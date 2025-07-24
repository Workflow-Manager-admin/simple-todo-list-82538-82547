import { render, screen, fireEvent, within } from "@testing-library/react";
import App from "./App";

// PUBLIC_INTERFACE
test("renders the app title", () => {
  render(<App />);
  expect(screen.getByRole("heading", { name: /simple todo/i })).toBeInTheDocument();
});

// PUBLIC_INTERFACE
test("can add and display a new todo", () => {
  render(<App />);
  const input = screen.getByPlaceholderText(/add new todo/i);
  fireEvent.change(input, { target: { value: "Test task" } });
  fireEvent.submit(input);
  expect(screen.getByText("Test task")).toBeInTheDocument();
});

// PUBLIC_INTERFACE
test("can mark a todo as completed", () => {
  render(<App />);
  const input = screen.getByPlaceholderText(/add new todo/i);
  fireEvent.change(input, { target: { value: "Complete me" } });
  fireEvent.submit(input);

  const checkbox = screen.getByRole("checkbox");
  expect(checkbox.checked).toBe(false);
  fireEvent.click(checkbox);
  expect(checkbox.checked).toBe(true);
});

// PUBLIC_INTERFACE
test("can edit an existing todo", () => {
  render(<App />);
  const input = screen.getByPlaceholderText(/add new todo/i);
  fireEvent.change(input, { target: { value: "Edit this" } });
  fireEvent.submit(input);

  const editButton = screen.getByLabelText("Edit");
  fireEvent.click(editButton);

  const editInput = screen.getByLabelText("Edit todo");
  fireEvent.change(editInput, { target: { value: "Edited!" } });
  fireEvent.blur(editInput);

  expect(screen.queryByText("Edit this")).not.toBeInTheDocument();
  expect(screen.getByText("Edited!")).toBeInTheDocument();
});

// PUBLIC_INTERFACE
test("can delete a todo", () => {
  render(<App />);
  const input = screen.getByPlaceholderText(/add new todo/i);
  fireEvent.change(input, { target: { value: "To be deleted" } });
  fireEvent.submit(input);

  const deleteButton = screen.getByLabelText(/delete/i);
  fireEvent.click(deleteButton);
  expect(screen.queryByText(/to be deleted/i)).not.toBeInTheDocument();
});

// PUBLIC_INTERFACE
test("can filter todos by status", () => {
  render(<App />);
  const input = screen.getByPlaceholderText(/add new todo/i);

  // Add two todos, mark the first completed
  fireEvent.change(input, { target: { value: "Done" } });
  fireEvent.submit(input);
  fireEvent.change(input, { target: { value: "Active" } });
  fireEvent.submit(input);

  const checkboxes = screen.getAllByRole("checkbox");
  fireEvent.click(checkboxes[0]); // Mark first as completed

  // Show Completed filter
  fireEvent.click(screen.getByRole("button", { name: /completed/i }));
  expect(screen.getByText("Done")).toBeInTheDocument();
  expect(screen.queryByText("Active")).not.toBeInTheDocument();

  // Show Active filter
  fireEvent.click(screen.getByRole("button", { name: /active/i }));
  expect(screen.getByText("Active")).toBeInTheDocument();
  expect(screen.queryByText("Done")).not.toBeInTheDocument();

  // Show All
  fireEvent.click(screen.getByRole("button", { name: /all/i }));
  expect(screen.getByText("Active")).toBeInTheDocument();
  expect(screen.getByText("Done")).toBeInTheDocument();
});
