# SQL CONSTITUTION

> กฎการเขียน SQL ทั้งระบบ — บังคับใช้ทุก Phase

---

## Objective

ARCHRON ไม่ใช่บล็อก

ARCHRON คือ living knowledge library

สถาปัตยกรรม SQL ต้องรองรับ

- Long-term scalability
- Knowledge relationships
- Editorial workflows
- AI integration
- Future expansion

**Never optimize only for CRUD. Optimize for knowledge.**

---

## Your Role

ออกแบบในฐานะ

- Principal Database Architect
- PostgreSQL Expert
- Supabase Architect
- Information Architect
- Knowledge Graph Architect
- AI Systems Architect
- Editorial Platform Architect

**Design for production. Never design for demonstration.**

---

## General Rules

- Normalize where appropriate
- Denormalize only when justified
- ทุก table ต้องมี **UUID Primary Key**, `created_at`, `updated_at`
- ห้ามใช้ integer IDs — ใช้ UUID เท่านั้น
- Prefer PostgreSQL native features
- Prefer Supabase compatibility

---

## SQL Standards

ใช้ feature เหล่านี้เมื่อเหมาะสม

| Feature | เหตุผล |
|---|---|
| `UUID` | Global unique, ไม่ต้อง auto-increment |
| `ENUM` | Type-safe values, ประหยัดพื้นที่ |
| `JSONB` | Flexible metadata, ค้นหาได้ |
| `ARRAY` | PostgreSQL-native lists |
| `GIN Index` | Index สำหรับ JSONB/ARRAY/FTS |
| `Full Text Search` | ค้นหาเนื้อหาภาษาไทย+อังกฤษ |
| `Generated Columns` | Computed values, ไม่ต้อง application logic |
| `Views` | Abstract complex queries |
| `Functions` | Business logic ใน DB |
| `Triggers` | Auto-update timestamps, validation |
| `Policies (RLS)` | Row-level security per role |
| `Constraints` | Data integrity at DB level |
| `Composite Indexes` | Optimize multi-column queries |
| `Check Constraints` | Validate data ranges |
| `Foreign Keys` | Referential integrity |
| `ON DELETE rules` | Cascade behavior |

---

## Every Phase Must Include

ทุก Phase ต้องมี

1. Database schema
2. Relationships
3. Indexes
4. Constraints
5. Triggers
6. Functions
7. Views
8. RLS Policies
9. Performance considerations
10. Migration-safe SQL
11. Documentation comments
12. Example queries

---

## Migration Rules

- ทุก SQL file ต้องเป็น **idempotent** เมื่อเป็นไปได้
- หลีกเลี่ยง destructive operations
- Support future migrations
- ห้าม break existing data

---

## Code Quality

SQL ต้อง

- Readable
- Modular
- Documented
- Production-ready
- Consistent
- Future-proof

ห้ามใช้ shortcuts
ห้าม placeholder implementations

---

## Phase Overview

| Phase | ชื่อ | ขอบเขต |
|---|---|---|
| 01 | Knowledge Core | Entries, Articles, Concepts, Thinkers, Schools, Books, Tags, Relations |
| 02 | Editorial Studio | Drafts, Versions, Workflow, AI Jobs, Embeddings, Media |
| 03 | Identity & Community | Profiles, Roles, Permissions, Bookmarks, History, Achievements |
| 04 | Knowledge Intelligence | Search, Graph, Embeddings, Recommendations, Analytics |
| 05 | Infrastructure | Storage, Cache, Jobs, Logs, Audit, Feature Flags |

---

## Final Goal

เมื่อครบทั้ง 5 Phase ผลลัพธ์คือ

> Production-ready, enterprise-grade PostgreSQL architecture
> ที่สามารถขับเคลื่อน ARCHRON ได้ยาวนานโดยไม่ต้อง redesign สถาปัตยกรรม
