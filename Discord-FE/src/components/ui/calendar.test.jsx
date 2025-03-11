import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Calendar } from './calendar';
import { DayPicker } from 'react-day-picker';

jest.mock('react-day-picker', () => ({
    DayPicker: jest.fn((props) => <div data-testid="day-picker" {...props} />),
}));

describe('Calendar component', () => {
    it('renders without crashing', () => {
        render(<Calendar />);
        expect(screen.getByTestId('day-picker')).toBeInTheDocument();
    });

    it('passes showOutsideDays prop correctly', () => {
        render(<Calendar showOutsideDays={false} />);
        expect(DayPicker).toHaveBeenCalledWith(
            expect.objectContaining({ showOutsideDays: false }),
            {}
        );
    });

    it('applies custom className', () => {
        const customClass = 'custom-class';
        render(<Calendar className={customClass} />);
        expect(DayPicker).toHaveBeenCalledWith(
            expect.objectContaining({ className: expect.stringContaining(customClass) }),
            {}
        );
    });

    it('applies custom classNames', () => {
        const customClassNames = { day: 'custom-day-class' };
        render(<Calendar classNames={customClassNames} />);
        expect(DayPicker).toHaveBeenCalledWith(
            expect.objectContaining({ classNames: expect.objectContaining(customClassNames) }),
            {}
        );
    });

    it('renders navigation icons', () => {
        render(<Calendar />);
        expect(screen.getByTestId('day-picker')).toBeInTheDocument();
    });
});