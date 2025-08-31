import { render, screen } from "@testing-library/react";
import { Label } from "./label.tsx";

describe("Label", () => {
  it("renders without crashing", () => {
    render(<Label>Test Label</Label>);
    const labelElement = screen.getByText("Test Label");
    expect(labelElement).toBeInTheDocument();
  });

  it("applies additional className", () => {
    render(<Label className="custom-class">Test Label</Label>);
    const labelElement = screen.getByText("Test Label");
    expect(labelElement).toHaveClass("custom-class");
  });

  it("renders children correctly", () => {
    render(
      <Label>
        <span>Child Span</span>
      </Label>
    );
    const childElement = screen.getByText("Child Span");
    expect(childElement).toBeInTheDocument();
  });
});
