# 🧾 Product Requirements Document (PRD)

**Project:** Travel Rule Calculator Web App
**Version:** MVP v1.0
**Author:** badgateway
**Use:** Internal tool for prototyping and validation

---

## 🎯 Goal

A standalone web application that simulates and compares FATF Travel Rule data-sharing requirements between two VASPs (Virtual Asset Service Providers), based on their jurisdictions, transaction direction, and transaction amount.

---

## 🧑‍💼 Target Audience

- Internal compliance, product, and solution engineers at Sumsub
- Potential external VASP clients in future versions
- MVP is a **pet project**, built quickly, standalone, without backend or external APIs

---

## 🖼 User Interface Overview

### Inputs:

| Field                     | Type              | Details                                                                |
| ------------------------- | ----------------- | ---------------------------------------------------------------------- |
| Sumsub VASP Country       | Dropdown          | Shows flag, name, and 3-letter code (e.g., 🇩🇪 Germany (DEU))           |
| Counterparty VASP Country | Dropdown          | Same as above                                                          |
| Direction                 | Toggle (2-way)    | `IN` / `OUT`, default is `OUT`                                         |
| Entity Type               | Toggle (disabled) | Fixed to `Individual`, toggle shows "Company — coming soon" (disabled) |
| Amount                    | Numeric input     | Integer only, in local currency of Sumsub VASP                         |
| Converted Amount          | Read-only float   | Converts amount to EUR using static `currencyRates.json`               |

---

## 📦 Business Logic

### Requirement Lookup:

- Each country’s rule is defined in a **JSON file**
- The app supports:
  - `threshold`-based logic (e.g., above/below 5000 ZAR)
  - Different rules for `individual` and `company` (MVP = only `individual`)
  - Optional AND/OR groupings of required fields
  - Field-level flags for:
    - `kyc_required`
    - `aml_required`
    - `wallet_attribution`

```json
{
  "ZAF": {
    "currency": "ZAR",
    "threshold": 5000,
    "individual": {
      "above_threshold": {
        "required_fields": [...],
        "kyc_required": true
      }
    }
  }
}
```

---

### Direction Logic:

- `OUT` (default) → Sumsub VASP is **sender**
- `IN` → Sumsub VASP is **receiver**
- Both sides (Sumsub and Counterparty) are evaluated **independently**

---

### Field Matching:

- Each VASP's requirement is rendered in its own **block**:
  - Sumsub VASP → **blue**
  - Counterparty VASP → **purple**

- Each required field:
  - Uses a **normalized name** via `fieldDictionary.json`
  - Hovering a field shows:
    - **Dashed border + slight scale** if a match is found on the other side
    - **Grey border** if unmatched

  - Combo fields like `"date_of_birth + birthplace"` treated as one unit

---

## 📊 Summary Indicator

Positioned above both VASP blocks. Color-coded block showing one of:

| Case               | Color  | Icon | Message                                                         |
| ------------------ | ------ | ---- | --------------------------------------------------------------- |
| Requirements Match | Green  | ✅   | Requirements match on both sides                                |
| Overcompliance     | Blue   | ☑️   | Sender shares more than receiver requires                       |
| Undercompliance    | Orange | ⚠️   | Receiver expects more than sender provides (may block transfer) |

- Evaluation based only on **required fields**
- KYC/AML/Wallet checks are displayed, not compared

---

## 📁 Data Files

- `requirements.json`: rules for each country
- `currencyRates.json`: static mapping for currency → EUR (e.g., ZAR → 0.05)
- `fieldDictionary.json`: maps raw field names to standard names

```json
{
  "passportNumber": "id_document_number",
  "dob + pob": "date_of_birth + birthplace"
}
```

---

## 🎨 Design & UX Guidelines

- Framework: React + Vite + TypeScript
- Styling: Tailwind CSS (with transitions and hover effects)
- Smooth interactions: scale, border transitions, tooltips
- Layout: responsive, mobile-friendly optional but not required
- Readable, sectioned, and commented code (easy for handoff)
- Easily extendable data model (new countries, rules, currencies)

---

## 🔥 Out of Scope for MVP

- Company entity logic (disabled toggle, shows "coming soon")
- Real-time exchange rates (planned in v2.0)
- External APIs or backend
- Debug/dev mode (raw JSON view etc.)

---

## ✅ MVP Acceptance Criteria

- All logic covered: direction, thresholds, requirement sets
- Field hover matches with normalization
- EUR conversion shown with `Math.round()`
- Summary indicator changes based on compliance scenario
- Usable, responsive interface with Tailwind styling and animations
- Static JSONs drive everything — no hardcoding inside logic
