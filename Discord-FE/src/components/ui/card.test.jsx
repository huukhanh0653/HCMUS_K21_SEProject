import React from "react";
import { render } from "@testing-library/react";
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "./card";
import "@testing-library/jest-dom/";

describe("Card components", () => {
    it("renders Card component correctly", () => {
        const { container } = render(<Card className="custom-class" />);
        expect(container.firstChild).toHaveClass("rounded-xl border bg-card text-card-foreground shadow custom-class");
    });

    it("renders CardHeader component correctly", () => {
        const { container } = render(<CardHeader className="custom-class" />);
        expect(container.firstChild).toHaveClass("flex flex-col space-y-1.5 p-6 custom-class");
    });

    it("renders CardTitle component correctly", () => {
        const { container } = render(<CardTitle className="custom-class" />);
        expect(container.firstChild).toHaveClass("font-semibold leading-none tracking-tight custom-class");
    });

    it("renders CardDescription component correctly", () => {
        const { container } = render(<CardDescription className="custom-class" />);
        expect(container.firstChild).toHaveClass("text-sm text-muted-foreground custom-class");
    });

    it("renders CardContent component correctly", () => {
        const { container } = render(<CardContent className="custom-class" />);
        expect(container.firstChild).toHaveClass("p-6 pt-0 custom-class");
    });

    it("renders CardFooter component correctly", () => {
        const { container } = render(<CardFooter className="custom-class" />);
        expect(container.firstChild).toHaveClass("flex items-center p-6 pt-0 custom-class");
    });
});