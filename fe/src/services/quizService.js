import api from "./api";

export const quizService = {
  // Lấy tất cả quiz
  getAll: () => api.get("/quizzes"),

  // Lấy quiz theo ID
  getById: (id) => api.get(`/quizzes/${id}`),

  // Tạo quiz mới (kèm câu hỏi)
  create: (data) => api.post("/quizzes", data),

  // Cập nhật quiz
  update: (id, data) => api.put(`/quizzes/${id}`, data),

  // Xóa quiz
  delete: (id) => api.delete(`/quizzes/${id}`),
};
