import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Login from "@/pages/login/Login";
import Home from "@/pages/home/Home";
import Profile from "@/pages/profile/Profile";
import PrivateRoute from "@/components/router/PrivateRoute";
import { AuthProvider } from "@/context/AuthContext";
import Header from "@/components/nav/Header";
import PracticeQuiz from "@/pages/quiz/PracticeQuiz";
import QuizDetail from "@/pages/quiz/QuizDetail";
import ExamQuiz from "@/pages/quiz/ExamQuiz";
import NewQuizForm from "@/components/quiz/NewQuizForm";
import Test from "@/pages/test/Test";
import SettingsPage from "@/pages/profile/SettingsPage";
import NotFound from "@/components/common/NotFound";
import CategoryDetail from "@/pages/category/CategoryDetail";
import Dashboard from "@/pages/dashboard/Dashboard";
import MyQuizzes from "@/pages/dashboard/MyQuizzes";
import SavedQuizzes from "@/pages/dashboard/SavedQuizzes";
import NewQuizPage from "@/pages/dashboard/NewQuizPage";
import Loading from "@/components/common/Loading";

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <AuthProvider>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/quiz/:idAndSlug" element={<QuizDetail />} />
            <Route path="/quiz/practice" element={<PracticeQuiz />} />
            <Route path="/quiz/exam" element={<ExamQuiz />} />
            {/* <Route path="/quiz/new" element={<PrivateRoute><NewQuiz /></PrivateRoute>} /> */}
            <Route path="/dashboard/new" element={<PrivateRoute><NewQuizPage /></PrivateRoute>} />
            <Route path="/dashboard/my" element={<PrivateRoute><MyQuizzes /></PrivateRoute>} />
            <Route path="/dashboard/saved" element={<PrivateRoute><SavedQuizzes /></PrivateRoute>} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/test" element={<Test />} />
            <Route path="/profile/:identifier" element={<Profile />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/categories/:idAndSlug" element={<CategoryDetail />} />
            <Route path="*" element={<NotFound message="Không tìm thấy trang" />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider >
    </Suspense>
  );
}

export default App;
