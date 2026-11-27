# MILON Admin Dashboard

## Language
Always reply to the user in **Bangla**. Code, comments, commit messages and file names stay in English.

## Project context
- **MILON** is a fitness and nutrition app, available in English and French.
- The mobile app is built in Flutter (GetX) at `~/Development/flutter_projects/slovci`. That repo is the reference for business logic, wording and EN/FR strings (`lib/core/localization/strings/`).
- **This folder** is the web **admin dashboard** for MILON, built with React.
- **Current phase:** functional frontend only. There is no backend yet, so use **mock data** behind a clean API/service layer that can be swapped for real endpoints later.

## Design source (Figma)
- Use the **Copy** file: https://www.figma.com/design/cdJVHdcDTXlCDuPuUTtTRF/MILON-—-App---Admin-UI--Copy- (fileKey `cdJVHdcDTXlCDuPuUTtTRF`). The original file has no access.
- The admin screens are inside that same file. The mobile screens live on the "Mobile App" page.
- Build pixel-close to Figma. Pull tokens with the Figma MCP tools.

## Brand tokens (from the mobile app)
- Primary / CTA red: `#E04D38`
- Body font: **Plus Jakarta Sans**
- Brand / wordmark font: **Archivo Black**
- Other mobile tokens (peach, coral, ink, muted, line, pearl) are in `slovci/lib/core/utils/constants/colors.dart`. Confirm them against the Figma admin frames.

## Tech stack (agreed)
- Vite + React + TypeScript
- Tailwind CSS + shadcn/ui
- React Router
- TanStack Query (data layer; mock now, real API later)
- react-hook-form + zod
- Recharts (charts)
- react-i18next (EN/FR), if the admin needs both languages

## Architecture
Use a feature-first structure, as in the Flutter app:
```
src/
  app/          # providers, router, layout
  components/   # shared UI (shadcn + custom)
  features/<name>/{api,components,pages,hooks,types}
  lib/          # utils, api client, mock data
  styles/
```

## Working rules
- **Do not scaffold or build screens** until the user shares the Figma admin link (or node) and says to start.
- Work one screen or feature at a time. Show progress, and commit only when asked.
- Git: commit or push only when the user asks. Use clean, conventional commit messages.
