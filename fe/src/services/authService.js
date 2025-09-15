import api from "./api";

// Đăng ký
export async function register(data) {
  const res = await api.post("/register", data);
  return res.data; // token nằm trong cookie, không trả về
}

// Đăng nhập
export async function login(data) {
  const res = await api.post("/login", data);
  return res.data; // cookie đã được set
}

// Đăng xuất
export async function logout() {
  try {
    await api.post("/logout");
  } catch (e) {
    console.error("Logout failed:", e);
  }
}

// Lấy profile
export async function getProfile() {
  const res = await api.get("/profile");
  return res.data;
}
