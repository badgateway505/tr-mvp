# Travel Rule Calculator — Implementation Plan (MVP v1.0)

## 0. Project Initialization & Tooling

- **0.1** \[x] **Create project scaffold (Vite + React + TypeScript)**
  _Context:_ Initialize the app with TS from the start to enforce types for requirements and logic.
  _Depends on:_ —
- **0.2** \[x] **Install & configure Tailwind CSS**
  _Context:_ Add Tailwind for fast, consistent styling and transitions. Include base, components, utilities.
  _Depends on:_ 0.1
- **0.3** \[x] **Establish folder structure**
  _Context:_ Create `/src/components`, `/src/logic`, `/src/data`, `/src/styles`, `/src/types`, `App.tsx`, `main.tsx`.
  _Depends on:_ 0.1
- **0.4** \[x] **Enable strict TypeScript settings**
  _Context:_ `strict: true`, `noImplicitAny`, `exactOptionalPropertyTypes`. Helps avoid runtime errors in rules logic.
  _Depends on:_ 0.1
- **0.5** \[x] **Add ESLint + Prettier (basic rules)**
  _Context:_ Keep code readable and consistent; minimal config to avoid overhead.
  _Depends on:_ 0.1

---

## 1. Static Data (JSON) & Docs

- **1.1** \[x] **Add `data/requirements.json` with DEU & ZAF**
  _Context:_ Encode examples from scope.md including thresholds, individual rules, AND/OR groups.
  _Depends on:_ 0.3
- **1.2** \[x] **Add `data/currencyRates.json`**
  _Context:_ Static mapping `{ "EUR": 1, "ZAR": 0.05 }` as example.
  _Depends on:_ 0.3
- **1.3** \[x] **Add `data/fieldDictionary.json`**
  _Context:_ Map raw law terms → normalized names, e.g. `{ "passportNumber": "id_document_number", "dob + pob": "date_of_birth + birthplace" }`.
  _Depends on:_ 0.3
- **1.4** \[x] **Include `/docs/scope.md` & `/docs/todo.md` in repo**
  _Context:_ Keep scope.md (PRD) and todo.md (plan) close to code for easy handoff.
  _Depends on:_ 0.3

---

## 2. Types & Parsing Utilities

- **2.1** \[x] **Define requirement types (`/types/requirements.ts`)**
  _Context:_ Types for `CountryCode`, `RequirementGroup`, `Logic = 'AND'|'OR'`, `Flags`, `RuleBlock`, `CountryRule`.
  _Depends on:_ 1.1
- **2.2** \[x] **Create loader helpers (`/logic/loadRequirements.ts`)**
  _Context:_ Read/validate `requirements.json`; expose `getCountryRule(code)`.
  _Depends on:_ 2.1, 1.1
- **2.3** \[x] **Create currency helper (`/logic/getCurrencyRate.ts`)**
  _Context:_ Read static mapping and return `number` for given currency code.
  _Depends on:_ 1.2
- **2.4** \[x] **Field normalization helper (`/logic/normalizeFieldName.ts`)**
  _Context:_ Map incoming field to normalized key using `fieldDictionary.json`. Fall back to the original if no map.
  _Depends on:_ 1.3

---

## 3. Core State Management

- **3.1** \[x] **Implement app state store (`/logic/useAppState.ts`)**
  _Context:_ Fields: `sumsubCountry`, `counterpartyCountry`, `direction ('IN'|'OUT', default 'OUT')`, `amount: number`, `entityType: 'individual'`.
  _Depends on:_ 0.3
- **3.2** \[x] **Amount validation (digits only) utility**
  _Context:_ Input → parse to `int` (reject non-digits). Ensure `amount` is an **integer**.
  _Depends on:_ 3.1
- **3.3** \[x] **Derived currency code for input**
  _Context:_ From `sumsubCountry` rule; use its `currency` for the amount label.
  _Depends on:_ 2.2, 3.1

