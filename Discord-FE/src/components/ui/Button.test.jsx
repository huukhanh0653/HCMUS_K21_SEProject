import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button } from './button';

describe('Button component', () => {
    it('renders default button', () => {
        render(<Button>Default Button</Button>);
        const buttonElement = screen.getByText('Default Button');
        expect(buttonElement).toBeInTheDocument();
        expect(buttonElement).toHaveClass('bg-primary text-primary-foreground');
    });

    it('renders destructive button', () => {
        render(<Button variant="destructive">Destructive Button</Button>);
        const buttonElement = screen.getByText('Destructive Button');
        expect(buttonElement).toBeInTheDocument();
        expect(buttonElement).toHaveClass('bg-destructive text-destructive-foreground');
    });

    it('renders outline button', () => {
        render(<Button variant="outline">Outline Button</Button>);
        const buttonElement = screen.getByText('Outline Button');
        expect(buttonElement).toBeInTheDocument();
        expect(buttonElement).toHaveClass('border border-input bg-background');
    });

    it('renders secondary button', () => {
        render(<Button variant="secondary">Secondary Button</Button>);
        const buttonElement = screen.getByText('Secondary Button');
        expect(buttonElement).toBeInTheDocument();
        expect(buttonElement).toHaveClass('bg-secondary text-secondary-foreground');
    });

    it('renders ghost button', () => {
        render(<Button variant="ghost">Ghost Button</Button>);
        const buttonElement = screen.getByText('Ghost Button');
        expect(buttonElement).toBeInTheDocument();
        expect(buttonElement).toHaveClass('hover:bg-accent hover:text-accent-foreground');
    });

    it('renders link button', () => {
        render(<Button variant="link">Link Button</Button>);
        const buttonElement = screen.getByText('Link Button');
        expect(buttonElement).toBeInTheDocument();
        expect(buttonElement).toHaveClass('text-primary underline-offset-4');
    });

    it('renders small button', () => {
        render(<Button size="sm">Small Button</Button>);
        const buttonElement = screen.getByText('Small Button');
        expect(buttonElement).toBeInTheDocument();
        expect(buttonElement).toHaveClass('h-8 rounded-md px-3 text-xs');
    });

    it('renders large button', () => {
        render(<Button size="lg">Large Button</Button>);
        const buttonElement = screen.getByText('Large Button');
        expect(buttonElement).toBeInTheDocument();
        expect(buttonElement).toHaveClass('h-10 rounded-md px-8');
    });

    it('renders icon button', () => {
        render(<Button size="icon">Icon Button</Button>);
        const buttonElement = screen.getByText('Icon Button');
        expect(buttonElement).toBeInTheDocument();
        expect(buttonElement).toHaveClass('h-9 w-9');
    });
});

test("calls onClick when button is clicked", () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click me</Button>);

  const button = screen.getByText(/Click me/i);
  fireEvent.click(button);

  expect(handleClick).toHaveBeenCalledTimes(1);
});