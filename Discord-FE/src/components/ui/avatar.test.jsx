import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Avatar, AvatarImage, AvatarFallback } from "./avatar";

describe("Avatar component", () => {
    it("renders Avatar component correctly", () => {
        const { container } = render(<Avatar className="custom-class" />);
        expect(container.firstChild).toHaveClass("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full custom-class");
    });
});