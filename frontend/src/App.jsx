import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import NotFoundPage from "./pages/NotFoundPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StatisticsPage from "./pages/StatisticsPage";
import ReservationsOfTheDay from "./pages/ReservationsOfTheDay";
import ClientsPage from "./pages/ClientsPage";
import AccountPage from "./pages/AccountPage";
import ReservationsCalendarPage from "./pages/ReservationsCalendarPage";
import ReservationsTablePage from "./pages/ReservationsTablePage";
import { CssBaseline, ThemeProvider } from "@mui/material";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./components/MainLayout";
import { DataProvider } from "./DataContext";
import theme from "./theme"; // Import the theme

function LoginPreventLocalStorage() {
  localStorage.clear();
  return <Login />;
}

function RegisterAndLogout() {
  localStorage.clear();
  return <Register />;
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPreventLocalStorage />} />
          <Route path="/register" element={<RegisterAndLogout />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DataProvider>
                  <MainLayout />
                </DataProvider>
              </ProtectedRoute>
            }
          >
            <Route
              path="/reservations_of_the_day"
              element={<ReservationsOfTheDay />}
            />
            <Route
              path="/reservations/calendar"
              element={<ReservationsCalendarPage />}
            />
            <Route
              path="/reservations/table"
              element={<ReservationsTablePage />}
            />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/statistics" element={<StatisticsPage />} />
            <Route path="/account" element={<AccountPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
