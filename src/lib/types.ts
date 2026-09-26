export type ResolutionState =
  | "HELD_FOR_REVIEW"
  | "POTENTIAL_DUPLICATE"
  | "CONFLICTING_STATE"
  | "INSUFFICIENT_EVIDENCE"
  | "MANUAL_REVIEW"
  | "CONFIRMED"
  | "REJECTED";

export interface Signal {
  signal: string;
  matched: boolean;
  weight: number;
}

export interface CorrelationEvidence {
  relation: "RELATED" | "UNRELATED" | "AMBIGUOUS";
  correlation_score: number; // e.g. 91 (Must render as 91/100)
  signals: Signal[];
  hard_blockers: string[];
  independent_signal_count: number;
}

export interface FinancialResolution {
  observed_amount: number;
  candidate_amount: number;
  committed_amount: number;
  resolution_state: ResolutionState;
  selected_attempt_id: string | null;
  candidate_attempt_ids: string[];
  resolution_confidence: number; // e.g. 62 (Must render as 62/100)
  reason: string;
  evidence: Record<string, unknown>;
}

export interface TimelineEvent {
  event_id: string;
  event_type: string;
  event_created_at: string;
  received_at: string;
  delay_seconds: number;
  provider: string;
  attempt_id?: string;
  amount?: number;
  status?: string;
  flags?: ("DELAYED" | "CONFLICT" | "RETRY" | "INFERRED")[];
}

export interface AuditTrailEntry {
  timestamp: string;
  from_state: string;
  to_state: string;
  actor: "SYSTEM" | "REVIEWER" | "SIMULATOR";
  notes: string;
}

export interface IncidentAnalysis {
  transaction_id: string;
  incident_id: string;
  declared_amount: number;
  root_cause_chain: string[];
  correlation_evidence: CorrelationEvidence;
  financial_resolution: FinancialResolution;
  recommendation: "HOLD_FOR_REVIEW" | "COMMIT_ATTEMPT" | "REJECT_ALL";
  why_not_commit_explanation: string;
  timeline: TimelineEvent[];
  audit_trail: AuditTrailEntry[];
  naive_amount: number;
  verity_committed_amount: number;
  verity_candidate_amount: number;
  verity_flagged_duplicate_amount: number;
}

export interface ReviewDecisionRequest {
  decision: "CONFIRM_ATTEMPT" | "MARK_DUPLICATE";
  chosen_attempt_id?: string;
  reviewer_note: string;
}

export interface DashboardStats {
  intent_counts: Record<ResolutionState, number>;
  potential_duplicate_exposure_total: number;
  prevented_ledger_commitments_count: number; // Prevented automatic ledger commitments count (never "money saved")
  recent_incidents: Array<{
    id: string;
    transaction_id: string;
    declared_amount: number;
    observed_amount: number;
    committed_amount: number;
    state: ResolutionState;
    created_at: string;
  }>;
}

export interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  transaction_id: string;
  expected_state: ResolutionState;
}

export interface SimulationRun {
  run_id: string;
  simulation_id: string;
  transaction_id: string;
  status: "RUNNING" | "COMPLETED" | "FAILED";
  current_step: number;
  total_steps: number;
  timeline_events: TimelineEvent[];
  final_analysis?: IncidentAnalysis;
}

export interface ReliabilityReport {
  timestamp: string;
  total_property_tests: number;
  passed_property_tests: number;
  failed_property_tests: number;
  invariants_verified: Array<{
    rule: string;
    description: string;
    status: "PASSED" | "FAILED";
    executions: number;
  }>;
}
