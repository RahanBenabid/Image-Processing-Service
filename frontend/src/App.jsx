import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ImageProvider } from "./context/ImageContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import Header from "./components/Header";
import Hero from "./components/Hero";
import Benefits from "./components/Benefits";
import Span from "./components/Span";
import Testimonials from "./components/Testimonials";
import Footer from "./components/Footer";
import ButtonGradient from "./assets/svg/ButtonGradient";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Transformations from "./pages/Transformations";
import ImageEditor from "./pages/imageEditor";

const HomeContent = () => (
  <>
    <Hero />
    <Benefits />
    <Span />
    <Testimonials />
  </>
);

const App = () => {
  return (
    <AuthProvider>
      <ImageProvider>
        <Header />
        <ButtonGradient />
        <Routes>
          <Route path="/" element={<HomeContent />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/editor/:id" element={<ImageEditor />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/transformations" element={<Transformations />} />
            <Route path="/edit/:id" element={<ImageEditor />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Footer />
      </ImageProvider>
    </AuthProvider>
  );
};

export default App;
