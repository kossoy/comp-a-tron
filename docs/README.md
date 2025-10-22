# Comp-a-tron Documentation

Welcome to the Comp-a-tron documentation. This guide will help you understand, set up, and contribute to the project.

## Quick Links

### Getting Started
- [Main README](../README.md) - Project overview and quick start guide
- [Docker Setup](../DOCKER.md) - Complete Docker documentation with troubleshooting

### For Developers
- [Migration Guide](../MIGRATION_GUIDE.md) - Understanding the Meteor → Next.js migration
- [Project Rules](./.claude/prompts/project-rules.md) - Coding standards and conventions

### Reference
- [Archive](./archive/) - Historical documentation from the migration process

## Documentation Structure

```
comp-a-tron/
├── README.md                    # 📘 Start here - main project documentation
├── DOCKER.md                    # 🐳 Docker setup and workflows
├── MIGRATION_GUIDE.md           # 🔄 Meteor to Next.js migration reference
│
├── docs/
│   ├── README.md               # 📚 This file - documentation index
│   └── archive/                # 📦 Historical documentation
│
└── .claude/
    └── prompts/
        └── project-rules.md    # 📋 Development guidelines for Claude Code
```

## Documentation Philosophy

Our documentation follows these principles:

1. **README.md** - Quick start and essential information
2. **Specialized guides** - Detailed documentation for specific topics (Docker, Migration)
3. **Self-contained** - Each doc should be readable standalone
4. **Cross-referenced** - Docs link to related information
5. **Up-to-date** - Kept current with the codebase

## Contributing to Documentation

When updating documentation:
- Keep README.md concise and beginner-friendly
- Put detailed info in specialized guides
- Update cross-references when moving content
- Follow the style used in existing docs
- Test all command examples before committing

## Documentation Standards

- Use clear headings and structure
- Include code examples with syntax highlighting
- Provide command line examples that can be copy-pasted
- Explain *why* not just *how*
- Keep it current - update docs when code changes

## Need Help?

- Check [README.md](../README.md) first for quick answers
- See [DOCKER.md](../DOCKER.md) for Docker-related issues
- Review [MIGRATION_GUIDE.md](../MIGRATION_GUIDE.md) to understand the architecture
- Check [project-rules.md](../.claude/prompts/project-rules.md) for development guidelines