---

## 4. Requirement Selection Logic

- **4.1** \[x] **Determine sender/receiver by direction**
  _Context:_ `OUT`: Sumsub=sender; `IN`: Sumsub=receiver. Used to label blocks and messages only (rules still independent).
  _Depends on:_ 3.1
- **4.2** \[x] **Select threshold bucket per side (`below_threshold` vs `above_threshold`)**
  _Context:_ Compare **that side’s** `threshold` with input `amount` (int). Sides evaluated independently.
  _Depends on:_ 2.2, 3.1, 3.2
- **4.3** \[x] **Extract fields & flags per side**
  _Context:_ For each side and bucket: get `required_fields` **or** `requirement_groups`; plus `kyc_required`, `aml_required`, `wallet_attribution`.
  _Depends on:_ 4.2
- **4.4** \[x] **Normalize field labels for comparison**
  _Context:_ Convert each field (including combo fields like `date_of_birth + birthplace`) to a normalized key for matching.
  _Depends on:_ 2.4, 4.3
- **4.5** \[x] **EUR conversion helper**
  _Context:_ Get rate for Sumsub’s currency; compute `convertedEUR = Math.round(amount * rate)`; display read-only.
  _Depends on:_ 2.3, 3.1, 3.2, 3.3

---

## 5. Primitive UI Components

- **5.1** \[x] **Country dropdown (`<CountrySelect />`)**
  _Context:_ Flag + name + code; value is 3-letter code; reuse for both Sumsub and Counterparty.
  _Depends on:_ 3.1
- **5.2** \[x] **Direction toggle (`<DirectionToggle />`)**
  _Context:_ Two-state switch `IN`/`OUT`; default `OUT`.
  _Depends on:_ 3.1
- **5.3** \[x] **Entity toggle (`<EntityToggle />`)**
  _Context:_ Show `Individual` active, `Company` disabled with label “Coming soon”.
  _Depends on:_ 3.1
- **5.4** \[x] **Amount input (`<AmountInput />`)**
  _Context:_ Digits-only; prevent non-digits; `amount` is `int`. Show currency from Sumsub VASP.
  _Depends on:_ 3.2, 3.3
- **5.5** \[x] **Converted EUR readout (`<ConvertedAmount />`)**
  _Context:_ Read-only display of `convertedEUR` from helper (rounded).
  _Depends on:_ 4.5

---

## 6. Requirements Rendering

- **6.1** \[x] **VASP requirements block wrapper (`<VaspRequirementsBlock />`)**
  _Context:_ Receives: role label, color theme (blue for Sumsub, purple for Counterparty), fields/groups, flags.
  _Depends on:_ 4.3
  _Status:_ ✅ **COMPLETED** - Component created with blue/purple themes, fields/groups display, verification flags, and comprehensive tests
- **6.2** \[x] **Group renderer (`<RequirementGroup />`)**
  _Context:_ Renders groups with `logic: 'AND' | 'OR'`; visually separate groups; support combo fields as a single chip.
  _Depends on:_ 6.1
- **6.3** \[x] **Field chip (`<FieldPill />`)**
  _Context:_ Single field (or combo) item; base border grey when unmatched; hover logic to scale + dashed if matched.
  _Depends on:_ 6.2
- **6.4** \[x] **Flags row (`<VerificationFlags />`)**
  _Context:_ Displays KYC / AML / Wallet Attribution as tags; informative only, not compared.
  _Depends on:_ 6.1

---

## 7. Matching & Hover Interaction

- **7.1** [x] **Build comparable sets per side**
  _Context:_ Produce normalized sets: `applicantFields` and `counterpartyFields`; treat OR-group as **satisfied** if any member matches.
  _Depends on:_ 4.4
  _Status:_ ✅ **COMPLETED** - Implemented `buildComparableSets` function with OR-group satisfaction logic, field pairing map, and UI integration
