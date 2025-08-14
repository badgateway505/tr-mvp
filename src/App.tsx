import { useState } from 'react';
import { useAppState } from './logic/useAppState';
import {
  getDirectionLabels,
  getSumsubLabel,
  getCounterpartyLabel,
} from './logic/directionUtils';
import { getThresholdBucket } from './logic/thresholdUtils';
import { extractRequirements } from './logic/requirementExtractor';
import {
  normalizeFields,
  fieldsMatch,
  buildComparableSets,
} from './logic/fieldNormalization';
import { convertToEUR, getConversionSummary } from './logic/currencyConversion';
import { getCountryRule } from './logic/loadRequirements';
import { VaspRequirementsBlock } from './components/VaspRequirementsBlock';
import { SummaryStatusBar } from './components/SummaryStatusBar';
import { ConvertedAmount } from './components/ConvertedAmount';
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
    setAmount,
  } = useAppState();

  const [testResults, setTestResults] = useState<string[]>([]);
  // Add hover state for field sync
  const [hoveredField, setHoveredField] = useState<string | null>(null);

  // Extract requirements for both sides
  const sumsubRequirements =
    sumsubCountry && amount > 0
      ? extractRequirements(sumsubCountry, amount)
      : undefined;
  const counterpartyRequirements =
    counterpartyCountry && amount > 0
      ? extractRequirements(counterpartyCountry, amount)
      : undefined;

  // Build comparable sets and field pairings for task 7.1
  const comparableSets =
    sumsubRequirements && counterpartyRequirements
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
      results.push(
        `   Sumsub: ${getSumsubLabel(direction)}, Counterparty: ${getCounterpartyLabel(direction)}`
      );

      if (sumsubCountry && counterpartyCountry && amount > 0) {
        // Test 4.2: Threshold buckets
        const sumsubBucket = getThresholdBucket(sumsubCountry, amount);
        const counterpartyBucket = getThresholdBucket(
          counterpartyCountry,
          amount
        );
        results.push(
          `✅ 4.2 Threshold: Sumsub=${sumsubBucket}, Counterparty=${counterpartyBucket}`
        );

        // Test 4.3: Extract requirements
        const sumsubReqs = extractRequirements(sumsubCountry, amount);
        const counterpartyReqs = extractRequirements(
          counterpartyCountry,
          amount
        );
        results.push(
          `✅ 4.3 Requirements: Sumsub=${sumsubReqs?.fields.length || 0} fields, Counterparty=${counterpartyReqs?.fields.length || 0} fields`
        );

        // Test 4.4: Field normalization
        if (sumsubReqs && counterpartyReqs) {
          const sumsubNormalized = normalizeFields(sumsubReqs.fields);
          const counterpartyNormalized = normalizeFields(
            counterpartyReqs.fields
          );
          results.push(
            `✅ 4.4 Normalization: Sumsub=${sumsubNormalized.length} normalized, Counterparty=${counterpartyNormalized.length} normalized`
          );

          // Test field matching
          if (
            sumsubReqs.fields.length > 0 &&
            counterpartyReqs.fields.length > 0
          ) {
            const match = fieldsMatch(
              sumsubReqs.fields[0],
              counterpartyReqs.fields[0]
            );
            results.push(
              `   Field matching: ${sumsubReqs.fields[0]} ↔ ${counterpartyReqs.fields[0]} = ${match}`
            );
          }
        }

        // Test 4.5: Currency conversion
        if (sumsubCountry) {
          const countryRule = getCountryRule(sumsubCountry);
          if (countryRule) {
            const conversion = convertToEUR(amount, countryRule.currency);
            const summary = getConversionSummary(amount, countryRule.currency);
            results.push(`✅ 4.5 Conversion: ${summary}`);
            results.push(
              `   Rate: ${countryRule.currency} → EUR = ${conversion?.exchangeRate}`
            );
          }
        }

        // Test 7.1: Comparable sets and OR-group satisfaction
        if (comparableSets) {
          results.push(
            `✅ 7.1 Comparable Sets: ${comparableSets.totalMatches} total matches`
          );
          results.push(
            `   Applicant fields: ${comparableSets.applicantFields.length}, Counterparty fields: ${comparableSets.counterpartyFields.length}`
          );
          results.push(
            `   Applicant groups: ${comparableSets.applicantGroups.length}, Counterparty groups: ${comparableSets.counterpartyGroups.length}`
          );

          // Show OR-group satisfaction details
          const applicantOrGroups = comparableSets.applicantGroups.filter(
            ([, group]) => group.logic === 'OR'
          );
          const counterpartyOrGroups = comparableSets.counterpartyGroups.filter(
            ([, group]) => group.logic === 'OR'
          );

          if (applicantOrGroups.length > 0) {
            const satisfiedOrGroups = applicantOrGroups.filter(
              ([, group]) => group.satisfied
            );
            results.push(
              `   Applicant OR groups: ${satisfiedOrGroups.length}/${applicantOrGroups.length} satisfied`
            );
          }

          if (counterpartyOrGroups.length > 0) {
            const satisfiedOrGroups = counterpartyOrGroups.filter(
              ([, group]) => group.satisfied
            );
            results.push(
              `   Counterparty OR groups: ${satisfiedOrGroups.length}/${counterpartyOrGroups.length} satisfied`
            );
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
    <div className="App min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Skip to main content link for screen readers - COMMENTED OUT FOR UI IMPROVEMENT */}
      {/* <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 
                   bg-sumsub-600 text-white px-4 py-2 rounded-lg shadow-medium z-50
                   focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-sumsub-600
                   animate-bounce-in"
      >
        Skip to main content
      </a> */}

      {/* Responsive container with proper padding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Header section */}
        <header className="text-center mb-8 sm:mb-12 animate-fade-in">
          <h1
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 
                         transition-all duration-300 ease-out hover:scale-105 hover:text-sumsub-700
                         animate-slide-up"
          >
            Travel Rule Calculator
          </h1>
          <p className="text-sm sm:text-base text-gray-600 transition-all duration-300 ease-out hover:text-gray-700
                       animate-slide-up animation-delay-100">
            Section 4 Integration - VASP Requirements Analysis
          </p>
        </header>

        {/* Main content area */}
        <main id="main-content" className="animate-fade-in animation-delay-200">
          {/* Input controls - responsive grid */}
          <section
            className="space-y-6 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 mb-8"
          >
            <h2 className="sr-only">
              Input Controls
            </h2>
            <div className="space-y-4">
              <div className="group animate-slide-up animation-delay-300">
                <label
                  htmlFor="sumsub-country"
                  className="block text-sm font-medium text-gray-700 mb-2 transition-colors duration-150 group-hover:text-sumsub-600"
                >
                  Sumsub Country
                </label>
                <select
                  id="sumsub-country"
                  value={sumsubCountry}
                  onChange={(e) => setSumsubCountry(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-soft 
                             focus:ring-2 focus:ring-sumsub-500 focus:border-sumsub-500 
                             transition-all duration-200 ease-out
                             hover:border-gray-400 hover:shadow-medium
                             focus:shadow-medium focus:scale-[1.01] hover-lift"
                >
                  <option value="">Select country</option>
                  <option value="DEU">Germany (EUR)</option>
                  <option value="ZAF">South Africa (ZAR)</option>
                </select>
              </div>

              <div className="group animate-slide-up animation-delay-400">
                <label
                  htmlFor="direction-select"
                  className="block text-sm font-medium text-gray-700 mb-2 transition-colors duration-150 group-hover:text-sumsub-600"
                >
                  Direction
                </label>
                <select
                  id="direction-select"
                  value={direction}
                  onChange={(e) => setDirection(e.target.value as 'IN' | 'OUT')}
                  className="self-start p-3 border border-gray-300 rounded-lg shadow-soft 
                             focus:ring-2 focus:ring-sumsub-500 focus:border-sumsub-500 
                             transition-all duration-200 ease-out
                             hover:border-gray-400 hover:shadow-medium
                             focus:shadow-medium focus:scale-[1.01] hover-lift"
                >
                  <option value="OUT">OUT (Sumsub = Sender)</option>
                  <option value="IN">IN (Sumsub = Receiver)</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="group animate-slide-up animation-delay-500">
                <label
                  htmlFor="counterparty-country"
                  className="block text-sm font-medium text-gray-700 mb-2 transition-colors duration-150 group-hover:text-counterparty-600"
                >
                  Counterparty Country
                </label>
                <select
                  id="counterparty-country"
                  value={counterpartyCountry}
                  onChange={(e) => setCounterpartyCountry(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-soft 
                             transition-all duration-200 ease-out
                             hover:border-gray-400 hover:shadow-medium
                             focus:shadow-medium focus:scale-[1.01] hover-lift"
                >
                  <option value="">Select country</option>
                  <option value="DEU">Germany (EUR)</option>
                  <option value="ZAF">South Africa (ZAR)</option>
                </select>
              </div>

              <div className="group">
                <label
                  htmlFor="amount-input"
                  className="block text-sm font-medium text-gray-700 mb-2 transition-colors duration-150 group-hover:text-gray-400"
                >
                  Amount
                </label>
                <input
                  id="amount-input"
                  type="number"
                  value={amount || ''}
                  onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                  placeholder="Enter amount"
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-soft 
                             focus:ring-2 focus:ring-sumsub-500 focus:border-sumsub-500 
                             transition-all duration-200 ease-out
                             hover:border-gray-400 hover:shadow-medium
                             focus:shadow-medium focus:scale-[1.01] hover-lift"
                />
              </div>
            </div>
          </section>

          {/* Currency Conversion Display */}
          {amount > 0 && sumsubCountry && (
            <section
              className="mb-8 transition-all duration-500 ease-out animate-in slide-in-from-bottom-4"
            >
              <h2 className="sr-only">
                Currency Conversion
              </h2>
              <ConvertedAmount
                amount={amount}
                originalCurrency={
                  getCountryRule(sumsubCountry)?.currency || 'EUR'
                }
                convertedEUR={
                  convertToEUR(
                    amount,
                    getCountryRule(sumsubCountry)?.currency || 'EUR'
                  )?.eurAmount || 0
                }
                label="Currency Conversion"
                showOriginal={true}
              />
            </section>
          )}

          {/* Test button */}
          <section className="text-center mb-8">
            <button
              onClick={runSection4Tests}
              className="w-full sm:w-auto bg-blue-600 text-white py-3 px-8 rounded-lg 
                         hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 
                         transition-all duration-200 ease-out font-medium
                         hover:scale-105 hover:shadow-lg active:scale-95"
            >
              Test Section 4 Integration
            </button>
          </section>

          {/* Summary Status Bar */}
          {sumsubRequirements && counterpartyRequirements && (
            <section
              className="mb-8 transition-all duration-500 ease-out animate-in slide-in-from-bottom-4"
            >
              <h2 className="sr-only">
                Summary Status
              </h2>
              <SummaryStatusBar
                applicantRequirements={sumsubRequirements}
                counterpartyRequirements={counterpartyRequirements}
                direction={direction}
                className="mb-4"
              />
            </section>
          )}

          {/* Requirements Display - Responsive VASP blocks */}
          {(sumsubRequirements || counterpartyRequirements) && (
            <section
              className="mb-8 transition-all duration-500 ease-out animate-in slide-in-from-bottom-4"
            >
              <h2
                className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-6 text-center
                             transition-all duration-300 hover:scale-105"
              >
                Requirements Display
              </h2>

              {/* Responsive grid: stacked on mobile, side-by-side on larger screens */}
              <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-8">
                {sumsubRequirements && (
                  <div className="w-full transition-all duration-300 ease-out hover:scale-[1.01]">
                    <VaspRequirementsBlock
                      roleLabel={getSumsubLabel(direction)}
                      colorTheme="blue"
                      requirements={sumsubRequirements}
                      comparableSets={comparableSets}
                      hoveredField={hoveredField}
                      onFieldHover={handleFieldHover}
                    />
                  </div>
                )}
                {counterpartyRequirements && (
                  <div className="w-full transition-all duration-300 ease-out hover:scale-[1.01]">
                    <VaspRequirementsBlock
                      roleLabel={getCounterpartyLabel(direction)}
                      colorTheme="purple"
                      requirements={counterpartyRequirements}
                      comparableSets={comparableSets}
                      hoveredField={hoveredField}
                      onFieldHover={handleFieldHover}
                    />
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Test Results */}
          {testResults.length > 0 && (
            <section
              className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm
                         transition-all duration-300 ease-out hover:shadow-md hover:scale-[1.01]"
            >
              <h3
                className="font-semibold text-gray-900 mb-3 text-lg transition-colors duration-200"
              >
                Test Results:
              </h3>
              <div
                className="space-y-2"
                // role="log"
                // aria-live="polite"
                // aria-label="Test execution results"
              >
                {testResults.map((result, index) => (
                  <div
                    key={index}
                    className="text-sm font-mono text-gray-700 bg-gray-50 p-2 rounded border-l-4 border-blue-500
                                          transition-all duration-200 hover:bg-gray-100 hover:border-blue-600"
                  >
                    {result}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Test Scenarios */}
          <section
            className="mt-12 bg-white border border-gray-200 rounded-lg p-6 shadow-sm
                       transition-all duration-300 ease-out hover:shadow-md hover:scale-[1.01]"
          >
            <h3
              className="font-semibold text-gray-900 mb-4 text-lg transition-colors duration-200"
            >
              Test Scenarios:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2 transition-all duration-200 hover:bg-gray-50 p-2 rounded">
                <div className="font-medium text-gray-800 transition-colors duration-200">
                  Threshold Tests:
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>
                    <strong>DEU + EUR 0:</strong> Above threshold (threshold =
                    0)
                  </li>
                  <li>
                    <strong>ZAF + ZAR 4999:</strong> Below threshold (threshold
                    = 5000)
                  </li>
                  <li>
                    <strong>ZAF + ZAR 5000:</strong> Above threshold with groups
                  </li>
                </ul>
              </div>
              <div className="space-y-2 transition-all duration-200 hover:bg-gray-50 p-2 rounded">
                <div className="font-medium text-gray-800 transition-colors duration-200">
                  Direction Tests:
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>
                    <strong>Direction IN/OUT:</strong> Swaps sender/receiver
                    labels
                  </li>
                  <li>
                    <strong>Field Matching:</strong> Highlights paired
                    requirements
                  </li>
                  <li>
                    <strong>OR Groups:</strong> Shows satisfaction status
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
