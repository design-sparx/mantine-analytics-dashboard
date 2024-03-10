# analytics-dashboard

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
