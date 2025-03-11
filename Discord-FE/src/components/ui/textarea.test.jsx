import React from "react";
import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import { Textarea } from "./textarea";

describe("Textarea component", () => {
    test("renders without crashing", () => {
        render(<Textarea />);
        const textareaElement = screen.getByRole("textbox");
        expect(textareaElement).toBeInTheDocument();
    });

    test("applies custom className", () => {
        const customClass = "custom-class";
        render(<Textarea className={customClass} />);
        const textareaElement = screen.getByRole("textbox");
        expect(textareaElement).toHaveClass(customClass);
    });

    test("forwards ref to the textarea element", () => {
        const ref = React.createRef();
        render(<Textarea ref={ref} />);
        expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
    });

    test("applies additional props", () => {
        render(<Textarea placeholder="Enter text here" />);
        const textareaElement = screen.getByPlaceholderText("Enter text here");
        expect(textareaElement).toBeInTheDocument();
    });
});