// backend/tests/unit/utils.test.js
/**
 * Unit tests for shared utilities and middleware helpers.
 * Pure functions — no mocking needed.
 */

import { describe, it, expect } from "@jest/globals";
import { successResponse } from "../../src/utils/api-response.js";
import { getPagination } from "../../src/utils/pagination.js";

// ─── successResponse ─────────────────────────────────────────────────────────
describe("successResponse util", () => {
  it("returns correct shape with data and message", () => {
    const result = successResponse({ id: 1 }, "Created");
    expect(result).toMatchObject({
      success: true,
      message: "Created",
      data: { id: 1 },
    });
  });

  it("defaults message to 'Success'", () => {
    const result = successResponse(null);
    expect(result.message).toBe("Success");
    expect(result.success).toBe(true);
  });

  it("includes pagination when provided", () => {
    const pagination = { total: 100, page: 2, limit: 10, totalPages: 10 };
    const result = successResponse([], "OK", pagination);
    expect(result.pagination).toEqual(pagination);
  });

  it("handles null data", () => {
    const result = successResponse(null, "Deleted");
    expect(result.data).toBeNull();
    expect(result.success).toBe(true);
  });
});

// ─── getPagination ────────────────────────────────────────────────────────────
describe("getPagination util", () => {
  it("calculates skip correctly for page 1", () => {
    const { skip, limit } = getPagination({ page: 1, limit: 10 });
    expect(skip).toBe(0);
    expect(limit).toBe(10);
  });

  it("calculates skip correctly for page 3", () => {
    const { skip, limit } = getPagination({ page: 3, limit: 10 });
    expect(skip).toBe(20);
    expect(limit).toBe(10);
  });

  it("uses default values when not provided", () => {
    const { skip, limit } = getPagination({});
    expect(skip).toBe(0);
    expect(limit).toBe(10);
  });

  it("handles string page/limit inputs", () => {
    const { skip, limit } = getPagination({ page: "2", limit: "5" });
    expect(skip).toBe(5);
    expect(limit).toBe(5);
  });
});