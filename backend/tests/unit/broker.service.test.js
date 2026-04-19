// backend/tests/unit/broker.service.test.js
/**
 * Unit tests for BrokerService
 * Repository is fully mocked — zero DB interaction.
 */

import { jest } from "@jest/globals";

// ─── Mock repository ──────────────────────────────────────────────────────────
const mockRepo = {
  create: jest.fn(),
  findByMobile: jest.fn(),
  findByEmail: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
  updateById: jest.fn(),
  deleteById: jest.fn(),
  getStats: jest.fn(),
};

jest.unstable_mockModule(
  "../../src/modules/broker/broker.repository.js",
  () => ({ default: mockRepo })
);

const { default: brokerService } = await import(
  "../../src/modules/broker/broker.service.js"
);

// ─── Factory ──────────────────────────────────────────────────────────────────
function makeBroker(overrides = {}) {
  return {
    _id: "broker_abc",
    name: "Rajesh Kumar",
    mobile: "9876543210",
    email: "rajesh@test.com",
    city: "Nagpur",
    area: "Dighori",
    isActive: true,
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

// ─── createBroker ─────────────────────────────────────────────────────────────
describe("BrokerService.createBroker", () => {
  beforeEach(() => jest.clearAllMocks());

  it("creates and returns a broker on valid payload", async () => {
    const payload = { name: "Rajesh Kumar", mobile: "9876543210" };
    const created = makeBroker();

    mockRepo.findByMobile.mockResolvedValue(null);
    mockRepo.findByEmail.mockResolvedValue(null);
    mockRepo.create.mockResolvedValue(created);

    const result = await brokerService.createBroker(payload);

    expect(mockRepo.create).toHaveBeenCalledWith(payload);
    expect(result.name).toBe("Rajesh Kumar");
  });

  it("throws 409 when mobile is already registered", async () => {
    mockRepo.findByMobile.mockResolvedValue(makeBroker());

    await expect(
      brokerService.createBroker({ name: "Test", mobile: "9876543210" })
    ).rejects.toMatchObject({
      status: 409,
      message: "Mobile number already registered",
    });

    expect(mockRepo.create).not.toHaveBeenCalled();
  });

  it("throws 409 when email is already registered", async () => {
    mockRepo.findByMobile.mockResolvedValue(null);
    mockRepo.findByEmail.mockResolvedValue(makeBroker());

    await expect(
      brokerService.createBroker({ name: "Test", mobile: "9999999999", email: "rajesh@test.com" })
    ).rejects.toMatchObject({ status: 409, message: "Email already registered" });
  });
});

// ─── getBroker ────────────────────────────────────────────────────────────────
describe("BrokerService.getBroker", () => {
  beforeEach(() => jest.clearAllMocks());

  it("returns broker when found", async () => {
    mockRepo.findById.mockResolvedValue(makeBroker());
    const result = await brokerService.getBroker("broker_abc");
    expect(result.name).toBe("Rajesh Kumar");
  });

  it("throws 404 when broker not found", async () => {
    mockRepo.findById.mockResolvedValue(null);
    await expect(brokerService.getBroker("nonexistent")).rejects.toMatchObject({
      status: 404,
      message: "Broker not found",
    });
  });
});

// ─── toggleStatus ────────────────────────────────────────────────────────────
describe("BrokerService.toggleStatus", () => {
  beforeEach(() => jest.clearAllMocks());

  it("deactivates an active broker", async () => {
    const broker = makeBroker({ isActive: true });
    const updated = { ...broker, isActive: false };

    mockRepo.findById.mockResolvedValue(broker);
    mockRepo.updateById.mockResolvedValue(updated);

    const result = await brokerService.toggleStatus("broker_abc");
    expect(result.isActive).toBe(false);
    expect(mockRepo.updateById).toHaveBeenCalledWith("broker_abc", { isActive: false });
  });

  it("activates an inactive broker", async () => {
    const broker = makeBroker({ isActive: false });
    const updated = { ...broker, isActive: true };

    mockRepo.findById.mockResolvedValue(broker);
    mockRepo.updateById.mockResolvedValue(updated);

    const result = await brokerService.toggleStatus("broker_abc");
    expect(result.isActive).toBe(true);
  });
});

// ─── getStats ────────────────────────────────────────────────────────────────
describe("BrokerService.getStats", () => {
  it("returns stats from repository", async () => {
    mockRepo.getStats.mockResolvedValue({ total: 10, active: 8, inactive: 2 });
    const stats = await brokerService.getStats();
    expect(stats).toEqual({ total: 10, active: 8, inactive: 2 });
  });
});