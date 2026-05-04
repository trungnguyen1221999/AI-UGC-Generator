# Database Schema

Source of truth: [backend/prisma/schema.prisma](../backend/prisma/schema.prisma)

---

## Models

## `User`

Primary fields:

- `id` (UUID, PK)
- `email`
- `name`
- `image`
- `plan` (default: `free`)
- `credits` (default: `10`)
- `createdAt`
- `updatedAt`

Relations:

- one-to-many with `Project` (`projects`)

## `Project`

Primary fields:

- `id` (UUID, PK)
- `name`
- `userId` (FK to `User.id`)
- `productName`
- `productDescription`
- `userPrompt`
- `videoAdditionalPrompt`
- `aspectRatio`
- `targetLength`
- `uploadedImages` (array)
- `generatedImage`
- `generatedVideo`
- `isGenerating`
- `isPublished`
- `error`
- `createdAt`
- `updatedAt`

Relations:

- belongs to `User` with `onDelete: Cascade`

---

## Credit-related constants (application layer)

Defined in [backend/src/constants/ai.constants.ts](../backend/src/constants/ai.constants.ts):

- image generation cost
- video generation cost
- resolution by plan

These are not DB constraints, but runtime business rules enforced by controllers.
