import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Input } from './input';

describe('Input component', () => {
    test('renders input element', () => {
        render(<Input type="text" />);
        const inputElement = screen.getByRole('textbox');
        expect(inputElement).toBeInTheDocument();
    });

    test('applies custom className', () => {
        render(<Input type="text" className="custom-class" />);
        const inputElement = screen.getByRole('textbox');
        expect(inputElement).toHaveClass('custom-class');
    });

    test('forwards ref to input element', () => {
        const ref = React.createRef();
        render(<Input type="text" ref={ref} />);
        expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    test('applies additional props to input element', () => {
        render(<Input type="text" placeholder="Enter text" />);
        const inputElement = screen.getByPlaceholderText('Enter text');
        expect(inputElement).toBeInTheDocument();
    });
});