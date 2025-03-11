import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { Icons } from "./icons";
import "@testing-library/jest-dom";

describe("Icons component", () => {
  it("should render logo icon with correct stroke width", () => {
    const { container } = render(<Icons.logo />);
    const lines = container.querySelectorAll("line");
    lines.forEach((line) => {
      expect(line).toHaveAttribute("strokeWidth", "32");
    });
  });

  it("should render twitter icon correctly", () => {
    const { container } = render(<Icons.twitter />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("should render gitHub icon correctly", () => {
    const { container } = render(<Icons.gitHub />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("should render radix icon correctly", () => {
    const { container } = render(<Icons.radix />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("should render aria icon correctly", () => {
    const { container } = render(<Icons.aria />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("should render npm icon correctly", () => {
    const { container } = render(<Icons.npm />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("should render yarn icon correctly", () => {
    const { container } = render(<Icons.yarn />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("should render pnpm icon correctly", () => {
    const { container } = render(<Icons.pnpm />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("should render react icon correctly", () => {
    const { container } = render(<Icons.react />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("should render tailwind icon correctly", () => {
    const { container } = render(<Icons.tailwind />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("should render google icon correctly", () => {
    const { container } = render(<Icons.google />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("should render apple icon correctly", () => {
    const { container } = render(<Icons.apple />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("should render paypal icon correctly", () => {
    const { container } = render(<Icons.paypal />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("should render spinner icon correctly", () => {
    const { container } = render(<Icons.spinner />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });
});
