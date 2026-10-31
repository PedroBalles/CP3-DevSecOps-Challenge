import {
  APP_SCHEMA_VERSION,
  TUTORIAL_VERSION,
  type AppState,
  type ConversationReconstructionV2Submission,
  type DomainAnalyzerV2Submission,
  type MfaConsoleV2Submission,
  type PhishingFoundationV2Submission,
  type RecoveryBuilderV2Submission,
  type TrueSenderV2Submission,
  type WorkdayTriageV2Submission,
  type BankProcessV2Submission,
} from "../domain/types";
import { createDemoState } from "../content/demo-seed";
import { grantEarnedAchievements } from "../domain/achievements";
import {
  isValidConversationReconstructionV2Submission,
  isValidDomainAnalyzerV2Submission,
  isValidMfaConsoleV2Submission,
  isValidPhishingFoundationV2Submission,
  isValidRecoveryBuilderV2Submission,
  isValidTrueSenderV2Submission,
  isValidWorkdayTriageV2Submission,
  isValidBankProcessV2Submission,
} from "../domain/rules";

export const STORAGE_KEY = "casa-digital-segura:mvp:v1";
const INVALID_STORAGE_KEY = `${STORAGE_KEY}:invalid-backup`;

export const LOCAL_SECURITY_NOTICE =
  "Demonstração local: o progresso existe apenas neste navegador e não é autoritativo. Antes do uso real, autenticação, servidor e banco de dados serão obrigatórios.";

