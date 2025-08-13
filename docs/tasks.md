# Travel Rule Calculator — Implementation Plan (MVP v1.0)

## 0. Project Initialization & Tooling

* **0.1** \[ ] **Create project scaffold (Vite + React + TypeScript)**
  *Context:* Initialize the app with TS from the start to enforce types for requirements and logic.
  *Depends on:* —
* **0.2** \[ ] **Install & configure Tailwind CSS**
  *Context:* Add Tailwind for fast, consistent styling and transitions. Include base, components, utilities.
  *Depends on:* 0.1
* **0.3** \[ ] **Establish folder structure**
  *Context:* Create `/src/components`, `/src/logic`, `/src/data`, `/src/styles`, `/src/types`, `App.tsx`, `main.tsx`.
  *Depends on:* 0.1
* **0.4** \[ ] **Enable strict TypeScript settings**
  *Context:* `strict: true`, `noImplicitAny`, `exactOptionalPropertyTypes`. Helps avoid runtime errors in rules logic.
  *Depends on:* 0.1
* **0.5** \[ ] **Add ESLint + Prettier (basic rules)**
  *Context:* Keep code readable and consistent; minimal config to avoid overhead.
  *Depends on:* 0.1

---

## 1. Static Data (JSON) & Docs

* **1.1** \[ ] **Add `data/requirements.json` with DEU & ZAF**
  *Context:* Encode examples from PRD including thresholds, individual rules, AND/OR groups.
  *Depends on:* 0.3
* **1.2** \[ ] **Add `data/currencyRates.json`**
  *Context:* Static mapping `{ "EUR": 1, "ZAR": 0.05 }` as example.
  *Depends on:* 0.3
* **1.3** \[ ] **Add `data/fieldDictionary.json`**
  *Context:* Map raw law terms → normalized names, e.g. `{ "passportNumber": "id_document_number", "dob + pob": "date_of_birth + birthplace" }`.
  *Depends on:* 0.3
* **1.4** \[ ] **Include `/docs/scope.md` & `/docs/todo.md` in repo**
  *Context:* Keep PRD and plan close to code for easy handoff.
  *Depends on:* 0.3

---

## 2. Types & Parsing Utilities

* **2.1** \[ ] **Define requirement types (`/types/requirements.ts`)**
  *Context:* Types for `CountryCode`, `RequirementGroup`, `Logic = 'AND'|'OR'`, `Flags`, `RuleBlock`, `CountryRule`.
  *Depends on:* 1.1
* **2.2** \[ ] **Create loader helpers (`/logic/loadRequirements.ts`)**
  *Context:* Read/validate `requirements.json`; expose `getCountryRule(code)`.
  *Depends on:* 2.1, 1.1
* **2.3** \[ ] **Create currency helper (`/logic/getCurrencyRate.ts`)**
  *Context:* Read static mapping and return `number` for given currency code.
  *Depends on:* 1.2
* **2.4** \[ ] **Field normalization helper (`/logic/normalizeFieldName.ts`)**
  *Context:* Map incoming field to normalized key using `fieldDictionary.json`. Fall back to the original if no map.
  *Depends on:* 1.3

---

## 3. Core State Management

* **3.1** \[ ] **Implement app state store (`/logic/useAppState.ts`)**
  *Context:* Fields: `sumsubCountry`, `counterpartyCountry`, `direction ('IN'|'OUT', default 'OUT')`, `amount: number`, `entityType: 'individual'`.
  *Depends on:* 0.3
* **3.2** \[ ] **Amount validation (digits only) utility**
  *Context:* Input → parse to `int` (reject non-digits). Ensure `amount` is an **integer**.
  *Depends on:* 3.1
* **3.3** \[ ] **Derived currency code for input**
  *Context:* From `sumsubCountry` rule; use its `currency` for the amount label.
  *Depends on:* 2.2, 3.1

---

## 4. Requirement Selection Logic

* **4.1** \[ ] **Determine sender/receiver by direction**
  *Context:* `OUT`: Sumsub=sender; `IN`: Sumsub=receiver. Used to label blocks and messages only (rules still independent).
  *Depends on:* 3.1
* **4.2** \[ ] **Select threshold bucket per side (`below_threshold` vs `above_threshold`)**
  *Context:* Compare **that side’s** `threshold` with input `amount` (int). Sides evaluated independently.
  *Depends on:* 2.2, 3.1, 3.2
