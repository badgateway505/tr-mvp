# Field Presence Map (Task 7.2)

## Overview

The Field Presence Map functionality provides a way to determine which normalized fields are present on each side (applicant and counterparty) of a VASP comparison. This is essential for understanding field coverage and compliance between two VASPs.

## Functions

### `buildFieldPresenceMap(applicantFields, counterpartyFields)`

Creates a map showing which normalized fields exist on each side.

**Parameters:**

- `applicantFields: string[]` - Raw field names from the applicant side
- `counterpartyFields: string[]` - Raw field names from the counterparty side

**Returns:**

- `Map<string, { inApplicant: boolean, inCounterparty: boolean }>`

**Example:**

```typescript
const applicantFields = ['passportNumber', 'dateOfBirth'];
const counterpartyFields = ['idDocumentNumber', 'dateOfBirth'];

const presenceMap = buildFieldPresenceMap(applicantFields, counterpartyFields);

// Result:
// Map {
//   'id_document_number' => { inApplicant: true, inCounterparty: true },
//   'date_of_birth' => { inApplicant: true, inCounterparty: true }
// }
```

### `isFieldPresentOnBothSides(normalizedField, presenceMap)`

Checks if a specific normalized field is present on both sides.

**Parameters:**

- `normalizedField: string` - The normalized field name to check
- `presenceMap: Map<string, { inApplicant: boolean, inCounterparty: boolean }>` - The presence map

**Returns:**

- `boolean` - True if the field is present on both sides

**Example:**

```typescript
const isPresent = isFieldPresentOnBothSides('id_document_number', presenceMap);
// Returns true if both sides have this field
```

### `getFieldPresenceMap(comparableSets)`

Helper function to extract the field presence map from the result of `buildComparableSets`.

**Parameters:**

- `comparableSets: ReturnType<typeof buildComparableSets>` - Result from buildComparableSets function

**Returns:**

- `Map<string, { inApplicant: boolean, inCounterparty: boolean }>`

## Integration with buildComparableSets

The `buildComparableSets` function now also returns a `fieldPresenceMap` property, making it easy to access this information:

```typescript
const result = buildComparableSets(
  applicantRequirements,
  counterpartyRequirements
);

// Access the field presence map
const presenceMap = result.fieldPresenceMap;

// Or use the helper function
const presenceMap = getFieldPresenceMap(result);
```

## Use Cases

1. **Field Coverage Analysis**: Determine which fields are required by both VASPs
2. **Compliance Checking**: Identify fields that are missing on one side
3. **Hover Interactions**: Power field pill highlighting when hovering over matched fields
4. **Summary Status**: Determine if VASPs are in compliance, over-compliant, or under-compliant

## Field Normalization

The system automatically normalizes field names using the `fieldDictionary.json` mapping:

```json
{
  "passportNumber": "id_document_number",
  "idDocumentNumber": "id_document_number",
  "dateOfBirth": "date_of_birth",
  "fullName": "full_name"
}
```

Fields that don't have explicit mappings are kept as-is during normalization.

## Testing

The functionality is thoroughly tested in `src/logic/__tests__/fieldNormalization.test.ts` with test cases covering:

- Fields present on both sides
- Fields present on only one side
- Boolean presence checking
- Integration with buildComparableSets

## Next Steps

This functionality enables the next task (7.3) which will implement hover synchronization between VASP blocks, using the presence map to determine which fields should highlight each other.
