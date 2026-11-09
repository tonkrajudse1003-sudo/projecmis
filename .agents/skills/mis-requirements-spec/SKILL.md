---
name: mis-requirements-spec
description: >-
  Translates business ideas or Management Information System (MIS) requests into structured
  Product Requirements Documents (PRD), role-permission matrices, workflow states, and reporting specs.
  Use this skill when the user wants to gather requirements, scope features, or define workflows for an MIS or enterprise app.
---

# MIS Requirements & Specification Skill

Use this workflow to transform high-level business requests into actionable technical specifications for Management Information Systems (MIS).

## 1. Stakeholder & Role Mapping
1. List all user personas/roles (e.g., Super Admin, Department Manager, Staff/Operator, Auditor, External User).
2. Create a **Permission & Visibility Matrix** defining what data each role can view (own records, department records, all records) and mutate.

## 2. Workflow & State Machine Definition
1. For any document, request, or transaction in the MIS, define its lifecycle states (e.g., `DRAFT` -> `SUBMITTED` -> `APPROVED` / `REJECTED` -> `ARCHIVED`).
2. Render a **State Diagram (`stateDiagram-v2`)** showing valid transitions, trigger actions, and which role is authorized to trigger each transition.

## 3. Core MIS Feature Checklist
Ensure the specification addresses standard enterprise/MIS operational needs:
- **CRUD & Search**: Advanced filtering, sorting, pagination, and bulk actions.
- **Import / Export**: CSV/Excel/PDF export templates and batch import validation rules.
- **Audit Trail**: Who changed what, when, and previous vs. new values (`old_value`, `new_value`).
- **Dashboard & KPIs**: Key summary metrics, aggregation periods (daily/monthly/yearly), and drill-down paths.

## 4. Acceptance Criteria (Given / When / Then)
Write testable Acceptance Criteria for each feature module, covering both the happy path and edge/error cases (e.g., unauthorized access, concurrent edits, invalid state transitions).
