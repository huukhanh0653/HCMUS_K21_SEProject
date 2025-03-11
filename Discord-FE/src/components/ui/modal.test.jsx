import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { PopupModal } from "./modal";
import "@testing-library/jest-dom";

describe("PopupModal Component", () => {
    const mockProps = {
        title: "Test Title",
        description: "Test Description",
    };

    const MockFormComponent = ({ setOpen }) => (
        <div>
            <button onClick={() => setOpen(false)}>Submit</button>
        </div>
    );

    test("renders Dialog on desktop view", () => {
        window.matchMedia = jest.fn().mockImplementation(query => {
            return {
                matches: query === "(min-width: 768px)",
                addEventListener: jest.fn(),
                removeEventListener: jest.fn(),
            };
        });

        render(
            <PopupModal
                open={true}
                setOpen={jest.fn()}
                formComponent={MockFormComponent}
                props={mockProps}
            >
                <button>Open Modal</button>
            </PopupModal>
        );

        expect(screen.getByText("Test Title")).toBeInTheDocument();
        expect(screen.getByText("Test Description")).toBeInTheDocument();
    });

    test("renders Drawer on mobile view", () => {
        window.matchMedia = jest.fn().mockImplementation(query => {
            return {
                matches: query !== "(min-width: 768px)",
                addListener: jest.fn(),
                removeListener: jest.fn(),
            };
        });

        render(
            <PopupModal
                open={true}
                setOpen={jest.fn()}
                formComponent={MockFormComponent}
                props={mockProps}
            >
                <button>Open Modal</button>
            </PopupModal>
        );

        expect(screen.getByText("Test Title")).toBeInTheDocument();
        expect(screen.getByText("Test Description")).toBeInTheDocument();
    });

    test("calls setOpen when form component button is clicked", () => {
        const setOpenMock = jest.fn();

        render(
            <PopupModal
                open={true}
                setOpen={setOpenMock}
                formComponent={MockFormComponent}
                props={mockProps}
            >
                <button>Open Modal</button>
            </PopupModal>
        );

        fireEvent.click(screen.getByText("Submit"));
        expect(setOpenMock).toHaveBeenCalledWith(false);
    });
});