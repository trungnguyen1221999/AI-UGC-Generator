# Generation Flow (Client → Image → Video)

This document describes the production flow aligned with the current backend controllers.

## 1) End-to-end flow

1. Client authenticates with Clerk and gets Bearer token.
2. Client sends `POST /api/projects` (multipart/form-data with images + metadata).
3. Backend `createProject` validates:
   - authenticated user,
   - user exists in DB,
   - enough credits,
   - minimum required images.
4. Backend deducts image credits (`PROJECT_CREDIT_COST`).
5. Backend uploads source images to Cloudinary.
6. Backend creates project with `isGenerating=true`.
7. Backend generates image via Gemini.
8. Backend uploads generated image to Cloudinary.
9. Backend updates project:
   - `generatedImage=<url>`
   - `isGenerating=false`
10. Client sends `POST /api/projects/:id/generate-video`.
11. Backend `generateVideo` validates:

- user ownership,
- generated image exists,
- video not generated yet,
- enough credits.

12. Backend deducts video credits (`PROJECT_CREDIT_VIDEO_COST`) and sets `isGenerating=true`.
13. Backend runs chained Veo flow (clip1 → last frame → clip2).
14. Backend merges clips and uploads final video to Cloudinary.
15. Backend updates project:

- `generatedVideo=<url>`
- `isGenerating=false`

---

## 2) Why chained Veo flow is used

Veo output duration is limited (currently around 8s per generation request in your flow).

To create a longer video:

1. Generate clip 1 from the generated product image.
2. Extract the last frame of clip 1.
3. Use that last frame as image input for clip 2.
4. Add continuity prompt: `Continue the motion seamlessly`.
5. Merge clip 1 and clip 2 into one final output.

This improves continuity and gives a longer final video.

---

## 3) Controller-level rollback behavior

The system uses compensation rollback (not one global DB transaction across external providers).

### `createProject`

- Deduct credits first to prevent abuse.
- If a later step fails:
  - reset project state using `resetProjectState(projectId, error)` when project exists,
  - refund deducted credits to user.

### `generateVideo`

- Deduct video credits before AI generation.
- Set `isGenerating=true` before long-running work.
- If generation/merge/upload fails:
  - refund deducted video credits,
  - reset project state (`isGenerating=false`) and persist error.

This prevents:

- lost credits on failure,
- projects stuck in generating state.

---

## 4) Controller safety checks currently applied

- Reject unauthorized requests.
- Reject when user does not own project.
- Reject video generation if image is not generated.
- Reject video generation if video already exists.
- Reject insufficient credits before generation.
