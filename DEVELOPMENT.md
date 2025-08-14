# Development Guide

This guide provides detailed instructions for developers working on the Travel Rule Calculator MVP.

## 🏗️ Architecture Overview

The application follows a clean architecture pattern with clear separation of concerns:

- **`/src/components/`** - Pure UI components (no business logic)
- **`/src/logic/`** - Pure business logic functions (no UI dependencies)
- **`/src/data/`** - Static JSON configuration files
- **`/src/types/`** - TypeScript type definitions
- **`/src/styles/`** - Tailwind CSS and theme configuration

## 🔧 Adding New Countries

### Step 1: Add Country Requirements

Edit `/src/data/requirements.json` to add your new country:

```json
{
  "USA": {
    "currency": "USD",
    "threshold": 3000,
    "individual": {
      "below_threshold": {
        "required_fields": ["full_name", "date_of_birth"],
        "kyc_required": false,
        "aml_required": false,
        "wallet_attribution": false
      },
      "above_threshold": {
        "required_fields": ["full_name", "date_of_birth", "id_document_number", "address"],
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
- **Logic groups:** Use `requirement_groups` for complex AND/OR logic

**Complex Requirements Example:**
```json
"above_threshold": {
  "requirement_groups": [
    {
      "logic": "AND",
      "fields": ["full_name", "date_of_birth"]
    },
    {
      "logic": "OR", 
      "fields": ["passport_number", "national_id", "drivers_license"]
    }
  ],
  "kyc_required": true,
  "aml_required": true,
  "wallet_attribution": true
}
```

### Step 2: Add Currency Rate

Edit `/src/data/currencyRates.json` to add the exchange rate:

```json
{
  "EUR": 1.0,
  "USD": 0.85,
  "ZAR": 0.05
}
```

**Important:** Rates are relative to EUR (EUR = 1.0). The app converts all amounts to EUR for threshold comparison.

### Step 3: Add Field Mappings (Optional)

If your country uses custom field names, add them to `/src/data/fieldDictionary.json`:

```json
{
  "passportNumber": "id_document_number",
  "nationalId": "id_document_number",
  "dob + pob": "date_of_birth + birthplace"
}
```

## 📊 Understanding the Data Flow

### 1. Country Selection
```typescript
// User selects country → App loads country rule
const countryRule = getCountryRule('USA');
```

### 2. Amount Processing
```typescript
// User enters amount → App converts to EUR
const conversion = convertToEUR(1500, 'USD');
// Result: { originalAmount: 1500, eurAmount: 1275, ... }
```

### 3. Threshold Determination
```typescript
// App determines which threshold bucket applies
const bucket = getThresholdBucket('USA', 1500);
// Result: 'below_threshold' (1500 < 3000)
```

### 4. Requirements Extraction
```typescript
// App extracts requirements for the threshold bucket
const requirements = extractRequirements('USA', 1500);
// Result: { fields: ['full_name', 'date_of_birth'], ... }
```

## 🧪 Testing New Countries

### Unit Tests
```bash
# Test specific country logic
npm test -- --grep "USA"

# Test currency conversion
npm test -- --grep "currencyConversion"
```

### Manual Testing
1. Add your country to the JSON files
2. Start the dev server: `npm run dev`
3. Select your country and test different amounts
4. Verify threshold logic works correctly
5. Check that requirements display properly

## 🔍 Debugging Common Issues

### Issue: Country Not Appearing in Dropdown
**Check:**
- Country code is added to `requirements.json`
- Country code follows ISO 3166-1 alpha-3 format (e.g., 'USA', 'DEU')
- No syntax errors in JSON file

### Issue: Currency Conversion Failing
**Check:**
- Currency code matches between `requirements.json` and `currencyRates.json`
- Exchange rate is a valid number
- No typos in currency codes

### Issue: Requirements Not Displaying
**Check:**
- Country rule structure is valid
- Required fields array exists and contains valid field names
- No missing required properties (kyc_required, aml_required, etc.)

### Issue: Field Matching Not Working
**Check:**
- Field names in `fieldDictionary.json` are correct
- Normalized field names match between requirements
- Combo fields use proper ` + ` separator

## 📝 Code Style Guidelines

### JSDoc Comments
All exported functions should have comprehensive JSDoc comments:

```typescript
/**
 * Brief description of what the function does
 * 
 * @param paramName - Description of the parameter
 * @param anotherParam - Description of another parameter
 * @returns Description of what the function returns
 * 
 * @example
 * ```typescript
 * const result = functionName('value', 123);
 * ```
 */
export function functionName(paramName: string, anotherParam: number): string {
  // Implementation
}
```

### Type Safety
- Always use TypeScript interfaces for data structures
- Avoid `any` type - use proper typing
- Use union types for finite sets of values
- Export types that other modules might need

### Error Handling
- Return `undefined` or `null` for missing data rather than throwing errors
- Use optional chaining (`?.`) and nullish coalescing (`??`)
- Log warnings for recoverable errors
- Validate input data early in function chains

## 🚀 Performance Considerations

### Memoization
- Use `useMemo` for expensive calculations in React components
- Cache results of pure functions when called repeatedly
- Avoid recreating objects/arrays in render cycles

### Data Loading
- Load JSON data once at startup (already implemented)
- Use static imports for configuration files
- Consider lazy loading for large datasets in future versions

## 🔒 Security Notes

- **Never hardcode API keys or secrets** - use environment variables
- **Validate all user input** - especially amount fields
- **Sanitize data** before displaying in UI
- **Use HTTPS** in production for any API calls

## 📚 Additional Resources

- **`/docs/scope.md`** - Full Product Requirements Document
- **`/docs/structure.md`** - Detailed codebase architecture
- **`/docs/accessibility-implementation.md`** - Accessibility guidelines
- **`/docs/todo.md`** - Development task list and progress

## 🤝 Contributing

1. **Create a feature branch** from `main`
2. **Follow the coding standards** outlined above
3. **Add comprehensive tests** for new functionality
4. **Update documentation** for any new features
5. **Submit a pull request** with clear description of changes

## 🐛 Reporting Issues

When reporting bugs or issues:

1. **Describe the expected behavior**
2. **Describe the actual behavior**
3. **Include steps to reproduce**
4. **Provide browser/OS information**
5. **Include any error messages from console**
6. **Attach relevant screenshots if applicable**
