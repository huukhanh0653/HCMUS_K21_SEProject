import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { LanguageProvider, useLanguage } from "../LanguageProvider";
import i18n from "../../i18n";
import "@testing-library/jest-dom";

jest.mock("../../i18n", () => ({
    language: "en",
    changeLanguage: jest.fn(),
}));

const TestComponent = () => {
    const { language, toggleLanguage } = useLanguage();
    return (
        <div>
            <span data-testid="language">{language}</span>
            <button onClick={toggleLanguage}>Toggle Language</button>
        </div>
    );
};

describe("LanguageProvider", () => {
    it("provides the initial language", () => {
        render(
            <LanguageProvider>
                <TestComponent />
            </LanguageProvider>
        );

        expect(screen.getByTestId("language").textContent).toBe("en");
    });

    it("toggles the language", () => {
        render(
            <LanguageProvider>
                <TestComponent />
            </LanguageProvider>
        );

        fireEvent.click(screen.getByText("Toggle Language"));
        expect(i18n.changeLanguage).toHaveBeenCalledWith("vi");
        expect(screen.getByTestId("language").textContent).toBe("vi");

        fireEvent.click(screen.getByText("Toggle Language"));
        expect(i18n.changeLanguage).toHaveBeenCalledWith("en");
        expect(screen.getByTestId("language").textContent).toBe("en");
    });
});