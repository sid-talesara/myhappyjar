# My Happy Jar

Monorepo layout for:

- `apps/native`: React Native app
- `apps/web`: web app
- `apps/landing`: marketing landing page
- `packages/*`: shared code, UI, config, and utilities

Current status:

- The existing static landing page has been moved under `apps/landing`
- `web` and `native` are scaffolded as app locations and ready for their actual app setup

Suggested next build steps:

1. Add the React Native app in `apps/native`
2. Add the web app in `apps/web`
3. Move shared types, constants, and design tokens into `packages/*`
4. Decide on the toolchain for the app pair:
   `Expo + React Native Web` if you want maximum code sharing
   `Expo` for native and `Next.js` for web if you want stronger web-specific SEO/app routing
