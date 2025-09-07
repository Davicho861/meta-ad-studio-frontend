# SDLC Nexus Dashboard Integration Plan

## 1. File Integration
- [ ] Copy `assets` directory from `Meta Ad Studio-sdlc-nexus-main/src` to `src`.
- [ ] Copy `components` directory from `Meta Ad Studio-sdlc-nexus-main/src` to `src`.
- [ ] Copy `hooks` directory from `Meta Ad Studio-sdlc-nexus-main/src` to `src`.
- [ ] Copy `lib` directory from `Meta Ad Studio-sdlc-nexus-main/src` to `src`.
- [ ] Copy `pages` directory from `Meta Ad Studio-sdlc-nexus-main/src` to `src`.
- [ ] Merge `index.css` from `Meta Ad Studio-sdlc-nexus-main/src` into `src/index.css`.

## 2. Configuration
- [ ] Merge `tailwind.config.ts` from `Meta Ad Studio-sdlc-nexus-main` into the root `tailwind.config.ts`.
- [ ] Update `vite.config.ts` if necessary.

## 3. Routing
- [ ] Add a route for `/sdlc` in `src/App.tsx` to render the `SdlcDashboard` component.
- [ ] Add a navigation link to the SDLC dashboard in the main application layout.

## 4. Data Integration
- [ ] Create mock API endpoints or a placeholder service for SDLC metrics.
- [ ] Implement data fetching in `SdlcDashboard.tsx` using React Query or Axios.
- [ ] Simulate real-time updates using WebSockets or polling.

## 5. Theme Implementation
- [ ] Create a `ThemeProvider` component.
- [ ] Implement a theme switcher with a toggle for light and dark modes.
- [ ] Use `localStorage` to persist the selected theme.
- [ ] Apply the 'dark' class to the `html` or `root` element.

## 6. Testing and Deployment
- [ ] Run `npm run dev` to test the integration.
- [ ] Fix any PostCSS or Tailwind CSS errors.
- [ ] Verify the dashboard at `http://localhost:3000/sdlc`.
- [ ] Update the `Dockerfile` and `cloudbuild.yaml` for production.

## 7. Documentation
- [ ] Update `README.md` with details about the integration and theme toggle usage.

## 8. Multiverse Photo Gallery Development
- [ ] Develop Multiverse Gallery Component (`src/components/MultiverseGallery.tsx`)
- [ ] Add API endpoints for multiverse photos (`openapi.yaml`)
- [ ] Integrate gallery with existing dashboards (`SdlcDashboard.tsx`, `Overview.tsx`)
- [ ] Update TESTING_PLAN.md with gallery test cases
