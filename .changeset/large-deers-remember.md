---
"analytics-dashboard": major
---

Upgrade to Next.js 14 with App Router and Mantine 7

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
