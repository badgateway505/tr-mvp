# Travel Rule Calculator MVP

A React-based application for calculating Travel Rule compliance requirements based on transaction amounts and country-specific regulations.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
npm install
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production
```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
/src
  /components          # UI components (AmountInput, CountrySelect, etc.)
  /logic              # Business logic and utility functions
  /data               # Static JSON configuration files
  /types              # TypeScript type definitions
  /styles             # Tailwind CSS and theme configuration
```

## 🔧 Configuration

### Adding/Editing Country Requirements

Edit `/src/data/requirements.json` to modify country-specific rules:

```json
{
  "DEU": {
    "currency": "EUR",
    "threshold": 1000,
    "individual": {
      "below_threshold": {
        "required_fields": ["full_name", "date_of_birth"],
        "kyc_required": false,
        "aml_required": false,
        "wallet_attribution": false
      },
      "above_threshold": {
        "required_fields": ["full_name", "date_of_birth", "id_document_number"],
        "kyc_required": true,
        "aml_required": true,
        "wallet_attribution": true
      }
    }
  }
}
```

**Field Types:**
- **Simple fields:** `"full_name"`, `"date_of_birth"`
- **Combined fields:** `"date_of_birth + birthplace"` (treated as one unit)
- **Logic groups:** Use `requirement_groups` with AND/OR logic for complex rules

### Adding New Countries

1. **Add country code** to `/src/data/requirements.json`
2. **Add currency rate** to `/src/data/currencyRates.json`
3. **Add field mappings** to `/src/data/fieldDictionary.json` if using custom field names

Example for adding South Africa:
```json
// requirements.json
"ZAF": {
  "currency": "ZAR",
  "threshold": 15000,
  "individual": { ... }
}

// currencyRates.json  
"ZAR": 0.05

// fieldDictionary.json
"passportNumber": "id_document_number"
```

### Currency Rates

Edit `/src/data/currencyRates.json` to update exchange rates:

```json
{
  "EUR": 1.0,
  "ZAR": 0.05,
  "USD": 0.85
}
```

**Note:** Rates are relative to EUR (EUR = 1.0). The app converts all amounts to EUR for threshold comparison.

### Field Dictionary

The `/src/data/fieldDictionary.json` maps user-friendly field names to canonical internal names:

```json
{
  "passportNumber": "id_document_number",
  "dob + pob": "date_of_birth + birthplace",
  "fullName": "full_name"
}
```

## 🧪 Testing

```bash
npm run test          # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

## 🎨 Styling

The app uses Tailwind CSS with a custom theme system:

- **Theme variables:** `/src/styles/theme-variables.css`
- **Theme utilities:** `/src/styles/theme-utils.ts`
- **Component styles:** Tailwind classes + custom CSS in component files

## 📚 Key Features

- **Amount-based threshold logic:** Different requirements above/below country thresholds
- **Multi-currency support:** Automatic conversion to EUR for compliance checking
- **Flexible field requirements:** Support for simple fields, combined fields, and logic groups
- **Accessibility-first:** WCAG 2.1 AA compliant with proper ARIA labels and keyboard navigation
- **Responsive design:** Mobile-first approach with Tailwind CSS

## 🔍 How It Works

1. **User selects country** → App loads country-specific rules
2. **User enters amount** → App converts to EUR using static rates
3. **App determines threshold** → Below/above threshold logic applied
4. **Requirements displayed** → Fields, KYC, AML, and wallet attribution requirements shown
5. **Field validation** → User can mark fields as present/absent
6. **Compliance status** → Real-time updates based on field presence and logic

## 🚧 Development Notes

- **State management:** Uses React hooks with custom `useAppState` hook
- **Type safety:** Full TypeScript implementation with strict type checking
- **Performance:** Memoized calculations and efficient re-renders
- **Testing:** Comprehensive test coverage for logic and components

## 📖 Documentation

- **`/docs/scope.md`** - Full Product Requirements Document
- **`/docs/structure.md`** - Codebase architecture and data flow
- **`/docs/accessibility-implementation.md`** - Accessibility compliance details
- **`/docs/todo.md`** - Development task list and progress
