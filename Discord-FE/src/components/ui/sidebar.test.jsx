import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "./sidebar";

describe("Sidebar component", () => {
  test("renders Sidebar component", () => {
    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>Item 1</SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    );
    expect(screen.getByText("Item 1")).toBeInTheDocument();
  });

  test("toggles Sidebar on button click", async () => {
    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarTrigger />
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>Item 1</SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    );

    const toggleButton = screen.getByRole("button", {
      name: /toggle sidebar/i,
    });
    expect(toggleButton).toBeInTheDocument();

    await userEvent.click(toggleButton);
    expect(screen.getByText("Item 1")).toBeInTheDocument();
  });

  test("renders Sidebar with custom className", () => {
    render(
      <SidebarProvider>
        <Sidebar className="custom-sidebar">
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>Item 1</SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    );
    expect(
      screen.getByText("Item 1").closest(".custom-sidebar")
    ).toBeInTheDocument();
  });
});
