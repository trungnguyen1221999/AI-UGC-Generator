# API Reference

Base URL (local): `http://localhost:5000`

Authentication: protected routes require Clerk Bearer token.

---

## Health

### `GET /`

Response: plain text hello message.

---

## User APIs

Base path: `/api/users`

### `GET /credits`

Get current user credits.

### `GET /projects`

Get user projects with filtering, sorting, pagination.

Supported query params:

- `type=image|video`
- `search=<string>`
- `sortBy=<field>`
- `sortOrder=asc|desc`
- `limit=<number>`
- `page=<number>`
- `published=true|false`
- `from=<iso-date>`
- `to=<iso-date>`
- `aspectRatio=<ratio>`

### `GET /projects/:id`

Get a single project by id (owned by authenticated user).

### `PATCH /projects/:id`

Toggle project publish state.

### `PATCH /plan`

Update user plan.

---

## Project APIs

Base path: `/api/projects`

### `POST /`

Create project and generate image.

Request type: `multipart/form-data`

Expected payload (current controller behavior):

- `images`: uploaded files (minimum required in backend constants)
- `name`
- `productName`
- `productDescription`
- `userPrompt`
- `aspectRatio`
- `targetLength`

### `DELETE /:id`

Delete project and related media assets.

### `POST /:id/generate-video`

Generate video for an existing project.

Body:

- `videoAdditionalPrompt` (optional)

---

## Webhook API

### `POST /api/webhooks`

Clerk webhook endpoint.

Handled event groups:

- user lifecycle (create/delete/update paths in controller)
- payment updates for plan/credit synchronization

Important: backend uses raw body for webhook signature verification.
