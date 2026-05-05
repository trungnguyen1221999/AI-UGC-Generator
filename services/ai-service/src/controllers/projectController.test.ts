import { describe, it, expect, vi, beforeEach } from "vitest";
import { createProject, deleteProject } from "./projectController.js";
import { prisma } from "../config/prisma.js";
import { getAuth } from "@clerk/express";
import { v2 as cloudinary } from "cloudinary"; // Import to verify mock calls
import {
  uploadFilesToCloudinary,
  uploadBufferToCloudinary,
} from "../utils/image.utils.js";
import { generateProductImage } from "../services/ai.services/aiImageGenerate.service.js";
import { AppError } from "../utils/AppError.js";

// --- MOCKS ---

// Fix 1: Ensure Prisma always returns Promises so `.catch()` chains do not break
vi.mock("../config/prisma.js", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(() => Promise.resolve({})), // Important
    },
    project: {
      create: vi.fn(),
      update: vi.fn(() => Promise.resolve({})), // Important
      findFirst: vi.fn(),
      delete: vi.fn(() => Promise.resolve({})),
    },
  },
}));

// Fix 2: Mock the Cloudinary module directly to avoid real API key checks
vi.mock("cloudinary", () => ({
  v2: {
    uploader: {
      destroy: vi.fn(() => Promise.resolve({ result: "ok" })),
    },
  },
}));

vi.mock("@clerk/express", () => ({
  getAuth: vi.fn(),
}));

vi.mock("../utils/image.utils.js", () => ({
  uploadFilesToCloudinary: vi.fn(),
  uploadBufferToCloudinary: vi.fn(),
}));

vi.mock("../services/ai.services/aiImageGenerate.service.js", () => ({
  generateProductImage: vi.fn(),
}));

// --- TEST SUITE ---

describe("Project Controller", () => {
  const mockUserId = "user_123";

  const mockReq = (body = {}, files = [], params = {}) =>
    ({
      body,
      files,
      params,
    }) as any;

  const mockRes = () => {
    const res: any = {};
    res.status = vi.fn().mockReturnValue(res);
    res.json = vi.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getAuth).mockReturnValue({ userId: mockUserId } as any);
  });

  describe("createProject", () => {
    it("should refund credits and reset state if AI generation fails", async () => {
      const req = mockReq({ productName: "Fail Test" }, [{}, {}]);
      const res = mockRes();

      // Simulate flow: user found -> credits deducted -> project created
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: mockUserId,
        credits: 100,
      } as any);
      vi.mocked(prisma.project.create).mockResolvedValue({
        id: "proj_fail",
      } as any);

      // Simulate an error at the AI generation step
      vi.mocked(generateProductImage).mockRejectedValue(
        new Error("AI Engine Down"),
      );

      // Verify the controller throws the "AI Engine Down" error
      await expect(createProject(req, res)).rejects.toThrow("AI Engine Down");

      // VERIFY REFUND LOGIC
      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: mockUserId },
          data: { credits: { increment: expect.any(Number) } },
        }),
      );

      // VERIFY PROJECT STATE RESET LOGIC
      expect(prisma.project.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "proj_fail" },
          data: expect.objectContaining({
            isGenerating: false,
            error: "AI Engine Down",
          }),
        }),
      );
    });
  });

  describe("deleteProject", () => {
    it("should delete project and return 200", async () => {
      const req = mockReq({}, [], { id: "proj_1" });
      const res = mockRes();

      vi.mocked(prisma.project.findFirst).mockResolvedValue({
        id: "proj_1",
        uploadedImages: [
          "http://res.cloudinary.com/demo/image/upload/sample.jpg",
        ],
      } as any);

      await deleteProject(req, res);

      // Cloudinary mock `destroy` must be called
      expect(vi.mocked(cloudinary.uploader.destroy)).toHaveBeenCalled();
      expect(prisma.project.delete).toHaveBeenCalledWith({
        where: { id: "proj_1" },
      });
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});
