import { createContext, useContext, useState, useEffect } from "react";
import { getProfile } from "@/services/authService";
import { useRef } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem("user");
        return saved ? JSON.parse(saved) : null;
    });
    const [loading, setLoading] = useState(!!user); // nếu có user → đang verify token

    const mounted = useRef(false);

    useEffect(() => {
        if (mounted.current) return; // đã chạy rồi → skip
        mounted.current = true;

        const verifyToken = async () => {
            if (!user) {
                setLoading(false);
                return;
            }
            try {
                const profile = await getProfile();
                setUser(profile);
                localStorage.setItem("user", JSON.stringify(profile));
            } catch (err) {
                if (err.response?.status === 401) {
                    setUser(null);
                    localStorage.removeItem("user");
                } else {
                    console.error(err);
                }
            } finally {
                setLoading(false);
            }
        };

        verifyToken();
    }, []);


    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
