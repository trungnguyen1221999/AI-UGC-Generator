import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../config/prisma.js", () => ({
  prisma: {
    user: { findUnique: vi.fn(), update: vi.fn() },
    project: {
      create: vi.fn(),
      update: vi.fn(),
      findFirst: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock("@clerk/express", () => ({
  getAuth: vi.fn(() => ({ userId: "user-1" })),
}));

vi.mock("../utils/image.utils.js", () => ({
  uploadFilesToCloudinary: vi.fn(),
  uploadBufferToCloudinary: vi.fn(),
}));

vi.mock("../services/ai.services/aiImageGenerate.service.js", () => ({
  generateProductImage: vi.fn(),
}));

vi.mock("../services/ai.services/aiVideoGenerate.service.js", () => ({
  generateProductVideo: vi.fn(),
}));

vi.mock("cloudinary", () => ({
  v2: { uploader: { destroy: vi.fn() } },
}));

import {
  createProject,
  generateVideo,
  deleteProject,
} from "./projectController.js";
import { prisma } from "../config/prisma.js";
import * as imageUtils from "../utils/image.utils.js";
import * as aiImage from "../services/ai.services/aiImageGenerate.service.js";
import * as aiVideo from "../services/ai.services/aiVideoGenerate.service.js";
import { AppError } from "../utils/AppError.js";
import {
  PROJECT_CREDIT_COST,
  PROJECT_CREDIT_VIDEO_COST,
} from "../constants/ai.constants.js";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const makeReq = (overrides: Record<string, any> = {}) => ({
  body: {
    name: "Test Project",
    productName: "Test Product",
    productDescription: "A test product",
    userPrompt: "",
    aspectRatio: "9:16",
    targetLength: 30,
    ...overrides.body,
  },
  files: [
    {
      buffer: Buffer.from("img1"),
      mimetype: "image/jpeg",
      originalname: "product.jpg",
    },
    {
      buffer: Buffer.from("img2"),
      mimetype: "image/jpeg",
      originalname: "model.jpg",
    },
  ],
  params: overrides.params ?? {},
  ...overrides,
});

const makeRes = () => {
  const res: any = {};
  res.status = vi.fn(() => res);
  res.json = vi.fn(() => res);
  return res;
};

// next là function nhận error — giống Express next(error)
// next is a function that receives an error — like Express next(error)
const makeNext = () => vi.fn();

const makeUser = (
  overrides: Partial<{ credits: number; plan: string }> = {},
) => ({
  id: "user-1",
  credits: 100,
  plan: "free",
  ...overrides,
});

const makeProject = (overrides: Partial<Record<string, any>> = {}) => ({
  id: "proj-1",
  userId: "user-1",
  name: "Test Project",
  productName: "Test Product",
  productDescription: "A test product",
  userPrompt: "",
  aspectRatio: "9:16",
  generatedImage: "https://cloudinary.com/img.jpg",
  generatedVideo: null,
  uploadedImages: ["https://cloudinary.com/p.jpg"],
  isGenerating: false,
  ...overrides,
});

// ─── createProject ────────────────────────────────────────────────────────────

describe("createProject", () => {
  beforeEach(() => vi.clearAllMocks());

  it("calls next with 404 AppError if user not found", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(null);

    const res = makeRes();
    const next = makeNext();
    await createProject(makeReq() as any, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    expect(next.mock.calls[0][0].statusCode).toBe(404);
  });

  it("calls next with 400 AppError if insufficient credits", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(
      makeUser({ credits: PROJECT_CREDIT_COST - 1 }) as any,
    );

    const res = makeRes();
    const next = makeNext();
    await createProject(makeReq() as any, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    expect(next.mock.calls[0][0].statusCode).toBe(400);
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it("calls next with 400 AppError if fewer than 2 images uploaded", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(makeUser() as any);

    const req = makeReq({ files: [{ buffer: Buffer.from("img1") }] });
    const res = makeRes();
    const next = makeNext();
    await createProject(req as any, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    expect(next.mock.calls[0][0].statusCode).toBe(400);
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it("returns 201 and project on success", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(makeUser() as any);
    vi.mocked(prisma.user.update).mockResolvedValue({} as any);
    vi.mocked(imageUtils.uploadFilesToCloudinary).mockResolvedValueOnce([
      "url1",
      "url2",
    ]);
    vi.mocked(prisma.project.create).mockResolvedValueOnce(
      makeProject() as any,
    );
    vi.mocked(aiImage.generateProductImage).mockResolvedValueOnce(
      Buffer.from("img"),
    );
    vi.mocked(imageUtils.uploadBufferToCloudinary).mockResolvedValueOnce(
      "https://cloudinary.com/generated.jpg",
    );
    const finalProject = makeProject({
      generatedImage: "https://cloudinary.com/generated.jpg",
    });
    vi.mocked(prisma.project.update).mockResolvedValueOnce(finalProject as any);

    const res = makeRes();
    const next = makeNext();
    await createProject(makeReq() as any, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ project: finalProject });
  });

  it("rollbacks credits when AI image generation fails", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(makeUser() as any);
    vi.mocked(prisma.user.update).mockResolvedValue({} as any);
    vi.mocked(imageUtils.uploadFilesToCloudinary).mockResolvedValueOnce([]);
    vi.mocked(prisma.project.create).mockResolvedValueOnce(
      makeProject() as any,
    );
    vi.mocked(aiImage.generateProductImage).mockRejectedValueOnce(
      new Error("Gemini failed"),
    );
    vi.mocked(prisma.project.update).mockResolvedValue({} as any);

    const res = makeRes();
    const next = makeNext();
    await createProject(makeReq() as any, res, next);

    // next phải được gọi với error
    expect(next).toHaveBeenCalled();

    // credits phải được rollback
    const updateCalls = vi.mocked(prisma.user.update).mock.calls;
    const rollback = updateCalls.find(
      (call) =>
        (call[0] as any).data?.credits?.increment === PROJECT_CREDIT_COST,
    );
    expect(rollback).toBeDefined();
  });

  it("does not rollback if credit was never deducted", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(
      makeUser({ credits: 0 }) as any,
    );

    const res = makeRes();
    const next = makeNext();
    await createProject(makeReq() as any, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    expect(prisma.user.update).not.toHaveBeenCalled();
  });
});

// ─── generateVideo ────────────────────────────────────────────────────────────

describe("generateVideo", () => {
  beforeEach(() => vi.clearAllMocks());

  it("calls next with 404 if user not found", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(null);

    const next = makeNext();
    await generateVideo(
      makeReq({ params: { id: "proj-1" } }) as any,
      makeRes(),
      next,
    );

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    expect(next.mock.calls[0][0].statusCode).toBe(404);
  });

  it("calls next with 404 if project not found", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(makeUser() as any);
    vi.mocked(prisma.project.findFirst).mockResolvedValueOnce(null);

    const next = makeNext();
    await generateVideo(
      makeReq({ params: { id: "proj-1" } }) as any,
      makeRes(),
      next,
    );

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    expect(next.mock.calls[0][0].statusCode).toBe(404);
  });

  it("calls next with 400 if image not generated yet", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(makeUser() as any);
    vi.mocked(prisma.project.findFirst).mockResolvedValueOnce(
      makeProject({ generatedImage: null }) as any,
    );

    const next = makeNext();
    await generateVideo(
      makeReq({ params: { id: "proj-1" } }) as any,
      makeRes(),
      next,
    );

    expect(next.mock.calls[0][0].message).toBe("Image not generated yet");
  });

  it("calls next with 400 if video already generated", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(makeUser() as any);
    vi.mocked(prisma.project.findFirst).mockResolvedValueOnce(
      makeProject({
        generatedVideo: "https://cloudinary.com/video.mp4",
      }) as any,
    );

    const next = makeNext();
    await generateVideo(
      makeReq({ params: { id: "proj-1" } }) as any,
      makeRes(),
      next,
    );

    expect(next.mock.calls[0][0].message).toBe("Video already generated");
  });

  it("calls next with 400 if insufficient credits for video", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(
      makeUser({ credits: PROJECT_CREDIT_VIDEO_COST - 1 }) as any,
    );
    vi.mocked(prisma.project.findFirst).mockResolvedValueOnce(
      makeProject() as any,
    );

    const next = makeNext();
    await generateVideo(
      makeReq({ params: { id: "proj-1" } }) as any,
      makeRes(),
      next,
    );

    expect(next.mock.calls[0][0].statusCode).toBe(400);
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it("uses high resolution for pro users", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(
      makeUser({ plan: "pro" }) as any,
    );
    vi.mocked(prisma.project.findFirst).mockResolvedValueOnce(
      makeProject() as any,
    );
    vi.mocked(prisma.user.update).mockResolvedValue({} as any);
    vi.mocked(prisma.project.update).mockResolvedValue(makeProject() as any);
    vi.mocked(aiVideo.generateProductVideo).mockResolvedValueOnce(
      "https://cloudinary.com/video.mp4",
    );

    const next = makeNext();
    await generateVideo(
      makeReq({ params: { id: "proj-1" }, body: {} }) as any,
      makeRes(),
      next,
    );

    const videoCall = vi.mocked(aiVideo.generateProductVideo).mock.calls[0];
    expect(videoCall[5]).toBe("1080p");
  });

  it("uses low resolution for free users", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(
      makeUser({ plan: "free" }) as any,
    );
    vi.mocked(prisma.project.findFirst).mockResolvedValueOnce(
      makeProject() as any,
    );
    vi.mocked(prisma.user.update).mockResolvedValue({} as any);
    vi.mocked(prisma.project.update).mockResolvedValue(makeProject() as any);
    vi.mocked(aiVideo.generateProductVideo).mockResolvedValueOnce("url");

    const next = makeNext();
    await generateVideo(
      makeReq({ params: { id: "proj-1" }, body: {} }) as any,
      makeRes(),
      next,
    );

    const videoCall = vi.mocked(aiVideo.generateProductVideo).mock.calls[0];
    expect(videoCall[5]).toBe("720p");
  });

  it("rollbacks credits when video generation fails", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(makeUser() as any);
    vi.mocked(prisma.project.findFirst).mockResolvedValueOnce(
      makeProject() as any,
    );
    vi.mocked(prisma.user.update).mockResolvedValue({} as any);
    vi.mocked(prisma.project.update).mockResolvedValue({} as any);
    vi.mocked(aiVideo.generateProductVideo).mockRejectedValueOnce(
      new Error("Veo failed"),
    );

    const next = makeNext();
    await generateVideo(
      makeReq({ params: { id: "proj-1" }, body: {} }) as any,
      makeRes(),
      next,
    );

    expect(next).toHaveBeenCalled();

    const updateCalls = vi.mocked(prisma.user.update).mock.calls;
    const rollback = updateCalls.find(
      (call) =>
        (call[0] as any).data?.credits?.increment === PROJECT_CREDIT_VIDEO_COST,
    );
    expect(rollback).toBeDefined();
  });
});

// ─── deleteProject ────────────────────────────────────────────────────────────

describe("deleteProject", () => {
  beforeEach(() => vi.clearAllMocks());

  it("calls next with 404 if project not found", async () => {
    vi.mocked(prisma.project.findFirst).mockResolvedValueOnce(null);

    const next = makeNext();
    await deleteProject(
      makeReq({ params: { id: "proj-1" } }) as any,
      makeRes(),
      next,
    );

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    expect(next.mock.calls[0][0].statusCode).toBe(404);
  });

  it("deletes project and returns 200", async () => {
    vi.mocked(prisma.project.findFirst).mockResolvedValueOnce(
      makeProject() as any,
    );
    vi.mocked(prisma.project.delete).mockResolvedValueOnce({} as any);

    const res = makeRes();
    const next = makeNext();
    await deleteProject(
      makeReq({ params: { id: "proj-1" } }) as any,
      res,
      next,
    );

    expect(next).not.toHaveBeenCalled();
    expect(prisma.project.delete).toHaveBeenCalledWith({
      where: { id: "proj-1" },
    });
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
