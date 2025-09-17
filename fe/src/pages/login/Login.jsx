import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authService } from "@/services";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
    const { setUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isRegister, setIsRegister] = useState(false);
    const [form, setForm] = useState({
        first_name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const from = location.state?.from?.pathname || "/profile";

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            let res;
            if (isRegister) {
                if (form.password !== form.password_confirmation) {
                    alert("Passwords do not match");
                    return;
                }

                res = await authService.register({
                    first_name: form.first_name,
                    email: form.email,
                    password: form.password,
                });
                alert(res.data.message || "Registration successful!");
            } else {
                res = await authService.login({
                    email: form.email,
                    password: form.password,
                });
                alert(res.data.message || "Login successful!");
            }

            setUser(res.data.user);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            navigate(from, { replace: true });
        } catch (err) {
            alert(
                "Error: " +
                (err.response?.data?.message ||
                    err.response?.data?.error ||
                    err.message)
            );
        }
    }

    return (
        <div className="flex items-center justify-center bg-gray-100 h-screen">
            <div className="bg-white p-8 rounded shadow-md w-90">
                <h2 className="text-center text-2xl font-bold text-gray-900">
                    {isRegister ? "Register" : "Login"}
                </h2>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {isRegister && (
                        <div>
                            <label
                                htmlFor="first_name"
                                className="block text-sm font-medium text-gray-900"
                            >
                                First name
                            </label>
                            <input
                                id="first_name"
                                type="text"
                                name="first_name"
                                required
                                value={form.first_name}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border px-3 py-1.5 text-gray-900"
                            />
                        </div>
                    )}

                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-900"
                        >
                            Email address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={form.email}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border px-3 py-1.5 text-gray-900"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-900"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            minLength={8}
                            value={form.password}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border px-3 py-1.5 text-gray-900"
                        />
                    </div>

                    {isRegister && (
                        <div>
                            <label
                                htmlFor="password_confirmation"
                                className="block text-sm font-medium text-gray-900"
                            >
                                Confirm Password
                            </label>
                            <input
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                required
                                value={form.password_confirmation}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border px-3 py-1.5 text-gray-900"
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-500"
                    >
                        {isRegister ? "Register" : "Login"}
                    </button>
                </form>

                <p
                    className="mt-4 text-sm text-center text-gray-500 cursor-pointer"
                    onClick={() => setIsRegister(!isRegister)}
                >
                    {isRegister ? (
                        <>
                            Already have an account?{" "}
                            <span className="text-indigo-600 hover:text-indigo-500">
                                Login
                            </span>
                        </>
                    ) : (
                        <>
                            No account?{" "}
                            <span className="text-indigo-600 hover:text-indigo-500">
                                Register
                            </span>
                        </>
                    )}
                </p>
            </div>
        </div>
    );
}
