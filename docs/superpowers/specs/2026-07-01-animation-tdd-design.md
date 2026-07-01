# Design Spec — Intro Preloader E2E Test Suite with TDD

This specification defines the testing and behavior for the `IntroPreloader` animation component. We implement End-to-End (E2E) testing using Playwright and add the "Click Screen to Skip" interactive feature.

---

## 1. Feature Specifications

### 1.1 Animation Timeline (9 Seconds Total)
* **0.0s – 1.8s**: The word `Arche` (ἀρχή) writes itself letter-by-letter, followed by its meaning.
* **1.8s – 3.4s**: The word `Chronos` (Χρόνος) writes itself letter-by-letter, followed by its meaning.
* **3.5s – 4.5s**: The two words slide towards the center of the screen, converging and fading out.
* **3.9s – 6.1s**: The book pages collapse, and the cover with **ARCHRON** fades in and expands.
* **6.5s – 7.2s**: The preloader overlay fades out.
* **9.0s**: The preloader is completely hidden and unmounted, revealing the home page.

### 1.2 "Click Screen to Skip" Feature
* Clicking anywhere on the main black backdrop container (the preloader overlay) will immediately trigger the `skip()` method, terminating the animation and entering the homepage.
* The explicit "Skip" button and keyboard shortcuts (`Escape`, `Enter`, `Space`) remain operational.

---

## 2. Test Scenarios (E2E Playwright)

The test suite is located at [tests/intro-preloader.spec.ts](file:///c:/Users/User/Desktop/Archron/Archon/tests/intro-preloader.spec.ts).

### Test 2.1: Normal Animation Flow
* **Behavior**: Open `/` with no session storage.
* **Assertions**:
  * At `2.0s`: Characters of `Arche` are visible.
  * At `4.5s`: Characters of `Chronos` are visible.
  * At `9.0s`: Preloader overlay is hidden (`toBeHidden()`).

### Test 2.2: Click Screen to Skip
* **Behavior**: Open `/`, wait `0.5s`, then click the center of the screen overlay.
* **Assertions**: Preloader overlay becomes hidden immediately (`toBeHidden()`).

### Test 2.3: Click Skip Button
* **Behavior**: Open `/`, wait `0.5s`, click the explicit "ข้าม" button.
* **Assertions**: Preloader overlay becomes hidden immediately.

### Test 2.4: Keyboard Bypass
* **Behavior**: Open `/`, wait `0.5s`, press `Escape`.
* **Assertions**: Preloader overlay becomes hidden immediately.

### Test 2.5: Session Storage Gate
* **Behavior**: 
  1. Open `/`, skip the animation.
  2. Reload the page.
* **Assertions**: Preloader overlay is not visible on page load.
