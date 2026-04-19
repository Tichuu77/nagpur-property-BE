// backend/tests/integration/auth.routes.test.js
/**
 * Integration tests for POST /api/v1/admin/auth/login
 *
 * Uses:
 *  - Real Express app (createTestApp)
 *  - Real MongoDB (from CI service / local Docker)
 *  - supertest for HTTP assertions
 *
 * Seeds a real admin document before tests and cleans up after.
 */

import request from "supertest";
import { createTestApp } from "../helpers/testApp.js";
import { connectTestDb, disconnectTestDb, clearCollections } from "../helpers/testDb.js";
import Admin from "../../src/models/admin.model.js";

const app = createTestApp();

const TEST_ADMIN = {
  firstName: "Test",
  lastName: "Admin",
  email: "testadmin@ci.com",
  password: "Admin@1234",
  phone: "9876543210",
  role: "admin",
};

// ─── Lifecycle ────────────────────────────────────────────────────────────────
beforeAll(async () => {
  await connectTestDb();
  // Seed a real admin with a hashed password (model pre-save hook handles hashing)
  await Admin.create(TEST_ADMIN);
});

afterAll(async () => {
  await clearCollections(Admin);
  await disconnectTestDb();
});

// ─── Tests ────────────────────────────────────────────────────────────────────
describe("POST /api/v1/admin/auth/login", () => {
  it("returns 200 and a JWT token on valid credentials", async () => {
    const res = await request(app)
      .post("/api/v1/admin/auth/login")
      .send({ email: TEST_ADMIN.email, password: TEST_ADMIN.password })
      .set("Content-Type", "application/json");

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("token");
    expect(res.body.data).toHaveProperty("role", "admin");
    expect(typeof res.body.data.token).toBe("string");
  });

  it("returns 401 on wrong password", async () => {
    const res = await request(app)
      .post("/api/v1/admin/auth/login")
      .send({ email: TEST_ADMIN.email, password: "WrongPassword" });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("returns 401 when email does not exist", async () => {
    const res = await request(app)
      .post("/api/v1/admin/auth/login")
      .send({ email: "nobody@nowhere.com", password: "anything" });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("returns 400 on missing email field", async () => {
    const res = await request(app)
      .post("/api/v1/admin/auth/login")
      .send({ password: "Admin@1234" });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("returns 400 on missing password field", async () => {
    const res = await request(app)
      .post("/api/v1/admin/auth/login")
      .send({ email: TEST_ADMIN.email });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("returns 400 on invalid email format", async () => {
    const res = await request(app)
      .post("/api/v1/admin/auth/login")
      .send({ email: "not-an-email", password: "Admin@1234" });

    expect(res.statusCode).toBe(400);
  });
});