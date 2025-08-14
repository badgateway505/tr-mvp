/**
 * Demonstration of the Field Presence Map functionality (Task 7.2)
 * 
 * This example shows how the buildFieldPresenceMap function works
 * to create a map showing which normalized fields exist on each side.
 */

import { buildFieldPresenceMap, isFieldPresentOnBothSides } from '../src/logic/fieldNormalization';

// Example field sets from two VASPs
const applicantFields = [
  'passportNumber',        // normalizes to 'id_document_number'
  'dateOfBirth',          // normalizes to 'date_of_birth'
  'fullName',             // normalizes to 'full_name'
  'residentialAddress'     // normalizes to 'residential_address'
];

const counterpartyFields = [
  'idDocumentNumber',      // normalizes to 'id_document_number'
  'dateOfBirth',          // normalizes to 'date_of_birth'
  'full_name',            // already normalized
  'walletAddress'          // no normalization mapping
];

console.log('=== Field Presence Map Demo ===\n');

// Build the presence map
const presenceMap = buildFieldPresenceMap(applicantFields, counterpartyFields);

console.log('Field Presence Map:');
console.log('===================');

// Display the presence map
for (const [normalizedField, presence] of presenceMap) {
  const applicantStatus = presence.inApplicant ? '✅' : '❌';
  const counterpartyStatus = presence.inCounterparty ? '✅' : '❌';
  
  console.log(`${normalizedField}:`);
  console.log(`  Applicant side: ${applicantStatus}`);
  console.log(`  Counterparty side: ${counterpartyStatus}`);
  console.log(`  Present on both: ${isFieldPresentOnBothSides(normalizedField, presenceMap) ? '✅' : '❌'}`);
  console.log('');
}

console.log('Summary:');
console.log('========');
const fieldsOnBothSides = Array.from(presenceMap.entries())
  .filter(([, presence]) => presence.inApplicant && presence.inCounterparty)
  .map(([field]) => field);

const fieldsOnlyOnApplicant = Array.from(presenceMap.entries())
  .filter(([, presence]) => presence.inApplicant && !presence.inCounterparty)
  .map(([field]) => field);

const fieldsOnlyOnCounterparty = Array.from(presenceMap.entries())
  .filter(([, presence]) => !presence.inApplicant && presence.inCounterparty)
  .map(([field]) => field);

console.log(`Fields present on both sides: ${fieldsOnBothSides.join(', ')}`);
console.log(`Fields only on applicant side: ${fieldsOnlyOnApplicant.join(', ')}`);
console.log(`Fields only on counterparty side: ${fieldsOnlyOnCounterparty.join(', ')}`);
console.log(`Total unique normalized fields: ${presenceMap.size}`);

export { buildFieldPresenceMap, isFieldPresentOnBothSides };
