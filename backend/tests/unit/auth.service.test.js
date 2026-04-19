// backend/tests/unit/auth.service.test.js
/**
 * Unit tests for AdminService.login
 * All external dependencies (repository, subAdminService) are mocked.
 */

import { jest } from "@jest/globals";

// ─── Mock the repository BEFORE importing the service ────────────────────────
const mockFindByEmailWithPassword = jest.fn();
jest.unstable_mockModule(
  "../../src/modules/admin/admin.repository.js",
  () => ({
    default: {
      findByEmailWithPassword: mockFindByEmailWithPassword,
      findByIdWithPassword: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findByEmailWithOTPToken: jest.fn(),
      update: jest.fn(),
    },
  })
);

// Mock subAdminService to avoid DB calls
jest.unstable_mockModule(
  "../../src/modules/sub-admin/sub-admin.service.js",
  () => ({
    default: {
      getPermissionsMap: jest.fn().mockResolvedValue({}),
    },
  })
);

// Import the service AFTER mocks are set up
const { default: AdminService } = await import(
  "../../src/modules/admin/admin.service.js"
);

// ─── Test data factory ────────────────────────────────────────────────────────
function makeMockAdmin(overrides = {}) {
  return {
    _id: "admin_123",
    firstName: "Super",
    lastName: "Admin",
    email: "admin@test.com",
    role: "admin",
    isActive: true,
    comparePassword: jest.fn().mockResolvedValue(true),
    generateToken: jest.fn().mockReturnValue("mock.jwt.token"),
    ...overrides,
  };
}

// ─── Tests ────────────────────────────────────────────────────────────────────
describe("AdminService.login", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns token and admin data on valid credentials", async () => {
    const mockAdmin = makeMockAdmin();
    mockFindByEmailWithPassword.mockResolvedValue(mockAdmin);

    const result = await AdminService.login({
      email: "admin@test.com",
      password: "Admin@123",
    });

    expect(result.token).toBe("mock.jwt.token");
    expect(result.role).toBe("admin");
    expect(result.permissions).toBeNull(); // full admin → no permission map
    expect(result.admin.email).toBe("admin@test.com");
    expect(mockAdmin.comparePassword).toHaveBeenCalledWith("Admin@123");
  });

  it("throws 401 when admin is not found", async () => {
    mockFindByEmailWithPassword.mockResolvedValue(null);

    await expect(
      AdminService.login({ email: "nobody@test.com", password: "any" })
    ).rejects.toMatchObject({ status: 401, message: "Invalid email or password" });
  });

  it("throws 401 when password is wrong", async () => {
    const mockAdmin = makeMockAdmin({
      comparePassword: jest.fn().mockResolvedValue(false),
    });
    mockFindByEmailWithPassword.mockResolvedValue(mockAdmin);

    await expect(
      AdminService.login({ email: "admin@test.com", password: "wrongPassword" })
    ).rejects.toMatchObject({ status: 401, message: "Invalid email or password" });
  });

  it("throws 403 when admin account is deactivated", async () => {
    const mockAdmin = makeMockAdmin({ isActive: false });
    mockFindByEmailWithPassword.mockResolvedValue(mockAdmin);

    await expect(
      AdminService.login({ email: "admin@test.com", password: "Admin@123" })
    ).rejects.toMatchObject({
      status: 403,
      message: expect.stringContaining("deactivated"),
    });
  });

  it("returns permissions map for sub-admin role", async () => {
    const mockAdmin = makeMockAdmin({ role: "sub-admin" });
    mockFindByEmailWithPassword.mockResolvedValue(mockAdmin);

    // subAdminService.getPermissionsMap is already mocked to return {}
    const result = await AdminService.login({
      email: "admin@test.com",
      password: "Admin@123",
    });

    expect(result.role).toBe("sub-admin");
    expect(result.permissions).toEqual({});
  });
});