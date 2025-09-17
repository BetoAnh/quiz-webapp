import { useState } from "react";
import { Dialog, RadioGroup } from "@headlessui/react";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import { quizService } from "@/services";

export default function QuizForm() {
    const [quiz, setQuiz] = useState({
        title: "",
        description: "",
        visibility: "public", // thêm private/public
        questions: [
            {
                id: 0,
                text: "",
                options: [{ id: 0, text: "" }],
                correctId: 0,
            },
        ],
    });
    const [showCancelDialog, setShowCancelDialog] = useState(false);

    // Thay đổi title/description/visibility
    const handleQuizChange = (e) => {
        setQuiz({ ...quiz, [e.target.name]: e.target.value });
    };

    // Thay đổi nội dung câu hỏi
    const handleQuestionChange = (qIndex, value) => {
        const newQuestions = [...quiz.questions];
        newQuestions[qIndex].text = value;
        setQuiz({ ...quiz, questions: newQuestions });
    };

    // Thay đổi nội dung option
    const handleOptionChange = (qIndex, oIndex, value) => {
        const newQuestions = [...quiz.questions];
        newQuestions[qIndex].options[oIndex].text = value;
        setQuiz({ ...quiz, questions: newQuestions });
    };

    // Chọn đáp án đúng
    const setCorrectAnswer = (qIndex, oIndex) => {
        const newQuestions = [...quiz.questions];
        newQuestions[qIndex].correctId = oIndex;
        setQuiz({ ...quiz, questions: newQuestions });
    };

    // Thêm câu hỏi
    const addQuestion = () => {
        const newId = quiz.questions.length;
        setQuiz({
            ...quiz,
            questions: [
                ...quiz.questions,
                {
                    id: newId,
                    text: "",
                    options: [{ id: 0, text: "" }],
                    correctId: 0,
                },
            ],
        });
    };

    // Xóa câu hỏi
    const removeQuestion = (qIndex) => {
        const newQuestions = quiz.questions.filter((_, i) => i !== qIndex);
        const reIndexed = newQuestions.map((q, i) => ({ ...q, id: i }));
        setQuiz({ ...quiz, questions: reIndexed });
    };

    // Thêm option
    const addOption = (qIndex) => {
        const newQuestions = [...quiz.questions];
        const nextId = newQuestions[qIndex].options.length;
        newQuestions[qIndex].options.push({ id: nextId, text: "" });
        setQuiz({ ...quiz, questions: newQuestions });
    };

    // Xóa option
    const removeOption = (qIndex, oIndex) => {
        const newQuestions = [...quiz.questions];
        newQuestions[qIndex].options = newQuestions[qIndex].options.filter(
            (_, i) => i !== oIndex
        );
        newQuestions[qIndex].options = newQuestions[qIndex].options.map((opt, i) => ({
            ...opt,
            id: i,
        }));
        if (newQuestions[qIndex].correctId === oIndex) {
            newQuestions[qIndex].correctId = 0;
        }
        setQuiz({ ...quiz, questions: newQuestions });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate Quiz Info
        if (!quiz.title.trim()) {
            alert("Quiz title is required");
            return;
        }
        if (!quiz.description.trim()) {
            alert("Quiz description is required");
            return;
        }

        // Validate Questions
        if (quiz.questions.length === 0) {
            alert("At least 1 question is required");
            return;
        }

        for (let i = 0; i < quiz.questions.length; i++) {
            const q = quiz.questions[i];

            if (!q.text.trim()) {
                alert(`Question ${i + 1} text is required`);
                return;
            }

            if (q.options.length < 2) {
                alert(`Question ${i + 1} must have at least 2 options`);
                return;
            }

            for (let j = 0; j < q.options.length; j++) {
                if (!q.options[j].text.trim()) {
                    alert(`Option ${j + 1} of Question ${i + 1} cannot be empty`);
                    return;
                }
            }

            if (q.correctId === null || q.correctId === undefined || q.correctId < 0 || q.correctId >= q.options.length) {
                alert(`Question ${i + 1} must have a correct answer selected`);
                return;
            }
        }

        try {
            const res = await quizService.create(quiz);
            alert("Quiz saved successfully!");
            console.log("Saved:", res.data);
        } catch (err) {
            alert("Error saving quiz: " + (err.response?.data?.message || err.message));
            console.error(err);
        }
    };


    return (
        <div className="max-w-5xl mx-auto p-6">
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Thông tin Quiz */}
                <div className="border-b border-gray-200 pb-6">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Quiz Information
                    </h2>
                    <div className="mt-4 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-900">
                                Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={quiz.title}
                                onChange={handleQuizChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                placeholder="Enter quiz title"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-900">
                                Description
                            </label>
                            <textarea
                                name="description"
                                rows={3}
                                value={quiz.description}
                                onChange={handleQuizChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                placeholder="Short description"
                                required
                            />
                        </div>

                        {/* Public / Private */}
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                Visibility
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
                                            `cursor-pointer rounded-md border px-4 py-2 text-sm font-medium ${checked ? "border-indigo-600 bg-indigo-50" : "border-gray-300"
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

                {/* Danh sách câu hỏi */}
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Questions</h2>
                    {quiz.questions.map((q, qIndex) => (
                        <div key={q.id} className="mt-6 rounded-lg border p-4 space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="block text-sm font-medium text-gray-900">
                                    Question {qIndex + 1}
                                </label>
                                <button
                                    type="button"
                                    onClick={() => removeQuestion(qIndex)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <TrashIcon className="h-5 w-5" />
                                </button>
                            </div>
                            <input
                                type="text"
                                value={q.text}
                                onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                                className="block w-full rounded-md border border-gray-300 px-3 py-2"
                                placeholder="Enter question"
                                required
                            />

                            {/* Options fix click chọn đáp án */}
                            <div className="space-y-3">
                                {q.options.map((opt, oIndex) => (
                                    <div
                                        key={opt.id}
                                        className={`flex items-center gap-3 rounded-md border px-3 py-2 ${q.correctId === oIndex
                                            ? "border-green-500 bg-green-600/10"
                                            : "border-gray-300"
                                            }`}
                                    >
                                        <input
                                            type="text"
                                            value={opt.text}
                                            onChange={(e) =>
                                                handleOptionChange(qIndex, oIndex, e.target.value)
                                            }
                                            className="flex-1 rounded-md border border-gray-300 px-3 py-2"
                                            placeholder={`Option ${oIndex + 1}`}
                                            onClick={(e) => e.stopPropagation()} // không trigger chọn
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
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <button
                                type="button"
                                onClick={() => addOption(qIndex)}
                                className="mt-2 flex items-center gap-1 text-sm text-indigo-600 hover:underline"
                            >
                                <PlusIcon className="h-4 w-4" /> Add Option
                            </button>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addQuestion}
                        className="mt-4 flex items-center gap-1 text-indigo-600 hover:underline"
                    >
                        <PlusIcon className="h-5 w-5" /> Add Question
                    </button>
                </div>

                {/* Submit */}
                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => setShowCancelDialog(true)}
                        className="px-4 py-2 text-sm font-semibold text-gray-600"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                    >
                        Save Quiz
                    </button>
                </div>
            </form>

            {/* Modal Cancel */}
            <Dialog
                open={showCancelDialog}
                onClose={() => setShowCancelDialog(false)}
                className="relative z-50"
            >
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel transition className="mx-auto max-w-sm rounded bg-white p-6 backdrop-blur-2xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0">
                        <Dialog.Title className="text-lg font-semibold ">
                            Cancel quiz creation?
                        </Dialog.Title>
                        <Dialog.Description className="mt-2 text-sm text-gray-600">
                            All unsaved changes will be lost.
                        </Dialog.Description>

                        <div className="mt-4 flex justify-end gap-3">
                            <button
                                className="px-4 py-2 text-sm font-medium text-gray-600"
                                onClick={() => setShowCancelDialog(false)}
                            >
                                No
                            </button>
                            <button
                                className="px-4 py-2 text-sm font-semibold text-red-600 hover:text-red-700"
                                onClick={() => {
                                    setShowCancelDialog(false);
                                    setQuiz({
                                        title: "",
                                        description: "",
                                        visibility: "public",
                                        questions: [
                                            { id: 0, text: "", options: [{ id: 0, text: "" }], correctId: 0 },
                                        ],
                                    });
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
