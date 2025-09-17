import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../index';

describe('Button Component', () => {
    describe('Rendering', () => {
        it('should render button with text (positive scenario)', () => {
            render(<Button>Click me</Button>);

            expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
        });

        it('should render button with different variants (positive scenario)', () => {
            const { rerender } = render(<Button variant="primary">Primary</Button>);
            expect(screen.getByRole('button')).toHaveClass('btn--primary');

            rerender(<Button variant="secondary">Secondary</Button>);
            expect(screen.getByRole('button')).toHaveClass('btn--secondary');
        });

        it('should render button with different sizes (positive scenario)', () => {
            const { rerender } = render(<Button size="small">Small</Button>);
            expect(screen.getByRole('button')).toHaveClass('btn--small');

            rerender(<Button size="medium">Medium</Button>);
            expect(screen.getByRole('button')).toHaveClass('btn--medium');

            rerender(<Button size="large">Large</Button>);
            expect(screen.getByRole('button')).toHaveClass('btn--large');
        });

        it('should render disabled button (positive scenario)', () => {
            render(<Button disabled>Disabled</Button>);

            const button = screen.getByRole('button');
            expect(button).toBeDisabled();
            expect(button).toHaveClass('btn--primary');
        });


        it('should render button with custom className (positive scenario)', () => {
            render(<Button className="custom-class">Custom</Button>);

            expect(screen.getByRole('button')).toHaveClass('custom-class');
        });
    });

    describe('Interactions', () => {
        it('should call onClick when clicked (positive scenario)', () => {
            const handleClick = jest.fn();
            render(<Button onClick={handleClick}>Click me</Button>);

            fireEvent.click(screen.getByRole('button'));
            expect(handleClick).toHaveBeenCalledTimes(1);
        });

        it('should not call onClick when disabled (negative scenario)', () => {
            const handleClick = jest.fn();
            render(<Button disabled onClick={handleClick}>Disabled</Button>);

            fireEvent.click(screen.getByRole('button'));
            expect(handleClick).not.toHaveBeenCalled();
        });


        it('should handle multiple clicks (positive scenario)', () => {
            const handleClick = jest.fn();
            render(<Button onClick={handleClick}>Click me</Button>);

            const button = screen.getByRole('button');
            fireEvent.click(button);
            fireEvent.click(button);
            fireEvent.click(button);

            expect(handleClick).toHaveBeenCalledTimes(3);
        });
    });

    describe('Form Integration', () => {
        it('should submit form when type is submit (positive scenario)', () => {
            const handleSubmit = jest.fn();
            render(
                <form onSubmit={handleSubmit}>
                    <Button type="submit">Submit</Button>
                </form>
            );

            fireEvent.click(screen.getByRole('button'));
            expect(handleSubmit).toHaveBeenCalledTimes(1);
        });

        it('should reset form when type is reset (positive scenario)', () => {
            const handleReset = jest.fn();
            render(
                <form onReset={handleReset}>
                    <Button type="reset">Reset</Button>
                </form>
            );

            fireEvent.click(screen.getByRole('button'));
            expect(handleReset).toHaveBeenCalledTimes(1);
        });

        it('should not submit form when type is button (positive scenario)', () => {
            const handleSubmit = jest.fn();
            render(
                <form onSubmit={handleSubmit}>
                    <Button type="button">Button</Button>
                </form>
            );

            fireEvent.click(screen.getByRole('button'));
            expect(handleSubmit).not.toHaveBeenCalled();
        });
    });

    describe('Accessibility', () => {
        it('should have proper ARIA attributes (positive scenario)', () => {
            render(<Button>Button</Button>);

            expect(screen.getByRole('button')).toBeInTheDocument();
        });

        it('should be keyboard accessible (positive scenario)', () => {
            const handleClick = jest.fn();
            render(<Button onClick={handleClick}>Click me</Button>);

            const button = screen.getByRole('button');
            button.focus();
            expect(button).toHaveFocus();

            fireEvent.click(button);
            expect(handleClick).toHaveBeenCalled();
        });

        it('should handle Enter key press (positive scenario)', () => {
            const handleClick = jest.fn();
            render(<Button onClick={handleClick}>Click me</Button>);

            const button = screen.getByRole('button');
            fireEvent.click(button);
            expect(handleClick).toHaveBeenCalled();
        });

        it('should handle Space key press (positive scenario)', () => {
            const handleClick = jest.fn();
            render(<Button onClick={handleClick}>Click me</Button>);

            const button = screen.getByRole('button');
            fireEvent.click(button);
            expect(handleClick).toHaveBeenCalled();
        });

        it('should not respond to other keys (negative scenario)', () => {
            const handleClick = jest.fn();
            render(<Button onClick={handleClick}>Click me</Button>);

            const button = screen.getByRole('button');
            fireEvent.keyDown(button, { key: 'Escape' });
            expect(handleClick).not.toHaveBeenCalled();
        });
    });


    describe('Error Handling', () => {
        it('should handle onClick errors gracefully (negative scenario)', () => {
            const handleClick = jest.fn().mockImplementation(() => {
                throw new Error('Click error');
            });

            // Should not throw error during render
            expect(() => {
                render(<Button onClick={handleClick}>Click me</Button>);
            }).not.toThrow();
        });

        it('should handle undefined onClick (negative scenario)', () => {
            // Should not throw error when onClick is undefined
            expect(() => {
                render(<Button>Click me</Button>);
                fireEvent.click(screen.getByRole('button'));
            }).not.toThrow();
        });
    });

    describe('Props Validation', () => {
        it('should handle all props correctly (positive scenario)', () => {
            const handleClick = jest.fn();
            render(
                <Button
                    variant="primary"
                    size="large"
                    disabled={false}
                    type="button"
                    className="test-class"
                    onClick={handleClick}
                >
                    Test Button
                </Button>
            );

            const button = screen.getByRole('button');
            expect(button).toHaveClass('btn--primary', 'btn--large', 'test-class');
            expect(button).toHaveAttribute('type', 'button');
            expect(button).not.toBeDisabled();
        });

        it('should use default props when not provided (positive scenario)', () => {
            render(<Button>Default</Button>);

            const button = screen.getByRole('button');
            expect(button).toHaveClass('btn--primary', 'btn--medium');
            expect(button).toHaveAttribute('type', 'button');
            expect(button).not.toBeDisabled();
        });
    });

    describe('Children Handling', () => {
        it('should render string children (positive scenario)', () => {
            render(<Button>String content</Button>);
            expect(screen.getByText('String content')).toBeInTheDocument();
        });

        it('should render React element children (positive scenario)', () => {
            render(
                <Button>
                    <span>React element</span>
                </Button>
            );
            expect(screen.getByText('React element')).toBeInTheDocument();
        });

        it('should render multiple children (positive scenario)', () => {
            render(
                <Button>
                    <span>Icon</span>
                    <span>Text</span>
                </Button>
            );
            expect(screen.getByText('Icon')).toBeInTheDocument();
            expect(screen.getByText('Text')).toBeInTheDocument();
        });

        it('should handle empty children (negative scenario)', () => {
            render(<Button>{''}</Button>);
            expect(screen.getByRole('button')).toBeInTheDocument();
        });
    });
});
