import { createContext, useContext, useState, useEffect } from "react";
import { getProfile } from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem("user");
        return saved ? JSON.parse(saved) : null;
    });
    const [loading, setLoading] = useState(!!user); // nếu có user → đang verify token

    useEffect(() => {
        const verifyToken = async () => {
            // Nếu không có user trong localStorage → không gọi API
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                // Gọi server verify token (cookie tự gửi)
                const profile = await getProfile();
                setUser(profile);
                localStorage.setItem("user", JSON.stringify(profile));
            } catch (err) {
                // Token mất/hết hạn → clear user
                if (err.response?.status === 401) {
                    setUser(null);
                    localStorage.removeItem("user");
                } else {
                    console.error("Verify profile failed:", err);
                }
            } finally {
                setLoading(false);
            }
        };

        verifyToken();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // chạy 1 lần khi mount

    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
