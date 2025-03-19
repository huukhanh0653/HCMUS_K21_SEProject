import React from "react";
import { render } from "@testing-library/react";
import { Badge } from "./badge";
import "@testing-library/jest-dom";

describe("Badge component", () => {
    it("should render with default variant", () => {
        const { container } = render(<Badge />);
        expect(container.firstChild).toHaveClass("bg-primary text-primary-foreground");
    });

    it("should render with secondary variant", () => {
        const { container } = render(<Badge variant="secondary" />);
        expect(container.firstChild).toHaveClass("bg-secondary text-secondary-foreground");
    });

    it("should render with destructive variant", () => {
        const { container } = render(<Badge variant="destructive" />);
        expect(container.firstChild).toHaveClass("bg-destructive text-destructive-foreground");
    });

    it("should render with outline variant", () => {
        const { container } = render(<Badge variant="outline" />);
        expect(container.firstChild).toHaveClass("text-foreground");
    });

    it("should apply additional class names", () => {
        const { container } = render(<Badge className="custom-class" />);
        expect(container.firstChild).toHaveClass("custom-class");
    });
});