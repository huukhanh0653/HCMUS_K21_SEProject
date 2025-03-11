import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "./dialog";

describe("Dialog component", () => {
  test("renders Dialog component", () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogPortal>
          <DialogOverlay />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dialog Title</DialogTitle>
            </DialogHeader>
            <DialogDescription>Dialog Description</DialogDescription>
            <DialogFooter>
              <button>Close</button>
            </DialogFooter>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    );

    expect(screen.getByText("Open Dialog")).toBeInTheDocument();
  });

  test("renders DialogHeader component", () => {
    render(<DialogHeader>Test Header</DialogHeader>);
    expect(screen.getByText("Test Header")).toBeInTheDocument();
  });

  test("renders DialogFooter component", () => {
    render(<DialogFooter>Test Footer</DialogFooter>);
    expect(screen.getByText("Test Footer")).toBeInTheDocument();
  });
});