- **7.2** [x] **Field ↔ field pairing resolver**
  _Context:_ For each unique normalized field, find presence in both sides; keep a map `{ normalizedKey: { inApplicant: boolean, inCounterparty: boolean } }`.
  _Depends on:_ 7.1
  _Status:_ ✅ **COMPLETED** - Implemented `buildFieldPresenceMap` function that creates a map showing which normalized fields exist on each side, with helper functions `getFieldPresenceMap` and `isFieldPresentOnBothSides`
- **7.3** [x] **Hover sync between blocks**
  _Context:_ On hover of a field pill, highlight corresponding pill(s) in the opposite block if `inBoth === true` → apply `scale` + `dashed-border`.
  _Depends on:_ 7.2, 6.3
  _Status:_ ✅ **COMPLETED** - Implemented bidirectional hover sync with scale + dashed border effects

---

## 8. Summary Indicator

- **8.1** [x] **Comparison function (`compareFieldSets`)**
  _Context:_ Return `"match"` if all normalized fields required by both are covered; `"overcompliance"` if sender (Sumsub side for OUT) includes more; `"undercompliance"` otherwise. KYC/AML/Wallet excluded.
  _Depends on:_ 7.2
  _Status:_ ✅ **COMPLETED** - Implemented `compareFieldSets` function that compares field sets from both sides, handles combo fields correctly by expanding them into individual components, and returns appropriate compliance status based on direction
- **8.2** \[x] **Summary bar component (`<SummaryStatusBar />`)**
  _Context:_ Green ✅ for match, Blue ☑️ for overcompliance, Orange ⚠️ for undercompliance; concise message per case.
  _Depends on:_ 8.1
  _Status:_ ✅ **COMPLETED** - Component created with proper styling, integrated into App.tsx, and fully tested

---

## 9. Layout, Styling & Animations

- **9.1** \[x] **Responsive layout (`App.tsx`)**
  _Context:_ Two-column layout for VASP blocks on desktop; stacked on small screens.
  _Depends on:_ 5.x, 6.x, 8.2
  _Status:_ ✅ **COMPLETED** - Implemented responsive layout with proper breakpoints, improved spacing, and modern UI design. VASP blocks stack on mobile and display side-by-side on larger screens.
- **9.2** \[x] **Theme colors & tokens**
  _Context:_ Tailwind classes for blue (Sumsub) and purple (Counterparty); consistent paddings, radii, shadows.
  _Depends on:_ 2.2, 6.1
  _Completed:_ Created centralized theme system with consistent tokens, CSS variables, and utility functions
- **9.3** \[x] **Micro-interactions**
  _Context:_ Tailwind transitions (`transition`, `transform`, `hover:scale-…`, `border-dashed`) for smooth UX; keep subtle.
  _Depends on:_ 6.3, 7.3
  _Completed:_ Added smooth transitions, hover effects, and subtle animations across all components including:
  - Input controls (hover:scale, focus:scale, smooth transitions)
  - Field pills (enhanced hover effects, border-dashed on hover)
  - VASP requirement blocks (card hover effects, group animations)
  - Summary status bar (status change animations, icon rotations)
  - Verification flags (hover scaling, shadow effects)
  - Header elements (title hover scaling, subtitle transitions)
  - Test results and scenarios (hover effects, smooth scaling)

---

## 10. Manual QA Scenarios

- **10.1** \[x] **Threshold edge cases**
  _Context:_ DEU (threshold 0) always above; ZAF around 5,000 boundary. Verify independent evaluation per side.
  _Depends on:_ 4.2, 6.x, 8.2
  _Completed:_ Comprehensive test suite created covering DEU threshold 0 behavior, ZAF 5,000 boundary testing, and independent evaluation per side validation.
- **10.2** \[ ] **Direction cases (IN vs OUT)**
  _Context:_ Ensure labeling and summary logic remain correct while requirements evaluation stays independent.
  _Depends on:_ 4.1, 8.2
