import { Request, Response, NextFunction } from "express";
import { ZodError, ZodIssue } from "zod";
import { errorHandler } from "../middleware/errorHandler";
import { AppError, NotFoundError } from "../errors/AppError";

const mockRes = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const req = {} as Request;
const next = jest.fn() as NextFunction;

describe("errorHandler", () => {
  it("handles ZodError with 400 and validation details", () => {
    const res = mockRes();
    const issues: ZodIssue[] = [
      { path: ["name"], message: "name is required", code: "too_small", minimum: 1, type: "string", inclusive: true },
    ];
    const err = new ZodError(issues);

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Validation failed",
      details: [{ path: "name", message: "name is required" }],
    });
  });

  it("handles AppError with its status code and message", () => {
    const res = mockRes();
    const err = new NotFoundError("Item with id 1 not found");

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Item with id 1 not found" });
  });

  it("handles unknown errors with 500", () => {
    const res = mockRes();
    jest.spyOn(console, "error").mockImplementation(() => {});

    errorHandler(new Error("unexpected"), req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Internal server error" });
  });

  it("uses statusCode from a custom AppError subclass", () => {
    const res = mockRes();
    const err = new AppError("Bad request", 400);

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Bad request" });
  });
});
