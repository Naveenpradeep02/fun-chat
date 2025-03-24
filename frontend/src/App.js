import React, { useEffect } from "react";
import Navbar from "./Components/Navbar";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import SignInPage from "./Pages/SignInPage";
import LoginPage from "./Pages/LoginPage";
import SettingPage from "./Pages/SettingPage";
import ProfilePage from "./Pages/ProfilePage";
import { useAuthStore } from "./store/useAuthStore";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { useThemeStore } from "./store/useTheme";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth, onlineUser } = useAuthStore();

  const { theme } = useThemeStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // console.log(authUser);
  // console.log(onlineUser);

  if (isCheckingAuth && !authUser)
    return (
      <div
        className="flex items-center justify-center h-screen "
        data-theme={theme}
      >
        <Loader className="size-10 animate-spin " />
      </div>
    );

  return (
    <div data-theme={theme}>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={authUser ? <Home /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignInPage /> : <Navigate to={"/"} />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to={"/"} />}
        />
        <Route path="/setting" element={<SettingPage />} />
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to={"/login"} />}
        />
      </Routes>

      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default App;
