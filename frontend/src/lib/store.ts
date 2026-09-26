import { IncidentAnalysis, DashboardStats, SimulationScenario, SimulationRun, ResolutionState } from "./types";

class BackendStore {
  private analyses: Map<string, IncidentAnalysis> = new Map();
  private simulationRuns: Map<string, SimulationRun> = new Map();

  constructor() {
    this.seedCanonicalData();
  }

  private seedCanonicalData() {
    // Canonical Scenario 1: Payment Retry Double-Count Prevention
    const canonical: IncidentAnalysis = {
      transaction_id: "tx_canonical_retry_001",
      incident_id: "inc_001",
      declared_amount: 2000,
      naive_amount: 4000,
      verity_committed_amount: 0,
      verity_candidate_amount: 2000,
      verity_flagged_duplicate_amount: 2000,
      root_cause_chain: [
        "BANK_SUCCESS",
        "CONFIRMATION_LOST",
        "NETWORK_TIMEOUT",
        "CUSTOMER_RETRY",
        "SECOND_ATTEMPT",
        "POTENTIAL_DUPLICATE"
      ],
      correlation_evidence: {
        relation: "RELATED",
        correlation_score: 91, // MUST render as 91/100
        independent_signal_count: 5,
        signals: [
          { signal: "same_order_id", matched: true, weight: 40 },
          { signal: "customer_fingerprint_match", matched: true, weight: 25 },
          { signal: "amount_exact_match", matched: true, weight: 15 },
          { signal: "timestamp_proximity_5m", matched: true, weight: 11 },
          { signal: "device_ip_match", matched: true, weight: 0 }
        ],
        hard_blockers: []
      },
      financial_resolution: {
        observed_amount: 4000,
        candidate_amount: 2000,
        committed_amount: 0,
        resolution_state: "HELD_FOR_REVIEW",
        selected_attempt_id: null,
        candidate_attempt_ids: ["att_stripe_001", "att_razorpay_002"],
        resolution_confidence: 62, // MUST render as 62/100
        reason: "Two independent attempts reached CONFIRMED status without authoritative supersedence identifier.",
        evidence: {
          attempt_1: { provider: "Stripe", attempt_id: "att_stripe_001", status: "CONFIRMED", amount: 2000 },
          attempt_2: { provider: "Razorpay", attempt_id: "att_razorpay_002", status: "CONFIRMED", amount: 2000 }
        }
      },
      recommendation: "HOLD_FOR_REVIEW",
      why_not_commit_explanation: "Two independent attempts reached CONFIRMED. No authoritative cross-provider identifier proves one supersedes the other. VERITY refuses to guess.",
      timeline: [
        {
          event_id: "evt_101",
          event_type: "ORDER_CREATED",
          event_created_at: "2026-09-26T14:00:00Z",
          received_at: "2026-09-26T14:00:00Z",
          delay_seconds: 0,
          provider: "Merchant Gateway",
          amount: 2000
        },
        {
          event_id: "evt_102",
          event_type: "PAYMENT_ATTEMPT",
          event_created_at: "2026-09-26T14:00:02Z",
          received_at: "2026-09-26T14:00:02Z",
          delay_seconds: 0,
          provider: "Stripe",
          attempt_id: "att_stripe_001",
          amount: 2000
        },
        {
          event_id: "evt_103",
          event_type: "GATEWAY_TIMEOUT",
          event_created_at: "2026-09-26T14:00:15Z",
          received_at: "2026-09-26T14:00:18Z",
          delay_seconds: 3,
          provider: "Stripe",
          attempt_id: "att_stripe_001",
          flags: ["DELAYED"]
        },
        {
          event_id: "evt_104",
          event_type: "CUSTOMER_RETRY",
          event_created_at: "2026-09-26T14:00:45Z",
          received_at: "2026-09-26T14:00:45Z",
          delay_seconds: 0,
          provider: "Merchant App",
          flags: ["RETRY"]
        },
        {
          event_id: "evt_105",
          event_type: "PAYMENT_ATTEMPT",
          event_created_at: "2026-09-26T14:00:48Z",
          received_at: "2026-09-26T14:00:48Z",
          delay_seconds: 0,
          provider: "Razorpay",
          attempt_id: "att_razorpay_002",
          amount: 2000
        },
        {
          event_id: "evt_106",
          event_type: "GATEWAY_SUCCESS",
          event_created_at: "2026-09-26T14:00:50Z",
          received_at: "2026-09-26T14:00:50Z",
          delay_seconds: 0,
          provider: "Razorpay",
          attempt_id: "att_razorpay_002",
          status: "SUCCESS"
        },
        {
          event_id: "evt_107",
          event_type: "LATE_CONFIRMATION",
          event_created_at: "2026-09-26T14:01:20Z",
          received_at: "2026-09-26T14:01:35Z",
          delay_seconds: 15,
          provider: "Stripe",
          attempt_id: "att_stripe_001",
          flags: ["DELAYED", "CONFLICT"]
        }
      ],
      audit_trail: [
        {
          timestamp: "2026-09-26T14:01:36Z",
          from_state: "INIT",
          to_state: "POTENTIAL_DUPLICATE",
          actor: "SYSTEM",
          notes: "Identified second payment attempt with duplicate order metadata."
        },
        {
          timestamp: "2026-09-26T14:01:37Z",
          from_state: "POTENTIAL_DUPLICATE",
          to_state: "HELD_FOR_REVIEW",
          actor: "SYSTEM",
          notes: "Committed amount held at ₹0 due to ambiguous provider supersedence."
        }
      ]
    };

    this.analyses.set(canonical.transaction_id, canonical);

    // Secondary Scenario 2: Multi-Gateway Conflict
    const sec2: IncidentAnalysis = { ...canonical,
      transaction_id: "tx_multi_gateway_002",
      incident_id: "inc_002",
      declared_amount: 5000,
      naive_amount: 10000,
      verity_committed_amount: 0,
      verity_candidate_amount: 5000,
      verity_flagged_duplicate_amount: 5000,
      financial_resolution: {
        ...canonical.financial_resolution,
        observed_amount: 10000,
        candidate_amount: 5000,
        committed_amount: 0,
        resolution_state: "HELD_FOR_REVIEW",
        candidate_attempt_ids: ["att_adyen_010", "att_paypal_011"]
      },
      why_not_commit_explanation: "Adyen and PayPal both reported successful auth for order ord_9941. Ledger commitment halted pending human confirmation."
    };
    this.analyses.set(sec2.transaction_id, sec2);
  }

