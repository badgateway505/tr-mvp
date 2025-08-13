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
