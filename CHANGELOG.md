# analytics-dashboard

## 3.2.0

### Minor Changes

- 0ca9f9a: migrating from next 14 to next 16

### Patch Changes

- 2acaf66: feat: upgraded clerk versions
- 5fb5465: Fix for Kanban Board hydration error.
- 78e3a9d: added announcements page and updated readme announcements

## 3.1.0

### Minor Changes

- feat: added changesets page

## 3.0.1

### Patch Changes

- a1d2c5c: fix: fixed image assets loading by reworking middleware.ts

## 3.0.0

### Major Changes

- 98675d3: 🚀 **Theme Customizer Overhaul**

  This release introduces a fully customizable theme system for Mantine Analytics Dashboard.

  ### ✨ What's New

  - Full **Theme Customizer Panel** with live preview
  - Adjustable **color schemes**, **spacing**, **border radius**, and **glassmorphism**
  - Redesigned **sidebar**, **header**, and **card components**
  - Modular layout architecture with better file organization
  - Bug fixes for sidebar behavior and theme typing

  Developers now have full control over the dashboard’s appearance, enabling personalized or brand-specific UIs with ease.

  🧼 Deprecated:

  - Removed `floating` and `transparent` variants
  - Removed unused sidebar state logic

  💥 This is a **breaking change** if you rely on layout variants or legacy theme behavior.

### Patch Changes

- f171570: - feat: added comprehensive theme customizer, for now we can update our layout (sidebar and header), removed AppShell for flexibility

## 2.2.6

### Patch Changes

- 0c08221: feat: added invoices apis
- 359be3a: Add project creation feature and enhance header actions
- 51f7f09: feat: multiple sidebar variations
- 2821176: feat: added file manager route and update dependencies
- 419297d: build(deps): bump nanoid from 3.3.7 to 3.3.8
- e340d29: build(deps): bump next from 14.2.17 to 14.2.21
- 194418f: feat: upgraded mantine and core packages
- e4bc477: refactor: change file imports project wide
- 33e3f29: feat: added edit and delete product components
- 699ed94: chore: remove package lock json
- 7a99267: build(deps): bump next from 14.2.21 to 14.2.26
- 077073f: feat: added edit and delete product category components
- 0a14258: feat/integrate-with-orders-api

## 2.2.5

### Patch Changes

- 52866a2: Bump webpack from 5.89.0 to 5.94.0
- 00a21fc: Bump send and express
- 23930b9: Bump micromatch and lint-staged
- 561a664: Bump body-parser and express
- dc92975: Bump elliptic from 6.5.4 to 6.6.0
- b07d0ba: Bump next from 14.1.1 to 14.2.12
- ab7e73c: Bump serve-static and express
- 2c03d73: build(deps): bump path-to-regexp and @clerk/nextjs

## 2.2.4

### Patch Changes

- 7cc5783: ### Dependency update
  Bump ws from 6.2.2 to 6.2.3
- b32a78e: Bump braces from 3.0.2 to 3.0.3

## 2.2.3

### Patch Changes

- 9b665f2: Bump next from 14.0.4 to 14.1.1

## 2.2.2

### Patch Changes

- 4ec6220: Bump ejs from 3.1.9 to 3.1.10

## 2.2.1

### Patch Changes

- a5cd1ea: feat(ui): added project about page

## 2.2.0

### Minor Changes

- 9daa7a1: fix(ui): navbar not closing on mobile devices

### Patch Changes

- 1a49be8: fix(ui): navbar not closing on mobile devices
- 9daa7a1: changed onboarding flow to landing -> signin -> dashboard, removed "auto" theme support now is light & dark only

## 2.1.7

### Patch Changes

- 201cea9: Bump jose from 4.15.4 to 4.15.5

## 2.1.6

### Patch Changes

- fb7e1b1: - docs: updated product roadmap notion link in README.md
  - styles: updated authentication page(s) layout
  - chore: added missing npm package @dnd-kit/utilities
  - chore: removed unused emotion/\*\* npm packages

## 2.1.5

### Patch Changes

- 3c28484: Bump ip from 2.0.0 to 2.0.1

## 2.1.4

### Patch Changes

- eab6d90: docs: added product roadmap to README.md

## 2.1.3

### Patch Changes

- 4c4968b: Bump @clerk/nextjs from 4.27.5 to 4.29.3

## 2.1.2

### Patch Changes

- 150d301: chore: removed @mantine/prism package

## 2.1.1

### Patch Changes

- 354818b: feat: updated landing page

  ### Added

  - added link to version 1

  ### Updated

  - updated landing page
  - refined light and dark mixins on home page
  - refactored breadcrumbs on apps pages
  - updated side navigation links verbiage and grouping

- 6738e41: fix: bumped mantine prism package from v6 to v7

## 2.1.0