- **10.3** \[ ] **Matching behavior**
  _Context:_ Hover matches for normalized names; unmatched default grey border; OR-group considered satisfied by any one field.
  _Depends on:_ 7.3
- **10.4** \[ ] **Currency conversion & rounding**
  _Context:_ Verify `amount` is **int**, rate is **float**, `convertedEUR = Math.round(amount * rate)` is displayed read-only.
  _Depends on:_ 3.2, 4.5, 5.5
- **10.5** \[ ] **Accessibility & keyboard checks (basic)**
  _Context:_ Tab through inputs/toggles/dropdowns; visible focus rings via Tailwind.
  _Depends on:_ 5.x, 9.x

---

## 11. Cleanup & Handoff

- **11.1** \[ ] **Docs & code comments**
  _Context:_ JSDoc for helpers; README with quick start, where to edit JSONs, how to add a country.
  _Depends on:_ 1.x–10.x
- **11.2** \[ ] **Run linter/formatter; fix warnings**
  _Context:_ Keep baseline green; avoids friction for the next devs.
  _Depends on:_ 11.1
- **11.3** \[ ] **Tag MVP v1.0 (git) & short changelog**
  _Context:_ Mark the snapshot used for demos; list known limitations (e.g., no company, static rates).
  _Depends on:_ 11.2

---

## Subtasks (expanded examples)

> Use these as templates where you want even smaller commits.

- **5.1.1** \[ ] **Country list data**
  _Context:_ Prepare array of countries (code, name, flag) to feed `<CountrySelect />`.
  _Depends on:_ 5.1
- **5.4.1** \[ ] **Digits-only input guard**
  _Context:_ Reject non-digit on keypress; sanitize paste by stripping non-digits; store `parseInt(value || '0', 10)`.
  _Depends on:_ 5.4, 3.2
- **6.2.1** \[ ] **Combo field rendering**
  _Context:_ If field includes `' + '`, render as a single chip displaying both parts joined by `+`.
  _Depends on:_ 6.2
- **7.2.1** \[ ] **OR-group satisfaction check**
  _Context:_ When comparing sets, count any OR-member match as a match for that group’s normalized key.
  _Depends on:_ 7.2
- **8.2.1** \[ ] **Summary messages copy**
  _Context:_ Human-readable strings for all three cases; short and clear.
  _Depends on:_ 8.2
- **9.3.1** \[ ] **Hover animation timing**
  _Context:_ Tailwind class tuning: `transition-all duration-150 ease-out` to keep motion subtle.
  _Depends on:_ 9.3

---

## Acceptance Checklist (maps to PRD)

- **A.1** \[ ] Direction default = **OUT**; entity shows **Individual**, Company disabled
  _Depends on:_ 5.2, 5.3
- **A.2** \[ ] Amount input is **integer-only**; conversion uses **float rate**, EUR value **rounded**
  _Depends on:_ 5.4, 4.5
- **A.3** \[ ] Independent threshold evaluation per VASP side
  _Depends on:_ 4.2
- **A.4** \[ ] Matching & hover highlighting between blocks
  _Depends on:_ 7.3
- **A.5** \[ ] Summary bar colors: Green/Blue/Orange with correct logic
  _Depends on:_ 8.2
- **A.6** \[x] Flags (KYC/AML/Wallet) displayed, not compared
  _Depends on:_ 6.4
- **A.7** \[ ] Tailwind styling + smooth transitions
  _Depends on:_ 9.x
- **A.8** \[ ] All logic driven by static JSONs; no API calls
  _Depends on:_ 1.x–4.x

---

### Notes & Best Practices

- Keep functions pure and small (helpers in `/logic`), UI dumb where possible.
- Normalize early, display raw labels via tooltips if needed.
- Prefer composition over conditionals in renderers (e.g., groups → items).
- Keep PRD and task list updated as you ship; small PRs aligned with IDs above.