type PersistedEnvelope = {
  schemaVersion: typeof APP_SCHEMA_VERSION;
  appVersion: "mvp-local-v14";
  savedAt: string;
  state: AppState;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isIsoDate(value: unknown): value is string {
  return isNonEmptyString(value) && !Number.isNaN(Date.parse(value));
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(isNonEmptyString);
}

const DECISIONS = new Set(["reportar", "verificar", "excluir", "abrir"]);
const EVIDENCE = new Set(["sender", "link", "context"]);
const REASONS = new Set(["domain", "urgency", "visual", "destination"]);
const RECOVERY_INCIDENTS = new Set([
  "opened-message",
  "clicked-link",
  "entered-credentials",
  "approved-mfa",
]);
const RECOVERY_IMMEDIATE_ACTIONS = new Set([
  "report-now",
  "secure-alone-first",
  "wait-for-signs",
  "hide-incident",
]);
const RECOVERY_ACTIONS = new Set([
  "stop-interaction",
  "preserve-details",
  "report-official",
  "change-password-known-route",
  "review-sessions",
  "deny-further-mfa",
  "delete-evidence",
  "forward-to-colleagues",
  "continue-interaction",
]);
const RECOVERY_REPORT_DETAILS = new Set([
  "received-channel",
  "occurred-at",
  "apparent-sender-destination",
  "action-taken",
  "affected-device",
  "password-or-code",
]);
const LINK_TOOLS = new Set([
  "protocol",
  "subdomain",
  "registeredDomain",
  "path",
  "displayName",
  "fromAddress",
  "replyTo",
  "messageContext",
]);
const LINK_VERDICTS = new Set(["legitimate", "suspicious", "inconclusive"]);
const LINK_EVIDENCE = new Set([
  "registered-domain",
  "expected-context",
  "https-alone",
  "visual-familiarity",
  "known-address",
  "changed-request",
  "reply-to-proves-safety",
  "display-name-proof",
]);
const SIMULATION_ACTIONS = new Set(["keep", "verify", "report", "delete"]);
const RADAR_OPTIONS = new Set([
  "scan-and-trust",
  "inspect-and-confirm",
  "avoid-all-qr",
]);
const BANK_CHANGE_INITIAL_ACTIONS = new Set([
  "pause-and-preserve",
  "reply-and-hold",
  "apply-now",
  "ignore-request",
]);
const BANK_CHANGE_EVIDENCE_ASSESSMENTS = new Set([
  "plausible-not-authenticated",
  "thread-proves-identity",
  "document-proves-change",
  "urgency-supports-request",
]);
const BANK_CHANGE_VERIFICATION_ROUTES = new Set([
  "registered-contact",
  "public-search",
  "request-contact",
  "same-thread",
]);
const BANK_CHANGE_PROCESS_ACTIONS = new Set([
  "block-report-second-approval",
  "pay-old-account-now",
  "supervisor-only-approval",
  "update-and-review-later",
]);
const BANK_CHANGE_REPORT_ACTIONS = new Set([
  "official-complete-report",
  "finance-only",
  "team-chat-forward",
  "wait-for-more",
]);
const BANK_CHANGE_EVIDENCE = new Set([
  "request-context",
  "payment-schedule",
  "vendor-record",
  "official-procedure",
  "registered-contact-response",
]);
const BANK_CHANGE_STAGES = new Set([
  "initial-action",
  "evidence-assessment",
  "verification-route",
  "process-action",
  "report-action",
]);
const COMPETENCIES = new Set([
  "observar",
  "investigar",
  "verificar",
  "decidir",
  "reportar",
  "recuperar",
  "orientar",
]);

function isMissionResult(value: unknown): boolean {
  return (
    isRecord(value) &&
    isFiniteNumber(value.score) &&
    value.score >= 0 &&
    value.score <= 100 &&
    DECISIONS.has(value.decision as string) &&
    Number.isInteger(value.inspected) &&
    (value.inspected as number) >= 0 &&
    Number.isInteger(value.correctReasons) &&
    (value.correctReasons as number) >= 0 &&
    isFiniteNumber(value.teamPoints) &&
    value.teamPoints >= 0 &&
    typeof value.needsReview === "boolean" &&
    isFiniteNumber(value.potentialReward) &&
    value.potentialReward >= 0
  );
}

function isMissionAttempt(value: unknown): boolean {
  return (
    isRecord(value) &&
    isNonEmptyString(value.attemptId) &&
    isNonEmptyString(value.activityId) &&
    Number.isInteger(value.activityVersion) &&
    isIsoDate(value.completedAt) &&
    DECISIONS.has(value.decision as string) &&
    Array.isArray(value.inspectedEvidence) &&
    value.inspectedEvidence.every((item) => EVIDENCE.has(item as string)) &&
    Array.isArray(value.selectedReasonIds) &&
    value.selectedReasonIds.every((item) => REASONS.has(item as string)) &&
    value.status === "evaluated" &&
    isMissionResult(value.result)
  );
}

function isPhishingFoundationV2Result(value: unknown): boolean {
  return (
    isRecord(value) &&
    isFiniteNumber(value.score) &&
    value.score >= 0 &&
    value.score <= 100 &&
    isFiniteNumber(value.requestImpactPoints) &&
    value.requestImpactPoints >= 0 &&
    value.requestImpactPoints <= 20 &&
    isFiniteNumber(value.pauseEvaluationPoints) &&
    value.pauseEvaluationPoints >= 0 &&
    value.pauseEvaluationPoints <= 15 &&
    isFiniteNumber(value.confirmationPoints) &&
    value.confirmationPoints >= 0 &&
    value.confirmationPoints <= 25 &&
    isFiniteNumber(value.responseReportPoints) &&
    value.responseReportPoints >= 0 &&
    value.responseReportPoints <= 25 &&
    isFiniteNumber(value.transferPoints) &&
    value.transferPoints >= 0 &&
    value.transferPoints <= 15 &&
    Number.isInteger(value.correctReportDetails) &&
    (value.correctReportDetails as number) >= 0 &&
    Number.isInteger(value.totalSafeReportDetails) &&
    (value.totalSafeReportDetails as number) > 0 &&
    (value.correctReportDetails as number) <=
      (value.totalSafeReportDetails as number) &&
    Array.isArray(value.criticalFailureIds) &&
    value.criticalFailureIds.every(isNonEmptyString) &&
    new Set(value.criticalFailureIds).size === value.criticalFailureIds.length &&
    value.criticalFailureIds.every((id) =>
      [
        "pause-before-action",
        "independent-confirmation",
        "safe-response",
        "safe-report",
        "legitimate-transfer",
      ].includes(id),
    ) &&
    isFiniteNumber(value.teamPoints) &&
    value.teamPoints >= 0 &&
    value.teamPoints <= 12 &&
    typeof value.needsReview === "boolean" &&
    isFiniteNumber(value.potentialReward) &&
    value.potentialReward >= 0
  );
}

function isPhishingFoundationV2Attempt(value: unknown): boolean {
  return (
    isRecord(value) &&
    value.status === "evaluated" &&
    isPhishingFoundationV2Result(value.result) &&
    isValidPhishingFoundationV2Submission(
      value as unknown as PhishingFoundationV2Submission,
    )
  );
}

function isRecoveryMissionResult(value: unknown): boolean {
  return (
    isRecord(value) &&
    isFiniteNumber(value.score) &&
    value.score >= 0 &&
    value.score <= 100 &&
    RECOVERY_INCIDENTS.has(value.incidentType as string) &&
    isFiniteNumber(value.immediatePoints) &&
    value.immediatePoints >= 0 &&
    value.immediatePoints <= 35 &&
    isFiniteNumber(value.recoveryPoints) &&
    value.recoveryPoints >= 0 &&
    value.recoveryPoints <= 40 &&
    isFiniteNumber(value.reportPoints) &&
    value.reportPoints >= 0 &&
    value.reportPoints <= 25 &&
    Number.isInteger(value.correctRecoveryActions) &&
    (value.correctRecoveryActions as number) >= 0 &&
    Number.isInteger(value.expectedRecoveryActions) &&
    (value.expectedRecoveryActions as number) > 0 &&
    Number.isInteger(value.harmfulActions) &&
    (value.harmfulActions as number) >= 0 &&
    Number.isInteger(value.correctReportDetails) &&
    (value.correctReportDetails as number) >= 0 &&
    typeof value.exposedSecret === "boolean" &&
    isFiniteNumber(value.teamPoints) &&
    value.teamPoints >= 0 &&
    typeof value.needsReview === "boolean" &&
    isFiniteNumber(value.potentialReward) &&
    value.potentialReward >= 0
  );
}

function isRecoveryMissionAttempt(value: unknown): boolean {
  return (
    isRecord(value) &&
    isNonEmptyString(value.attemptId) &&
    isNonEmptyString(value.activityId) &&
    Number.isInteger(value.activityVersion) &&
    isIsoDate(value.completedAt) &&
    RECOVERY_INCIDENTS.has(value.incidentType as string) &&
    RECOVERY_IMMEDIATE_ACTIONS.has(value.immediateActionId as string) &&
    Array.isArray(value.selectedRecoveryActionIds) &&
    value.selectedRecoveryActionIds.length > 0 &&
    value.selectedRecoveryActionIds.every((actionId) =>
      RECOVERY_ACTIONS.has(actionId as string),
    ) &&
    new Set(value.selectedRecoveryActionIds).size ===
      value.selectedRecoveryActionIds.length &&
    Array.isArray(value.selectedReportDetailIds) &&
    value.selectedReportDetailIds.length > 0 &&
    value.selectedReportDetailIds.every((detailId) =>
      RECOVERY_REPORT_DETAILS.has(detailId as string),
    ) &&
    new Set(value.selectedReportDetailIds).size ===
      value.selectedReportDetailIds.length &&
    value.status === "evaluated" &&
    isRecoveryMissionResult(value.result)
  );
}

function isRecoveryBuilderV2Result(value: unknown): boolean {
  return (
    isRecord(value) &&
    isFiniteNumber(value.score) &&
    value.score >= 0 &&
    value.score <= 100 &&
    isNonEmptyString(value.casePackageId) &&
    isFiniteNumber(value.exposurePoints) &&
    value.exposurePoints >= 0 &&
    value.exposurePoints <= 20 &&
    isFiniteNumber(value.classificationPoints) &&
    value.classificationPoints >= 0 &&
    value.classificationPoints <= 30 &&
    isFiniteNumber(value.precedencePoints) &&
    value.precedencePoints >= 0 &&
    value.precedencePoints <= 15 &&
    isFiniteNumber(value.proportionalityPoints) &&
    value.proportionalityPoints >= 0 &&
    value.proportionalityPoints <= 15 &&
    isFiniteNumber(value.reportPoints) &&
    value.reportPoints >= 0 &&
    value.reportPoints <= 20 &&
    Number.isInteger(value.correctPlacements) &&
    Number.isInteger(value.totalPlacements) &&
    Number.isInteger(value.correctPrecedencePairs) &&
    Number.isInteger(value.totalPrecedencePairs) &&
    Number.isInteger(value.safeReportBlocks) &&
    isStringArray(value.criticalFailureIds) &&
    isFiniteNumber(value.teamPoints) &&
    typeof value.needsReview === "boolean" &&
    isFiniteNumber(value.potentialReward)
  );
}

function isRecoveryBuilderV2Attempt(value: unknown): boolean {
  return (
    isRecord(value) &&
    value.status === "evaluated" &&
    isRecoveryBuilderV2Result(value.result) &&
    isValidRecoveryBuilderV2Submission(
      value as unknown as RecoveryBuilderV2Submission,
    )
  );
}

function isPhishLabResult(value: unknown): boolean {
  return (
    isRecord(value) &&
    isFiniteNumber(value.score) &&
    value.score >= 0 &&
    value.score <= 100 &&
    isFiniteNumber(value.evidencePoints) &&
    value.evidencePoints >= 0 &&
    value.evidencePoints <= 30 &&
    isFiniteNumber(value.conclusionPoints) &&
    value.conclusionPoints >= 0 &&
    value.conclusionPoints <= 25 &&
    isFiniteNumber(value.toolsPoints) &&
    value.toolsPoints >= 0 &&
    value.toolsPoints <= 20 &&
    isFiniteNumber(value.independentPoints) &&
    value.independentPoints >= 0 &&
    value.independentPoints <= 25 &&
    Number.isInteger(value.usedTools) &&
    (value.usedTools as number) >= 0 &&
    Number.isInteger(value.selectedEvidence) &&
    (value.selectedEvidence as number) >= 0 &&
    isFiniteNumber(value.teamPoints) &&
    value.teamPoints >= 0 &&
    typeof value.needsReview === "boolean" &&
    isFiniteNumber(value.potentialReward) &&
    value.potentialReward >= 0
  );
}

function isPhishLabAttempt(value: unknown): boolean {
  return (
    isRecord(value) &&
    isNonEmptyString(value.attemptId) &&
    isNonEmptyString(value.activityId) &&
    Number.isInteger(value.activityVersion) &&
    isIsoDate(value.completedAt) &&
    Array.isArray(value.usedTools) &&
    value.usedTools.every((tool) => LINK_TOOLS.has(tool as string)) &&
    typeof value.usedHint === "boolean" &&
    LINK_VERDICTS.has(value.guidedVerdict as string) &&
    LINK_VERDICTS.has(value.independentVerdict as string) &&
    Array.isArray(value.independentEvidence) &&
    value.independentEvidence.every((evidence) =>
      LINK_EVIDENCE.has(evidence as string),
    ) &&
    value.status === "evaluated" &&
    isPhishLabResult(value.result)
  );
}

function isDomainAnalyzerV2Result(value: unknown): boolean {
  return (
    isRecord(value) &&
    isFiniteNumber(value.score) &&
    value.score >= 0 &&
    value.score <= 100 &&
    isFiniteNumber(value.anatomyPoints) &&
    value.anatomyPoints >= 0 &&
    value.anatomyPoints <= 30 &&
    isFiniteNumber(value.domainConclusionPoints) &&
    value.domainConclusionPoints >= 0 &&
    value.domainConclusionPoints <= 25 &&
    isFiniteNumber(value.safeRoutePoints) &&
    value.safeRoutePoints >= 0 &&
    value.safeRoutePoints <= 20 &&
    isFiniteNumber(value.transferPoints) &&
    value.transferPoints >= 0 &&
    value.transferPoints <= 25 &&
    Number.isInteger(value.correctlyAssignedSegments) &&
    (value.correctlyAssignedSegments as number) >= 0 &&
    Number.isInteger(value.totalSegments) &&
    (value.totalSegments as number) > 0 &&
    (value.correctlyAssignedSegments as number) <=
      (value.totalSegments as number) &&
    isStringArray(value.criticalFailureIds) &&
    new Set(value.criticalFailureIds).size === value.criticalFailureIds.length &&
    value.criticalFailureIds.every((id) =>
      ["registered-domain", "safe-route", "transfer-origin"].includes(id),
    ) &&
    isFiniteNumber(value.teamPoints) &&
    value.teamPoints >= 0 &&
    value.teamPoints <= 3 &&
    typeof value.needsReview === "boolean" &&
    isFiniteNumber(value.potentialReward) &&
    value.potentialReward >= 0
  );
}

function isDomainAnalyzerV2Attempt(value: unknown): boolean {
  return (
    isRecord(value) &&
    value.status === "evaluated" &&
    isDomainAnalyzerV2Result(value.result) &&
    isValidDomainAnalyzerV2Submission(
      value as unknown as DomainAnalyzerV2Submission,
    )
  );
}

function isTrueSenderV2Result(value: unknown): boolean {
  return (
    isRecord(value) &&
    isFiniteNumber(value.score) &&
    value.score >= 0 &&
    value.score <= 100 &&
    isFiniteNumber(value.evidencePoints) &&
    value.evidencePoints >= 0 &&
    value.evidencePoints <= 30 &&
    isFiniteNumber(value.conclusionPoints) &&
    value.conclusionPoints >= 0 &&
    value.conclusionPoints <= 25 &&
    isFiniteNumber(value.mapPoints) &&
    value.mapPoints >= 0 &&
    value.mapPoints <= 20 &&
    isFiniteNumber(value.transferPoints) &&
    value.transferPoints >= 0 &&
    value.transferPoints <= 25 &&
    Number.isInteger(value.correctlyMappedFields) &&
    (value.correctlyMappedFields as number) >= 0 &&
    Number.isInteger(value.totalMappedFields) &&
    (value.totalMappedFields as number) > 0 &&
    (value.correctlyMappedFields as number) <=
      (value.totalMappedFields as number) &&
    Number.isInteger(value.correctClaimAssessments) &&
    (value.correctClaimAssessments as number) >= 0 &&
    Number.isInteger(value.totalClaimAssessments) &&
    (value.totalClaimAssessments as number) > 0 &&
    (value.correctClaimAssessments as number) <=
      (value.totalClaimAssessments as number) &&
    isStringArray(value.criticalFailureIds) &&
    new Set(value.criticalFailureIds).size === value.criticalFailureIds.length &&
    value.criticalFailureIds.every((id) =>
      ["human-control", "independent-route", "secret-sharing"].includes(id),
    ) &&
    isFiniteNumber(value.teamPoints) &&
    value.teamPoints >= 0 &&
    value.teamPoints <= 3 &&
    typeof value.needsReview === "boolean" &&
    isFiniteNumber(value.potentialReward) &&
    value.potentialReward >= 0
  );
}

function isTrueSenderV2Attempt(value: unknown): boolean {
  return (
    isRecord(value) &&
    value.status === "evaluated" &&
    isTrueSenderV2Result(value.result) &&
    isValidTrueSenderV2Submission(
      value as unknown as TrueSenderV2Submission,
    )
  );
}

function isConversationReconstructionV2Result(value: unknown): boolean {
  return (
    isRecord(value) &&
    isFiniteNumber(value.score) &&
    value.score >= 0 &&
    value.score <= 100 &&
    isFiniteNumber(value.reconstructionPoints) &&
    value.reconstructionPoints >= 0 &&
    value.reconstructionPoints <= 20 &&
    isFiniteNumber(value.turningPointPoints) &&
    value.turningPointPoints >= 0 &&
    value.turningPointPoints <= 20 &&
    isFiniteNumber(value.evidencePoints) &&
    value.evidencePoints >= 0 &&
    value.evidencePoints <= 20 &&
    isFiniteNumber(value.calibrationPoints) &&
    value.calibrationPoints >= 0 &&
    value.calibrationPoints <= 15 &&
    isFiniteNumber(value.confirmationPoints) &&
    value.confirmationPoints >= 0 &&
    value.confirmationPoints <= 15 &&
    isFiniteNumber(value.responsePoints) &&
    value.responsePoints >= 0 &&
    value.responsePoints <= 10 &&
    Number.isInteger(value.correctEvidenceAssessments) &&
    (value.correctEvidenceAssessments as number) >= 0 &&
    Number.isInteger(value.totalEvidenceAssessments) &&
    (value.totalEvidenceAssessments as number) > 0 &&
    (value.correctEvidenceAssessments as number) <=
      (value.totalEvidenceAssessments as number) &&
    isStringArray(value.criticalFailureIds) &&
    new Set(value.criticalFailureIds).size === value.criticalFailureIds.length &&
    value.criticalFailureIds.every((id) =>
      ["turning-point", "independent-route", "safe-action", "safe-report"].includes(id),
    ) &&
    isFiniteNumber(value.teamPoints) &&
    value.teamPoints >= 0 &&
    value.teamPoints <= 12 &&
    typeof value.needsReview === "boolean" &&
    isFiniteNumber(value.potentialReward) &&
    value.potentialReward >= 0
  );
}

function isConversationReconstructionV2Attempt(value: unknown): boolean {
  return (
    isRecord(value) &&
    value.status === "evaluated" &&
    isConversationReconstructionV2Result(value.result) &&
    isValidConversationReconstructionV2Submission(
      value as unknown as ConversationReconstructionV2Submission,
    )
  );
}

function isMfaConsoleV2Result(value: unknown): boolean {
  const validCriticalFailures = [
    "unsafe-factor-approval",
    "unsafe-support-contact",
    "independent-route",
    "recovery-actions",
    "safe-report",
    "transfer",
  ];

  return (
    isRecord(value) &&
    isFiniteNumber(value.score) &&
    value.score >= 0 &&
    value.score <= 100 &&
    isFiniteNumber(value.contextAssociationPoints) &&
    value.contextAssociationPoints >= 0 &&
    value.contextAssociationPoints <= 15 &&
    isFiniteNumber(value.eventDecisionPoints) &&
    value.eventDecisionPoints >= 0 &&
    value.eventDecisionPoints <= 25 &&
    isFiniteNumber(value.factorSupportPoints) &&
    value.factorSupportPoints >= 0 &&
    value.factorSupportPoints <= 20 &&
    isFiniteNumber(value.officialRoutePoints) &&
    value.officialRoutePoints >= 0 &&
    value.officialRoutePoints <= 15 &&
    isFiniteNumber(value.recoveryReportPoints) &&
    value.recoveryReportPoints >= 0 &&
    value.recoveryReportPoints <= 25 &&
    Number.isInteger(value.correctAssociations) &&
    (value.correctAssociations as number) >= 0 &&
    Number.isInteger(value.totalAssociations) &&
    (value.totalAssociations as number) > 0 &&
    (value.correctAssociations as number) <=
      (value.totalAssociations as number) &&
    Number.isInteger(value.correctEventActions) &&
    (value.correctEventActions as number) >= 0 &&
    Number.isInteger(value.totalEventActions) &&
    (value.totalEventActions as number) > 0 &&
    (value.correctEventActions as number) <=
      (value.totalEventActions as number) &&
    isStringArray(value.criticalFailureIds) &&
    new Set(value.criticalFailureIds).size === value.criticalFailureIds.length &&
    value.criticalFailureIds.every((id) => validCriticalFailures.includes(id)) &&
    isFiniteNumber(value.teamPoints) &&
    value.teamPoints >= 0 &&
    value.teamPoints <= 12 &&
    typeof value.needsReview === "boolean" &&
    isFiniteNumber(value.potentialReward) &&
    value.potentialReward >= 0
  );
}

function isMfaConsoleV2Attempt(value: unknown): boolean {
  return (
    isRecord(value) &&
    value.status === "evaluated" &&
    isMfaConsoleV2Result(value.result) &&
    isValidMfaConsoleV2Submission(value as unknown as MfaConsoleV2Submission)
  );
}

function isSimulationResult(value: unknown): boolean {
  return (
    isRecord(value) &&
    isFiniteNumber(value.score) &&
    value.score >= 0 &&
    value.score <= 100 &&
    isFiniteNumber(value.identificationPoints) &&
    value.identificationPoints >= 0 &&
    value.identificationPoints <= 30 &&
    isFiniteNumber(value.actionPoints) &&
    value.actionPoints >= 0 &&
    value.actionPoints <= 30 &&
    isFiniteNumber(value.evidencePoints) &&
    value.evidencePoints >= 0 &&
    value.evidencePoints <= 25 &&
    isFiniteNumber(value.falsePositivePoints) &&
    value.falsePositivePoints >= 0 &&
    value.falsePositivePoints <= 15 &&
    Number.isInteger(value.correctIdentifications) &&
    (value.correctIdentifications as number) >= 0 &&
    Number.isInteger(value.correctActions) &&
    (value.correctActions as number) >= 0 &&
    Number.isInteger(value.inspectedMessages) &&
    (value.inspectedMessages as number) >= 0 &&
    Number.isInteger(value.falsePositives) &&
    (value.falsePositives as number) >= 0 &&
    isFiniteNumber(value.teamPoints) &&
    value.teamPoints >= 0 &&
    typeof value.needsReview === "boolean" &&
    isFiniteNumber(value.potentialReward) &&
    value.potentialReward >= 0
  );
}

function isSimulationDecision(value: unknown): boolean {
  return (
    isRecord(value) &&
    isNonEmptyString(value.messageId) &&
    SIMULATION_ACTIONS.has(value.action as string) &&
    Array.isArray(value.inspectedEvidence) &&
    value.inspectedEvidence.every((evidence) => EVIDENCE.has(evidence as string))
  );
}

function isSimulationAttempt(value: unknown): boolean {
  return (
    isRecord(value) &&
    isNonEmptyString(value.attemptId) &&
    isNonEmptyString(value.activityId) &&
    Number.isInteger(value.activityVersion) &&
    isIsoDate(value.completedAt) &&
    Array.isArray(value.messageDecisions) &&
    value.messageDecisions.every(isSimulationDecision) &&
    value.status === "evaluated" &&
    isSimulationResult(value.result)
  );
}

function isWorkdayTriageV2Result(value: unknown): boolean {
  return (
    isRecord(value) &&
    isFiniteNumber(value.score) &&
    value.score >= 0 &&
    value.score <= 100 &&
    isFiniteNumber(value.triagePoints) &&
    value.triagePoints >= 0 &&
    value.triagePoints <= 30 &&
    isFiniteNumber(value.actionPoints) &&
    value.actionPoints >= 0 &&
    value.actionPoints <= 30 &&
    isFiniteNumber(value.evidencePoints) &&
    value.evidencePoints >= 0 &&
    value.evidencePoints <= 25 &&
    isFiniteNumber(value.calibrationPoints) &&
    value.calibrationPoints >= 0 &&
    value.calibrationPoints <= 15 &&
    Number.isInteger(value.correctQueues) &&
    (value.correctQueues as number) >= 0 &&
    Number.isInteger(value.correctActions) &&
    (value.correctActions as number) >= 0 &&
    Number.isInteger(value.totalItems) &&
    (value.totalItems as number) > 0 &&
    Number.isInteger(value.inspectedEvidence) &&
    (value.inspectedEvidence as number) >= 0 &&
    Number.isInteger(value.requiredEvidence) &&
    (value.requiredEvidence as number) > 0 &&
    Number.isInteger(value.falsePositives) &&
    (value.falsePositives as number) >= 0 &&
    Array.isArray(value.criticalFailureIds) &&
    value.criticalFailureIds.every(isNonEmptyString) &&
    new Set(value.criticalFailureIds).size === value.criticalFailureIds.length &&
    isFiniteNumber(value.teamPoints) &&
    value.teamPoints >= 0 &&
    typeof value.needsReview === "boolean" &&
    isFiniteNumber(value.potentialReward) &&
    value.potentialReward >= 0
  );
}

function isWorkdayTriageV2Attempt(value: unknown): boolean {
  return (
    isRecord(value) &&
    isValidWorkdayTriageV2Submission(
      value as unknown as WorkdayTriageV2Submission,
    ) &&
    value.status === "evaluated" &&
    isWorkdayTriageV2Result(value.result)
  );
}

function isRadarResult(value: unknown): boolean {
  return (
    isRecord(value) &&
    (value.score === 0 || value.score === 100) &&
    typeof value.correct === "boolean" &&
    isFiniteNumber(value.points) &&
    value.points >= 0 &&
    typeof value.alreadyCompleted === "boolean"
  );
}

function isRadarAttempt(value: unknown): boolean {
  return (
    isRecord(value) &&
    isNonEmptyString(value.attemptId) &&
    isNonEmptyString(value.activityId) &&
    Number.isInteger(value.activityVersion) &&
    isIsoDate(value.completedAt) &&
    RADAR_OPTIONS.has(value.selectedOptionId as string) &&
    value.status === "evaluated" &&
    isRadarResult(value.result)
  );
}

function isTeamChallengeResult(value: unknown): boolean {
  if (!isRecord(value)) return false;
  const competencyScores = value.competencyScores;
  return (
    isFiniteNumber(value.score) &&
    value.score >= 0 &&
    value.score <= 100 &&
    Number.isInteger(value.correctDecisions) &&
    (value.correctDecisions as number) >= 0 &&
    Number.isInteger(value.totalDecisions) &&
    (value.totalDecisions as number) > 0 &&
    Number.isInteger(value.falsePositives) &&
    (value.falsePositives as number) >= 0 &&
    isRecord(competencyScores) &&
    ["observar", "verificar", "decidir"].every(
      (competencyId) =>
        isFiniteNumber(competencyScores[competencyId]) &&
        (competencyScores[competencyId] as number) >= 0 &&
        (competencyScores[competencyId] as number) <= 100,
    ) &&
    Array.isArray(value.coveredCompetencyIds) &&
    value.coveredCompetencyIds.every((item) =>
      COMPETENCIES.has(item as string),
    ) &&
    isFiniteNumber(value.potentialReward) &&
    value.potentialReward >= 0
  );
}

function isTeamChallengeDecision(value: unknown): boolean {
  return (
    isRecord(value) &&
    isNonEmptyString(value.caseId) &&
    SIMULATION_ACTIONS.has(value.action as string) &&
    Array.isArray(value.inspectedEvidence) &&
    value.inspectedEvidence.every((evidence) => EVIDENCE.has(evidence as string))
  );
}

function isTeamChallengeAttempt(value: unknown): boolean {
  return (
    isRecord(value) &&
    isNonEmptyString(value.attemptId) &&
    isNonEmptyString(value.activityId) &&
    Number.isInteger(value.activityVersion) &&
    isIsoDate(value.completedAt) &&
    Array.isArray(value.caseDecisions) &&
    value.caseDecisions.every(isTeamChallengeDecision) &&
    value.status === "evaluated" &&
    isTeamChallengeResult(value.result)
  );
}

function isBankChangeResult(value: unknown): boolean {
  if (
    !isRecord(value) ||
    !isFiniteNumber(value.score) ||
    value.score < 0 ||
    value.score > 100 ||
    !Number.isInteger(value.correctDecisions) ||
    (value.correctDecisions as number) < 0 ||
    (value.correctDecisions as number) > 5 ||
    value.totalDecisions !== 5 ||
    !isRecord(value.stageScores) ||
    !isRecord(value.competencyScores)
  ) {
    return false;
  }

  const stageScores = value.stageScores;
  const competencyScores = value.competencyScores;
  return (
    [...BANK_CHANGE_STAGES].every((stageId) => {
      const stageScore = stageScores[stageId];
      return (
        isFiniteNumber(stageScore) && stageScore >= 0 && stageScore <= 25
      );
    }) &&
    ["verificar", "decidir", "reportar", "orientar"].every(
      (competencyId) => {
        const competencyScore = competencyScores[competencyId];
        return (
          isFiniteNumber(competencyScore) &&
          competencyScore >= 0 &&
          competencyScore <= 100
        );
      },
    ) &&
    Array.isArray(value.coveredCompetencyIds) &&
    value.coveredCompetencyIds.every((item) =>
      COMPETENCIES.has(item as string),
    ) &&
    typeof value.needsReview === "boolean" &&
    Array.isArray(value.criticalFailureStageIds) &&
    new Set(value.criticalFailureStageIds).size ===
      value.criticalFailureStageIds.length &&
    value.criticalFailureStageIds.every((item) =>
      BANK_CHANGE_STAGES.has(item as string),
    ) &&
    isFiniteNumber(value.potentialReward) &&
    value.potentialReward >= 0
  );
}

function isBankChangeAttempt(value: unknown): boolean {
  return (
    isRecord(value) &&
    isNonEmptyString(value.attemptId) &&
    value.activityId === "team:bank-change" &&
    value.activityVersion === 1 &&
    isIsoDate(value.completedAt) &&
    BANK_CHANGE_INITIAL_ACTIONS.has(value.initialActionId as string) &&
    BANK_CHANGE_EVIDENCE_ASSESSMENTS.has(
      value.evidenceAssessmentId as string,
    ) &&
    BANK_CHANGE_VERIFICATION_ROUTES.has(
      value.verificationRouteId as string,
    ) &&
    BANK_CHANGE_PROCESS_ACTIONS.has(value.processActionId as string) &&
    BANK_CHANGE_REPORT_ACTIONS.has(value.reportActionId as string) &&
    Array.isArray(value.inspectedEvidenceIds) &&
    new Set(value.inspectedEvidenceIds).size ===
      value.inspectedEvidenceIds.length &&
    value.inspectedEvidenceIds.every((item) =>
      BANK_CHANGE_EVIDENCE.has(item as string),
    ) &&
    value.status === "evaluated" &&
    isBankChangeResult(value.result)
  );
}

function isBankProcessV2Result(value: unknown): boolean {
  if (
    !isRecord(value) ||
    !isFiniteNumber(value.score) ||
    value.score < 0 ||
    value.score > 100 ||
    !isFiniteNumber(value.comparisonPoints) ||
    !isFiniteNumber(value.contactPoints) ||
    !isFiniteNumber(value.processClassificationPoints) ||
    !isFiniteNumber(value.processRelationPoints) ||
    !isFiniteNumber(value.reportPoints) ||
    !Number.isInteger(value.correctDecisions) ||
    value.totalDecisions !== 5 ||
    !isRecord(value.normalizedControlScores) ||
    !isRecord(value.competencyScores) ||
    !Array.isArray(value.coveredCompetencyIds) ||
    !value.coveredCompetencyIds.every((item) =>
      COMPETENCIES.has(item as string),
    ) ||
    typeof value.needsReview !== "boolean" ||
    !Array.isArray(value.criticalFailureIds) ||
    !value.criticalFailureIds.every(isNonEmptyString) ||
    !isFiniteNumber(value.potentialReward)
  ) {
    return false;
  }
  const normalizedControlScores = value.normalizedControlScores;
  const competencyScores = value.competencyScores;
  return (
    [...BANK_CHANGE_STAGES].every((stageId) => {
      const score = normalizedControlScores[stageId];
      return isFiniteNumber(score) && score >= 0 && score <= 25;
    }) &&
    ["verificar", "decidir", "reportar", "orientar"].every(
      (competencyId) => {
        const score = competencyScores[competencyId];
        return isFiniteNumber(score) && score >= 0 && score <= 100;
      },
    )
  );
}

function isBankProcessV2Attempt(value: unknown): boolean {
  return (
    isRecord(value) &&
    isValidBankProcessV2Submission(
      value as unknown as BankProcessV2Submission,
    ) &&
    value.status === "evaluated" &&
    isBankProcessV2Result(value.result)
  );
}

function isLearningAttempt(value: unknown): boolean {
  return (
    isMissionAttempt(value) ||
    isPhishingFoundationV2Attempt(value) ||
    isConversationReconstructionV2Attempt(value) ||
    isMfaConsoleV2Attempt(value) ||
    isRecoveryMissionAttempt(value) ||
    isRecoveryBuilderV2Attempt(value) ||
    isPhishLabAttempt(value) ||
    isDomainAnalyzerV2Attempt(value) ||
    isTrueSenderV2Attempt(value) ||
    isWorkdayTriageV2Attempt(value) ||
    isSimulationAttempt(value) ||
    isRadarAttempt(value) ||
    isTeamChallengeAttempt(value) ||
    isBankChangeAttempt(value) ||
    isBankProcessV2Attempt(value)
  );
}

function isActivityProgress(value: unknown): boolean {
  return (
    isRecord(value) &&
    isNonEmptyString(value.activityId) &&
    (value.status === "available" ||
      value.status === "inProgress" ||
      value.status === "completed") &&
    isStringArray(value.attemptIds) &&
    (value.lastAttemptId === undefined || isNonEmptyString(value.lastAttemptId)) &&
    (value.bestScore === undefined ||
      (isFiniteNumber(value.bestScore) &&
        value.bestScore >= 0 &&
        value.bestScore <= 100)) &&
    (value.completedAt === undefined || isIsoDate(value.completedAt))
  );
}

function isRewardClaim(value: unknown): boolean {
  return (
    isRecord(value) &&
    isNonEmptyString(value.claimKey) &&
    isNonEmptyString(value.sourceId) &&
    isFiniteNumber(value.points) &&
    value.points >= 0 &&
    isIsoDate(value.claimedAt)
  );
}

function isPointEntry(value: unknown): boolean {
  return (
    isRecord(value) &&
    isNonEmptyString(value.id) &&
    isNonEmptyString(value.claimKey) &&
    isNonEmptyString(value.sourceId) &&
    (value.category === "learning" ||
      value.category === "arcade" ||
      value.category === "team" ||
      value.category === "radar" ||
      value.category === "achievement") &&
    isFiniteNumber(value.points) &&
    value.points >= 0 &&
    (value.status === "confirmed" || value.status === "pending") &&
    isIsoDate(value.createdAt)
  );
}

function isCompetencyEvidence(value: unknown): boolean {
  return (
    isRecord(value) &&
    isNonEmptyString(value.key) &&
    COMPETENCIES.has(value.competencyId as string) &&
    isNonEmptyString(value.activityId) &&
    isNonEmptyString(value.attemptId) &&
    isFiniteNumber(value.score) &&
    value.score >= 0 &&
    value.score <= 100 &&
    (value.context === "guided" ||
      value.context === "independent" ||
      value.context === "review") &&
    isIsoDate(value.createdAt)
  );
}

function isRecommendation(value: unknown): boolean {
  return (
    isRecord(value) &&
    isNonEmptyString(value.id) &&
    isNonEmptyString(value.sourceActivityId) &&
    isNonEmptyString(value.targetActivityId) &&
    isNonEmptyString(value.reason) &&
    (value.status === "recommended" ||
      value.status === "completed" ||
      value.status === "dismissed") &&
    isIsoDate(value.createdAt)
  );
}

function isHistoryEvent(value: unknown): boolean {
  return (
    isRecord(value) &&
    isNonEmptyString(value.id) &&
    (value.kind === "activityCompleted" ||
      value.kind === "rewardGranted" ||
      value.kind === "achievementUnlocked" ||
      value.kind === "demoReset") &&
    isNonEmptyString(value.sourceId) &&
    isNonEmptyString(value.title) &&
    isIsoDate(value.createdAt)
  );
}

function isTeamContribution(value: unknown): boolean {
  return (
    isRecord(value) &&
    isNonEmptyString(value.claimKey) &&
    isNonEmptyString(value.sourceId) &&
    isFiniteNumber(value.points) &&
    value.points >= 0 &&
    isIsoDate(value.createdAt)
  );
}

function isTeamAggregateClaim(value: unknown): boolean {
  return (
    isRecord(value) &&
    isNonEmptyString(value.claimKey) &&
    isNonEmptyString(value.sourceId) &&
    Number.isInteger(value.correctDecisions) &&
    (value.correctDecisions as number) >= 0 &&
    Number.isInteger(value.totalDecisions) &&
    (value.totalDecisions as number) > 0 &&
    Array.isArray(value.coveredCompetencyIds) &&
    value.coveredCompetencyIds.every((item) =>
      COMPETENCIES.has(item as string),
    ) &&
    isIsoDate(value.createdAt)
  );
}

function isSectorAggregate(value: unknown): boolean {
  return (
    isRecord(value) &&
    Number.isInteger(value.eligibleParticipants) &&
    (value.eligibleParticipants as number) > 0 &&
    Number.isInteger(value.validParticipants) &&
    (value.validParticipants as number) >= 0 &&
    (value.validParticipants as number) <=
      (value.eligibleParticipants as number) &&
    Number.isInteger(value.correctDecisions) &&
    (value.correctDecisions as number) >= 0 &&
    Number.isInteger(value.validDecisions) &&
    (value.validDecisions as number) >= 0 &&
    (value.correctDecisions as number) <= (value.validDecisions as number) &&
    Array.isArray(value.requiredCompetencyIds) &&
    value.requiredCompetencyIds.length > 0 &&
    value.requiredCompetencyIds.every((item) =>
      COMPETENCIES.has(item as string),
    ) &&
    Array.isArray(value.coveredCompetencyIds) &&
    value.coveredCompetencyIds.every(
      (item) =>
        COMPETENCIES.has(item as string) &&
        (value.requiredCompetencyIds as unknown[]).includes(item),
    )
  );
}

function isSectorRankingEntry(value: unknown): boolean {
  return (
    isRecord(value) &&
    isNonEmptyString(value.id) &&
    isNonEmptyString(value.name) &&
    isFiniteNumber(value.score) &&
    value.score >= 0 &&
    value.score <= 100
  );
}

function isTeamHistoryEvent(value: unknown): boolean {
  return (
    isRecord(value) &&
    isNonEmptyString(value.id) &&
    isNonEmptyString(value.title) &&
    isNonEmptyString(value.detail) &&
    isIsoDate(value.createdAt)
  );
}

function isValidState(value: unknown): value is AppState {
  if (!isRecord(value)) return false;
  const meta = value.meta;
  const demo = value.demo;
  const learning = value.learning;
  const teams = value.teams;
  const preferences = value.preferences;
  const onboarding = value.onboarding;
  const admin = value.admin;

  if (
    !isRecord(demo) ||
    !isRecord(demo.learner) ||
    !isRecord(demo.administrator) ||
    !isRecord(learning)
  ) {
    return false;
  }

  const attempts = learning.attempts;
  const activityProgress = learning.activityProgress;
  const rewardClaims = learning.rewardClaims;
  const recommendations = learning.recommendations;

  if (
    !isRecord(attempts) ||
    !isRecord(activityProgress) ||
    !isRecord(rewardClaims) ||
    !isRecord(recommendations)
  ) {
    return false;
  }

  const attemptsAreValid = Object.entries(attempts).every(
    ([attemptId, attempt]) =>
      isLearningAttempt(attempt) &&
      isRecord(attempt) &&
      attempt.attemptId === attemptId,
  );
  const progressIsValid = Object.values(activityProgress).every(
    (progress) =>
      isActivityProgress(progress) &&
      isRecord(progress) &&
      (!progress.lastAttemptId ||
        (typeof progress.lastAttemptId === "string" &&
          Object.prototype.hasOwnProperty.call(
            attempts,
            progress.lastAttemptId,
          ))),
  );
  const claimsAreValid = Object.entries(rewardClaims).every(
    ([claimKey, claim]) =>
      isRewardClaim(claim) && isRecord(claim) && claim.claimKey === claimKey,
  );
  const recommendationsAreValid = Object.entries(recommendations).every(
    ([recommendationId, recommendation]) =>
      isRecommendation(recommendation) &&
      isRecord(recommendation) &&
      recommendation.id === recommendationId,
  );
  const ledgerIsValid =
    Array.isArray(learning.pointLedger) &&
    learning.pointLedger.every(isPointEntry) &&
    new Set(
      learning.pointLedger.map((entry) =>
        isRecord(entry) ? entry.id : undefined,
      ),
    ).size === learning.pointLedger.length;
  const evidenceIsValid =
    Array.isArray(learning.competencyEvidence) &&
    learning.competencyEvidence.every(
      (evidence) =>
        isCompetencyEvidence(evidence) &&
        isRecord(evidence) &&
        typeof evidence.attemptId === "string" &&
        Object.prototype.hasOwnProperty.call(attempts, evidence.attemptId),
    );
  const teamContributionsAreValid =
    isRecord(teams) &&
    isRecord(teams.contributionClaims) &&
    Object.entries(teams.contributionClaims).every(
      ([claimKey, contribution]) =>
        isTeamContribution(contribution) &&
        isRecord(contribution) &&
        contribution.claimKey === claimKey,
    );
  const aggregateClaimsAreValid =
    isRecord(teams) &&
    isRecord(teams.aggregateClaims) &&
    Object.entries(teams.aggregateClaims).every(
      ([claimKey, claim]) =>
        isTeamAggregateClaim(claim) &&
        isRecord(claim) &&
        claim.claimKey === claimKey,
    );

  return (
    isRecord(meta) &&
    meta.schemaVersion === APP_SCHEMA_VERSION &&
    Number.isInteger(meta.revision) &&
    (meta.revision as number) >= 0 &&
    isIsoDate(meta.savedAt) &&
    isNonEmptyString(demo.learner.id) &&
    isNonEmptyString(demo.learner.name) &&
    isNonEmptyString(demo.learner.store) &&
    isNonEmptyString(demo.learner.area) &&
    isNonEmptyString(demo.administrator.id) &&
    isNonEmptyString(demo.administrator.name) &&
    (demo.activeRole === "learner" || demo.activeRole === "administrator") &&
    attemptsAreValid &&
    progressIsValid &&
    claimsAreValid &&
    ledgerIsValid &&
    evidenceIsValid &&
    recommendationsAreValid &&
    Array.isArray(learning.history) &&
    learning.history.every(isHistoryEvent) &&
    isRecord(teams) &&
    isNonEmptyString(teams.id) &&
    isNonEmptyString(teams.name) &&
    isFiniteNumber(teams.baseShield) &&
    teams.baseShield >= 0 &&
    teams.baseShield <= 100 &&
    teamContributionsAreValid &&
    aggregateClaimsAreValid &&
    isSectorAggregate(teams.sectorAggregate) &&
    Array.isArray(teams.ranking) &&
    teams.ranking.length > 0 &&
    teams.ranking.every(isSectorRankingEntry) &&
    isRecord(teams.activeGoal) &&
    isNonEmptyString(teams.activeGoal.id) &&
    isNonEmptyString(teams.activeGoal.title) &&
    isNonEmptyString(teams.activeGoal.description) &&
    isFiniteNumber(teams.activeGoal.targetScore) &&
    teams.activeGoal.targetScore >= 0 &&
    teams.activeGoal.targetScore <= 100 &&
    Array.isArray(teams.history) &&
    teams.history.every(isTeamHistoryEvent) &&
    isRecord(preferences) &&
    typeof preferences.reducedMotion === "boolean" &&
    typeof preferences.highContrast === "boolean" &&
    typeof preferences.soundEnabled === "boolean" &&
    typeof preferences.notificationsEnabled === "boolean" &&
    (preferences.textSize === "default" ||
      preferences.textSize === "large" ||
      preferences.textSize === "extraLarge") &&
    typeof preferences.captionsEnabled === "boolean" &&
    typeof preferences.leaderboardParticipation === "boolean" &&
    (preferences.leaderboardIdentity === "initials" ||
      preferences.leaderboardIdentity === "displayName" ||
      preferences.leaderboardIdentity === "anonymous") &&
    typeof preferences.notificationMission === "boolean" &&
    typeof preferences.notificationReview === "boolean" &&
    typeof preferences.notificationArcade === "boolean" &&
    typeof preferences.notificationTeam === "boolean" &&
    typeof preferences.notificationRadar === "boolean" &&
    (preferences.reminderFrequency === "important" ||
      preferences.reminderFrequency === "weekly" ||
      preferences.reminderFrequency === "off") &&
    isRecord(onboarding) &&
    isRecord(onboarding.tutorial) &&
    onboarding.tutorial.version === TUTORIAL_VERSION &&
    (onboarding.tutorial.status === "required" ||
      onboarding.tutorial.status === "available" ||
      onboarding.tutorial.status === "inProgress" ||
      onboarding.tutorial.status === "completed") &&
    Number.isInteger(onboarding.tutorial.currentStep) &&
    typeof onboarding.tutorial.currentStep === "number" &&
    onboarding.tutorial.currentStep >= 0 &&
    onboarding.tutorial.currentStep <= 6 &&
    (onboarding.tutorial.completedAt === null ||
      isIsoDate(onboarding.tutorial.completedAt)) &&
    (onboarding.tutorial.status !== "completed" ||
      isIsoDate(onboarding.tutorial.completedAt)) &&
    isRecord(admin) &&
    Array.isArray(admin.auditLog) &&
    admin.auditLog.every(
      (entry) =>
        isRecord(entry) &&
        isNonEmptyString(entry.id) &&
        isNonEmptyString(entry.action) &&
        isNonEmptyString(entry.actorId) &&
        isIsoDate(entry.createdAt),
    )
  );
}

function quarantineInvalidState(rawValue: string): void {
  try {
    window.localStorage.setItem(INVALID_STORAGE_KEY, rawValue);
  } catch {
    // O backup é uma conveniência de diagnóstico; não pode impedir a recuperação.
  }

  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // O Provider tratará indisponibilidade completa do armazenamento.
  }
}

