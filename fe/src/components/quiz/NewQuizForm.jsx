import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, RadioGroup } from "@headlessui/react";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import { quizService } from "@/services";

export default function NewQuizForm({ onCancel }) {
    const navigate = useNavigate();

    const [quiz, setQuiz] = useState({
        title: "",
        description: "",
        visibility: "public",
        questions: [
            { id: 0, text: "", options: [{ id: 0, text: "" }], correctId: 0 },
        ],
    });

    const [showCancelDialog, setShowCancelDialog] = useState(false);

    // ==== HANDLERS ====
    const handleQuizChange = (e) => {
        setQuiz({ ...quiz, [e.target.name]: e.target.value });
    };

    const handleQuestionChange = (qIndex, value) => {
        const newQuestions = [...quiz.questions];
        newQuestions[qIndex].text = value;
        setQuiz({ ...quiz, questions: newQuestions });
    };

    const handleOptionChange = (qIndex, oIndex, value) => {
        const newQuestions = [...quiz.questions];
        newQuestions[qIndex].options[oIndex].text = value;
        setQuiz({ ...quiz, questions: newQuestions });
    };

    const setCorrectAnswer = (qIndex, oIndex) => {
        const newQuestions = [...quiz.questions];
        newQuestions[qIndex].correctId = oIndex;
        setQuiz({ ...quiz, questions: newQuestions });
    };

    const addQuestion = () => {
        const newId = quiz.questions.length;
        setQuiz({
            ...quiz,
            questions: [
                ...quiz.questions,
                { id: newId, text: "", options: [{ id: 0, text: "" }], correctId: 0 },
            ],
        });
    };

    const removeQuestion = (qIndex) => {
        const newQuestions = quiz.questions.filter((_, i) => i !== qIndex);
        const reIndexed = newQuestions.map((q, i) => ({ ...q, id: i }));
        setQuiz({ ...quiz, questions: reIndexed });
    };

    const addOption = (qIndex) => {
        const newQuestions = [...quiz.questions];
        const nextId = newQuestions[qIndex].options.length;
        newQuestions[qIndex].options.push({ id: nextId, text: "" });
        setQuiz({ ...quiz, questions: newQuestions });
    };

    const removeOption = (qIndex, oIndex) => {
        const newQuestions = [...quiz.questions];
        newQuestions[qIndex].options = newQuestions[qIndex].options
            .filter((_, i) => i !== oIndex)
            .map((opt, i) => ({ ...opt, id: i }));
        if (newQuestions[qIndex].correctId === oIndex) {
            newQuestions[qIndex].correctId = 0;
        }
        setQuiz({ ...quiz, questions: newQuestions });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await quizService.create(quiz);
            alert("Quiz saved successfully!");
            navigate("/quizzes"); // về danh sách quiz
        } catch (err) {
            alert("Error saving quiz: " + (err.response?.data?.message || err.message));
            console.error(err);
        }
    };

    // ==== JSX ====
    return (
        <div className="">
            <form
                onSubmit={handleSubmit}
                className="space-y-8 bg-white rounded-2xl shadow-xl p-8"
            >
                {/* Quiz Info */}
                <div className="border-b border-gray-200 pb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Thông tin quiz</h2>
                    <div className="mt-6 grid gap-6 md:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-900">
                                Tiêu đề
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={quiz.title}
                                onChange={handleQuizChange}
                                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Enter quiz title"
                                required
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-900">
                                Mô tả
                            </label>
                            <textarea
                                name="description"
                                rows={3}
                                value={quiz.description}
                                onChange={handleQuizChange}
                                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Short description"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                Hiển thị
                            </label>
                            <RadioGroup
                                value={quiz.visibility}
                                onChange={(val) => setQuiz({ ...quiz, visibility: val })}
                                className="flex gap-4"
                            >
                                {["public", "private"].map((val) => (
                                    <RadioGroup.Option
                                        key={val}
                                        value={val}
                                        className={({ checked }) =>
                                            `cursor-pointer rounded-lg border px-4 py-2 text-sm font-medium shadow-sm transition 
                                            ${checked
                                                ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                                                : "border-gray-300 text-gray-600 hover:border-gray-400"
                                            }`
                                        }
                                    >
                                        {val.charAt(0).toUpperCase() + val.slice(1)}
                                    </RadioGroup.Option>
                                ))}
                            </RadioGroup>
                        </div>
                    </div>
                </div>

                {/* Questions */}
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Câu hỏi</h2>
                    {quiz.questions.map((q, qIndex) => (
                        <div
                            key={q.id}
                            className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-6 shadow-sm"
                        >
                            <div className="flex justify-between items-center">
                                <label className="font-medium text-gray-700">
                                    Câu {qIndex + 1}
                                </label>
                                <button
                                    type="button"
                                    onClick={() => removeQuestion(qIndex)}
                                    className="text-red-500 hover:text-red-700 transition"
                                >
                                    <TrashIcon className="h-5 w-5" />
                                </button>
                            </div>
                            <input
                                type="text"
                                value={q.text}
                                onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                                className="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Nhập câu hỏi"
                                required
                            />

                            <div className="mt-4 space-y-3">
                                {q.options.map((opt, oIndex) => (
                                    <div
                                        key={opt.id}
                                        className={`flex items-center gap-3 rounded-lg border px-3 py-2 shadow-sm transition ${q.correctId === oIndex
                                            ? "border-green-500 bg-green-50"
                                            : "border-gray-300 bg-white"
                                            }`}
                                    >
                                        <input
                                            type="text"
                                            value={opt.text}
                                            onChange={(e) =>
                                                handleOptionChange(qIndex, oIndex, e.target.value)
                                            }
                                            className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            placeholder={`Đáp án ${oIndex + 1}`}
                                            onClick={(e) => e.stopPropagation()}
                                            required
                                        />
                                        <input
                                            type="radio"
                                            name={`correct-${qIndex}`}
                                            checked={q.correctId === oIndex}
                                            onChange={() => setCorrectAnswer(qIndex, oIndex)}
                                            className="h-4 w-4 text-indigo-600"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeOption(qIndex, oIndex)}
                                            className="text-red-500 hover:text-red-700 transition"
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <button
                                type="button"
                                onClick={() => addOption(qIndex)}
                                className="mt-3 flex items-center gap-1 text-sm font-medium text-indigo-600 hover:underline"
                            >
                                <PlusIcon className="h-4 w-4" /> Thêm đáp án
                            </button>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addQuestion}
                        className="mt-6 flex items-center gap-2 rounded-lg border border-indigo-600 px-4 py-2 text-indigo-600 hover:bg-indigo-50 transition"
                    >
                        <PlusIcon className="h-5 w-5" /> Thêm câu hỏi
                    </button>
                </div>

                {/* Submit */}
                <div className="mt-8 flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={() => setShowCancelDialog(true)}
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition"
                    >
                        Save Quiz
                    </button>
                </div>
            </form>

            {/* Cancel Dialog */}
            <Dialog
                open={showCancelDialog}
                onClose={() => setShowCancelDialog(false)}
                className="relative z-50"
            >
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="mx-auto max-w-sm rounded-xl bg-white p-6 shadow-lg">
                        <Dialog.Title className="text-lg font-semibold text-gray-900">
                            Cancel quiz creation?
                        </Dialog.Title>
                        <Dialog.Description className="mt-2 text-sm text-gray-600">
                            All unsaved changes will be lost.
                        </Dialog.Description>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
                                onClick={() => setShowCancelDialog(false)}
                            >
                                No
                            </button>
                            <button
                                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 transition"
                                onClick={() => {
                                    setShowCancelDialog(false);
                                    onCancel?.();
                                }}
                            >
                                Yes, Cancel
                            </button>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </div>
    );
}
