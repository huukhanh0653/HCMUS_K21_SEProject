import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Footer from './Footer';
import { ThemeProvider } from './ThemeProvider';
import '@testing-library/jest-dom';

// Mock data for testing
const FOOTER_LINKS = [
    { title: 'Column 1', links: ['Link 1', 'Link 2'] },
    { title: 'Column 2', links: ['Link 3', 'Link 4'] }
];

const FOOTER_CONTACT_INFO = {
    title: 'Contact Us',
    links: [
        { label: 'Email', value: 'contact@example.com' },
        { label: 'Phone', value: '123-456-7890' }
    ]
};

describe('Footer Component', () => {
    test('renders footer links correctly', () => {
        render(
            <Router>
                <ThemeProvider>
                    <Footer />
                </ThemeProvider>
            </Router>
        );

        // Check if footer links are rendered
        FOOTER_LINKS.forEach(col => {
            expect(screen.getByText(col.title)).toBeInTheDocument();
            col.links.forEach(link => {
                expect(screen.getByText(link)).toBeInTheDocument();
            });
        });
    });

    test('renders contact info correctly', () => {
        render(
            <Router>
                <ThemeProvider>
                    <Footer />
                </ThemeProvider>
            </Router>
        );

        // Check if contact info is rendered
        expect(screen.getByText(FOOTER_CONTACT_INFO.title)).toBeInTheDocument();
        FOOTER_CONTACT_INFO.links.forEach(link => {
            expect(screen.getByText(link.label)).toBeInTheDocument();
            expect(screen.getByText(link.value)).toBeInTheDocument();
        });
    });

    test('renders social icons correctly', () => {
        render(
            <Router>
                <ThemeProvider>
                    <Footer />
                </ThemeProvider>
            </Router>
        );

        // Check if social icons are rendered
        const socialIcons = screen.getAllByRole('link');
        expect(socialIcons).toHaveLength(3);
    });

    test('renders copyright text correctly', () => {
        render(
            <Router>
                <ThemeProvider>
                    <Footer />
                </ThemeProvider>
            </Router>
        );

        // Check if copyright text is rendered
        expect(screen.getByText('2025 EchoNet| All rights reserved.')).toBeInTheDocument();
    });
});