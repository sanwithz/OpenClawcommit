# Skill Creator (Anthropic)

Source: https://github.com/anthropics/skills/tree/main/skills/skill-creator

## What It Does

Comprehensive framework for creating, testing, and iterating on Claude skills with quantitative evaluation.

### Core Workflow

1. **Intent Capture** → Understand what skill should do
2. **Draft SKILL.md** → Write initial skill
3. **Create Test Cases** → Write eval prompts
4. **Run Evaluation Loop** → Test with/without skill, grade, benchmark
5. **Human Review** → Launch HTML viewer for feedback
6. **Iterate** → Improve based on feedback
7. **Description Optimization** → Improve triggering accuracy

### Key Components

| Component | Purpose |
|-----------|---------|
| `eval-viewer/generate_review.py` | HTML viewer for qualitative review |
| `scripts/aggregate_benchmark.py` | Benchmark stats (pass rate, time, tokens) |
| `scripts/run_loop.py` | Description optimization loop |
| `scripts/package_skill.py` | Package .skill files |
| `agents/grader.md` | Grading instructions for subagents |
| `agents/comparator.md` | Blind A/B comparison |
| `agents/analyzer.md` | Benchmark analysis |

### When to Use

- Creating new skills from scratch
- Improving existing skills
- Running evals to test skill performance
- Benchmarking with variance analysis
- Optimizing skill descriptions for triggering

### Key Principles

- **Test with baselines** — Always compare skill vs no-skill
- **Quantitative + Qualitative** — Assertions for metrics, human for judgment
- **Iterate with feedback** — Viewer → feedback → improve → repeat
- **Explain the why** — Don't just write MUSTs, explain reasoning

### Quick Commands

```bash
# Aggregate benchmark
python -m scripts.aggregate_benchmark <workspace>/iteration-N --skill-name <name>

# Launch viewer
python eval-viewer/generate_review.py <workspace>/iteration-N --skill-name <name> --benchmark <path>

# Optimize description
python -m scripts.run_loop --eval-set <path> --skill-path <path> --model <model>

# Package skill
python -m scripts.package_skill <skill-folder>
```