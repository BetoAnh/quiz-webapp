import api from "./api";

export const quizService = {
  getAll: () => api.get("/quizzes"),
  getById: (id) => api.get(`/quizzes/${id}`),
  create: (data) => api.post("/quizzes", data),
};
