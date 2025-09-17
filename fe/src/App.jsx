import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "@/pages/profile/Dashboard";
import Login from "@/pages/login/Login";
import Home from "@/pages/home/Home";
import Profile from "@/pages/profile/Profile";
import PrivateRoute from "@/components/router/PrivateRoute";
import { AuthProvider } from "@/context/AuthContext";
import Header from "@/components/nav/Header";
import PracticeQuiz from "@/pages/quiz/PracticeQuiz";
import QuizDetail from "@/pages/quiz/QuizDetail";
import ExamQuiz from "@/pages/quiz/ExamQuiz";
import NewQuiz from "@/pages/quiz/NewQuiz";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/quiz/:idAndSlug" element={<QuizDetail />} />
          <Route path="/quiz/practice" element={<PracticeQuiz />} />
          <Route path="/quiz/exam" element={<ExamQuiz />} />
          <Route path="/quiz/new" element={<NewQuiz />} />
          <Route
            path="/login"
            element={
              <Login />
            }
          />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