  public getAnalysis(transactionId: string): IncidentAnalysis | undefined {
    return this.analyses.get(transactionId);
  }

  public getIncidentById(incidentId: string): IncidentAnalysis | undefined {
    return Array.from(this.analyses.values()).find(a => a.incident_id === incidentId);
  }

  public getAllAnalyses(): IncidentAnalysis[] {
    return Array.from(this.analyses.values());
  }

  public reviewIncident(
    incidentId: string,
    decision: "CONFIRM_ATTEMPT" | "MARK_DUPLICATE",
    chosenAttemptId?: string,
    reviewerNote?: string
  ): IncidentAnalysis {
    const analysis = this.getIncidentById(incidentId);
    if (!analysis) {
      throw new Error(`Incident ${incidentId} not found`);
    }

    const fromState = analysis.financial_resolution.resolution_state;
    const toState: ResolutionState = decision === "CONFIRM_ATTEMPT" ? "CONFIRMED" : "REJECTED";

    let committedAmt = 0;
    let selectedAttempt = null;

    if (decision === "CONFIRM_ATTEMPT") {
      committedAmt = analysis.financial_resolution.candidate_amount;
      selectedAttempt = chosenAttemptId || analysis.financial_resolution.candidate_attempt_ids[0] || "att_stripe_001";
    }

    analysis.financial_resolution.committed_amount = committedAmt;
    analysis.financial_resolution.resolution_state = toState;
    analysis.financial_resolution.selected_attempt_id = selectedAttempt;
    analysis.verity_committed_amount = committedAmt;

    if (decision === "CONFIRM_ATTEMPT") {
      analysis.why_not_commit_explanation = "";
    } else {
      analysis.why_not_commit_explanation = "Reviewer explicitly rejected all attempts as duplicate.";
    }

    analysis.audit_trail.push({
      timestamp: new Date().toISOString(),
      from_state: fromState,
      to_state: toState,
      actor: "REVIEWER",
      notes: `Reviewer decision: ${decision}. Selected attempt: ${selectedAttempt || "none"}. Note: ${reviewerNote || "N/A"}`
    });

    this.analyses.set(analysis.transaction_id, analysis);
    return analysis;
  }

