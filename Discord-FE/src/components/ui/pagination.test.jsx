import React from "react";
import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import {

Pagination,
PaginationContent,
PaginationLink,
PaginationItem,
PaginationPrevious,
PaginationNext,
PaginationEllipsis,
} from "./pagination";

describe("Pagination Component", () => {
test("renders Pagination component", () => {
    render(<Pagination />);
    const navElement = screen.getByRole("navigation", { name: /pagination/i });
    expect(navElement).toBeInTheDocument();
});

test("renders PaginationContent component", () => {
    render(<PaginationContent />);
    const ulElement = screen.getByRole("list");
    expect(ulElement).toBeInTheDocument();
});

test("renders PaginationItem component", () => {
    render(<PaginationItem />);
    const liElement = screen.getByRole("listitem");
    expect(liElement).toBeInTheDocument();
});

test("renders active PaginationLink component", () => {
    render(<PaginationLink isActive />);
    const linkElement = screen.getByRole("link");
    expect(linkElement).toHaveAttribute("aria-current", "page");
});

test("renders inactive PaginationLink component", () => {
    render(<PaginationLink />);
    const linkElement = screen.getByRole("link");
    expect(linkElement).not.toHaveAttribute("aria-current");
});

test("renders PaginationPrevious component", () => {
    render(<PaginationPrevious />);
    const linkElement = screen.getByRole("link", { name: /go to previous page/i });
    expect(linkElement).toBeInTheDocument();
});

test("renders PaginationNext component", () => {
    render(<PaginationNext />);
    const linkElement = screen.getByRole("link", { name: /go to next page/i });
    expect(linkElement).toBeInTheDocument();
});

test("renders PaginationEllipsis component", () => {
    render(<PaginationEllipsis />);
    const spanElement = screen.getByText(/more pages/i);
    expect(spanElement).toBeInTheDocument();
});
});