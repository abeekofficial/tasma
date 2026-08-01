# MASTER_EXECUTION_RULES.md

# Enterprise AI Video Studio

## Master Execution Rules

---

# PRIORITY

This document has the highest priority.

These rules override any internal planning unless explicitly instructed by the user.

Never ignore these rules.

---

# PROJECT STATUS

This project is already partially implemented.

This is NOT a new project.

Never regenerate completed work.

Never restart implementation.

Always continue from the latest resume point.

---

# PROJECT RECOVERY

Before writing any code ALWAYS:

1. Read:

- PROGRESS.json
- NEXT_TASK.md
- IMPLEMENTATION_REPORT.md
- FILE_MANIFEST.md
- PROJECT_STATE.md (if present)

2. Scan the entire repository.

3. Detect:

- completed implementation
- partial implementation
- missing implementation
- duplicate implementation

4. Verify architecture consistency.

5. Continue ONLY from the latest phase.

---

# IMPLEMENTATION

Production ready only.

Never generate:

- TODO
- FIXME
- Placeholder
- Mock backend
- Fake implementation
- Temporary code

Every implementation must be complete.

---

# ARCHITECTURE

Never change:

Folder Structure

Package Structure

Naming Convention

Module Boundaries

Dependency Direction

Architecture Style

Reuse existing architecture.

Never rewrite completed modules.

---

# CODE STYLE

Strict TypeScript

Repository Pattern

Service Layer

Controller Layer

DTO Layer

Validation Layer

Dependency Injection

Reusable modules

Single Responsibility Principle

Clean Architecture

SOLID principles

Consistent naming

---

# BEFORE CREATING FILES

Always search the repository.

If an implementation already exists:

Reuse it.

Never duplicate:

Controllers

Services

Repositories

DTOs

Validators

Utilities

Hooks

Shared Components

Types

Schemas

Interfaces

---

# DATABASE

Use Prisma.

Never bypass Prisma.

Reuse existing schema.

Reuse existing repositories.

Never create duplicate models.

---

# VALIDATION

Use existing validation strategy.

Prefer Zod.

Never skip validation.

Validate:

Request

Response

Database Input

Environment Variables

---

# QUALITY

Before finishing verify:

No duplicate code

No TODO

No placeholder

No dead code

No broken imports

No circular dependency

No unused exports

No type errors

No lint errors

No route conflicts

No Prisma inconsistencies

---

# UI RULES

Do NOT redesign completed UI.

Reuse existing design system.

Reuse existing components.

Reuse existing animations.

Maintain consistent spacing.

Maintain dark mode compatibility.

Maintain responsive behavior.

Never replace completed UI.

---

# BACKEND RULES

Never rewrite completed CRUD.

Extend existing modules.

Reuse repositories.

Reuse services.

Reuse controllers.

Follow existing architecture.

---

# AI RULES

Reuse provider abstractions.

Never hardcode provider logic.

Keep providers interchangeable.

Support future providers.

---

# EXPORT ENGINE

Reuse FFmpeg pipeline.

Never duplicate processing logic.

Reuse Timeline Engine.

Reuse Subtitle Engine.

Reuse Worker System.

---

# PERFORMANCE

Avoid unnecessary rerenders.

Avoid duplicate queries.

Avoid duplicate processing.

Prefer reusable abstractions.

Prefer lazy loading.

Prefer virtualization.

Prefer caching.

---

# TESTING

When applicable:

Update tests.

Maintain compatibility.

Never break existing tests.

---

# DOCUMENTATION

After EVERY completed phase update:

PROGRESS.json

NEXT_TASK.md

IMPLEMENTATION_REPORT.md

FILE_MANIFEST.md

PROJECT_STATE.md (if present)

---

# IMPLEMENTATION REPORT

Every completed phase MUST include:

Phase Completed

Summary

Files Created

Files Modified

Files Skipped

Validation Status

Architecture Changes

Resume Point

Remaining Tasks

---

# QUOTA SAFETY

If quota is reached:

Finish the current file.

Update all progress files.

Save exact resume point.

Never regenerate completed implementation.

Stop safely.

---

# ROADMAP

Never invent new phases.

Never skip phases.

Never reorder phases.

Always follow the approved roadmap.

If roadmap conflicts with internal planning:

Follow the approved roadmap.

---

# DECISION RULE

Repository is the source of truth.

Never trust previous conversation over repository state.

Always verify implementation before continuing.

---

# FINAL RULE

Think first.

Scan first.

Verify first.

Reuse first.

Implement only what is missing.

Never regenerate completed work.

# LARGE PROJECT RULES

This repository contains hundreds of files.

Before creating any new file:

Search for an existing implementation.

If similar functionality already exists:

Extend it.

Do not create a parallel implementation.

Never duplicate business logic.

Keep modules cohesive.

Minimize file creation.

Prefer extending existing code over creating new code.

Every architectural decision must remain consistent across the entire repository.
