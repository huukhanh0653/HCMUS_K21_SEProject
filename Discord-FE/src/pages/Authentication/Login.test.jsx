import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from './Login';
import { useTheme } from '../../components/ThemeProvider';
import { signInWithGoogle, signInWithFacebook } from '../../firebase';

jest.mock('../../components/ThemeProvider');
jest.mock('../../firebase');

describe('Login Component', () => {
    beforeEach(() => {
        useTheme.mockReturnValue({ isDarkMode: false });
    });

    // test('renders login heading', () => {
    //     render(<Login />);
    //     const headingElement = screen.getByText(/Đăng nhập/i);
    //     expect(headingElement).toBeInTheDocument();
    // });

    test('renders Google login button', () => {
        render(<Login />);
        const googleButton = screen.getByText(/Đăng nhập bằng Google/i);
        expect(googleButton).toBeInTheDocument();
    });

    test('renders Facebook login button', () => {
        render(<Login />);
        const facebookButton = screen.getByText(/Đăng nhập bằng Facebook/i);
        expect(facebookButton).toBeInTheDocument();
    });

    test('handles Google login success', async () => {
        signInWithGoogle.mockResolvedValue({ email: 'test@example.com' });
        render(<Login />);
        const googleButton = screen.getByText(/Đăng nhập bằng Google/i);
        fireEvent.click(googleButton);
        expect(signInWithGoogle).toHaveBeenCalled();
    });

    test('handles Google login failure', async () => {
        signInWithGoogle.mockRejectedValue(new Error('Google login failed'));
        render(<Login />);
        const googleButton = screen.getByText(/Đăng nhập bằng Google/i);
        fireEvent.click(googleButton);
        const errorMessage = await screen.findByText(/Google đăng nhập thất bại/i);
        expect(errorMessage).toBeInTheDocument();
    });

    test('handles Facebook login success', async () => {
        signInWithFacebook.mockResolvedValue({ email: 'test@example.com' });
        render(<Login />);
        const facebookButton = screen.getByText(/Đăng nhập bằng Facebook/i);
        fireEvent.click(facebookButton);
        expect(signInWithFacebook).toHaveBeenCalled();
    });

    test('handles Facebook login failure', async () => {
        signInWithFacebook.mockRejectedValue(new Error('Facebook login failed'));
        render(<Login />);
        const facebookButton = screen.getByText(/Đăng nhập bằng Facebook/i);
        fireEvent.click(facebookButton);
        const errorMessage = await screen.findByText(/Facebook đăng nhập thất bại/i);
        expect(errorMessage).toBeInTheDocument();
    });
});