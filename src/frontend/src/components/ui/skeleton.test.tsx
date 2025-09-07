import { render, screen } from "@testing-library/react";
import { Skeleton } from "./skeleton.tsx";
import { describe, it, expect } from "vitest";

describe("Skeleton Component", () => {
  it("should render with default classes", () => {
    render(<Skeleton data-testid="skeleton" />);
    const skeletonElement = screen.getByTestId("skeleton");
    expect(skeletonElement).toBeInTheDocument();
    expect(skeletonElement).toHaveClass("animate-pulse rounded-md bg-muted");
  });

  it("should accept and merge additional classes", () => {
    const additionalClass = "w-full h-4";
    render(<Skeleton className={additionalClass} data-testid="skeleton" />);
    const skeletonElement = screen.getByTestId("skeleton");
    expect(skeletonElement).toHaveClass("animate-pulse rounded-md bg-muted");
    expect(skeletonElement).toHaveClass(additionalClass);
  });

  it("should pass through other HTML attributes", () => {
    render(<Skeleton data-testid="custom-skeleton" aria-label="Loading" />);
    const skeletonElement = screen.getByTestId("custom-skeleton");
    expect(skeletonElement).toHaveAttribute("aria-label", "Loading");
  });
});
