import { Link } from "react-router-dom";
import { quizService } from "@/services";
import { useEffect, useState } from "react";

function Home() {
    const [quizzes, setQuizzes] = useState([]); // state lưu danh sách quiz

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const res = await quizService.getAll();
                setQuizzes(res.data); // cập nhật state
                console.log("Quizzes:", res.data);

            } catch (err) {
                console.error("Lỗi khi lấy quiz:", err);
            }
        };

        fetchQuizzes();
    }, []); // [] để chỉ chạy 1 lần khi component mount

    return (
        <div>
            <h1 className="my-6 text-center text-3xl font-bold">
                Welcome to Quiz App
            </h1>
            <p className="mb-6 text-center text-lg text-gray-700">
                Create, practice, and take quizzes to enhance your knowledge!
            </p>

            <button className="mt-4 rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">
                <Link to="/quiz/new">Tạo Quiz Mới</Link>
            </button>

            {/* Hiển thị danh sách quiz */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {quizzes.map((quiz) => (
                    <div
                        key={quiz.id}
                        className="border rounded-lg p-4 shadow hover:shadow-lg transition"
                    >
                        <h2 className="text-xl font-semibold mb-2">{quiz.title}</h2>
                        <p className="text-gray-600 mb-4">{quiz.description}</p>
                        <Link
                            to={`/quiz/${quiz.id}-${quiz.slug}`}
                            className="text-indigo-600 hover:underline"
                        >
                            Bắt đầu quiz
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home;
