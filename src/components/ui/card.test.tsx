import { render, screen } from "@testing-library/react";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "./card.tsx";

describe("Card Components", () => {
  describe("Card", () => {
    it("renders children and applies className", () => {
      render(<Card className="custom-card">Card Content</Card>);
      const cardElement = screen.getByText("Card Content");
      expect(cardElement).toBeInTheDocument();
      expect(cardElement).toHaveClass("custom-card");
    });
  });

  describe("CardHeader", () => {
    it("renders children and applies className", () => {
      render(<CardHeader className="custom-header">Header</CardHeader>);
      const headerElement = screen.getByText("Header");
      expect(headerElement).toBeInTheDocument();
      expect(headerElement).toHaveClass("custom-header");
    });
  });

  describe("CardTitle", () => {
    it("renders children and applies className", () => {
      render(<CardTitle className="custom-title">Title</CardTitle>);
      const titleElement = screen.getByText("Title");
      expect(titleElement).toBeInTheDocument();
      expect(titleElement).toHaveClass("custom-title");
    });
  });

  describe("CardDescription", () => {
    it("renders children and applies className", () => {
      render(
        <CardDescription className="custom-description">
          Description
        </CardDescription>
      );
      const descriptionElement = screen.getByText("Description");
      expect(descriptionElement).toBeInTheDocument();
      expect(descriptionElement).toHaveClass("custom-description");
    });
  });

  describe("CardContent", () => {
    it("renders children and applies className", () => {
      render(<CardContent className="custom-content">Content</CardContent>);
      const contentElement = screen.getByText("Content");
      expect(contentElement).toBeInTheDocument();
      expect(contentElement).toHaveClass("custom-content");
    });
  });

  describe("CardFooter", () => {
    it("renders children and applies className", () => {
      render(<CardFooter className="custom-footer">Footer</CardFooter>);
      const footerElement = screen.getByText("Footer");
      expect(footerElement).toBeInTheDocument();
      expect(footerElement).toHaveClass("custom-footer");
    });
  });
});
