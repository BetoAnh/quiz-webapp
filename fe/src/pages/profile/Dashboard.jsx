import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const navigate = useNavigate();

    useEffect(() => {
        // Nếu không có token thì tự động quay lại login
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
        }
    }, [navigate]);

    function handleLogout() {
        localStorage.removeItem("token");
        navigate("/login");
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-green-100">
            <h1 className="text-3xl font-bold mb-6">Welcome to Dashboard 🎉</h1>
            <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition"
            >
                Logout
            </button>
        </div>
    );
}
