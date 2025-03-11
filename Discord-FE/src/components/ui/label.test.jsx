import React from "react";
import { render } from "@testing-library/react";
import { Label } from "./label";
import "@testing-library/jest-dom";

describe("Label component", () => {
    it("renders without crashing", () => {
        const { getByText } = render(<Label>Test Label</Label>);
        expect(getByText("Test Label")).toBeInTheDocument();
    });

    it("applies custom className", () => {
        const { container } = render(<Label className="custom-class">Test Label</Label>);
        expect(container.firstChild).toHaveClass("custom-class");
    });

    it("forwards ref to the root element", () => {
        const ref = React.createRef();
        render(<Label ref={ref}>Test Label</Label>);
        expect(ref.current).toBeInstanceOf(HTMLElement);
    });

    it("applies default styles", () => {
        const { container } = render(<Label>Test Label</Label>);
        expect(container.firstChild).toHaveClass("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70");
    });
});