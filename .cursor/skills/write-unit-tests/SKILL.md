---
name: write-unit-tests
description: Write Unit Tests
---

# Write Unit Tests

## Overview

Create comprehensive unit tests for the current code and generate the test file with proper imports and setup according to the project's testing conventions.

## When NOT to Write Unit Tests

**Skip unit tests for code that:**

1. **Pure configuration with no logic**
   - RTK Query API definitions (endpoints with only `query`, `providesTags`, simple `serializeQueryArgs`)
   - Simple re-exports or barrel files
   - TypeScript interface/type definitions
   - Example: `forceRefetch: ({ currentArg, previousArg }) => !isEqual(currentArg, previousArg)` - this just uses lodash

2. **Simple delegation to well-tested libraries**
   - Code that only passes through to React, Redux Toolkit, Lodash, etc.
   - The library's own tests cover the behavior

3. **Exports that TypeScript already validates**
   - `export const useHook = ...` - if the name changes, consuming code won't compile

**What to do instead:**

- Rely on integration tests (component tests) to verify the wiring works
- Add comments in the source file acknowledging the gap: `// Caching behavior tested via ComponentName integration tests`

## Steps

1. **Test Coverage**
   - Test all public methods and functions **that contain custom logic**
   - Cover edge cases and error conditions
   - Test both positive and negative scenarios
   - Aim for high code coverage on extracted logic, not configuration

2. **Test Structure**
   - Use the project's testing framework conventions
   - Write clear, descriptive test names
   - Follow the Arrange-Act-Assert pattern
   - Group related tests logically

3. **Test Cases to Include**
   - Happy path scenarios
   - Edge cases and boundary conditions
   - Error handling and exception cases
   - Mock external dependencies appropriately

4. **Test Quality**
   - Make tests independent and isolated
   - Ensure tests are deterministic and repeatable
   - Keep tests simple and focused on one thing
   - Prefer `toBeVisible()` over `toBeInTheDocument()` when testing UI that should be visible to users
   - Use `toBeInTheDocument()` only when visibility is irrelevant or element is intentionally hidden

## Write Unit Tests Checklist

- [ ] Identified if this code needs testing (configuration vs logic)
- [ ] Tested all public methods and functions with custom logic
- [ ] Covered edge cases and error conditions
- [ ] Tested both positive and negative scenarios
- [ ] Used the project's testing framework conventions
- [ ] Written clear, descriptive test names
- [ ] Followed the Arrange-Act-Assert pattern
- [ ] Included happy path scenarios
- [ ] Included edge cases and boundary conditions
- [ ] Mocked external dependencies appropriately
- [ ] Made tests independent and isolated
- [ ] Ensured tests are deterministic and repeatable
- [ ] Not testing duplicate logic - the test doesn't just reimplement the code
