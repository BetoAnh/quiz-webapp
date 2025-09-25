import { useEffect, useState } from "react";
import DashboardTabs from "@/components/dashboard/DashboardTabs";
import QuizList from "@/components/quiz/QuizList";
import { quizService } from "@/services";

export default function MyQuizzes() {
    const [loading, setLoading] = useState(true);
    const [quizzes, setQuizzes] = useState([]);

    useEffect(() => {
        let isMounted = true;

        async function fetchData() {
            try {
                const res = await quizService.myquizzes();
                console.log("Fetched quizzes:", res.data);

                if (isMounted) {
                    setQuizzes(res.data);
                }
            } catch (err) {
                console.error("Error fetching quizzes:", err);
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        fetchData();
        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <div className="w-full max-w-6xl mx-auto py-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Quiz của tôi</h1>
            <DashboardTabs />

            <div className="mt-6 bg-white rounded-2xl shadow-md p-6">
                <QuizList quizzes={quizzes} loading={loading} />
            </div>
        </div>
    );
}
