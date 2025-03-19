import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs";
import "@testing-library/jest-dom";

describe("Tabs component", () => {
    test("renders Tabs component", () => {
        render(
            <Tabs defaultValue="tab1">
                <TabsList>
                    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                </TabsList>
                <TabsContent value="tab1">Content 1</TabsContent>
                <TabsContent value="tab2">Content 2</TabsContent>
            </Tabs>
        );

        expect(screen.getByText("Tab 1")).toBeInTheDocument();
        expect(screen.getByText("Tab 2")).toBeInTheDocument();
        expect(screen.getByText("Content 1")).toBeInTheDocument();
    });

    test("switches tabs on click", async () => {
        render(
            <Tabs defaultValue="tab1">
                <TabsList>
                    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                </TabsList>
                <TabsContent value="tab1">Content 1</TabsContent>
                <TabsContent value="tab2">Content 2</TabsContent>
            </Tabs>
        );

        const tab2 = screen.getByText("Tab 2");
        await userEvent.click(tab2);

        expect(screen.getByText("Content 2")).toBeInTheDocument();
        expect(screen.queryByText("Content 1")).not.toBeInTheDocument();
    });

    test("applies custom class names", () => {
        render(
            <Tabs defaultValue="tab1">
                <TabsList className="custom-tabs-list">
                    <TabsTrigger value="tab1" className="custom-tab-trigger">Tab 1</TabsTrigger>
                    <TabsTrigger value="tab2" className="custom-tab-trigger">Tab 2</TabsTrigger>
                </TabsList>
                <TabsContent value="tab1" className="custom-tab-content">Content 1</TabsContent>
                <TabsContent value="tab2" className="custom-tab-content">Content 2</TabsContent>
            </Tabs>
        );

        expect(screen.getByText("Tab 1")).toHaveClass("custom-tab-trigger");
        expect(screen.getByText("Tab 2")).toHaveClass("custom-tab-trigger");
        expect(screen.getByText("Content 1")).toHaveClass("custom-tab-content");
    });
});