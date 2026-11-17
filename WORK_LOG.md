
2026-11-17: Review follow-up: require string labels and queries before rendering local search terms. Eight regression cases failed before the fix, then all 60 tests, ESLint and the production build passed. No browser interaction was tested.
Review follow-up, 2026-11-17: Preserve original first-match precedence when duplicate preset IDs are loaded. A candidate-link regression failed before the fix. All 50 tests, ESLint and production build pass. The duplicate fixture triggers React's existing duplicate-key warning; this change does not redesign duplicate preset handling. No browser interaction was tested.

Integration: kept both independent work-log entries after PR30 merged; combined tests, lint and production build rerun before pushing.
