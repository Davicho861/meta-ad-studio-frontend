import { render, screen } from "@testing-library/react";
import { Progress } from "./progress.tsx";

describe("Progress", () => {
  it("renders without crashing", () => {
    render(<Progress value={50} />);
    const progressElement = screen.getByRole("progressbar");
    expect(progressElement).toBeInTheDocument();
  });

  it("applies additional className", () => {
    render(<Progress value={50} className="custom-class" />);
    const progressElement = screen.getByRole("progressbar");
    expect(progressElement).toHaveClass("custom-class");
  });

  it("sets the correct value", () => {
    render(<Progress value={75} />);
    const progressElement = screen.getByRole("progressbar");
    expect(progressElement).toHaveAttribute("aria-valuenow", "75");
  });

  it("handles a value of 0", () => {
    render(<Progress value={0} />);
    const progressIndicator = screen.getByRole("progressbar").firstChild;
    expect(progressIndicator).toHaveStyle("transform: translateX(-100%)");
  });

  it("handles a value of 100", () => {
    render(<Progress value={100} />);
    const progressIndicator = screen.getByRole("progressbar").firstChild;
    expect(progressIndicator).toHaveStyle("transform: translateX(-0%)");
  });
});