function createEnvelope(state: AppState): PersistedEnvelope {
  return {
    schemaVersion: APP_SCHEMA_VERSION,
    appVersion: "mvp-local-v14",
    savedAt: new Date().toISOString(),
    state,
  };
}

function migrateLegacyState(value: unknown): AppState | null {
  if (!isRecord(value) || !isRecord(value.meta) || !isRecord(value.teams)) {
    return null;
  }

  const seed = createDemoState();
  const candidate: unknown = {
    ...value,
    meta: {
      ...value.meta,
      schemaVersion: APP_SCHEMA_VERSION,
    },
    teams: {
      ...seed.teams,
      ...value.teams,
      aggregateClaims: seed.teams.aggregateClaims,
      sectorAggregate: seed.teams.sectorAggregate,
      ranking: seed.teams.ranking,
      activeGoal: seed.teams.activeGoal,
      history: seed.teams.history,
    },
    preferences: {
      ...seed.preferences,
      ...(isRecord(value.preferences) ? value.preferences : {}),
    },
    onboarding: {
      tutorial: {
        ...seed.onboarding.tutorial,
        status: "available",
      },
    },
  };

  return isValidState(candidate)
    ? grantEarnedAchievements(candidate, candidate.meta.savedAt)
    : null;
}

function migrateV2State(value: unknown): AppState | null {
  if (!isRecord(value) || !isRecord(value.meta)) return null;

  const seed = createDemoState();
  const candidate: unknown = {
    ...value,
    meta: {
      ...value.meta,
      schemaVersion: APP_SCHEMA_VERSION,
    },
    preferences: {
      ...seed.preferences,
      ...(isRecord(value.preferences) ? value.preferences : {}),
    },
    onboarding: {
      tutorial: {
        ...seed.onboarding.tutorial,
        status: "available",
      },
    },
  };

  return isValidState(candidate)
    ? grantEarnedAchievements(candidate, candidate.meta.savedAt)
    : null;
}

