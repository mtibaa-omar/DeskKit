import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Suspense, lazy } from "react";
import "./styles/index.css";

import AppLayout from "./components/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import PageNotFound from "./components/PageNotFound";
import Home from "./pages/Home";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import ConfirmEmailPage from "./pages/ConfirmEmailPage";
import ProfilePage from "./pages/ProfilePage";
import PomodoroPage from "./pages/PomodoroPage";
import Spinner from "./components/Spinner";

const TasksPage = lazy(() => import("./pages/TasksPage"));
const NotesPage = lazy(() => import("./pages/NotesPage"));
const CalendarPage = lazy(() => import("./pages/CalendarPage"));
const WhiteboardsPage = lazy(() => import("./pages/WhiteboardsPage"));
const WhiteboardEditorPage = lazy(() => import("./pages/WhiteboardEditorPage"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
  },
});

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <BrowserRouter>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route index element={<Home />} />
            <Route path="account" element={<ProfilePage />} />
            <Route path="workspace">
              <Route path="pomodoro" element={<PomodoroPage />} />
              <Route path="tasks" element={<TasksPage />} />
              <Route path="notes" element={<NotesPage />} />
              <Route path="calendar" element={<CalendarPage />} />
              <Route path="whiteboard" element={<WhiteboardsPage />} />
              <Route path="whiteboard/:id" element={<WhiteboardEditorPage />} />
            </Route>
            <Route path="*" element={<PageNotFound />} />
          </Route>
          <Route path="signup" element={<SignupPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="confirm-email" element={<ConfirmEmailPage />} />
        </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
