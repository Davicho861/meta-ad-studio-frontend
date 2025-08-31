import { render, screen } from "@testing-library/react";
import { Input } from "./input.tsx";

describe("Input", () => {
  it("renders without crashing", () => {
    render(<Input />);
    const inputElement = screen.getByRole("textbox");
    expect(inputElement).toBeInTheDocument();
  });

  it("applies additional className", () => {
    render(<Input className="custom-class" />);
    const inputElement = screen.getByRole("textbox");
    expect(inputElement).toHaveClass("custom-class");
  });

  it("handles the type prop", () => {
    const { container } = render(<Input type="password" />);
    const inputElement = container.querySelector(`input[type="password"]`);
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute("type", "password");
  });

  it("is disabled when the disabled prop is true", () => {
    render(<Input disabled />);
    const inputElement = screen.getByRole("textbox");
    expect(inputElement).toBeDisabled();
  });
});