function migrateV3State(value: unknown): AppState | null {
  if (!isRecord(value) || !isRecord(value.meta)) return null;

  const seed = createDemoState();
  const candidate: unknown = {
    ...value,
    meta: {
      ...value.meta,
      schemaVersion: APP_SCHEMA_VERSION,
    },
    onboarding: {
      tutorial: {
        ...seed.onboarding.tutorial,
        status: "available",
      },
    },
  };

  return isValidState(candidate) ? candidate : null;
}

function migrateV4State(value: unknown): AppState | null {
  if (!isRecord(value) || !isRecord(value.meta)) return null;

  const candidate: unknown = {
    ...value,
    meta: {
      ...value.meta,
      schemaVersion: APP_SCHEMA_VERSION,
    },
  };

  return isValidState(candidate) ? candidate : null;
}

function migrateV5State(value: unknown): AppState | null {
  if (!isRecord(value) || !isRecord(value.meta)) return null;

  const candidate: unknown = {
    ...value,
    meta: {
      ...value.meta,
      schemaVersion: APP_SCHEMA_VERSION,
    },
  };

  return isValidState(candidate) ? candidate : null;
}

function migrateV6State(value: unknown): AppState | null {
  if (!isRecord(value) || !isRecord(value.meta)) return null;

  const candidate: unknown = {
    ...value,
    meta: {
      ...value.meta,
      schemaVersion: APP_SCHEMA_VERSION,
    },
  };

  return isValidState(candidate) ? candidate : null;
}

