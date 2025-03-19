import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { Sheet, SheetTrigger, SheetContent } from "./sheet";
import "@testing-library/jest-dom";

describe("SheetTrigger", () => {
    it("should render the SheetTrigger component", () => {
        const { getByText } = render(
            <Sheet>
                <SheetTrigger>Open Sheet</SheetTrigger>
                <SheetContent>Sheet Content</SheetContent>
            </Sheet>
        );

        expect(getByText("Open Sheet")).toBeInTheDocument();
    });

    it("should open the sheet when the trigger is clicked", () => {
        const { getByText, queryByText } = render(
            <Sheet>
                <SheetTrigger>Open Sheet</SheetTrigger>
                <SheetContent>Sheet Content</SheetContent>
            </Sheet>
        );

        expect(queryByText("Sheet Content")).not.toBeInTheDocument();

        fireEvent.click(getByText("Open Sheet"));

        expect(getByText("Sheet Content")).toBeInTheDocument();
    });
});