* **4.3** \[ ] **Extract fields & flags per side**
  *Context:* For each side and bucket: get `required_fields` **or** `requirement_groups`; plus `kyc_required`, `aml_required`, `wallet_attribution`.
  *Depends on:* 4.2
* **4.4** \[ ] **Normalize field labels for comparison**
  *Context:* Convert each field (including combo fields like `date_of_birth + birthplace`) to a normalized key for matching.
  *Depends on:* 2.4, 4.3
* **4.5** \[ ] **EUR conversion helper**
  *Context:* Get rate for Sumsub’s currency; compute `convertedEUR = Math.round(amount * rate)`; display read-only.
  *Depends on:* 2.3, 3.1, 3.2, 3.3

---

## 5. Primitive UI Components

* **5.1** \[ ] **Country dropdown (`<CountrySelect />`)**
  *Context:* Flag + name + code; value is 3-letter code; reuse for both Sumsub and Counterparty.
  *Depends on:* 3.1
* **5.2** \[ ] **Direction toggle (`<DirectionToggle />`)**
  *Context:* Two-state switch `IN`/`OUT`; default `OUT`.
  *Depends on:* 3.1
* **5.3** \[ ] **Entity toggle (`<EntityToggle />`)**
  *Context:* Show `Individual` active, `Company` disabled with label “Coming soon”.
  *Depends on:* 3.1
* **5.4** \[ ] **Amount input (`<AmountInput />`)**
  *Context:* Digits-only; prevent non-digits; `amount` is `int`. Show currency from Sumsub VASP.
  *Depends on:* 3.2, 3.3
* **5.5** \[ ] **Converted EUR readout (`<ConvertedAmount />`)**
  *Context:* Read-only display of `convertedEUR` from helper (rounded).
  *Depends on:* 4.5

---

## 6. Requirements Rendering

* **6.1** \[ ] **VASP requirements block wrapper (`<VaspRequirementsBlock />`)**
  *Context:* Receives: role label, color theme (blue for Sumsub, purple for Counterparty), fields/groups, flags.
  *Depends on:* 4.3
* **6.2** \[ ] **Group renderer (`<RequirementGroup />`)**
  *Context:* Renders groups with `logic: 'AND' | 'OR'`; visually separate groups; support combo fields as a single chip.
  *Depends on:* 6.1
* **6.3** \[ ] **Field chip (`<FieldPill />`)**
  *Context:* Single field (or combo) item; base border grey when unmatched; hover logic to scale + dashed if matched.
  *Depends on:* 6.2
* **6.4** \[ ] **Flags row (`<VerificationFlags />`)**
  *Context:* Displays KYC / AML / Wallet Attribution as tags; informative only, not compared.
  *Depends on:* 6.1

---

## 7. Matching & Hover Interaction

* **7.1** \[ ] **Build comparable sets per side**
  *Context:* Produce normalized sets: `applicantFields` and `counterpartyFields`; treat OR-group as **satisfied** if any member matches.
  *Depends on:* 4.4
* **7.2** \[ ] **Field ↔ field pairing resolver**
  *Context:* For each unique normalized field, find presence in both sides; keep a map `{ normalizedKey: { inApplicant: boolean, inCounterparty: boolean } }`.
  *Depends on:* 7.1
* **7.3** \[ ] **Hover sync between blocks**
  *Context:* On hover of a field pill, highlight corresponding pill(s) in the opposite block if `inBoth === true` → apply `scale` + `dashed-border`.
  *Depends on:* 7.2, 6.3

---

## 8. Summary Indicator

* **8.1** \[ ] **Comparison function (`compareFieldSets`)**
  *Context:* Return `"match"` if all normalized fields required by both are covered; `"overcompliance"` if sender (Sumsub side for OUT) includes more; `"undercompliance"` otherwise. KYC/AML/Wallet excluded.
  *Depends on:* 7.2
* **8.2** \[ ] **Summary bar component (`<SummaryStatusBar />`)**
  *Context:* Green ✅ for match, Blue ☑️ for overcompliance, Orange ⚠️ for undercompliance; concise message per case.
  *Depends on:* 8.1

---

## 9. Layout, Styling & Animations

* **9.1** \[ ] **Responsive layout (`App.tsx`)**
  *Context:* Two-column layout for VASP blocks on desktop; stacked on small screens.
  *Depends on:* 5.x, 6.x, 8.2
* **9.2** \[ ] **Theme colors & tokens**
  *Context:* Tailwind classes for blue (Sumsub) and purple (Counterparty); consistent paddings, radii, shadows.
  *Depends on:* 2.2, 6.1
