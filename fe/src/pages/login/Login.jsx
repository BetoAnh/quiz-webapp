import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { login, register } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
    const { setUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isRegister, setIsRegister] = useState(false);
    const [form, setForm] = useState({ first_name: "", email: "", password: "" });
    const from = location.state?.from?.pathname || "/profile";

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            let res;
            if (isRegister) {
                res = await register({
                    first_name: form.first_name,
                    email: form.email,
                    password: form.password,
                });
            } else {
                res = await login({ email: form.email, password: form.password });
            }

            setUser(res.user);
            localStorage.setItem("user", JSON.stringify(res.user));

            navigate(from, { replace: true });
        } catch (err) {
            alert("Error: " + (err.response?.data?.error || err.message));
        }
    }


    return (
        <>
            <div className="flex items-center justify-center bg-gray-100 h-screen">
                <div className=" bg-white p-8 rounded shadow-md w-90">
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                        <h2 className="text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                            {isRegister ? "Register" : "Login"}
                        </h2>
                    </div>

                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {isRegister && (
                                <div>
                                    <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                                        First name
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="first_name"
                                            type="text"
                                            name="first_name"
                                            required
                                            autoComplete="first_name"
                                            value={form.first_name}
                                            onChange={handleChange}
                                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                        />
                                    </div>
                                </div>
                            )}
                            <div>
                                <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                                    Email address
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        autoComplete="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                                    Password
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        autoComplete="current-password"
                                        value={form.password}
                                        onChange={(e) => {
                                            handleChange(e);

                                            // Kiểm tra độ dài
                                            const input = e.target;
                                            if (input.value.length < 6) {
                                                input.setCustomValidity("Password must be at least 8 characters");
                                            } else {
                                                input.setCustomValidity("");
                                            }

                                            // Đồng thời kiểm tra confirm password
                                            const confirmInput = document.querySelector('input[name="password_confirmation"]');
                                            if (confirmInput && confirmInput.value && confirmInput.value !== input.value) {
                                                confirmInput.setCustomValidity("Passwords do not match");
                                            } else if (confirmInput) {
                                                confirmInput.setCustomValidity("");
                                            }
                                        }}
                                        minLength={8}
                                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    />
                                </div>
                            </div>
                            {isRegister && (
                                <div>
                                    <label htmlFor="password_confirmation" className="block text-sm/6 font-medium text-gray-900">
                                        Confirm Password
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="password_confirmation"
                                            type="password"
                                            name="password_confirmation"
                                            value={form.password_confirmation || ""}
                                            onChange={(e) => {
                                                handleChange(e);

                                                const input = e.target;
                                                if (input.value !== form.password) {
                                                    input.setCustomValidity("Passwords do not match");
                                                } else {
                                                    input.setCustomValidity("");
                                                }
                                            }}
                                            required
                                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                        />
                                    </div>
                                </div>
                            )}
                            <div>
                                <button
                                    type="submit"
                                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    {isRegister ? "Register" : "Login"}
                                </button>
                            </div>
                        </form>

                        <p
                            className="mt-4 text-sm/6 cursor-pointer text-center font-semibold  "
                            onClick={() => setIsRegister(!isRegister)}
                        >
                            {isRegister
                                ? (<span className="text-gray-500">Already have an account? <span className="text-indigo-600 hover:text-indigo-500">Login</span></span>)
                                : (<span className="text-gray-500">No account? <span className="text-indigo-600 hover:text-indigo-500">Register</span></span>)}
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
