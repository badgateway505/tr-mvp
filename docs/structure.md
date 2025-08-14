# 📚 Project Structure — Travel Rule Calculator (MVP v1.0)

> **Purpose:** LLM-friendly map of the codebase. Use this file to quickly locate where logic lives, how data flows, and which module to modify. Mirrors the PRD and todo plan.

## 1) High-Level Map

```
/docs
  scope.md                    # Full PRD (source of truth for features)
  todo.md                     # Task plan with dependencies and completion status
  structure.md                # You are here — codebase map for humans & LLMs
  accessibility-implementation.md # Comprehensive accessibility documentation

/src
  /components                 # Pure UI (dumb) components with full accessibility
  /logic                      # Pure functions & app logic (no JSX), state, helpers
  /data                       # Static JSON data files (rules, rates, dictionary)
  /styles                     # Tailwind entry + global styles + theme system
  /types                      # TypeScript contracts for rules and logic
  App.tsx                     # Composition, page layout, wiring, accessibility
  main.tsx                    # React bootstrap (Vite entry)
```

## 2) Data Contracts & Types

**Location:** `/types/requirements.ts`

**Why:** Keep strict, explicit shapes to avoid runtime drift between JSON and UI.

**Core interfaces (implemented):**

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
  // company?: ...                              # v2 placeholder
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

