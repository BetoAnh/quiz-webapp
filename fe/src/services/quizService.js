import api from "./api";

export const quizService = {
  // Lấy tất cả quiz
  getAll: (params = {}) => api.get("/quizzes", { params }),
  // Lấy quiz theo ID
  getById: (id) => api.get(`/quizzes/${id}`),

  getByUser: (id) => api.get(`/quizzes/user/${id}`),

  // Tạo quiz mới (kèm câu hỏi)
  create: (data) => api.post("/quizzes", data),

  // Cập nhật quiz
  update: (id, data) => api.put(`/quizzes/${id}`, data),

  // Xóa quiz
  delete: (id) => api.delete(`/quizzes/${id}`),

  myquizzes: () => api.get("/myquizzes"),
};
