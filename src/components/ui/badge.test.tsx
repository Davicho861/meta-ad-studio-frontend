import { render, screen } from '@testing-library/react';
import { Badge } from './badge.js';

describe('Badge', () => {
  test('renders with default variant', () => {
    render(<Badge>Default Badge</Badge>);
    const badgeElement = screen.getByText('Default Badge');
    expect(badgeElement).toBeInTheDocument();
    expect(badgeElement).toHaveClass('bg-primary');
  });

  test('renders with secondary variant', () => {
    render(<Badge variant="secondary">Secondary Badge</Badge>);
    const badgeElement = screen.getByText('Secondary Badge');
    expect(badgeElement).toBeInTheDocument();
    expect(badgeElement).toHaveClass('bg-secondary');
  });

  test('renders with destructive variant', () => {
    render(<Badge variant="destructive">Destructive Badge</Badge>);
    const badgeElement = screen.getByText('Destructive Badge');
    expect(badgeElement).toBeInTheDocument();
    expect(badgeElement).toHaveClass('bg-destructive');
  });

  test('renders with outline variant', () => {
    render(<Badge variant="outline">Outline Badge</Badge>);
    const badgeElement = screen.getByText('Outline Badge');
    expect(badgeElement).toBeInTheDocument();
    expect(badgeElement).toHaveClass('text-foreground');
  });

  test('renders with additional className', () => {
    render(<Badge className="custom-class">Badge with custom class</Badge>);
    const badgeElement = screen.getByText('Badge with custom class');
    expect(badgeElement).toBeInTheDocument();
    expect(badgeElement).toHaveClass('custom-class');
  });

  test('renders children correctly', () => {
    render(<Badge><span>Child Span</span></Badge>);
    const childElement = screen.getByText('Child Span');
    expect(childElement).toBeInTheDocument();
    expect(childElement.tagName).toBe('SPAN');
  });
});