* **9.3** \[ ] **Micro-interactions**
  *Context:* Tailwind transitions (`transition`, `transform`, `hover:scale-…`, `border-dashed`) for smooth UX; keep subtle.
  *Depends on:* 6.3, 7.3

---

## 10. Manual QA Scenarios

* **10.1** \[ ] **Threshold edge cases**
  *Context:* DEU (threshold 0) always above; ZAF around 5,000 boundary. Verify independent evaluation per side.
  *Depends on:* 4.2, 6.x, 8.2
* **10.2** \[ ] **Direction cases (IN vs OUT)**
  *Context:* Ensure labeling and summary logic remain correct while requirements evaluation stays independent.
  *Depends on:* 4.1, 8.2
* **10.3** \[ ] **Matching behavior**
  *Context:* Hover matches for normalized names; unmatched default grey border; OR-group considered satisfied by any one field.
  *Depends on:* 7.3
* **10.4** \[ ] **Currency conversion & rounding**
  *Context:* Verify `amount` is **int**, rate is **float**, `convertedEUR = Math.round(amount * rate)` is displayed read-only.
  *Depends on:* 3.2, 4.5, 5.5
* **10.5** \[ ] **Accessibility & keyboard checks (basic)**
  *Context:* Tab through inputs/toggles/dropdowns; visible focus rings via Tailwind.
  *Depends on:* 5.x, 9.x

---

## 11. Cleanup & Handoff

* **11.1** \[ ] **Docs & code comments**
  *Context:* JSDoc for helpers; README with quick start, where to edit JSONs, how to add a country.
  *Depends on:* 1.x–10.x
* **11.2** \[ ] **Run linter/formatter; fix warnings**
  *Context:* Keep baseline green; avoids friction for the next devs.
  *Depends on:* 11.1
* **11.3** \[ ] **Tag MVP v1.0 (git) & short changelog**
  *Context:* Mark the snapshot used for demos; list known limitations (e.g., no company, static rates).
  *Depends on:* 11.2

---

## Subtasks (expanded examples)

> Use these as templates where you want even smaller commits.

* **5.1.1** \[ ] **Country list data**
  *Context:* Prepare array of countries (code, name, flag) to feed `<CountrySelect />`.
  *Depends on:* 5.1
* **5.4.1** \[ ] **Digits-only input guard**
  *Context:* Reject non-digit on keypress; sanitize paste by stripping non-digits; store `parseInt(value || '0', 10)`.
  *Depends on:* 5.4, 3.2
* **6.2.1** \[ ] **Combo field rendering**
  *Context:* If field includes `' + '`, render as a single chip displaying both parts joined by `+`.
  *Depends on:* 6.2
* **7.2.1** \[ ] **OR-group satisfaction check**
  *Context:* When comparing sets, count any OR-member match as a match for that group’s normalized key.
  *Depends on:* 7.2
* **8.2.1** \[ ] **Summary messages copy**
  *Context:* Human-readable strings for all three cases; short and clear.
  *Depends on:* 8.2
* **9.3.1** \[ ] **Hover animation timing**
  *Context:* Tailwind class tuning: `transition-all duration-150 ease-out` to keep motion subtle.
  *Depends on:* 9.3

---

## Acceptance Checklist (maps to PRD)

* **A.1** \[ ] Direction default = **OUT**; entity shows **Individual**, Company disabled
  *Depends on:* 5.2, 5.3
* **A.2** \[ ] Amount input is **integer-only**; conversion uses **float rate**, EUR value **rounded**
  *Depends on:* 5.4, 4.5
* **A.3** \[ ] Independent threshold evaluation per VASP side
  *Depends on:* 4.2
* **A.4** \[ ] Matching & hover highlighting between blocks
  *Depends on:* 7.3
* **A.5** \[ ] Summary bar colors: Green/Blue/Orange with correct logic
  *Depends on:* 8.2
* **A.6** \[ ] Flags (KYC/AML/Wallet) displayed, not compared
  *Depends on:* 6.4
* **A.7** \[ ] Tailwind styling + smooth transitions
  *Depends on:* 9.x
* **A.8** \[ ] All logic driven by static JSONs; no API calls
  *Depends on:* 1.x–4.x

---

### Notes & Best Practices

* Keep functions pure and small (helpers in `/logic`), UI dumb where possible.
* Normalize early, display raw labels via tooltips if needed.
* Prefer composition over conditionals in renderers (e.g., groups → items).
* Keep PRD and task list updated as you ship; small PRs aligned with IDs above.
