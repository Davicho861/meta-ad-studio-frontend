import { render, screen } from '@testing-library/react';
import { Alert, AlertTitle, AlertDescription } from './alert.js';

describe('Alert', () => {
  test('renders with default variant', () => {
    render(<Alert>Default Alert</Alert>);
    const alertElement = screen.getByText('Default Alert');
    expect(alertElement).toBeInTheDocument();
    expect(alertElement).toHaveClass('bg-background');
  });

  test('renders with destructive variant', () => {
    render(<Alert variant="destructive">Destructive Alert</Alert>);
    const alertElement = screen.getByText('Destructive Alert');
    expect(alertElement).toBeInTheDocument();
    expect(alertElement).toHaveClass('border-destructive/50');
  });

  test('renders with additional className', () => {
    render(<Alert className="custom-class">Alert with custom class</Alert>);
    const alertElement = screen.getByText('Alert with custom class');
    expect(alertElement).toBeInTheDocument();
    expect(alertElement).toHaveClass('custom-class');
  });

  test('renders with AlertTitle and AlertDescription', () => {
    render(
      <Alert>
        <AlertTitle>Alert Title</AlertTitle>
        <AlertDescription>Alert Description</AlertDescription>
      </Alert>
    );
    expect(screen.getByText('Alert Title')).toBeInTheDocument();
    expect(screen.getByText('Alert Description')).toBeInTheDocument();
  });

  test('AlertTitle renders with additional className', () => {
    render(<AlertTitle className="custom-title-class">Title</AlertTitle>);
    const titleElement = screen.getByText('Title');
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveClass('custom-title-class');
  });

  test('AlertDescription renders with additional className', () => {
    render(<AlertDescription className="custom-description-class">Description</AlertDescription>);
    const descriptionElement = screen.getByText('Description');
    expect(descriptionElement).toBeInTheDocument();
    expect(descriptionElement).toHaveClass('custom-description-class');
  });
});
