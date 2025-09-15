import { useAuth } from "../../context/AuthContext";
import { logout } from "../../services/authService";
import { useNavigate } from "react-router-dom";

export default function Profile() {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (err) {
            console.error("Logout failed:", err);
        } finally {
            setUser(null);
            localStorage.removeItem("user");
            navigate("/login", { replace: true });
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-red-100">
                <p className="text-lg text-red-600">Bạn chưa đăng nhập</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-blue-100">
            <h1 className="text-3xl font-bold mb-4">Profile</h1>
            <p><strong>ID:</strong> {user.id}</p>
            <p><strong>Name:</strong> {user.first_name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <button
                onClick={handleLogout}
                className="mt-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
                Logout
            </button>
        </div>
    );
}
