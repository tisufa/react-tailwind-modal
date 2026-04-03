# Changelog

All notable changes to this project will be documented in this file.

## [1.0.2] - 2026-04-03

### Changed

- **Peer Dependencies:** Updated `react` and `react-dom` requirements to `>=18.0.0` to explicitly support React 18 and 19.
- **Package Exports:** Refined `package.json` exports for better compatibility with modern bundlers and to fix CSS specifier resolution issues.

### Docs

- **Requirements:** Added a dedicated section to `README.md` to clarify mandatory support for **React 18+**, **Tailwind CSS v4**, and **Node.js 20+**.
- **Style Integration:** Updated the documentation with the correct CSS import guide specifically for Tailwind v4 native projects.

## [1.0.1] - 2026-03-28

### Fixed

- **CSS Style Leaking:** Switched from `@import` to `@reference "tailwindcss"` to prevent the library's base styles (Preflight) from leaking into and overriding the parent application's global styles.

- **Bundle Optimization:** Reduced the final CSS bundle size by referencing Tailwind's theme and utilities instead of bundling the entire Tailwind base engine.

## [1.0.0] - 2026-03-15

### ⚠ Breaking Changes

- **Renamed event handlers:** `onChange` is now `onClose`, and the previous `onClose` is now `onDismiss` to align with the new lifecycle methods.
- **New Interface:** Refactored modal components to use the new `ModalProps<TModel, TResult>` generic API for better type safety.

### Added

- Added `dismiss()` method to the `useActiveModal` hook to programmatically close modals without a result.
- Added default background overlay content for modals.

### Fixed

- **Scroll Locking:** Fixed body scroll locking behavior to correctly preserve the `original document.body.style.overflow `value.
- **Stacked Modals:** Improved scroll management when multiple modals are opened simultaneously.

### Docs

- Updated README to reflect the new modal API and lifecycle.
- Added comprehensive examples for creating type-safe modals using ModalProps.
- Added a migration guide for upgrading from version 0.x to 1.0.0.
