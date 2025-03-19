import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import ForgotPassword from "./ForgotPassword";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "../../components/ThemeProvider";
import "@testing-library/jest-dom";

jest.mock("axios");

describe("ForgotPassword Component", () => {
  const renderComponent = () => {
    return render(
      <Router>
        <ThemeProvider>
          <ForgotPassword />
        </ThemeProvider>
      </Router>
    );
  };

  test("renders ForgotPassword component", () => {
    renderComponent();
    expect(screen.getByText("Forgot Password")).toBeInTheDocument();
  });

  test("submits email and moves to code step", async () => {
    axios.post.mockResolvedValueOnce({
      data: { message: "Code sent to email" },
    });

    renderComponent();

    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.click(screen.getByText("Send Reset Code"));

    await waitFor(() =>
      expect(screen.getByText("Verify Code")).toBeInTheDocument()
    );
  });

  test("submits code and moves to password step", async () => {
    axios.post.mockResolvedValueOnce({ data: { message: "Code verified" } });

    renderComponent();

    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.click(screen.getByText("Send Reset Code"));

    await waitFor(() =>
      expect(screen.getByText("Verify Code")).toBeInTheDocument()
    );

    fireEvent.change(screen.getByLabelText("code-input-0"), {
      target: { value: "1" },
    });
    fireEvent.change(screen.getByLabelText("code-input-1"), {
      target: { value: "2" },
    });
    fireEvent.change(screen.getByLabelText("code-input-2"), {
      target: { value: "3" },
    });
    fireEvent.change(screen.getByLabelText("code-input-3"), {
      target: { value: "4" },
    });
    fireEvent.change(screen.getByLabelText("code-input-4"), {
      target: { value: "5" },
    });
    fireEvent.change(screen.getByLabelText("code-input-5"), {
      target: { value: "6" },
    });
    fireEvent.change(screen.getByLabelText("code-input-6"), {
      target: { value: "7" },
    });
    fireEvent.change(screen.getByLabelText("code-input-7"), {
      target: { value: "8" },
    });
    fireEvent.change(screen.getByLabelText("code-input-8"), {
      target: { value: "9" },
    });

    fireEvent.click(screen.getByText("Verify Code"));

    await waitFor(() =>
      expect(screen.getByText("Reset Password")).toBeInTheDocument()
    );
  });

  test("submits new password successfully", async () => {
    axios.post.mockResolvedValueOnce({
      data: { message: "Password reset successful" },
      status: 200,
    });

    renderComponent();

    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.click(screen.getByText("Send Reset Code"));

    await waitFor(() =>
      expect(screen.getByText("Verify Code")).toBeInTheDocument()
    );

    fireEvent.change(screen.getByLabelText("code-input-0"), {
      target: { value: "1" },
    });
    fireEvent.change(screen.getByLabelText("code-input-1"), {
      target: { value: "2" },
    });
    fireEvent.change(screen.getByLabelText("code-input-2"), {
      target: { value: "3" },
    });
    fireEvent.change(screen.getByLabelText("code-input-3"), {
      target: { value: "4" },
    });
    fireEvent.change(screen.getByLabelText("code-input-4"), {
      target: { value: "5" },
    });
    fireEvent.change(screen.getByLabelText("code-input-5"), {
      target: { value: "6" },
    });
    fireEvent.change(screen.getByLabelText("code-input-6"), {
      target: { value: "7" },
    });
    fireEvent.change(screen.getByLabelText("code-input-7"), {
      target: { value: "8" },
    });
    fireEvent.change(screen.getByLabelText("code-input-8"), {
      target: { value: "9" },
    });

    fireEvent.click(screen.getByText("Verify Code"));

    await waitFor(() =>
      expect(screen.getByText("Reset Password")).toBeInTheDocument()
    );

    fireEvent.change(screen.getByPlaceholderText("Enter new password"), {
      target: { value: "newpassword" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm new password"), {
      target: { value: "newpassword" },
    });

    fireEvent.click(screen.getByText("Reset Password"));

    await waitFor(() =>
      expect(screen.getByText("You can log in now!")).toBeInTheDocument()
    );
  });
});