  public getDashboardStats(): DashboardStats {
    const all = this.getAllAnalyses();
    let totalExposure = 0;
    let preventedCount = 0;

    const counts: Record<ResolutionState, number> = {
      HELD_FOR_REVIEW: 0,
      POTENTIAL_DUPLICATE: 0,
      CONFLICTING_STATE: 0,
      INSUFFICIENT_EVIDENCE: 0,
      MANUAL_REVIEW: 0,
      CONFIRMED: 0,
      REJECTED: 0
    };

    all.forEach(item => {
      const state = item.financial_resolution.resolution_state;
      if (counts[state] !== undefined) {
        counts[state]++;
      }
      if (item.financial_resolution.committed_amount === 0) {
        preventedCount++;
      }
      totalExposure += item.financial_resolution.observed_amount;
    });

    return {
      intent_counts: counts,
      potential_duplicate_exposure_total: totalExposure,
      prevented_ledger_commitments_count: preventedCount,
      recent_incidents: all.map(a => ({
        id: a.incident_id,
        transaction_id: a.transaction_id,
        declared_amount: a.declared_amount,
        observed_amount: a.financial_resolution.observed_amount,
        committed_amount: a.financial_resolution.committed_amount,
        state: a.financial_resolution.resolution_state,
        created_at: a.timeline[0]?.event_created_at || new Date().toISOString()
      }))
    };
  }

  public getScenarios(): SimulationScenario[] {
    return [
      {
        id: "sim_canonical_retry",
        name: "Canonical Payment Retry (Double-Count Prevention)",
        description: "Merchant loses confirmation, customer retries on secondary gateway. Standard double-charging vulnerability.",
        transaction_id: "tx_canonical_retry_001",
        expected_state: "HELD_FOR_REVIEW"
      },
      {
        id: "sim_multi_gateway",
        name: "Multi-Gateway Timeout & Duplicate Auth",
        description: "Concurrent provider attempts both authorize funds. VERITY prevents dual ledger commitment.",
        transaction_id: "tx_multi_gateway_002",
        expected_state: "HELD_FOR_REVIEW"
      }
    ];
  }

  public startSimulationRun(simulationId: string): SimulationRun {
    const scenario = this.getScenarios().find(s => s.id === simulationId) || this.getScenarios()[0];
    const analysis = this.getAnalysis(scenario.transaction_id)!;

    const runId = `run_${Date.now()}`;
    const run: SimulationRun = {
      run_id: runId,
      simulation_id: scenario.id,
      transaction_id: scenario.transaction_id,
      status: "RUNNING",
      current_step: 1,
      total_steps: analysis.timeline.length,
      timeline_events: [analysis.timeline[0]],
      final_analysis: analysis
    };

    this.simulationRuns.set(runId, run);
    return run;
  }

  public getSimulationRun(runId: string): SimulationRun | undefined {
    const run = this.simulationRuns.get(runId);
    if (!run) {
      // Fallback for initial demo links
      const canonical = this.getAnalysis("tx_canonical_retry_001")!;
      return {
        run_id: runId,
        simulation_id: "sim_canonical_retry",
        transaction_id: "tx_canonical_retry_001",
        status: "COMPLETED",
        current_step: canonical.timeline.length,
        total_steps: canonical.timeline.length,
        timeline_events: canonical.timeline,
        final_analysis: canonical
      };
    }
    return run;
  }
}

export const backendStore = new BackendStore();
