import React from "react";
import { render } from "@testing-library/react";
import { Separator } from "./separator";
import "@testing-library/jest-dom";

describe("Separator component", () => {
    it("renders with default props", () => {
        const { container } = render(<Separator />);
        const separator = container.firstChild;
        expect(separator).toHaveClass("shrink-0 bg-border h-[1px] w-full");
    });

    it("renders with vertical orientation", () => {
        const { container } = render(<Separator orientation="vertical" />);
        const separator = container.firstChild;
        expect(separator).toHaveClass("shrink-0 bg-border h-full w-[1px]");
    });

    it("applies additional className", () => {
        const { container } = render(<Separator className="extra-class" />);
        const separator = container.firstChild;
        expect(separator).toHaveClass("extra-class");
    });
});