// backend/tests/integration/health.test.js
/**
 * Integration test for the /health endpoint.
 * Uses supertest against the real Express app — no DB needed.
 */

import request from "supertest";
import { createTestApp } from "../helpers/testApp.js";

const app = createTestApp();

describe("GET /health", () => {
  it("returns 200 with status ok", async () => {
    const res = await request(app).get("/health");

    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({ status: "ok" });
  });

  it("responds with JSON content-type", async () => {
    const res = await request(app).get("/health");
    expect(res.headers["content-type"]).toMatch(/json/);
  });
});

describe("GET /api/unknown-route", () => {
  it("returns 404 for unknown routes", async () => {
    const res = await request(app).get("/api/v1/this-does-not-exist");
    expect(res.statusCode).toBe(404);
  });
});