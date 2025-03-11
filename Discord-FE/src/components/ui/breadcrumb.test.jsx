import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import {

Breadcrumb,
BreadcrumbList,
BreadcrumbItem,
BreadcrumbLink,
BreadcrumbPage,
BreadcrumbSeparator,
BreadcrumbEllipsis,
} from './breadcrumb';

describe('Breadcrumb components', () => {
test('renders Breadcrumb component', () => {
    const { container } = render(<Breadcrumb className="test-class" />);
    expect(container.firstChild).toHaveClass('test-class');
});

test('renders BreadcrumbList component', () => {
    const { container } = render(<BreadcrumbList className="test-class" />);
    expect(container.firstChild).toHaveClass('test-class');
});

test('renders BreadcrumbItem component', () => {
    const { container } = render(<BreadcrumbItem className="test-class" />);
    expect(container.firstChild).toHaveClass('test-class');
});

test('renders BreadcrumbLink component', () => {
    const { container } = render(<BreadcrumbLink className="test-class" />);
    expect(container.firstChild).toHaveClass('test-class');
});

test('renders BreadcrumbPage component', () => {
    const { container } = render(<BreadcrumbPage className="test-class" />);
    expect(container.firstChild).toHaveClass('test-class');
});

test('renders BreadcrumbSeparator component', () => {
    const { container } = render(<BreadcrumbSeparator className="test-class" />);
    expect(container.firstChild).toHaveClass('test-class');
});

test('renders BreadcrumbEllipsis component', () => {
    const { container } = render(<BreadcrumbEllipsis className="test-class" />);
    expect(container.firstChild).toHaveClass('test-class');
});
});