import { useState } from 'react';
import { useAppState } from './logic/useAppState';
import { getDirectionLabels, getSumsubLabel, getCounterpartyLabel } from './logic/directionUtils';
import { getThresholdBucket } from './logic/thresholdUtils';
import { extractRequirements } from './logic/requirementExtractor';
import { normalizeFields, fieldsMatch, buildComparableSets } from './logic/fieldNormalization';
import { convertToEUR, getConversionSummary } from './logic/currencyConversion';
import { getCountryRule } from './logic/loadRequirements';
import { VaspRequirementsBlock } from './components/VaspRequirementsBlock';
import './App.css';

function App() {
  const { 
    sumsubCountry, 
    counterpartyCountry, 
    direction, 
    amount, 
    setSumsubCountry, 
    setCounterpartyCountry, 
    setDirection, 
    setAmount 
  } = useAppState();

  const [testResults, setTestResults] = useState<string[]>([]);
  // Add hover state for field sync
  const [hoveredField, setHoveredField] = useState<string | null>(null);

  // Extract requirements for both sides
  const sumsubRequirements = sumsubCountry && amount > 0 ? extractRequirements(sumsubCountry, amount) : undefined;
  const counterpartyRequirements = counterpartyCountry && amount > 0 ? extractRequirements(counterpartyCountry, amount) : undefined;

  // Build comparable sets and field pairings for task 7.1
  const comparableSets = (sumsubRequirements && counterpartyRequirements) 
    ? buildComparableSets(sumsubRequirements, counterpartyRequirements)
    : undefined;

  // Handle field hover for sync between blocks
  const handleFieldHover = (field: string, isHovering: boolean) => {
    if (isHovering) {
      setHoveredField(field);
    } else {
      setHoveredField(null);
    }
  };

  const runSection4Tests = () => {
    const results: string[] = [];
    
    try {
      // Test 4.1: Direction logic
      const labels = getDirectionLabels(direction);
      results.push(`✅ 4.1 Direction: ${labels.sender} → ${labels.receiver}`);
      results.push(`   Sumsub: ${getSumsubLabel(direction)}, Counterparty: ${getCounterpartyLabel(direction)}`);

      if (sumsubCountry && counterpartyCountry && amount > 0) {
        // Test 4.2: Threshold buckets
        const sumsubBucket = getThresholdBucket(sumsubCountry, amount);
        const counterpartyBucket = getThresholdBucket(counterpartyCountry, amount);
        results.push(`✅ 4.2 Threshold: Sumsub=${sumsubBucket}, Counterparty=${counterpartyBucket}`);

        // Test 4.3: Extract requirements
        const sumsubReqs = extractRequirements(sumsubCountry, amount);
        const counterpartyReqs = extractRequirements(counterpartyCountry, amount);
        results.push(`✅ 4.3 Requirements: Sumsub=${sumsubReqs?.fields.length || 0} fields, Counterparty=${counterpartyReqs?.fields.length || 0} fields`);

        // Test 4.4: Field normalization
        if (sumsubReqs && counterpartyReqs) {
          const sumsubNormalized = normalizeFields(sumsubReqs.fields);
          const counterpartyNormalized = normalizeFields(counterpartyReqs.fields);
          results.push(`✅ 4.4 Normalization: Sumsub=${sumsubNormalized.length} normalized, Counterparty=${counterpartyNormalized.length} normalized`);

          // Test field matching
          if (sumsubReqs.fields.length > 0 && counterpartyReqs.fields.length > 0) {
            const match = fieldsMatch(sumsubReqs.fields[0], counterpartyReqs.fields[0]);
            results.push(`   Field matching: ${sumsubReqs.fields[0]} ↔ ${counterpartyReqs.fields[0]} = ${match}`);
          }
        }

        // Test 4.5: Currency conversion
        if (sumsubCountry) {
          const countryRule = getCountryRule(sumsubCountry);
          if (countryRule) {
            const conversion = convertToEUR(amount, countryRule.currency);
            const summary = getConversionSummary(amount, countryRule.currency);
            results.push(`✅ 4.5 Conversion: ${summary}`);
            results.push(`   Rate: ${countryRule.currency} → EUR = ${conversion?.exchangeRate}`);
          }
        }

        // Test 7.1: Comparable sets and OR-group satisfaction
        if (comparableSets) {
          results.push(`✅ 7.1 Comparable Sets: ${comparableSets.totalMatches} total matches`);
          results.push(`   Applicant fields: ${comparableSets.applicantFields.length}, Counterparty fields: ${comparableSets.counterpartyFields.length}`);
          results.push(`   Applicant groups: ${comparableSets.applicantGroups.length}, Counterparty groups: ${comparableSets.counterpartyGroups.length}`);
          
          // Show OR-group satisfaction details
          const applicantOrGroups = comparableSets.applicantGroups.filter(([_, group]) => group.logic === 'OR');
          const counterpartyOrGroups = comparableSets.counterpartyGroups.filter(([_, group]) => group.logic === 'OR');
          
          if (applicantOrGroups.length > 0) {
            const satisfiedOrGroups = applicantOrGroups.filter(([_, group]) => group.satisfied);
            results.push(`   Applicant OR groups: ${satisfiedOrGroups.length}/${applicantOrGroups.length} satisfied`);
          }
          
          if (counterpartyOrGroups.length > 0) {
            const satisfiedOrGroups = counterpartyOrGroups.filter(([_, group]) => group.satisfied);
            results.push(`   Counterparty OR groups: ${satisfiedOrGroups.length}/${counterpartyOrGroups.length} satisfied`);
          }
        }
      } else {
        results.push('⚠️ Set countries and amount to test full functionality');
      }
    } catch (error) {
      results.push(`❌ Error: ${error}`);
    }

    setTestResults(results);
  };

  return (
    <div className="App p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Travel Rule Calculator - Section 4 Integration</h1>
      
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">Sumsub Country</label>
          <select 
            value={sumsubCountry} 
            onChange={(e) => setSumsubCountry(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Select country</option>
            <option value="DEU">Germany (EUR)</option>
            <option value="ZAF">South Africa (ZAR)</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Counterparty Country</label>
          <select 
            value={counterpartyCountry} 
            onChange={(e) => setCounterpartyCountry(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Select country</option>
            <option value="DEU">Germany (EUR)</option>
            <option value="ZAF">South Africa (ZAR)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">Direction</label>
          <select 
            value={direction} 
            onChange={(e) => setDirection(e.target.value as 'IN' | 'OUT')}
            className="w-full p-2 border rounded"
          >
            <option value="OUT">OUT (Sumsub = Sender)</option>
            <option value="IN">IN (Sumsub = Receiver)</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Amount</label>
          <input 
            type="number" 
            value={amount || ''} 
            onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
            placeholder="Enter amount"
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      <button 
        onClick={runSection4Tests}
        className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 mb-6"
      >
        Test Section 4 Integration
      </button>

      {/* Requirements Display */}
      {(sumsubRequirements || counterpartyRequirements) && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Requirements Display</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {sumsubRequirements && (
              <VaspRequirementsBlock
                roleLabel={getSumsubLabel(direction)}
                colorTheme="blue"
                requirements={sumsubRequirements}
                comparableSets={comparableSets}
                hoveredField={hoveredField}
                onFieldHover={handleFieldHover}
              />
            )}
            {counterpartyRequirements && (
              <VaspRequirementsBlock
                roleLabel={getCounterpartyLabel(direction)}
                colorTheme="purple"
                requirements={counterpartyRequirements}
                comparableSets={comparableSets}
                hoveredField={hoveredField}
                onFieldHover={handleFieldHover}
              />
            )}
          </div>
        </div>
      )}

      {testResults.length > 0 && (
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Test Results:</h3>
          {testResults.map((result, index) => (
            <div key={index} className="text-sm mb-1 font-mono">{result}</div>
          ))}
        </div>
      )}

      <div className="mt-8 text-sm text-gray-600">
        <h3 className="font-semibold mb-2">Test Scenarios:</h3>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>DEU + EUR 0:</strong> Should show above_threshold (threshold = 0)</li>
          <li><strong>ZAF + ZAR 4999:</strong> Should show below_threshold (threshold = 5000)</li>
          <li><strong>ZAF + ZAR 5000:</strong> Should show above_threshold with requirement groups</li>
          <li><strong>Direction IN/OUT:</strong> Should swap sender/receiver labels</li>
        </ul>
      </div>
    </div>
  );
}

export default App;
