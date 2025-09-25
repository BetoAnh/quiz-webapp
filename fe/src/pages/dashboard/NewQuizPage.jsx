// src/pages/NewQuizPage.jsx
import { useState } from "react";
import DashboardTabs from "@/components/dashboard/DashboardTabs";
import NewQuizForm from "@/components/quiz/NewQuizForm";

export default function NewQuizPage() {
    const [mode, setMode] = useState(null); // null | "manual" | "ai"

    return (
        <div className="w-full max-w-5xl mx-auto py-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Thêm Quiz mới</h1>
            <DashboardTabs />

            <div className="mt-6">
                {/* Nếu chưa chọn mode */}
                {!mode && (
                    <div className="flex gap-4">
                        <button
                            onClick={() => setMode("manual")}
                            className="px-5 py-2.5 rounded-lg border text-gray-700 bg-white hover:bg-gray-100 shadow-sm transition"
                        >
                            ✍️ Tạo thủ công
                        </button>
                        <button
                            onClick={() => setMode("ai")}
                            className="px-5 py-2.5 rounded-lg border text-gray-700 bg-white hover:bg-gray-100 shadow-sm transition"
                        >
                            🤖 Dùng AI sinh từ tài liệu
                        </button>
                    </div>
                )}

                {/* Nếu đã chọn mode */}
                {mode && (
                    <div>
                        {/* Nút Back */}
                        <button
                            onClick={() => setMode(null)}
                            className="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-gray-700 bg-white hover:bg-gray-100 shadow-sm transition"
                        >
                            ← Quay lại
                        </button>

                        {mode === "manual" && (
                            <NewQuizForm onCancel={() => setMode(null)} />
                        )}

                        {mode === "ai" && (
                            <div className="p-6 border rounded-2xl shadow bg-gray-50">
                                <h2 className="text-lg font-semibold mb-4">Sinh quiz bằng AI</h2>
                                <input
                                    type="file"
                                    className="mb-4 block w-full text-sm text-gray-700 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                                />
                                <textarea
                                    placeholder="Hoặc dán nội dung tài liệu..."
                                    className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                                    rows={6}
                                />
                                <div className="flex justify-end mt-4">
                                    <button className="px-5 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700 transition shadow">
                                        Sinh câu hỏi
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