function migrateV7State(value: unknown): AppState | null {
  if (!isRecord(value) || !isRecord(value.meta)) return null;

  const candidate: unknown = {
    ...value,
    meta: {
      ...value.meta,
      schemaVersion: APP_SCHEMA_VERSION,
    },
  };

  return isValidState(candidate) ? candidate : null;
}

function migrateV8State(value: unknown): AppState | null {
  if (!isRecord(value) || !isRecord(value.meta)) return null;

  const candidate: unknown = {
    ...value,
    meta: {
      ...value.meta,
      schemaVersion: APP_SCHEMA_VERSION,
    },
  };

  return isValidState(candidate) ? candidate : null;
}

function migrateV9State(value: unknown): AppState | null {
  if (!isRecord(value) || !isRecord(value.meta)) return null;

  const candidate: unknown = {
    ...value,
    meta: {
      ...value.meta,
      schemaVersion: APP_SCHEMA_VERSION,
    },
  };

  return isValidState(candidate) ? candidate : null;
}

function migrateV10State(value: unknown): AppState | null {
  if (!isRecord(value) || !isRecord(value.meta)) return null;

  const candidate: unknown = {
    ...value,
    meta: {
      ...value.meta,
      schemaVersion: APP_SCHEMA_VERSION,
    },
  };

  return isValidState(candidate) ? candidate : null;
}

