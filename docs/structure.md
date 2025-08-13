# 📚 Project Structure — Travel Rule Calculator (MVP v1.0)

> **Purpose:** LLM-friendly map of the codebase. Use this file to quickly locate where logic lives, how data flows, and which module to modify. Mirrors the PRD and todo plan.

## 1) High-Level Map

```
/docs
  scope.md            # Full PRD (source of truth for features)
  todo.md             # Task plan with dependencies
  structure.md        # You are here — codebase map for humans & LLMs

/src
  /components         # Pure UI (dumb) components
  /logic              # Pure functions & app logic (no JSX), state, helpers
  /data               # Static JSON data files (rules, rates, dictionary)
  /styles             # Tailwind entry + global styles
  /types              # TypeScript contracts for rules and logic
  App.tsx             # Composition, page layout, wiring
  main.tsx            # React bootstrap (Vite entry)
```

## 2) Data Contracts & Types

**Location:** `/types/requirements.ts`

**Why:** Keep strict, explicit shapes to avoid runtime drift between JSON and UI.

**Core interfaces (sketch):**

```ts
export type CountryCode = string; // 'DEU', 'ZAF', etc.
export type Logic = 'AND' | 'OR';

export type Flags = {
  kyc_required: boolean;
  aml_required: boolean;
  wallet_attribution: boolean;
};

// A group of fields with boolean logic
export type RequirementGroup = {
  logic: Logic; // 'AND' | 'OR'
  fields: string[]; // may include combo: "date_of_birth + birthplace"
};

// Rule block may be simple (required_fields) or grouped (requirement_groups)
export type RuleBlock =
  | { required_fields: string[] } // simple
  | { requirement_groups: RequirementGroup[] }; // complex

export type IndividualBranch = {
  below_threshold: RuleBlock & Flags;
  above_threshold: RuleBlock & Flags;
};

export type CountryRule = {
  currency: string; // e.g., 'EUR', 'ZAR'
  threshold: number; // local currency
  individual: IndividualBranch; // MVP: only 'individual'
  // company?: ...                              // v2 placeholder
};

export type RequirementsJson = Record<CountryCode, CountryRule>;
```

**Notes/Contracts:**

- **Amount** is an **integer** (local currency of **Sumsub** VASP).
- **Rate** is a **float** (from static `currencyRates.json`).
- **Converted EUR** = `Math.round(amount * rate)` (**rounded int**).
- OR-groups are **satisfied** if any member matches; combo fields are treated as one unit.

## 3) Static Data Files

**Location:** `/data`