- `requirements.json` — per-country rules (see scope.md examples for **DEU**/**ZAF**).
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
- `fieldNormalization.ts` — enhanced field normalization with combo field support.
  - `normalizeFields(fields: string[]): NormalizedField[]`
  - `fieldsMatch(field1: string, field2: string): boolean`
  - `findMatchingFields(fields1: string[], fields2: string[]): Array<...>`
  - `buildFieldPresenceMap(applicantFields, counterpartyFields): Map<string, { inApplicant: boolean, inCounterparty: boolean }>`
  - `isFieldPresentOnBothSides(normalizedField, presenceMap): boolean`
  - `buildComparableSets(applicantRequirements, counterpartyRequirements): ComparableSets`
  - `compareFieldSets(applicantRequirements, counterpartyRequirements, direction): ComplianceStatus`
- `useAppState.ts` — centralized state (minimal), e.g. with Zustand or `useReducer`.
  - State: `{ sumsubCountry, counterpartyCountry, direction, amount, entityType }`
  - Defaults: `direction='OUT'`, `entityType='individual'`
  - Amount guard: digits-only; store **int**.
- `requirementExtractor.ts` — compute requirement block **per side**.
  - Input: `(country: CountryCode, amount: number)`
  - Uses: `getCountryRule`, pick `above/below_threshold` (independent of other side)
  - Output: `{ fields: string[], groups?: RequirementGroup[], flags: Flags }`
  - `extractRequirements(countryCode, amount): ExtractedRequirements`
  - `getAllRequirements(countryCode): { below_threshold, above_threshold, threshold }`
- `thresholdUtils.ts` — threshold determination utilities.
  - `getThresholdBucket(countryCode, amount): ThresholdBucket`
  - `isAmountAboveThreshold(countryCode, amount): boolean`
  - `getCountryThreshold(countryCode): number`
- `currencyConversion.ts` — conversion helper with formatting.
  - `convertToEUR(amount: number, currencyCode: string): CurrencyConversion`
  - `getConversionSummary(amount, currencyCode): string`
  - `formatCurrency(amount, currencyCode): string`
- `currencyUtils.ts` — currency display and formatting utilities.
  - `getCurrencyForAmount(sumsubCountry): string`
  - `getCurrencySymbol(currencyCode): string`
  - `formatAmountWithCurrency(amount, currencyCode): string`
- `directionUtils.ts` — direction-based labeling utilities.
  - `getDirectionLabels(direction): { sender, receiver }`
  - `getSumsubLabel(direction): string`
  - `getCounterpartyLabel(direction): string`
- `amountValidation.ts` — amount input validation.
  - `validateAmount(input: string): number | null`
  - `formatAmount(amount: number): string`
  - `isDigitsOnly(input: string): boolean`

## 5) UI Components (Dumb/Pure Presentation with Full Accessibility)

**Location:** `/components`

- **Inputs**
  - `CountrySelect.tsx` — dropdown with flag, name, code (reused for both sides). **✅ Full accessibility with ARIA labels, validation states, and proper labeling.**
  - `DirectionToggle.tsx` — IN/OUT (default OUT). **✅ Full accessibility with keyboard navigation, ARIA roles, and focus management.**
  - `EntityToggle.tsx` — Individual active, Company disabled with "Coming soon" label. **✅ Full accessibility with proper ARIA states and keyboard support.**
  - `AmountInput.tsx` — digits-only; stores **int**; shows local currency (from Sumsub country). **✅ Full accessibility with label associations, validation states, and help text.**
  - `ConvertedAmount.tsx` — read-only EUR value (rounded). **✅ Full accessibility with region roles and proper descriptions.**

- **Results**
  - `VaspRequirementsBlock.tsx` — titled card (blue for Sumsub, purple for Counterparty). **✅ Full accessibility with landmark roles, proper heading structure, and semantic content organization.**
    - `RequirementGroup` — renders AND/OR groups, supports combo fields as a single chip. **✅ Full accessibility with group roles and satisfaction indicators.**
    - `FieldPill.tsx` — individual field chip; unmatched = grey border; hover → scale + dashed if paired. **✅ Full accessibility with button roles, keyboard navigation, and comprehensive ARIA labels.**
    - `VerificationFlags.tsx` — KYC/AML/Wallet tags (display-only). **✅ Full accessibility with list roles and proper labeling.**
  - `SummaryStatusBar.tsx` — compliance status indicator with color coding. **✅ Full accessibility with status roles and live updates.**

**Styling & Accessibility**

- **Tailwind** classes only; smooth transitions via `transition`, `duration-150`, `ease-out`.
- **Full accessibility** with ARIA attributes, keyboard navigation, and screen reader support.
- **Focus management** with visible focus rings via `focus:ring-2`, `focus:ring-offset-2`.
- **Semantic HTML** with proper roles, landmarks, and heading hierarchy.

## 6) Composition & Data Flow

**Location:** `App.tsx`

**Flow (happy path):**

1. App reads static JSONs on load (via logic loaders).
2. User selects countries, direction (default OUT), enters **amount (int)**.
3. App derives:
   - Local currency from **Sumsub** country.
   - Converted EUR via `convertToEUR(amount, getCurrencyRate(localCurrency))` → **rounded**.
4. For **each side** (Sumsub & Counterparty):
   - `extractRequirements(country, amount)` → `{ fields/groups, flags }`.
5. Build **normalized** sets + field matching.
6. Render:
   - Two `VaspRequirementsBlock` with lists and flags.
7. Hover on a field pill → look up pairing map → highlight peer(s) across.

**Accessibility Features:**
- Skip to main content link for keyboard users
- Proper landmark roles and semantic structure
- Comprehensive ARIA labeling and descriptions
- Full keyboard navigation support
- Screen reader friendly content organization

## 7) Where To Change **X**

- **Threshold logic:** `/logic/thresholdUtils.ts`
- **Matching behavior / OR-group satisfaction:** `/logic/fieldNormalization.ts`
- **Summary color/outcome:** `/logic/fieldNormalization.ts` → `compareFieldSets()`
- **Normalization:** `/logic/normalizeFieldName.ts` + `/data/fieldDictionary.json`
- **EUR conversion & rounding:** `/logic/currencyConversion.ts` + `/data/currencyRates.json`
- **Flags (KYC/AML/Wallet) display:** `VerificationFlags.tsx` (not part of comparison)
- **Add a new country:** `/data/requirements.json` (+ flag/name in `CountrySelect` source)
- **Disable/enable Company (future):** `EntityToggle.tsx` (UI) and add `company` branch in JSON + types
- **Direction labels (IN/OUT):** `DirectionToggle.tsx` (UI) + `App.tsx` labeling
- **Styling theme tokens:** Tailwind classes in components; optional CSS vars in `/styles`
- **Accessibility features:** All components have comprehensive accessibility implementations

## 8) Extension Points (v2+)

- **Company entity**
  - Add `company` branch to `CountryRule` in types & JSON.
  - Update `requirementExtractor` to branch on entity type.
- **Live exchange rates**
  - Replace `getCurrencyRate` with API-backed source; keep the same interface.
- **Debug/Dev Mode**
  - Optional panel to display raw JSON block and normalized view for each side.
- **More countries**
  - Append to `requirements.json`; prefer a small per-country file split if size grows.
- **Advanced accessibility**
  - Focus trapping for modals
  - Reduced motion support
  - High contrast themes
  - Voice navigation enhancements

## 9) Testing & Validation (Comprehensive coverage)

- **Threshold edges:** DEU (0 → always above); ZAF at 5,000 boundary.
- **Direction swap:** OUT vs IN only affects labels, **not** per-side evaluation.
- **Matching:** normalized names pair correctly; unmatched show grey borders.
- **OR-groups:** considered satisfied if **any** member matches.
- **Amount:** **int-only**; conversion uses **float** rate; EUR **rounded**.
- **Accessibility:** Comprehensive testing with 13 accessibility tests covering all features.
- **Integration:** Full test coverage for currency conversion, field matching, and UI components.

## 10) Naming & Conventions

- **Files:** `camelCase` for logic files, `PascalCase` for components.
- **Types:** `PascalCase` (`CountryRule`, `RequirementGroup`).
- **Functions:** pure, small, no JSX inside `/logic`.
- **No side effects** in helpers; pass data in, return data out.
- **Accessibility:** Consistent ARIA attribute naming and role assignments.

## 11) Minimal Dependency Graph (text)

```
App.tsx
 ├─ useAppState (logic/useAppState.ts)
 ├─ getCountryRule, getCurrencyRate (logic/loadRequirements.ts, logic/getCurrencyRate.ts)
 ├─ extractRequirements (logic/requirementExtractor.ts)
 │    └─ normalize (logic/normalizeFieldName.ts)
 ├─ field matching (logic/fieldNormalization.ts)
 ├─ threshold determination (logic/thresholdUtils.ts)
 ├─ currency conversion (logic/currencyConversion.ts)
 ├─ direction utilities (logic/directionUtils.ts)
 ├─ amount validation (logic/amountValidation.ts)
 ├─ currency utilities (logic/currencyUtils.ts)
 ├─ UI (with full accessibility)
 │   ├─ VaspRequirementsBlock
 │   │   ├─ RequirementGroup
 │   │   ├─ FieldPill
 │   │   └─ VerificationFlags
 │   ├─ CountrySelect
 │   ├─ DirectionToggle
 │   ├─ EntityToggle
 │   └─ AmountInput + ConvertedAmount
 └─ styles (Tailwind + accessibility)
```

**Source Data → Logic → UI** is strictly one-way:

- `/data` → `/logic` → `/components` → `App.tsx` composition.

## 12) Quick How-To

- **Add country:** update `/data/requirements.json`; add display entry for dropdown; done.
- **Add field alias:** update `/data/fieldDictionary.json`; normalization picks it up.
- **Change summary outcome rules:** edit `/logic/fieldNormalization.ts` → `compareFieldSets()`.
- **Change hover behavior:** edit `/components/FieldPill.tsx` + reference pairing map.
- **Change conversion rounding:** edit `/logic/currencyConversion.ts`.
- **Modify accessibility:** all components have comprehensive accessibility implementations with proper ARIA attributes.

## 13) Implementation Status

**✅ Fully Implemented:**

- Core data loading and validation
- Threshold determination logic
- Requirement extraction for both sides
- Field normalization with combo field support
- Currency conversion and formatting
- Direction-based labeling
- Amount validation
- All UI components with comprehensive accessibility
- Field matching logic with pairing visualization
- Summary status comparison and display
- Responsive design and animations
- Comprehensive accessibility features (Task 10.5)
- Full test coverage for all functionality

**🚧 Partially Implemented:**

- None - all planned features are fully implemented

**❌ Not Yet Implemented:**

- Company entity support (planned for v2)
- Live exchange rates (planned for v2)
- Debug/development mode (planned for v2)

---

## 14) Accessibility Implementation (Task 10.5 - COMPLETED)

**✅ Comprehensive Accessibility Features Implemented:**

### Core Accessibility
- **Skip to main content link** for keyboard users
- **Semantic HTML structure** with proper landmarks
- **ARIA attributes** throughout all components
- **Keyboard navigation** with Enter/Space key support
- **Focus management** with visible focus rings
- **Screen reader support** with comprehensive labeling

### Component-Specific Accessibility
- **Form components**: Proper label associations, validation states, help text
- **Interactive elements**: Button roles, state management, keyboard support
- **Data display**: List roles, region roles, proper heading hierarchy
- **Status updates**: Live regions for dynamic content

### Testing & Validation
- **13 comprehensive accessibility tests** covering all features
- **All tests passing** ✅
- **WCAG 2.1 AA compliance** for basic accessibility
- **Cross-browser and assistive technology** compatibility

---

_This structure reflects the current implementation state. All planned features for MVP v1.0 have been implemented, including comprehensive accessibility support. The codebase is production-ready with full test coverage and accessibility compliance._
