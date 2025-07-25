import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import RequireAuth from "./components/RequireAuth";

import SignupPage from "./components/SignupPage";
import LoginPage from "./components/LoginPage";
import SignupTest from "./components/SignupTest";
import MainPage from "./components/MainPage";
import Dashboard from "./components/Dashboard";

import TutorListPage from "./components/TutorListPage";
import TutorProfilePage from "./components/TutorProfilePage";
import TutorAvailabilityPage from "./components/TutorAvailabilityPage";
import TutorDashboardPage from "./components/TutorDashboardPage";
import TutorCalendarDashboard from "./components/TutorCalendarDashboard";

import BookingPage from "./components/BookingPage";
import BookingPageWithDisabledTimesWrapper from "./components/BookingPageWithDisabledTimesWrapper";
import BookTutorPage from "./components/BookTutorPage";
import BookingList from "./components/BookingList";
import BookingListWithTutorName from "./components/BookingListWithTutorName";

import MyPage from "./components/MyPage";
import ProfileEditPage from "./components/ProfileEditPage";
import ChangePasswordPage from "./components/ChangePasswordPage";

import PaymentPage from "./components/PaymentPage";
import PaymentSuccess from "./components/PaymentSuccess";
import PaymentList from "./components/PaymentList";
import PaymentHistory from "./components/PaymentHistory";

import ForgotPasswordPage from "./components/ForgotPasswordPage";
import ResetPasswordPage from "./components/ResetPasswordPage";
import VideoClassPage from "./components/VideoClassPage";
import TutorBookingList from "./components/TutorBookingList";
import BookingForm from "./components/BookingForm";
import AdminDashboard from "./components/admin/AdminDashboard";
import UserList from "./components/admin/UserList";
import TutorList from "./components/admin/TutorList"; 
import AdminBookingList from "./components/admin/AdminBookingList"; 
import StudentMyPage from "./components/StudentMyPage";


function App() {
  const { user } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup-test" element={<SignupTest />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/tutors" element={<TutorListPage />} />
        <Route path="/tutors/:id" element={<TutorProfilePage />} />
        <Route path="/video" element={<VideoClassPage />} />
        <Route path="/admin" element={<RequireAuth role="admin"><AdminDashboard /></RequireAuth>} />
        <Route path="/admin/users" element={<RequireAuth role="admin"><UserList /></RequireAuth>} />
        <Route path="/admin/tutors" element={<RequireAuth role="admin"><TutorList /></RequireAuth>} />
        <Route path="/admin/bookings" element={<RequireAuth role="admin"><AdminBookingList /></RequireAuth>} />
        <Route path="/book" element={<BookingForm />} />
        <Route path="/student/mypage" element={<RequireAuth><StudentMyPage /></RequireAuth>} />
        
        

        <Route
          path="/mypage"
          element={
            <RequireAuth>
              <MyPage />
            </RequireAuth>
          }
        />
        <Route
          path="/mybookings"
          element={
            <RequireAuth>
              <BookingList />
            </RequireAuth>
          }
        />
        <Route
          path="/my-bookings"
          element={
            <RequireAuth>
              <BookingListWithTutorName />
            </RequireAuth>
          }
        />
        <Route
          path="/payment"
          element={
            <RequireAuth>
              <PaymentPage />
            </RequireAuth>
          }
        />
        <Route
          path="/payments/success"
          element={
            <RequireAuth>
              <PaymentSuccess />
            </RequireAuth>
          }
        />
        <Route
          path="/payment-list"
          element={
            <RequireAuth>
              <PaymentList />
            </RequireAuth>
          }
        />
        <Route
          path="/payments/history"
          element={
            <RequireAuth>
              <PaymentHistory />
            </RequireAuth>
          }
        />
        <Route
          path="/change-password"
          element={
            <RequireAuth>
              <ChangePasswordPage />
            </RequireAuth>
          }
        />
        <Route
          path="/edit-profile"
          element={
            <RequireAuth>
              <ProfileEditPage />
            </RequireAuth>
          }
        />

        <Route
          path="/tutor/dashboard"
          element={
            <RequireAuth role="tutor">
              <TutorDashboardPage />
            </RequireAuth>
          }
        />
        <Route
          path="/tutor/bookings"
          element={
            <RequireAuth role="tutor">
              <TutorBookingList />
            </RequireAuth>
          }
        />
        <Route
          path="/tutor-availability"
          element={
            <RequireAuth role="tutor">
              <TutorAvailabilityPage />
            </RequireAuth>
          }
        />
        <Route
          path="/tutor/calendar"
          element={
            <RequireAuth role="tutor">
              <TutorCalendarDashboard />
            </RequireAuth>
          }
        />

        <Route
          path="/booking"
          element={
            <RequireAuth>
              <BookingPage />
            </RequireAuth>
          }
        />
        <Route
          path="/booking/:tutorId"
          element={
            <RequireAuth>
              <BookingPageWithDisabledTimesWrapper />
            </RequireAuth>
          }
        />
        <Route
          path="/book/:id"
          element={
            <RequireAuth>
              <BookTutorPage />
            </RequireAuth>
          }
        />

        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;