- `requirements.json` — per-country rules (see PRD examples for **DEU**/**ZAF**).
- `currencyRates.json` — `{"EUR": 1, "ZAR": 0.05, ...}` (static for MVP).
- `fieldDictionary.json` — normalization map (law term → canonical key), e.g.:
  ```json
  {
    "passportNumber": "id_document_number",
    "dob + pob": "date_of_birth + birthplace"
  }
  ```

**LLM Tip:** If matching seems wrong, check normalization entries first.

## 4) Core Logic (Pure Functions)

**Location:** `/logic`

- `loadRequirements.ts` — load & validate `requirements.json`.
  - `getCountryRule(code: CountryCode): CountryRule`
- `getCurrencyRate.ts` — read `currencyRates.json`.
  - `getCurrencyRate(code: string): number`
- `normalizeFieldName.ts` — map raw field → canonical field via `fieldDictionary.json`.
  - `normalize(field: string): string`
- `useAppState.ts` — centralized state (minimal), e.g. with Zustand or `useReducer`.
  - State: `{ sumsubCountry, counterpartyCountry, direction, amount, entityType }`
  - Defaults: `direction='OUT'`, `entityType='individual'`
  - Amount guard: digits-only; store **int**.
- `getRequirementSet.ts` — compute requirement block **per side**.
  - Input: `(country: CountryCode, amount: number)`
  - Uses: `getCountryRule`, pick `above/below_threshold` (independent of other side)
  - Output: `{ fields: string[], groups?: RequirementGroup[], flags: Flags }`
- `pairing.ts` — field matching & OR-satisfaction utilities.
  - Build normalized sets per side
  - Produce map: `{ normalizedKey: { inApplicant: boolean, inCounterparty: boolean } }`
- `compareFieldSets.ts` — summary result logic (excludes KYC/AML/Wallet flags).
  - Returns: `'match' | 'overcompliance' | 'undercompliance'`
- `currency.ts` — conversion helper.
  - `toEUR(amountInt: number, rateFloat: number): number /* rounded */`

## 5) UI Components (Dumb/Pure Presentation)

**Location:** `/components`

- **Inputs**
  - `CountrySelect.tsx` — dropdown with flag, name, code (reused for both sides).
  - `DirectionToggle.tsx` — IN/OUT (default OUT).
  - `EntityToggle.tsx` — Individual active, Company disabled with “Coming soon” label.
  - `AmountInput.tsx` — digits-only; stores **int**; shows local currency (from Sumsub country).
  - `ConvertedAmount.tsx` — read-only EUR value (rounded).

- **Results**
  - `SummaryStatusBar.tsx` — green✅/blue☑️/orange⚠️ per `compareFieldSets`.
  - `VaspRequirementsBlock.tsx` — titled card (blue for Sumsub, purple for Counterparty).
    - `RequirementGroup.tsx` — renders AND/OR groups, supports combo fields as a single chip.
    - `FieldPill.tsx` — individual field chip; unmatched = grey border; hover → scale + dashed if paired.
    - `VerificationFlags.tsx` — KYC/AML/Wallet tags (display-only).

**Styling**

- **Tailwind** classes only; smooth transitions via `transition`, `duration-150`, `ease-out`.
- Keep motion subtle; prefer accessible contrast; use focus-visible rings.

## 6) Composition & Data Flow

**Location:** `App.tsx`

**Flow (happy path):**

1. App reads static JSONs on load (via logic loaders).
2. User selects countries, direction (default OUT), enters **amount (int)**.
3. App derives:
   - Local currency from **Sumsub** country.
   - Converted EUR via `toEUR(amount, getCurrencyRate(localCurrency))` → **rounded**.
4. For **each side** (Sumsub & Counterparty):
   - `getRequirementSet(country, amount)` → `{ fields/groups, flags }`.
5. Build **normalized** sets + pairing map.
6. Render:
   - `SummaryStatusBar(compareFieldSets(applicant, counterparty))`.
   - Two `VaspRequirementsBlock` with lists and flags.
7. Hover on a field pill → look up pairing map → highlight peer(s) across.

## 7) Where To Change **X**

- **Threshold logic:** `/logic/getRequirementSet.ts`
- **Matching behavior / OR-group satisfaction:** `/logic/pairing.ts`
- **Summary color/outcome:** `/logic/compareFieldSets.ts` (then `SummaryStatusBar.tsx`)
- **Normalization:** `/logic/normalizeFieldName.ts` + `/data/fieldDictionary.json`
- **EUR conversion & rounding:** `/logic/currency.ts` + `/data/currencyRates.json`
- **Flags (KYC/AML/Wallet) display:** `VerificationFlags.tsx` (not part of comparison)
- **Add a new country:** `/data/requirements.json` (+ flag/name in `CountrySelect` source)
- **Disable/enable Company (future):** `EntityToggle.tsx` (UI) and add `company` branch in JSON + types
- **Direction labels (IN/OUT):** `DirectionToggle.tsx` (UI) + `App.tsx` labeling
- **Styling theme tokens:** Tailwind classes in components; optional CSS vars in `/styles`

## 8) Extension Points (v2+)

- **Company entity**
  - Add `company` branch to `CountryRule` in types & JSON.
  - Update `getRequirementSet` to branch on entity type.
- **Live exchange rates**
  - Replace `getCurrencyRate` with API-backed source; keep the same interface.
- **Debug/Dev Mode**
  - Optional panel to display raw JSON block and normalized view for each side.
- **More countries**
  - Append to `requirements.json`; prefer a small per-country file split if size grows.

## 9) Testing & Validation (MVP manual focus)

- Threshold edges: DEU (0 → always above); ZAF at 5,000 boundary.
- Direction swap: OUT vs IN only affects labels, **not** per-side evaluation.
- Matching: normalized names pair correctly; unmatched show grey borders.
- OR-groups: considered satisfied if **any** member matches.
- Amount: **int-only**; conversion uses **float** rate; EUR **rounded**.
- Accessibility: keyboardable inputs/toggles; visible focus outlines.

## 10) Naming & Conventions

- **Files:** `camelCase` for logic files, `PascalCase` for components.
- **Types:** `PascalCase` (`CountryRule`, `RequirementGroup`).
- **Functions:** pure, small, no JSX inside `/logic`.
- **No side effects** in helpers; pass data in, return data out.

## 11) Minimal Dependency Graph (text)

```
App.tsx
 ├─ useAppState (logic/useAppState.ts)
 ├─ getCountryRule, getCurrencyRate (logic/loadRequirements.ts, logic/getCurrencyRate.ts)
 ├─ getRequirementSet (logic/getRequirementSet.ts)
 │    └─ normalize (logic/normalizeFieldName.ts)
 ├─ pairing map (logic/pairing.ts)
 ├─ compareFieldSets (logic/compareFieldSets.ts)
 ├─ UI
 │   ├─ SummaryStatusBar
 │   ├─ VaspRequirementsBlock
 │   │   ├─ RequirementGroup
 │   │   ├─ FieldPill
 │   │   └─ VerificationFlags
 │   ├─ CountrySelect
 │   ├─ DirectionToggle
 │   ├─ EntityToggle
 │   └─ AmountInput + ConvertedAmount
 └─ styles (Tailwind)
```

**Source Data → Logic → UI** is strictly one-way:

- `/data` → `/logic` → `/components` → `App.tsx` composition.

## 12) Quick How-To

- **Add country:** update `/data/requirements.json`; add display entry for dropdown; done.
- **Add field alias:** update `/data/fieldDictionary.json`; normalization picks it up.
- **Change summary outcome rules:** edit `/logic/compareFieldSets.ts`.
- **Change hover behavior:** edit `/components/FieldPill.tsx` + reference pairing map.
- **Change conversion rounding:** edit `/logic/currency.ts`.

---

_This structure intentionally mirrors the PRD and task plan. Keep it updated when you add features (e.g., company logic, live rates, debug mode)._
