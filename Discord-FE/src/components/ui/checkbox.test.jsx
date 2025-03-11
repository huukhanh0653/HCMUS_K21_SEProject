import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Checkbox } from "./checkbox";
import "@testing-library/jest-dom";

describe("Checkbox component", () => {
    test("renders without crashing", () => {
        render(<Checkbox />);
        const checkbox = screen.getByRole("checkbox");
        expect(checkbox).toBeInTheDocument();
    });

    test("can be checked and unchecked", () => {
        render(<Checkbox />);
        const checkbox = screen.getByRole("checkbox");
        expect(checkbox).not.toBeChecked();
        fireEvent.click(checkbox);
        expect(checkbox).toBeChecked();
        fireEvent.click(checkbox);
        expect(checkbox).not.toBeChecked();
    });

    test("applies custom className", () => {
        const customClass = "custom-class";
        render(<Checkbox className={customClass} />);
        const checkbox = screen.getByRole("checkbox");
        expect(checkbox).toHaveClass(customClass);
    });

    test("is disabled when disabled prop is passed", () => {
        render(<Checkbox disabled />);
        const checkbox = screen.getByRole("checkbox");
        expect(checkbox).toBeDisabled();
    });
});