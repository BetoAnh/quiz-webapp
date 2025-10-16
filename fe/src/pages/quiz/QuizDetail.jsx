import { useState, useEffect } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { encryptData } from "@/utils/cryptoStorage";
import { quizService } from "@/services";
import NotFound from "@/components/common/NotFound";
import { EyeIcon, LockClosedIcon } from "@heroicons/react/24/solid";
import { useAuth } from "@/contexts/AuthContext";
import { PencilSquareIcon } from "@heroicons/react/24/solid";

// Hàm shuffle array
const shuffleArray = (arr) => {
    const newArr = [...arr];
    for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
};

export default function QuizDetail() {
    const { idAndSlug } = useParams();
    const { user } = useAuth();
    const [id] = idAndSlug.split("-");
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [shuffleQuestions, setShuffleQuestions] = useState(false);
    const [shuffleOptions, setShuffleOptions] = useState(false);
    const [previewCount, setPreviewCount] = useState(3); // số câu hiển thị
    const [showAnswers, setShowAnswers] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const res = await quizService.getById(id);
                setQuiz(res.data);
                console.log("Quiz:", res.data);


                const expectedSlug = res.data.slug;
                const currentSlug = idAndSlug.split("-").slice(1).join("-");
                if (!currentSlug || currentSlug !== expectedSlug) {
                    navigate(`/quiz/${id}-${expectedSlug}`, { replace: true });
                }
            } catch (err) {
                console.error("Lỗi khi lấy quiz:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchQuiz();
    }, [id]);

    const prepareQuiz = () => {
        const storageKey = `quiz-${quiz.id}-${quiz.title.replace(/\s/g, "-")}`;

        sessionStorage.removeItem(storageKey + "-quiz");
        sessionStorage.removeItem(storageKey + "-state");

        let preparedQuiz = JSON.parse(JSON.stringify(quiz));

        if (shuffleQuestions) {
            preparedQuiz.questions = shuffleArray(preparedQuiz.questions);
        }

        if (shuffleOptions) {
            preparedQuiz.questions = preparedQuiz.questions.map((q) => ({
                ...q,
                options: shuffleArray(q.options),
            }));
        }

        sessionStorage.setItem(
            storageKey + "-quiz",
            encryptData(preparedQuiz)
        );

        const initialAnswers = preparedQuiz.questions.map(() => ({
            selectedId: null,
        }));
        sessionStorage.setItem(
            storageKey + "-state",
            encryptData({
                answers: initialAnswers,
                currentIndex: 0,
                startTime: Date.now(),
            })
        );

        return storageKey;
    };

    const handleStartQuiz = (mode) => {
        const storageKey = prepareQuiz();

        let path = "/quiz/practice";
        if (mode === "exam") path = "/quiz/exam";
        else if (mode === "review") path = "/quiz/review";

        navigate(path, { state: { storageKey } });
    };

    const toggleAnswer = (qId) => {
        setShowAnswers((prev) => ({
            ...prev,
            [qId]: !prev[qId],
        }));
    };

    if (loading) return <p className="p-6 text-gray-500">Đang tải quiz...</p>;
    if (!quiz) return <NotFound message="Không tìm thấy quiz" />;

    return (
        <div className="mt-8 space-y-8">
            {/* Thông tin quiz */}
            <div className="bg-white shadow-md rounded-2xl p-6 space-y-6">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">{quiz.title}</h2>
                    <p className="mt-2 text-gray-600">
                        {quiz.description || "Không có mô tả"}
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-sm">
                    <NavLink to={`/category/${quiz.category_id}`}>
                        <span className="px-2 py-1 bg-gray-100 rounded-lg text-gray-700">
                            {quiz.category?.name || "No category"}
                        </span>
                    </NavLink>
                    <span className="px-2 py-1 bg-gray-100 rounded-lg text-gray-700">
                        {`${quiz.level?.name} ${quiz.level?.parent?.name}` || "No level"}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 rounded-lg text-gray-700 flex items-center gap-1">
                        {quiz.visibility === "public" ? (
                            <EyeIcon className="h-4 w-4 text-green-500" />
                        ) : (
                            <LockClosedIcon className="h-4 w-4 text-gray-500" />
                        )}
                        {quiz.visibility}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 rounded-lg text-gray-700">
                        {quiz.questions?.length || 0} câu hỏi
                    </span>
                </div>

                <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={shuffleQuestions}
                            onChange={(e) => setShuffleQuestions(e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-gray-700">Đảo thứ tự câu hỏi</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={shuffleOptions}
                            onChange={(e) => setShuffleOptions(e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-gray-700">Đảo thứ tự đáp án</span>
                    </label>
                </div>

                <div className="flex flex-wrap gap-4 pt-4">
                    <button
                        onClick={() => handleStartQuiz("practice")}
                        className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
                    >
                        Luyện tập
                    </button>
                    <button
                        onClick={() => handleStartQuiz("exam")}
                        className="px-6 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition"
                    >
                        Thi thử
                    </button>
                    {user && (quiz.author_id === user.id || quiz.author?.id === user.id) && (
                        <button
                            onClick={() =>
                                navigate(`/quiz/${quiz.id}/edit`)
                            }
                            className="flex items-center gap-2 px-6 py-2 rounded-lg bg-gray-500 text-white font-medium hover:bg-gray-600 transition"
                        >
                            <PencilSquareIcon className="h-5 w-5" />
                            Chỉnh sửa
                        </button>
                    )}
                </div>
            </div>

            {/* Xem trước câu hỏi */}
            <div className="bg-white shadow-md rounded-2xl p-6">
                <h3 className="text-xl font-semibold mb-4">Xem trước câu hỏi</h3>
                <div className="space-y-4">
                    {quiz.questions.slice(0, previewCount).map((q, idx) => (
                        <div
                            key={q.id}
                            className="border rounded-lg p-4 bg-gray-50"
                        >
                            <p className="font-medium text-gray-800">
                                Câu {idx + 1}: {q.text}
                            </p>
                            <ul className="list-disc ml-6 mt-2 text-gray-700">
                                {q.options.map((opt) => {
                                    const isCorrect = opt.id === q.correct_id;
                                    return (
                                        <li
                                            key={opt.id}
                                            className={
                                                showAnswers[q.id] && isCorrect
                                                    ? "text-green-600 font-semibold"
                                                    : ""
                                            }
                                        >
                                            {opt.text}
                                        </li>
                                    );
                                })}
                            </ul>
                            <div className="mt-2">
                                <button
                                    onClick={() => toggleAnswer(q.id)}
                                    className="text-sm text-indigo-600 hover:underline"
                                >
                                    {showAnswers[q.id] ? "Ẩn đáp án" : "Xem đáp án"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {quiz.questions.length > 5 && (
                    <div className="mt-4 flex justify-center">
                        {previewCount < quiz.questions.length ? (
                            <button
                                onClick={() => setPreviewCount(quiz.questions.length)}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                            >
                                Xem thêm
                            </button>
                        ) : (
                            <button
                                onClick={() => setPreviewCount(5)}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                            >
                                Ẩn bớt
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
