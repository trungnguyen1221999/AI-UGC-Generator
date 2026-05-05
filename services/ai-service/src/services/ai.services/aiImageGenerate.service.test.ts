import { describe, it, expect, vi, beforeEach } from "vitest";
import { generateProductImage } from "./aiImageGenerate.service.js";
import ai from "../../config/ai.js";
import { getProductUsageInstruction } from "../../utils/productAiUsageInstruction.utils.js";
import { toInlineImage } from "../../utils/image.utils.js";

// --- MOCKING EXTERNAL DEPENDENCIES ---

vi.mock("../../config/ai.js", () => ({
  default: {
    models: {
      generateContent: vi.fn(),
    },
  },
}));

vi.mock("../../utils/productAiUsageInstruction.utils.js", () => ({
  getProductUsageInstruction: vi.fn(() => "Mocked Product Usage Instruction"),
}));

vi.mock("../../utils/image.utils.js", () => ({
  toInlineImage: vi.fn(() => ({
    inlineData: { data: "base64_pixel_data", mimeType: "image/jpeg" },
  })),
}));

describe("aiImageGenerate Service", () => {
  const mockProductFile = {
    buffer: Buffer.from("product"),
    mimetype: "image/jpeg",
  } as any;
  const mockModelFile = {
    buffer: Buffer.from("model"),
    mimetype: "image/jpeg",
  } as any;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * SUCCESS CASE
   * Fixed the structure of toHaveBeenCalledWith to match Gemini SDK requirements.
   */
  it("should generate a product image buffer successfully", async () => {
    const mockAiResponse = {
      candidates: [
        {
          content: {
            parts: [
              {
                inlineData: {
                  data: "ZmFrZS1pbWFnZS1kYXRh",
                  mimeType: "image/png",
                },
              },
            ],
          },
        },
      ],
    };

    vi.mocked(ai.models.generateContent).mockResolvedValue(
      mockAiResponse as any,
    );

    const result = await generateProductImage(
      mockProductFile,
      mockModelFile,
      "Sneakers",
      "Running sneakers",
      "In a futuristic city",
      "16:9",
    );

    // FIX: The SDK receives ONE object containing model, contents, and config.
    // Also, we search for instructions in the text part instead of the product name directly.
    expect(ai.models.generateContent).toHaveBeenCalledWith(
      expect.objectContaining({
        model: expect.any(String),
        contents: expect.arrayContaining([
          // The third element in contents array is the text prompt
          expect.objectContaining({
            text: expect.stringContaining("Mocked Product Usage Instruction"),
          }),
        ]),
        config: expect.objectContaining({
          imageConfig: expect.objectContaining({ aspectRatio: "16:9" }),
        }),
      }),
    );

    expect(Buffer.isBuffer(result)).toBe(true);
    expect(result.toString()).toBe("fake-image-data");
  });

  it("should throw error if AI response structure is invalid", async () => {
    vi.mocked(ai.models.generateContent).mockResolvedValue({
      candidates: [],
    } as any);

    await expect(
      generateProductImage(
        mockProductFile,
        mockModelFile,
        "Name",
        "Desc",
        "",
        "9:16",
      ),
    ).rejects.toThrow("AI returned an invalid response structure");
  });

  it("should throw error if AI returns no image in the response parts", async () => {
    const mockTextOnlyResponse = {
      candidates: [
        { content: { parts: [{ text: "Safety filter triggered." }] } },
      ],
    };
    vi.mocked(ai.models.generateContent).mockResolvedValue(
      mockTextOnlyResponse as any,
    );

    await expect(
      generateProductImage(
        mockProductFile,
        mockModelFile,
        "Name",
        "Desc",
        "",
        "9:16",
      ),
    ).rejects.toThrow("AI did not return an image in the response");
  });

  it("should include userPrompt in the final text payload if provided", async () => {
    vi.mocked(ai.models.generateContent).mockResolvedValue({
      candidates: [{ content: { parts: [{ inlineData: { data: "YQ==" } }] } }],
    } as any);

    const customUserPrompt = "Add blue neon lights";
    await generateProductImage(
      mockProductFile,
      mockModelFile,
      "Product",
      "Description",
      customUserPrompt,
      "1:1",
    );

    expect(ai.models.generateContent).toHaveBeenCalledWith(
      expect.objectContaining({
        contents: expect.arrayContaining([
          expect.objectContaining({
            text: expect.stringContaining(customUserPrompt),
          }),
        ]),
      }),
    );
  });
});
