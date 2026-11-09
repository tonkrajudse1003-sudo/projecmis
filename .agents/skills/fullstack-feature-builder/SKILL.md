---
name: fullstack-feature-builder
description: >-
  End-to-end implementation and verification workflow for full-stack features (Database -> Backend API -> Frontend UI -> Tests).
  Use this skill when implementing, refactoring, or scaffolding a new feature slice across the stack.
---

# Full-Stack Feature Builder & Verification Skill

Execute full-stack features in vertical slices using this step-by-step runbook so every layer is validated before moving to the next.

## Step 1: Data Layer & Migrations
1. Define or update the database schema/models and migration scripts.
2. Verify foreign keys, indexes, and default values.
3. Create seed or fixture data for local testing.

## Step 2: Domain Service & API Layer
1. Implement DTOs / validation schemas at the API boundary (never trust raw client input).
2. Implement business logic in isolated service/use-case modules (keep controllers/route handlers thin).
3. Enforce authentication and role-based authorization checks before data mutation.
4. Return standardized response envelopes and meaningful HTTP status codes.

## Step 3: Frontend UI & State Management
1. Build reusable, accessible UI components with clear loading, empty, and error states.
2. Connect forms with client-side validation that mirrors backend validation rules.
3. Ensure responsive layout across desktop and mobile viewports.

## Step 4: End-to-End Verification Checklist
Before marking any feature complete:
1. Run the project's typechecker / linter and fix all errors.
2. Run unit/integration tests covering happy paths, validation failures, and permission denials.
3. Verify the running application or API endpoints to confirm zero runtime regressions.