### Minor Changes

- 1a6b808: updated navigation groups verbiage, updated navigation styles

### Patch Changes

- e541e80: feat: updated hero section and header nav content and styles
- 57e711a: refactored all breadcrumb menu in apps pages
- 8701c24: feat: updated landing page design

## 2.0.1

### Patch Changes

- 4371af7: added github, components, previous version links on landing page

## 2.0.0

### Major Changes

- ec87a81: Upgrade to Next.js 14 with App Router and Mantine 7

  # Summary

  This major release marks a significant upgrade to the website, transitioning from Next.js 13 to 14 with App Router and from Mantine 6 to 7. This upgrade brings about substantial enhancements in performance, accessibility, user experience, and overall development practices.

  # Next.js

  - Project Structure: Aligned the project structure with the recommended guidelines for Next.js and App Router, enhancing organization and maintainability.
  - Pages and Layouts: Optimized the pages and layouts structure to align with Next.js and App Router best practices, ensuring a more structured and efficient codebase.
  - Pages Metadata: Updated each page's metadata content to provide more accurate and informative descriptions for search engines.
  - Error Pages: Deprecated the individual 403, 404, and 500 error pages and adopted a unified "not-found" page for 404 errors and a generic error page for other server-side errors.
  - Navigation Progress Bar: Discontinued the navigation progress bar for in-page transitions and implemented a centralized loading.tsx file to handle all in-page loading animations.

  # Mantine

  - CreateStyles: Adopted CSS Modules as the preferred method for styling components, replacing the deprecated createStyles function.
  - Sx Prop: Replaced the deprecated sx prop with className or style prop for styling components in Mantine 7.0.
  - Theme and ColorScheme: Refactored the theme and colour scheme usage across the codebase to align with Mantine 7.0 conventions.
  - Dynamic Multicolor Theme: Deprecated the dynamic multicolour theme change feature and centralized theme configuration in the theme/index.tsx file.

  # New Features

  - Collapsible Side Navigation: Introduced a collapsible side navigation panel for enhanced user interface and navigation experience.
  - Active Link Styles: Implemented logic to dynamically apply active link styles to the side navigation menu, providing clear visual cues for the currently selected page.
  - Dark/Light Theme Switch: Integrated a dark/light theme toggle switch on the navigation header, enabling users to personalize their viewing experience.
  - Loading Animations: Added loading animations to components rendering mock data, providing visual feedback during data fetching and processing.
  - Custom useFetch Hook: Developed a custom useFetch hook to streamline data fetching across the application. This hook encapsulates data fetching logic, returning data, loading, and error states, and utilizes the native JavaScript fetch API.
  - Code Formatting: Implemented Prettier, Husky, and lint-staged to enforce consistent code formatting and maintain a high level of code quality.
  - Clerk Integration: Integrated Clerk (https://clerk.com/) to extend user authentication and management capabilities, providing a seamless user experience.
  - NextAuth with Auth0: Implemented NextAuth with Auth0 (https://auth0.com/) for user authentication, leveraging NextAuth's flexibility and Auth0's robust identity management platform.
  - Component Documentation Stories: Created component documentation stories using Storybook to provide clear and interactive documentation for each component.

  # Bug Fixes

  - General Bug Fixes: Addressed a variety of bugs and issues to enhance overall stability and performance.

- 7c9c77d: upgraded to next 14 and mantine 7

### Minor Changes

- 8c0f1cf: added and setup prettier, husky and lint-staged
- 2516fd6: updated side nav background color
- 5100231: updated pages metadata bug removed head tags in pages added color mode switch moved color mode switch to header removed theme drawer because no logic for color switching yet
- 3cebb01: updated all pages metatadata
- 2516fd6: refactored layouts to match recommended layouts file structure by next docs 13
- 764a558: Added storybook component stories
- 1176e8c: setup next-auth & added auth0 provicder

### Patch Changes

- 5c1c149: added logic for active link styles
- 222a5c3: added mantine sliders, dates, buttons stories
- 4197fea: added usefetchdata hook for all mock data replacing the previous data imports
- 7820b01: replaced yarn with npm configs
- 33fca13: updated .yarn configs
- d97f262: added chats loading animation, updated chats data to fetch using fetch data hook
- bug fix on chromatic yaml file
- 61d5f55: removed 403 page because of build time errors
- bc0b3e1: refactored 404 and 500 pages because they are ootb & designated special pages by nextjs
- a86aa70: updated .yarn configs
- 4e8993e: finished app layout migrations
- b16fc6a: Ft/yarn

## 1.0.1

### Patch Changes

- 342a66a: ### Updated
  - Update issue templates

## 1.0.0

### Major Changes

- 5ae5a37: version 1 complete

### Patch Changes

- cfff613: ### added
  - added changesets to manage versioning
  - basic application complete
