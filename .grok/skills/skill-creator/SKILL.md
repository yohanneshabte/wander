---
name: skill-creator
description: >
  Write or update a Grok agent skill (SKILL.md + references/). Use when adding
  a new skill, documenting a pipeline, or the user says "create a skill".
metadata:
  short-description: "Author SKILL.md files for Grok agents"
user-invocable: true
---

# Skill creator

A skill is a folder under `.grok/skills/<name>/`:

```
SKILL.md              required — YAML frontmatter + how to do the work
references/*.md       optional — depth, loaded on demand
scripts/              optional — helpers the agent may run
```

## Frontmatter

```yaml
---
name: kebab-case-id
description: >
  What it does. Include trigger words the router will match.
metadata:
  short-description: "one line"
user-invocable: true   # false if only agents should load it
---
```

## Body rules

- Imperative. Tell the agent what to do, not the theory.
- Point to `references/` instead of pasting novels into SKILL.md.
- Name files the agent should open (`src/lib/spa/engine.ts`).
- Never put secrets, tokens, or live desk codes in a skill.

## Checklist

- [ ] Unique `name`
- [ ] Triggers in `description`
- [ ] One happy path
- [ ] What *not* to do (common failure)
- [ ] Links to existing skills if this wraps them (auth, neon, design-ui)
