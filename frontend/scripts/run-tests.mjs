import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateDeterministicTemplate, explain } from '../src/lib/explain.ts';
import { backendStore } from '../src/lib/store.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

console.log('====================================================');
console.log('   VERITY MODULE 2 - UI & INVARIANT TEST SUITE');
console.log('====================================================\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`[PASS] ${message}`);
    passedTests++;
  } else {
    console.error(`[FAIL] ${message}`);
    process.exitCode = 1;
  }
}

// ------------------------------------------------------------------
// Test 1: Financial Resolution & API contract data provenance
// ------------------------------------------------------------------
console.log('--- TEST 1: Contract & API Data Provenance ---');
const analysis = backendStore.getAnalysis('tx_canonical_retry_001');
assert(!!analysis, 'Canonical analysis tx_canonical_retry_001 exists in store');
assert(analysis.financial_resolution.observed_amount === 4000, 'Observed amount is ₹4,000');
assert(analysis.financial_resolution.candidate_amount === 2000, 'Candidate amount is ₹2,000');
assert(analysis.financial_resolution.committed_amount === 0, 'Committed amount is ₹0 (Held)');
assert(analysis.financial_resolution.resolution_confidence === 62, 'Resolution confidence is 62/100');
assert(analysis.correlation_evidence.correlation_score === 91, 'Correlation score is 91/100');
assert(analysis.why_not_commit_explanation.includes('VERITY refuses to guess'), 'Why not commit explanation is present');

// ------------------------------------------------------------------
// Test 2: AI_ENABLED=false Template vs AI Equivalence
// ------------------------------------------------------------------
console.log('\n--- TEST 2: AI_ENABLED=false Template Equivalence ---');
const templateRes = explain(analysis, { forceTemplate: true });
assert(templateRes.enabled === false, 'AI disabled flag returns enabled=false');
assert(templateRes.source === 'DETERMINISTIC_TEMPLATE', 'Source is DETERMINISTIC_TEMPLATE');
assert(templateRes.explanation.includes('91/100'), 'Template includes correlation score 91/100');
assert(templateRes.explanation.includes('₹4,000'), 'Template includes observed amount ₹4,000');
assert(templateRes.explanation.includes('₹0'), 'Template includes committed amount ₹0');

const aiRes = explain(analysis, { forceTemplate: false });
assert(aiRes.explanation.includes('91/100'), 'AI narration includes correlation score 91/100');
assert(aiRes.explanation.includes('₹4,000'), 'AI narration includes observed exposure ₹4,000');
assert(!aiRes.explanation.includes('% likely fraud'), 'AI narration strictly avoids percentage likelihood format');

// ------------------------------------------------------------------
// Test 3: Reviewer Action Endpoint Mutation
// ------------------------------------------------------------------
console.log('\n--- TEST 3: Reviewer Action Endpoint Mutation ---');
const prevCommitted = analysis.financial_resolution.committed_amount;
const updated = backendStore.reviewIncident('inc_001', 'CONFIRM_ATTEMPT', 'att_stripe_001', 'Test confirmation');
assert(updated.financial_resolution.committed_amount === 2000, 'Committed amount updated to ₹2,000 after CONFIRM_ATTEMPT');
assert(updated.financial_resolution.resolution_state === 'CONFIRMED', 'Resolution state updated to CONFIRMED');
assert(updated.audit_trail.some(a => a.notes.includes('Test confirmation')), 'Audit trail records reviewer note');

// Reset canonical data for clean run
backendStore.seedCanonicalData();

// ------------------------------------------------------------------
// Test 4: No-Hardcoded-Data Component Audit
// ------------------------------------------------------------------
console.log('\n--- TEST 4: No-Hardcoded-Data Component Audit ---');
const componentsDir = path.join(projectRoot, 'src', 'components');
const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.tsx'));

let hardcodedViolations = 0;
files.forEach(file => {
  const content = fs.readFileSync(path.join(componentsDir, file), 'utf8');
  // Check for literal rupee amounts hardcoded in JSX text nodes like >₹4,000< or >₹2,000<
  const hardcodedRupees = content.match(/>\s*₹\s*\d+[,0-9]*\s*</g);
  if (hardcodedRupees) {
    console.error(`[VIOLATION] Found hardcoded rupee amount in ${file}:`, hardcodedRupees);
    hardcodedViolations++;
  }
});

assert(hardcodedViolations === 0, `No hardcoded rupee values found across ${files.length} components`);

// ------------------------------------------------------------------
// Summary
// ------------------------------------------------------------------
console.log('\n====================================================');
console.log(` TEST SUMMARY: ${passedTests} / ${totalTests} PASSED`);
console.log('====================================================\n');

if (passedTests !== totalTests) {
  process.exit(1);
}
