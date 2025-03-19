import * as React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import AdminLogin from "../../pages/Authentication/AdminLogin";
import { ThemeProvider } from "../ThemeProvider";
import "@testing-library/jest-dom";
import fetch from "jest-fetch-mock";

describe("AdminLogin", () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  test("renders login form", () => {
    render(
      <Router>
        <ThemeProvider>
          <AdminLogin />
        </ThemeProvider>
      </Router>
    );

    expect(screen.getByPlaceholderText("Tên đăng nhập")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Mật khẩu")).toBeInTheDocument();
    expect(screen.getByText("Đăng nhập")).toBeInTheDocument();
  });

  test("displays error message on failed login", async () => {
    fetch.mockResponseOnce(JSON.stringify({ message: "Login failed" }), {
      status: 400,
    });

    render(
      <Router>
        <ThemeProvider>
          <AdminLogin />
        </ThemeProvider>
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText("Tên đăng nhập"), {
      target: { value: "admin" },
    });
    fireEvent.change(screen.getByPlaceholderText("Mật khẩu"), {
      target: { value: "wrongpassword" },
    });
    fireEvent.click(screen.getByText("Đăng nhập"));

    await waitFor(() => {
      expect(screen.getByText("Login failed")).toBeInTheDocument();
    });
  });

  test("displays success message and redirects on successful login", async () => {
    fetch.mockResponseOnce(JSON.stringify({ message: "Login successful" }), {
      status: 200,
    });

    render(
      <Router>
        <ThemeProvider>
          <AdminLogin />
        </ThemeProvider>
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText("Tên đăng nhập"), {
      target: { value: "admin" },
    });
    fireEvent.change(screen.getByPlaceholderText("Mật khẩu"), {
      target: { value: "correctpassword" },
    });
    fireEvent.click(screen.getByText("Đăng nhập"));

    await waitFor(() => {
      expect(screen.getByText("Login successful")).toBeInTheDocument();
    });
  });
});
