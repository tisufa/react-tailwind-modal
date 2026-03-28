# Changelog

All notable changes to this project will be documented in this file.

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
