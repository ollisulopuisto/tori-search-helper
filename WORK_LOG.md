
Review follow-up, 2026-11-17: Preserve original first-match precedence when duplicate preset IDs are loaded. A candidate-link regression failed before the fix. All 50 tests, ESLint and production build pass. The duplicate fixture triggers React's existing duplicate-key warning; this change does not redesign duplicate preset handling. No browser interaction was tested.
