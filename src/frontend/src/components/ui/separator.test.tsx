import { render, screen } from "@testing-library/react";
import { Separator } from "./separator.tsx";
import { describe, it, expect } from "vitest";

describe("Separator Component", () => {
  it("should render with default horizontal orientation", () => {
    render(
      <Separator
        decorative={false}
        orientation="horizontal"
        data-testid="separator"
      />
    );
    const separatorElement = screen.getByTestId("separator");
    expect(separatorElement).toBeInTheDocument();
    expect(separatorElement).toHaveClass("shrink-0 bg-border h-[1px] w-full");
  });

  it("should render with vertical orientation", () => {
    render(
      <Separator decorative={false} orientation="vertical" data-testid="separator" />
    );
    const separatorElement = screen.getByTestId("separator");
    expect(separatorElement).toBeInTheDocument();
    expect(separatorElement).toHaveClass("shrink-0 bg-border h-full w-[1px]");
    expect(separatorElement).toHaveAttribute("aria-orientation", "vertical");
  });

  it("should accept and merge additional classes", () => {
    const additionalClass = "my-4";
    render(<Separator className={additionalClass} data-testid="separator" />);
    const separatorElement = screen.getByTestId("separator");
    expect(separatorElement).toHaveClass("shrink-0 bg-border h-[1px] w-full");
    expect(separatorElement).toHaveClass(additionalClass);
  });

  it("should be decorative by default", () => {
    render(<Separator data-testid="separator" />);
    const separatorElement = screen.getByTestId("separator");
    // In Radix, a decorative separator has role="none"
    expect(separatorElement).toHaveAttribute("role", "none");
  });

  it("should not be decorative when specified", () => {
    render(<Separator decorative={false} data-testid="separator" />);
    const separatorElement = screen.getByTestId("separator");
    // A non-decorative separator has role="separator"
    expect(separatorElement).toHaveAttribute("role", "separator");
  });
});
