# Cog

**Agentic software development platform. Spec in. Software out.**

Cog takes a structured Low-Level Design as input, distributes implementation work across a fleet of specialized AI agents running in parallel, and delivers a fully integrated, traceable codebase as output.

You define what needs to be built. Cog executes it.

---

## What Cog Is

Most AI coding tools make developers faster. Cog removes developers from execution entirely.

You fill a structured spec form — modules, data models, API contracts, constraints. Cog reads it, decomposes the work, assigns specialized agents to each module, and runs them in parallel. Every decision is logged. Every step is backed up. Progress is readable at any level of detail, from a one-line summary for a client to raw execution logs for a developer.

When all modules are done, an integration agent validates the interfaces, wires everything together, and runs end-to-end tests against the spec. You get a working, integrated codebase you can export directly to GitHub.

---

## How It Works

### 1. Fill the LLD Form

The spec form is the foundation of everything. It covers:

- Project overview and goals
- Module list with responsibilities and dependencies
- Data models and relationships
- API contracts — endpoints, request and response shapes, auth requirements
- Per-agent configuration — constraints, rules, and context specific to each module

Before the build starts, a pre-flight validation screen checks for missing fields, undefined interface contracts, and dependency conflicts. Nothing executes until all blocking errors are resolved.

The approved spec becomes the shared context for every agent. It is the contract.

### 2. Work Distribution

Cog reads the spec and automatically decomposes it into atomic tasks per module, resolves the dependency order across modules, and assigns each module to a specialized agent loaded with its specific scope and constraints.

Agents are grouped into execution waves based on dependencies. Modules with no dependencies run in wave one simultaneously. Modules that depend on wave one outputs wait for interface validation before starting.

### 3. Parallel Implementation

All agents in a wave run simultaneously in isolated cloud containers. Each agent:

- Works strictly within its assigned module scope
- Honors the interface contracts defined in the spec
- Logs every action, file change, and technical decision in real time
- Commits its state to git after every completed task
- Surfaces a plain-English blocker notification if it encounters genuine ambiguity

When an agent hits a blocker, it pauses and notifies you with a specific question. You answer inline. The agent resumes. The resolution is logged against the spec.

### 4. Tiered Standup Views

Progress is visible through four levels of detail:

| Tier | Audience | Content |
|------|----------|---------|
| Summary | Client, stakeholder | One line per module. Plain English. No jargon. |
| Tasks | CTO, technical founder | Task-level status per agent. Estimated completion. |
| Decisions | Developer | Everything in Tasks plus logged decisions with reasoning. |
| Logs | Debugging, auditing | Raw output. Every action, file, error, and timestamp. |

Toggle between tiers with a single click. The same underlying data at different resolution.

### 5. Integration

After all agents complete, a dedicated integration agent runs:

- Validates all module interfaces against the spec's defined contracts
- Flags mismatches with specific attribution — which agent, which decision, which file
- Wires modules together
- Runs end-to-end tests against expected behavior
- Produces a plain-English integration report

Integration failures point back to the exact agent, task, and decision responsible. Every step is recoverable.

### 6. Export

Export the completed codebase directly to GitHub, GitLab, or download as a zip. You own the output.

---

## Architecture

Cog is composed of five independently deployable modules:

```
Frontend          Next.js 14           Spec form, project dashboard, standup views
Backend API       Node.js + Express    Auth, project management, orchestration trigger
Orchestrator      Python asyncio       Reads spec, decomposes tasks, manages agent waves
Agent Runner      Python + Claude API  Executes tasks in isolated Docker containers
Integration Agent Python + Claude API  Validates interfaces, wires modules, runs tests
```

Real-time standup streaming runs over WebSocket. Agent containers run on AWS ECS Fargate — one task per agent, ephemeral, auto-teardown on completion.

---

## Data Flow

```
User submits spec
       |
       v
Backend validates and stores spec in PostgreSQL
       |
       v
Orchestrator decomposes spec into tasks, builds dependency graph
       |
       v
Wave 1: independent agents spin up in parallel (Docker on ECS)
       |
       v
Interface validation between waves
       |
       v
Wave 2+: dependent agents spin up in parallel
       |
       v
All agents complete
       |
       v
Integration agent validates, wires, tests
       |
       v
User reviews and exports
```

---

## Traceability

Every action taken by every agent is logged and backed up.

- Git commit after every completed task — rollback to any task boundary
- Full audit trail in PostgreSQL — agent, task, decision, timestamp, file
- Decision log — when an agent makes a choice not explicitly specified in the spec, the choice and its reasoning are recorded and attributed
- S3 backup of all agent outputs on task completion and container teardown

If something goes wrong during integration, the system tells you exactly which agent made which decision that caused the failure.

---

## Access Roles

Projects support multiple users at different access levels:

| Role | Spec | Standup | Code |
|------|------|---------|------|
| Owner | Full access | All tiers | Read and edit |
| Developer | Read only | Tiers 2-4 | Read and edit |
| Observer | None | Tier 2 | None |
| Client | None | Tier 1 only | None |

An agency can give their client a login to watch the project being built in real time — in plain English, with no code visible.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 (App Router) |
| Backend API | Node.js + Express |
| Orchestrator | Python asyncio |
| Agent Runtime | Python + Anthropic Claude API |
| Database | PostgreSQL (AWS RDS) |
| Containers | Docker on AWS ECS Fargate |
| Storage | AWS S3 |
| Real-time | Socket.io |
| Auth | Clerk |
| Payments | Stripe |
| Frontend Deploy | Vercel |
| Secrets | AWS Secrets Manager |

---

## Project Structure

```
cog/
  frontend/          Next.js app
  backend/           Node.js API server
  orchestrator/      Python orchestration service
  agent-runner/      Python agent execution runtime
  infra/             Docker and AWS configuration
```

---

## Who This Is For

**Solo technical founders and early-stage CTOs** who have a clear system design but limited engineering capacity and need to ship faster without hiring a full team.

**Software development agencies** taking on multiple client projects simultaneously, bottlenecked by engineering capacity. Cog lets teams take on more projects with the same headcount.

Cog is not for vibe coding simple apps. It is designed for complex, multi-module systems where parallelism, spec enforcement, and full traceability matter.

---

## What Cog Is Not

Cog is not a replacement for software architecture expertise. The quality of the output is directly proportional to the quality of the spec. Vague input produces vague output.

Cog is not fully autonomous. Human judgment is required at spec creation, blocker resolution, output review, and integration approval. The platform handles execution. Humans handle intent.

Cog is not suitable for projects with no upfront design. It is designed for builders who know exactly what they want to build and need it executed reliably, quickly, and transparently.

---

## Status

Under active development. Early access coming soon.

---

*Cog — Build what you design.*
