import { render, screen, act } from "@testing-library/react";
import { vi } from "vitest";
import { Avatar, AvatarImage, AvatarFallback } from "./avatar.tsx";

describe("Avatar", () => {
  let imageInstance: {
    onload: ((event: Event) => void) | null;
    src: string;
  } | null = null;

  beforeEach(() => {
    vi.stubGlobal("Image", class MockImage {
      onload: ((event: Event) => void) | null = null;
      src = "";
      constructor() {
        imageInstance = this;
      }
      addEventListener(type: string, listener: EventListener) {
        if (type === 'load') {
          this.onload = listener as (event: Event) => void;
        }
      }
      removeEventListener() {}
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    imageInstance = null;
  });

  it("renders without crashing", () => {
    render(
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    );
    const fallback = screen.getByText("CN");
    expect(fallback).toBeInTheDocument();
  });

  it("applies additional className to Avatar", () => {
    render(
      <Avatar className="custom-avatar" data-testid="avatar">
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    );
    const avatarElement = screen.getByTestId("avatar");
    expect(avatarElement).toHaveClass("custom-avatar");
  });

  it("displays image after it has loaded and applies className", async () => {
    render(
      <Avatar>
        <AvatarImage
          className="custom-image"
          src="https://github.com/shadcn.png"
          alt="@shadcn"
          data-testid="avatar-image"
        />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    );

    // Manually trigger the onload event inside act
    act(() => {
      if (imageInstance && imageInstance.onload) {
        imageInstance.onload(new Event("load"));
      }
    });

    const imageElement = await screen.findByTestId("avatar-image");
    expect(imageElement).toBeInTheDocument();
    expect(imageElement).toHaveClass("custom-image");
  });

  it("applies additional className to AvatarFallback", () => {
    render(
      <Avatar>
        <AvatarFallback className="custom-fallback">CN</AvatarFallback>
      </Avatar>
    );
    const fallbackElement = screen.getByText("CN");
    expect(fallbackElement).toHaveClass("custom-fallback");
  });
});
