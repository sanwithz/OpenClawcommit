# DECISIONS.md

> Key Decisions Log - SSOT
> Important architectural and policy decisions

## Format

```markdown
### DXXX: [Decision Title] - YYYY-MM-DD
**Decision**: What was decided?
**Rationale**: Why this choice?
**Alternatives considered**: What else was considered?
**Consequences**: What does this affect?
**Reversible?**: Yes/No, under what conditions?
```

## Decisions

### D001: Adoption of WORKSPACE_GOVERNANCE patterns - 2026-02-26
**Decision**: Adapt lightweight governance patterns from Adamchanadam's WORKSPACE_GOVERNANCE
**Rationale**: Need structure for file changes without heavy overhead
**Alternatives considered**: Full plugin install vs lightweight adaptation
**Consequences**: Created `_control/`, `_runs/`, `archive/` structure; updated AGENTS.md
**Reversible?**: Yes, can remove governance structure if it doesn't fit workflow

### D002: Model Policy - Anthropic API only - 2026-02-26
**Decision**: Use only Anthropic API tokens (`sk-ant-...`); never `google-antigravity/*`
**Rationale**: Separate concerns, clear boundaries
**Alternatives considered**: Mixed provider usage
**Consequences**: All API calls route through Anthropic
**Reversible?**: Yes, policy can be updated

### D003: Financial Safety Hard Rule - 2026-02-26
**Decision**: Never initiate/confirm/enable payments without explicit written approval
**Rationale**: Prevent accidental spending or subscriptions
**Alternatives considered**: Confirmation prompts, delayed execution
**Consequences**: User must explicitly say "Proceed. Confirmed. Done." for financial actions
**Reversible?**: No - this is a permanent safety boundary

