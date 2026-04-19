// backend/tests/integration/broker.routes.test.js
/**
 * Integration tests for /api/v1/admin/brokers
 *
 * Covers: auth guard, CRUD, pagination, search, toggle status.
 * Seeds a real admin JWT before each test suite.
 */

import request from "supertest";
import { createTestApp } from "../helpers/testApp.js";
import { connectTestDb, disconnectTestDb, clearCollections } from "../helpers/testDb.js";
import Admin from "../../src/models/admin.model.js";
import Broker from "../../src/models/broker.model.js";

const app = createTestApp();
let authToken = "";

const ADMIN_SEED = {
  firstName: "CI",
  lastName: "Admin",
  email: "ci.admin@broker-test.com",
  password: "Admin@1234",
  phone: "9000000000",
  role: "admin",
};

// ─── Lifecycle ────────────────────────────────────────────────────────────────
beforeAll(async () => {
  await connectTestDb();
  await Admin.create(ADMIN_SEED);

  // Obtain a real JWT
  const loginRes = await request(app)
    .post("/api/v1/admin/auth/login")
    .send({ email: ADMIN_SEED.email, password: ADMIN_SEED.password });

  authToken = loginRes.body?.data?.token ?? "";
  if (!authToken) throw new Error("Could not obtain test JWT — check admin seed");
});

afterAll(async () => {
  await clearCollections(Admin, Broker);
  await disconnectTestDb();
});

afterEach(async () => {
  // Keep admin but clear brokers between tests for isolation
  await Broker.deleteMany({});
});

// ─── Auth guard ───────────────────────────────────────────────────────────────
describe("Broker routes — auth guard", () => {
  it("returns 401 without a token", async () => {
    const res = await request(app).get("/api/v1/admin/brokers");
    expect(res.statusCode).toBe(401);
  });

  it("returns 401 with an invalid token", async () => {
    const res = await request(app)
      .get("/api/v1/admin/brokers")
      .set("Authorization", "Bearer invalid.token.here");
    expect(res.statusCode).toBe(401);
  });
});

// ─── GET /brokers ─────────────────────────────────────────────────────────────
describe("GET /api/v1/admin/brokers", () => {
  it("returns empty list when no brokers exist", async () => {
    const res = await request(app)
      .get("/api/v1/admin/brokers")
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toEqual([]);
    expect(res.body.pagination.total).toBe(0);
  });

  it("returns paginated brokers", async () => {
    await Broker.create([
      { name: "Broker A", mobile: "9000000001" },
      { name: "Broker B", mobile: "9000000002" },
      { name: "Broker C", mobile: "9000000003" },
    ]);

    const res = await request(app)
      .get("/api/v1/admin/brokers?page=1&limit=2")
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.pagination.total).toBe(3);
    expect(res.body.pagination.totalPages).toBe(2);
  });

  it("filters brokers by search query", async () => {
    await Broker.create([
      { name: "Rajesh Kumar", mobile: "9000000011" },
      { name: "Priya Sharma", mobile: "9000000012" },
    ]);

    const res = await request(app)
      .get("/api/v1/admin/brokers?search=Rajesh")
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].name).toBe("Rajesh Kumar");
  });
});

// ─── POST /brokers ────────────────────────────────────────────────────────────
describe("POST /api/v1/admin/brokers", () => {
  it("creates a broker with valid payload", async () => {
    const payload = {
      name: "New Broker",
      mobile: "9111111111",
      email: "broker@test.com",
      city: "Nagpur",
      area: "Dighori",
    };

    const res = await request(app)
      .post("/api/v1/admin/brokers")
      .set("Authorization", `Bearer ${authToken}`)
      .send(payload);

    expect(res.statusCode).toBe(201);
    expect(res.body.data.name).toBe("New Broker");
    expect(res.body.data.mobile).toBe("9111111111");
    expect(res.body.data).not.toHaveProperty("fcmToken"); // sensitive field excluded
  });

  it("returns 400 on missing required mobile field", async () => {
    const res = await request(app)
      .post("/api/v1/admin/brokers")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ name: "No Mobile" });

    expect(res.statusCode).toBe(400);
  });

  it("returns 409 on duplicate mobile number", async () => {
    await Broker.create({ name: "Existing", mobile: "9222222222" });

    const res = await request(app)
      .post("/api/v1/admin/brokers")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ name: "Duplicate", mobile: "9222222222" });

    expect(res.statusCode).toBe(409);
    expect(res.body.message).toContain("Mobile number already registered");
  });
});

// ─── GET /brokers/stats ───────────────────────────────────────────────────────
describe("GET /api/v1/admin/brokers/stats", () => {
  it("returns correct counts", async () => {
    await Broker.create([
      { name: "Active 1", mobile: "9300000001", isActive: true },
      { name: "Active 2", mobile: "9300000002", isActive: true },
      { name: "Inactive", mobile: "9300000003", isActive: false },
    ]);

    const res = await request(app)
      .get("/api/v1/admin/brokers/stats")
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.total).toBe(3);
    expect(res.body.data.active).toBe(2);
    expect(res.body.data.inactive).toBe(1);
  });
});

// ─── PATCH /brokers/:id/status ────────────────────────────────────────────────
describe("PATCH /api/v1/admin/brokers/:id/status", () => {
  it("toggles broker from active to inactive", async () => {
    const broker = await Broker.create({
      name: "Toggle Me",
      mobile: "9400000001",
      isActive: true,
    });

    const res = await request(app)
      .patch(`/api/v1/admin/brokers/${broker._id}/status`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.isActive).toBe(false);
  });

  it("returns 404 for non-existent broker", async () => {
    const fakeId = "64a000000000000000000000";
    const res = await request(app)
      .patch(`/api/v1/admin/brokers/${fakeId}/status`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.statusCode).toBe(404);
  });
});