function migrateV11State(value: unknown): AppState | null {
  if (!isRecord(value) || !isRecord(value.meta)) return null;
  const candidate: unknown = {
    ...value,
    meta: {
      ...value.meta,
      schemaVersion: APP_SCHEMA_VERSION,
    },
  };
  return isValidState(candidate) ? candidate : null;
}

function migrateV12State(value: unknown): AppState | null {
  if (!isRecord(value) || !isRecord(value.meta)) return null;
  const candidate: unknown = {
    ...value,
    meta: {
      ...value.meta,
      schemaVersion: APP_SCHEMA_VERSION,
    },
  };
  return isValidState(candidate) ? candidate : null;
}

function migrateV13State(value: unknown): AppState | null {
  if (!isRecord(value) || !isRecord(value.meta)) return null;
  const candidate: unknown = {
    ...value,
    meta: {
      ...value.meta,
      schemaVersion: APP_SCHEMA_VERSION,
    },
  };
  return isValidState(candidate) ? candidate : null;
}

export function loadPersistedState(): AppState | null {
  if (typeof window === "undefined") return null;

  const rawValue = window.localStorage.getItem(STORAGE_KEY);
  if (!rawValue) return null;

  try {
    const envelope: unknown = JSON.parse(rawValue);
    if (!isRecord(envelope) || !isIsoDate(envelope.savedAt)) {
      quarantineInvalidState(rawValue);
      return null;
    }

    if (
      envelope.schemaVersion === APP_SCHEMA_VERSION &&
      envelope.appVersion === "mvp-local-v14" &&
      isValidState(envelope.state)
    ) {
      return envelope.state;
    }

    if (
      envelope.schemaVersion === 13 &&
      envelope.appVersion === "mvp-local-v13"
    ) {
      const migrated = migrateV13State(envelope.state);
      if (migrated) return migrated;
    }

    if (
      envelope.schemaVersion === 12 &&
      envelope.appVersion === "mvp-local-v12"
    ) {
      const migrated = migrateV12State(envelope.state);
      if (migrated) return migrated;
    }

    if (
      envelope.schemaVersion === 11 &&
      envelope.appVersion === "mvp-local-v11"
    ) {
      const migrated = migrateV11State(envelope.state);
      if (migrated) return migrated;
    }

    if (
      envelope.schemaVersion === 10 &&
      envelope.appVersion === "mvp-local-v10"
    ) {
      const migrated = migrateV10State(envelope.state);
      if (migrated) return migrated;
    }

    if (envelope.schemaVersion === 9 && envelope.appVersion === "mvp-local-v9") {
      const migrated = migrateV9State(envelope.state);
      if (migrated) return migrated;
    }

    if (envelope.schemaVersion === 8 && envelope.appVersion === "mvp-local-v8") {
      const migrated = migrateV8State(envelope.state);
      if (migrated) return migrated;
    }

    if (envelope.schemaVersion === 7 && envelope.appVersion === "mvp-local-v7") {
      const migrated = migrateV7State(envelope.state);
      if (migrated) return migrated;
    }

    if (envelope.schemaVersion === 6 && envelope.appVersion === "mvp-local-v6") {
      const migrated = migrateV6State(envelope.state);
      if (migrated) return migrated;
    }

    if (envelope.schemaVersion === 5 && envelope.appVersion === "mvp-local-v5") {
      const migrated = migrateV5State(envelope.state);
      if (migrated) return migrated;
    }

    if (envelope.schemaVersion === 4 && envelope.appVersion === "mvp-local-v4") {
      const migrated = migrateV4State(envelope.state);
      if (migrated) return migrated;
    }

    if (envelope.schemaVersion === 3 && envelope.appVersion === "mvp-local-v3") {
      const migrated = migrateV3State(envelope.state);
      if (migrated) return migrated;
    }

    if (envelope.schemaVersion === 2 && envelope.appVersion === "mvp-local-v2") {
      const migrated = migrateV2State(envelope.state);
      if (migrated) return migrated;
    }

    if (
      envelope.schemaVersion === 1 &&
      envelope.appVersion === "mvp-local-v1"
    ) {
      const migrated = migrateLegacyState(envelope.state);
      if (migrated) return migrated;
    }

    quarantineInvalidState(rawValue);
    return null;
  } catch {
    quarantineInvalidState(rawValue);
    return null;
  }
}

export function savePersistedState(state: AppState): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(createEnvelope(state)));
}

export function clearPersistedState(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
  window.localStorage.removeItem(INVALID_STORAGE_KEY);
}
