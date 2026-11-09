---
name: system-architect
description: >-
  Designs comprehensive system architectures, database schemas (ER diagrams), API specifications,
  and security/RBAC models. Use this skill when the user asks to design a new system, module,
  database structure, or technical architecture before implementation.
---

# System Architect & Database Design Skill

Follow this structured procedure whenever designing a new system, subsystem, or major feature.

## 1. Architecture & Context Analysis
1. Identify the core domain entities, actors/roles, and system boundaries.
2. Produce a high-level **System Context / Container Diagram** using Mermaid (`flowchart TD` or `flowchart LR`).
3. Explicitly define the chosen architectural pattern (e.g., Modular Monolith, Clean/Hexagonal Architecture, or Microservices) and justify why it fits the scale of the project.

## 2. Database Schema & Data Modeling
1. Design normalized database schemas (3NF by default, with explicit justification for any denormalization or JSONB fields).
2. Generate an **Entity-Relationship Diagram (`erDiagram`)** in Mermaid showing primary keys (`PK`), foreign keys (`FK`), and cardinality.
3. For every core table, include:
   - Standard audit columns (`id`, `created_at`, `updated_at`, `deleted_at` if soft-delete is required).
   - Indexing strategy (composite indexes for frequent filter/sort queries, unique constraints).
   - Data integrity rules (cascading behaviors, check constraints).

## 3. API Contract & Integration Design
1. Define clear API endpoints (RESTful or GraphQL/RPC) with:
   - HTTP Method, Path, and Purpose.
   - Request payload schema (headers, query params, body with validation rules).
   - Response payload schema (including pagination metadata and standard error format).
2. Provide a **Sequence Diagram (`sequenceDiagram`)** for complex multi-step workflows (e.g., authentication, approval flows, payment/transaction processing).

## 4. Security, RBAC & Non-Functional Requirements
1. Define a **Role-Based Access Control (RBAC)** matrix mapping Roles to Resources and Actions (`Create`, `Read`, `Update`, `Delete`, `Approve`, `Export`).
2. Specify security controls:
   - Input validation & sanitization at the boundary.
   - Authentication & session/token lifecycle.
   - Audit logging for sensitive state changes.
3. Verify the design against scalability bottlenecks (N+1 queries, missing pagination, unbounded payloads) before concluding.
