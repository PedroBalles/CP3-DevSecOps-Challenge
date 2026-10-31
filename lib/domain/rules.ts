import type {
  BankChangeResult,
  BankChangeStageId,
  BankChangeSubmission,
  BankProcessV2Result,
  BankProcessV2Submission,
  CompetencyEvidence,
  CompetencyId,
  ConversationReconstructionV2Result,
  ConversationReconstructionV2Submission,
  DecisionKey,
  DomainAnalyzerV2Result,
  DomainAnalyzerV2Submission,
  LinkEvidenceKey,
  LinkToolKey,
  LinkVerdict,
  MissionResult,
  MissionSubmission,
  MfaConsoleV2Result,
  MfaConsoleV2Submission,
  PhishingFoundationV2Result,
  PhishingFoundationV2Submission,
  PhishLabResult,
  PhishLabSubmission,
  RecoveryActionId,
  RecoveryImmediateActionId,
  RecoveryMissionResult,
  RecoveryMissionSubmission,
  RecoveryBuilderV2Result,
  RecoveryBuilderV2Submission,
  RadarResult,
  RadarSubmission,
  SectorAggregate,
  SectorMetrics,
  SimulationResult,
  SimulationSubmission,
  WorkdayTriageV2Result,
  WorkdayTriageV2Submission,
  TeamChallengeResult,
  TeamChallengeSubmission,
  TrueSenderV2Result,
  TrueSenderV2Submission,
} from "./types";
import {
  findPhishingFoundationPackage,
  PHISHING_FOUNDATION_ACTIVITY_ID,
  PHISHING_FOUNDATION_ACTIVITY_VERSION,
  PHISHING_FOUNDATION_MECHANIC_ID,
} from "../content/activities/account-lock/v2";
import {
  BANK_CHANGE_ACTIVITY_ID,
  BANK_CHANGE_ACTIVITY_VERSION,
  BANK_CHANGE_CORRECT_CHOICES,
  BANK_CHANGE_CRITICAL_STAGES,
  BANK_CHANGE_EVIDENCE,
  BANK_CHANGE_EVIDENCE_ASSESSMENTS,
  BANK_CHANGE_INITIAL_ACTIONS,
  BANK_CHANGE_PROCESS_ACTIONS,
  BANK_CHANGE_REPORT_ACTIONS,
  BANK_CHANGE_VERIFICATION_ROUTES,
} from "../content/bank-change-catalog";
import {
  BANK_CHANGE_PROCESS_ACTIVITY_ID,
  BANK_CHANGE_PROCESS_ACTIVITY_VERSION,
  BANK_CHANGE_PROCESS_MECHANIC_ID,
  findBankChangeProcessV2Package,
} from "../content/activities/bank-change/v2";
import { DOMAIN_UNDER_MAGNIFIER_V1_PACKAGE } from "../content/activities/domain-under-magnifier/v1";
import {
  DOMAIN_ANALYZER_V2_ACTIVITY_ID,
  DOMAIN_ANALYZER_V2_ACTIVITY_VERSION,
  URL_ANATOMY_MECHANIC_ID,
  findDomainAnalyzerV2Package,
} from "../content/activities/domain-under-magnifier/v2";
import {
  CONVERSATION_RECONSTRUCTION_ACTIVITY_ID,
  CONVERSATION_RECONSTRUCTION_ACTIVITY_VERSION,
  CONVERSATION_RECONSTRUCTION_MECHANIC_ID,
  findConversationReconstructionPackage,
} from "../content/activities/compromised-conversation/v2";
import {
  findTrueSenderV2Package,
  IDENTITY_MAP_MECHANIC_ID,
  TRUE_SENDER_V2_ACTIVITY_ID,
  TRUE_SENDER_V2_ACTIVITY_VERSION,
} from "../content/activities/true-sender/v2";
import {
  findMfaConsoleV2Package,
  MFA_CONSOLE_ACTIVITY_ID,
  MFA_CONSOLE_ACTIVITY_VERSION,
  MFA_CONSOLE_MECHANIC_ID,
} from "../content/activities/mfa-console/v2";
import {
  findRecoveryBuilderV2Package,
  RECOVERY_BUILDER_ACTIVITY_ID,
  RECOVERY_BUILDER_ACTIVITY_VERSION,
  RECOVERY_BUILDER_MECHANIC_ID,
} from "../content/activities/recovery-builder/v2";
import {
  findRecoveryIncident,
  HARMFUL_RECOVERY_ACTION_IDS,
  RECOVERY_ACTION_OPTIONS,
  RECOVERY_IMMEDIATE_OPTIONS,
  RECOVERY_INCIDENTS,
  RECOVERY_REPORT_DETAIL_OPTIONS,
  SAFE_RECOVERY_REPORT_DETAIL_IDS,
} from "../content/recovery-mission-catalog";
import {
  WORKDAY_MESSAGES,
  WORKDAY_SIMULATION_ID,
  WORKDAY_SIMULATION_VERSION,
} from "../content/simulation-catalog";
import {
  findWorkdayTriageV2Package,
  WORKDAY_TRIAGE_ACTIVITY_ID,
  WORKDAY_TRIAGE_ACTIVITY_VERSION,
  WORKDAY_TRIAGE_MECHANIC_ID,
} from "../content/activities/workday-triage/v2";
import {
  RADAR_CORRECT_OPTION_ID,
  RADAR_FEATURED_ARTICLE_ID,
  RADAR_FEATURED_ARTICLE_VERSION,
  RADAR_QUESTION_OPTIONS,
} from "../content/radar-catalog";
import {
  TEAM_CHALLENGE_CASES,
  TEAM_CHALLENGE_ID,
  TEAM_CHALLENGE_VERSION,
} from "../content/team-challenge-catalog";

export const PILOT_MISSION_ID = "mission:account-lock";
export const PILOT_MISSION_VERSION = 1;
export const PILOT_MISSION_REWARD_CLAIM =
  `${PILOT_MISSION_ID}:first-completion`;
export const PILOT_MISSION_TEAM_CLAIM =
  `team:${PILOT_MISSION_ID}:first-contribution`;
export const COMPROMISED_CONVERSATION_MISSION_ID =
  "mission:compromised-conversation";
export const COMPROMISED_CONVERSATION_MISSION_VERSION = 1;
export const COMPROMISED_CONVERSATION_REWARD_CLAIM =
  `${COMPROMISED_CONVERSATION_MISSION_ID}:first-completion`;
export const COMPROMISED_CONVERSATION_TEAM_CLAIM =
  `team:${COMPROMISED_CONVERSATION_MISSION_ID}:first-contribution`;
export const MFA_FATIGUE_MISSION_ID = "mission:mfa-fatigue";
export const MFA_FATIGUE_MISSION_VERSION = 1;
export const MFA_FATIGUE_REWARD_CLAIM =
  `${MFA_FATIGUE_MISSION_ID}:first-completion`;
export const MFA_FATIGUE_TEAM_CLAIM =
  `team:${MFA_FATIGUE_MISSION_ID}:first-contribution`;
export const RECOVERY_MISSION_ID = "mission:clicked-now-what";
export const RECOVERY_MISSION_VERSION = 1;
export const RECOVERY_MISSION_REWARD_CLAIM =
  `${RECOVERY_MISSION_ID}:first-completion`;
export const RECOVERY_MISSION_TEAM_CLAIM =
  `team:${RECOVERY_MISSION_ID}:first-contribution`;
export const PHISHLAB_ACTIVITY_ID = "phishlab:link-analyzer";
export const PHISHLAB_ACTIVITY_VERSION = 1;
export const PHISHLAB_REWARD_CLAIM =
  `${PHISHLAB_ACTIVITY_ID}:first-completion`;
export const PHISHLAB_TEAM_CLAIM =
  `team:${PHISHLAB_ACTIVITY_ID}:first-contribution`;
export const SENDER_INSPECTOR_ACTIVITY_ID = "phishlab:true-sender";
export const SENDER_INSPECTOR_ACTIVITY_VERSION = 1;
export const SENDER_INSPECTOR_REWARD_CLAIM =
  `${SENDER_INSPECTOR_ACTIVITY_ID}:first-completion`;
export const SENDER_INSPECTOR_TEAM_CLAIM =
  `team:${SENDER_INSPECTOR_ACTIVITY_ID}:first-contribution`;
export const SIMULATION_ACTIVITY_ID = WORKDAY_SIMULATION_ID;
export const SIMULATION_ACTIVITY_VERSION = WORKDAY_SIMULATION_VERSION;
export const SIMULATION_REWARD_CLAIM =
  `${SIMULATION_ACTIVITY_ID}:first-completion`;
export const SIMULATION_TEAM_CLAIM =
  `team:${SIMULATION_ACTIVITY_ID}:first-contribution`;
export const RADAR_ACTIVITY_ID = RADAR_FEATURED_ARTICLE_ID;
export const RADAR_ACTIVITY_VERSION = RADAR_FEATURED_ARTICLE_VERSION;
export const RADAR_REWARD_CLAIM = `${RADAR_ACTIVITY_ID}:first-completion`;
export const TEAM_CHALLENGE_ACTIVITY_ID = TEAM_CHALLENGE_ID;
export const TEAM_CHALLENGE_ACTIVITY_VERSION = TEAM_CHALLENGE_VERSION;
export const TEAM_CHALLENGE_REWARD_CLAIM =
  `${TEAM_CHALLENGE_ACTIVITY_ID}:first-completion`;
export const TEAM_CHALLENGE_AGGREGATE_CLAIM =
  `team:${TEAM_CHALLENGE_ACTIVITY_ID}:first-aggregate-contribution`;
export const BANK_CHANGE_REWARD_CLAIM =
  `${BANK_CHANGE_ACTIVITY_ID}:first-completion`;
export const BANK_CHANGE_AGGREGATE_CLAIM =
  `team:${BANK_CHANGE_ACTIVITY_ID}:first-aggregate-contribution`;

export const POINT_RULES = {
  mainMission: 100,
  secondaryMission: 40,
  simulation: 70,
  phishLab: 60,
  teamOperation: 80,
  radar: 5,
} as const;

export type MissionRuntimeDefinition = {
  activityId: string;
  activityVersion: number;
  title: string;
  rewardClaimKey: string;
  teamClaimKey: string;
  reviewTargetActivityId: string;
  reviewReason: string;
};

export type PhishLabRuntimeDefinition = {
  activityId: string;
  activityVersion: number;
  title: string;
  rewardClaimKey: string;
  teamClaimKey: string;
  nextActivityId: string;
  nextReason: string;
};

export type RecoveryMissionRuntimeDefinition = {
  activityId: string;
  activityVersion: number;
  title: string;
  rewardClaimKey: string;
  teamClaimKey: string;
  reviewTargetActivityId: string;
  reviewReason: string;
};

const RECOVERY_MISSION_RUNTIME_DEFINITION: RecoveryMissionRuntimeDefinition = {
  activityId: RECOVERY_MISSION_ID,
  activityVersion: RECOVERY_MISSION_VERSION,
  title: "Cliquei. E agora?",
  rewardClaimKey: RECOVERY_MISSION_REWARD_CLAIM,
  teamClaimKey: RECOVERY_MISSION_TEAM_CLAIM,
  reviewTargetActivityId: RECOVERY_MISSION_ID,
  reviewReason:
    "Revisar a ordem de contenção, reporte e recuperação proporcional ao que aconteceu.",
};

const MISSION_RUNTIME_DEFINITIONS: Readonly<
  Record<string, MissionRuntimeDefinition>
> = {
  [PILOT_MISSION_ID]: {
    activityId: PILOT_MISSION_ID,
    activityVersion: PILOT_MISSION_VERSION,
    title: "O aviso que não podia esperar",
    rewardClaimKey: PILOT_MISSION_REWARD_CLAIM,
    teamClaimKey: PILOT_MISSION_TEAM_CLAIM,
    reviewTargetActivityId: PHISHLAB_ACTIVITY_ID,
    reviewReason: "Reforçar a investigação de domínio e destino de links.",
  },
  [COMPROMISED_CONVERSATION_MISSION_ID]: {
    activityId: COMPROMISED_CONVERSATION_MISSION_ID,
    activityVersion: COMPROMISED_CONVERSATION_MISSION_VERSION,
    title: "A conversa já estava acontecendo",
    rewardClaimKey: COMPROMISED_CONVERSATION_REWARD_CLAIM,
    teamClaimKey: COMPROMISED_CONVERSATION_TEAM_CLAIM,
    reviewTargetActivityId: SENDER_INSPECTOR_ACTIVITY_ID,
    reviewReason:
      "Reforçar a diferença entre a conta que enviou a mensagem e a pessoa que pode estar controlando essa conta.",
  },
  [MFA_FATIGUE_MISSION_ID]: {
    activityId: MFA_FATIGUE_MISSION_ID,
    activityVersion: MFA_FATIGUE_MISSION_VERSION,
    title: "Você iniciou este acesso?",
    rewardClaimKey: MFA_FATIGUE_REWARD_CLAIM,
    teamClaimKey: MFA_FATIGUE_TEAM_CLAIM,
    reviewTargetActivityId: SENDER_INSPECTOR_ACTIVITY_ID,
    reviewReason:
      "Revisar como confirmar a identidade de um suporte antes de confiar em um pedido de aprovação ou compartilhamento de código.",
  },
};

const PHISHLAB_RUNTIME_DEFINITIONS: Readonly<
  Record<string, PhishLabRuntimeDefinition>
> = {
  [PHISHLAB_ACTIVITY_ID]: {
    activityId: PHISHLAB_ACTIVITY_ID,
    activityVersion: PHISHLAB_ACTIVITY_VERSION,
    title: "Domínio sob a lupa",
    rewardClaimKey: PHISHLAB_REWARD_CLAIM,
    teamClaimKey: PHISHLAB_TEAM_CLAIM,
    nextActivityId: SIMULATION_ACTIVITY_ID,
    nextReason:
      "Aplicar a análise de domínio em uma caixa com mensagens legítimas, suspeitas e que exigem verificação.",
  },
  [SENDER_INSPECTOR_ACTIVITY_ID]: {
    activityId: SENDER_INSPECTOR_ACTIVITY_ID,
    activityVersion: SENDER_INSPECTOR_ACTIVITY_VERSION,
    title: "Quem enviou de verdade?",
    rewardClaimKey: SENDER_INSPECTOR_REWARD_CLAIM,
    teamClaimKey: SENDER_INSPECTOR_TEAM_CLAIM,
    nextActivityId: PHISHLAB_ACTIVITY_ID,
    nextReason:
      "Continuar a investigação separando palavras familiares do domínio que realmente controla o destino.",
  },
};

export function getMissionRuntimeDefinition(
  activityId: string,
): MissionRuntimeDefinition | null {
  return MISSION_RUNTIME_DEFINITIONS[activityId] ?? null;
}

export function getPhishLabRuntimeDefinition(
  activityId: string,
): PhishLabRuntimeDefinition | null {
  return PHISHLAB_RUNTIME_DEFINITIONS[activityId] ?? null;
}

export function getRecoveryMissionRuntimeDefinition(
  activityId: string,
): RecoveryMissionRuntimeDefinition | null {
  return activityId === RECOVERY_MISSION_ID
    ? RECOVERY_MISSION_RUNTIME_DEFINITION
    : null;
}

export const LEVEL_RULES = [
  { id: "fundacao", label: "Fundação", minimum: 0 },
  { id: "estrutura", label: "Estrutura", minimum: 300 },
  { id: "reforco", label: "Reforço", minimum: 700 },
  { id: "protecao", label: "Proteção", minimum: 1200 },
  { id: "resiliencia", label: "Resiliência", minimum: 2000 },
] as const;

const DECISION_POINTS: Record<DecisionKey, number> = {
  reportar: 40,
  verificar: 32,
  excluir: 20,
  abrir: 0,
};

const CORRECT_REASON_IDS = new Set(["domain", "urgency", "destination"]);
const INCORRECT_REASON_IDS = new Set(["visual"]);
const EVIDENCE_IDS = new Set(["sender", "link", "context"]);
const REASON_IDS = new Set(["domain", "urgency", "visual", "destination"]);

export function isValidMissionSubmission(
  submission: MissionSubmission,
): boolean {
  const definition = getMissionRuntimeDefinition(submission.activityId);

  return (
    Boolean(definition) &&
    submission.activityVersion === definition?.activityVersion &&
    typeof submission.attemptId === "string" &&
    submission.attemptId.length > 0 &&
    typeof submission.completedAt === "string" &&
    !Number.isNaN(Date.parse(submission.completedAt)) &&
    Object.prototype.hasOwnProperty.call(DECISION_POINTS, submission.decision) &&
    Array.isArray(submission.inspectedEvidence) &&
    submission.inspectedEvidence.every((evidence) => EVIDENCE_IDS.has(evidence)) &&
    Array.isArray(submission.selectedReasonIds) &&
    submission.selectedReasonIds.every((reason) => REASON_IDS.has(reason))
  );
}

export function isValidPilotMissionSubmission(
  submission: MissionSubmission,
): boolean {
  return (
    submission.activityId === PILOT_MISSION_ID &&
    isValidMissionSubmission(submission)
  );
}

export function calculatePerformanceBonus(score: number): number {
  if (score >= 90) return 0.3;
  if (score >= 75) return 0.2;
  if (score >= 60) return 0.1;
  return 0;
}

export function calculateMissionReward(score: number): number {
  return Math.round(
    POINT_RULES.mainMission * (1 + calculatePerformanceBonus(score)),
  );
}

export function calculateActivityReward(
  basePoints: number,
  score: number,
): number {
  return Math.round(basePoints * (1 + calculatePerformanceBonus(score)));
}

export function evaluatePilotMission(
  submission: MissionSubmission,
): MissionResult {
  const uniqueEvidence = new Set(submission.inspectedEvidence);
  const uniqueReasons = new Set(submission.selectedReasonIds);
  const correctReasons = [...uniqueReasons].filter((reason) =>
    CORRECT_REASON_IDS.has(reason),
  ).length;
  const incorrectReasons = [...uniqueReasons].filter((reason) =>
    INCORRECT_REASON_IDS.has(reason),
  ).length;
  const score = Math.max(
    0,
    Math.min(
      100,
      DECISION_POINTS[submission.decision] +
        uniqueEvidence.size * 8 +
        correctReasons * 12 -
        incorrectReasons * 10,
    ),
  );

  return {
    score,
    decision: submission.decision,
    inspected: uniqueEvidence.size,
    correctReasons,
    teamPoints:
      submission.decision === "reportar"
        ? 12
        : submission.decision === "verificar"
          ? 8
          : submission.decision === "excluir"
            ? 5
            : 2,
    needsReview: score < 75 || submission.decision === "abrir",
    potentialReward: calculateMissionReward(score),
  };
}

export function evaluateMission(submission: MissionSubmission): MissionResult {
  if (!isValidMissionSubmission(submission)) {
    throw new Error("Tentativa de Missão inválida ou incompatível com o catálogo.");
  }

  return evaluatePilotMission(submission);
}

function decisionCompetencyScore(decision: DecisionKey): number {
  if (decision === "reportar") return 100;
  if (decision === "verificar") return 80;
  if (decision === "excluir") return 55;
  return 10;
}

export function createMissionCompetencyEvidence(
  submission: MissionSubmission,
  result: MissionResult,
): CompetencyEvidence[] {
  const values: Array<[CompetencyId, number]> = [
    ["observar", Math.min(100, result.inspected * 30)],
    ["investigar", result.score],
    ["decidir", decisionCompetencyScore(result.decision)],
    ["reportar", result.decision === "reportar" ? 100 : 40],
  ];

  return values.map(([competencyId, score]) => ({
    key: `${submission.activityId}:${competencyId}:${submission.attemptId}`,
    competencyId,
    activityId: submission.activityId,
    attemptId: submission.attemptId,
    score,
    context: "independent",
    createdAt: submission.completedAt,
  }));
}

export function isValidPhishingFoundationV2Submission(
  submission: PhishingFoundationV2Submission,
): boolean {
  const contentPackage = findPhishingFoundationPackage(
    submission.casePackageId,
  );

  if (
    !contentPackage ||
    submission.activityId !== PHISHING_FOUNDATION_ACTIVITY_ID ||
    submission.activityVersion !== PHISHING_FOUNDATION_ACTIVITY_VERSION ||
    submission.mechanicId !== PHISHING_FOUNDATION_MECHANIC_ID ||
    typeof submission.attemptId !== "string" ||
    submission.attemptId.length === 0 ||
    typeof submission.completedAt !== "string" ||
    Number.isNaN(Date.parse(submission.completedAt)) ||
    !Array.isArray(submission.reportDetailIds) ||
    submission.reportDetailIds.length === 0 ||
    new Set(submission.reportDetailIds).size !==
      submission.reportDetailIds.length
  ) {
    return false;
  }

  const allowlists = contentPackage.allowlists;

  return (
    allowlists.requestedActionIds.includes(submission.requestedActionId) &&
    allowlists.protectedAssetIds.includes(submission.protectedAssetId) &&
    allowlists.consequenceIds.includes(submission.potentialConsequenceId) &&
    allowlists.pauseDecisionIds.includes(submission.pauseDecisionId) &&
    allowlists.evaluationIds.includes(submission.evaluationId) &&
    allowlists.confirmationRouteIds.includes(submission.confirmationRouteId) &&
    allowlists.assessmentIds.includes(submission.finalAssessmentId) &&
    allowlists.finalActionIds.includes(submission.finalActionId) &&
    submission.reportDetailIds.every((detailId) =>
      allowlists.reportDetailIds.includes(detailId),
    ) &&
    allowlists.transferDecisionIds.includes(submission.transferDecisionId)
  );
}

export function evaluatePhishingFoundationV2(
  submission: PhishingFoundationV2Submission,
): PhishingFoundationV2Result {
  if (!isValidPhishingFoundationV2Submission(submission)) {
    throw new Error(
      "Tentativa da fundação de phishing inválida ou incompatível com o pacote publicado.",
    );
  }

  const contentPackage = findPhishingFoundationPackage(
    submission.casePackageId,
  )!;
  const allowlists = contentPackage.allowlists;
  const requestImpactMatches = [
    submission.requestedActionId === allowlists.correctRequestedActionId,
    submission.protectedAssetId === allowlists.correctProtectedAssetId,
    submission.potentialConsequenceId === allowlists.correctConsequenceId,
  ].filter(Boolean).length;
  const requestImpactPoints =
    requestImpactMatches === 3 ? 20 : requestImpactMatches === 2 ? 10 : 0;
  const pauseIsCorrect =
    submission.pauseDecisionId === allowlists.correctPauseDecisionId;
  const evaluationIsCorrect =
    submission.evaluationId === allowlists.correctEvaluationId;
  const pauseEvaluationPoints =
    pauseIsCorrect && evaluationIsCorrect
      ? 15
      : pauseIsCorrect || evaluationIsCorrect
        ? 7
        : 0;
  const confirmationIsCorrect =
    submission.confirmationRouteId === allowlists.correctConfirmationRouteId;
  const confirmationPoints = confirmationIsCorrect
    ? 25
    : submission.confirmationRouteId === "generic-search"
      ? 8
      : 0;
  const assessmentIsCorrect =
    submission.finalAssessmentId === allowlists.correctAssessmentId;
  const actionIsCorrect =
    submission.finalActionId === allowlists.correctFinalActionId;
  const reportIsCorrect = sameStringSet(
    submission.reportDetailIds,
    allowlists.safeReportDetailIds,
  );
  const correctReportDetails = submission.reportDetailIds.filter((detailId) =>
    allowlists.safeReportDetailIds.includes(detailId),
  ).length;
  const responseReportPoints =
    assessmentIsCorrect && actionIsCorrect && reportIsCorrect
      ? 25
      : confirmationIsCorrect && actionIsCorrect && !reportIsCorrect
        ? 18
        : submission.finalActionId === "delete-only"
          ? 8
          : 0;
  const transferIsCorrect =
    submission.transferDecisionId === allowlists.correctTransferDecisionId;
  const transferPoints = transferIsCorrect
    ? 15
    : submission.transferDecisionId === "report-as-attack"
      ? 10
      : submission.transferDecisionId === "discard-without-checking"
        ? 5
        : 0;
  const criticalFailureIds = [
    ...(!pauseIsCorrect ? ["pause-before-action"] : []),
    ...(!confirmationIsCorrect ? ["independent-confirmation"] : []),
    ...(!actionIsCorrect ? ["safe-response"] : []),
    ...(!reportIsCorrect ? ["safe-report"] : []),
    ...(!transferIsCorrect ? ["legitimate-transfer"] : []),
  ];
  const score = Math.max(
    0,
    Math.min(
      100,
      requestImpactPoints +
        pauseEvaluationPoints +
        confirmationPoints +
        responseReportPoints +
        transferPoints,
    ),
  );

  return {
    score,
    requestImpactPoints,
    pauseEvaluationPoints,
    confirmationPoints,
    responseReportPoints,
    transferPoints,
    correctReportDetails,
    totalSafeReportDetails: allowlists.safeReportDetailIds.length,
    criticalFailureIds,
    teamPoints:
      criticalFailureIds.length === 0
        ? 12
        : criticalFailureIds.length === 1
          ? 8
          : criticalFailureIds.length <= 3
            ? 5
            : 2,
    needsReview: score < 75 || criticalFailureIds.length > 0,
    potentialReward: calculateMissionReward(score),
  };
}

export function createPhishingFoundationV2CompetencyEvidence(
  submission: PhishingFoundationV2Submission,
  result: PhishingFoundationV2Result,
): CompetencyEvidence[] {
  const values: Array<[CompetencyId, number]> = [
    ["observar", Math.round((result.requestImpactPoints / 20) * 100)],
    ["investigar", Math.round((result.pauseEvaluationPoints / 15) * 100)],
    ["verificar", Math.round((result.confirmationPoints / 25) * 100)],
    [
      "decidir",
      Math.round(((result.responseReportPoints + result.transferPoints) / 40) * 100),
    ],
    ["reportar", Math.round((result.responseReportPoints / 25) * 100)],
  ];

  return values.map(([competencyId, score]) => ({
    key: `${submission.activityId}:${competencyId}:${submission.attemptId}`,
    competencyId,
    activityId: submission.activityId,
    attemptId: submission.attemptId,
    score: Math.max(0, Math.min(100, score)),
    context: "guided",
    createdAt: submission.completedAt,
  }));
}

function sameStringSet(left: readonly string[], right: readonly string[]) {
  return (
    left.length === right.length &&
    new Set(left).size === left.length &&
    left.every((item) => right.includes(item))
  );
}

export function isValidConversationReconstructionV2Submission(
  submission: ConversationReconstructionV2Submission,
): boolean {
  const contentPackage = findConversationReconstructionPackage(
    submission.casePackageId,
  );

  if (
    !contentPackage ||
    submission.activityId !== CONVERSATION_RECONSTRUCTION_ACTIVITY_ID ||
    submission.activityVersion !== CONVERSATION_RECONSTRUCTION_ACTIVITY_VERSION ||
    submission.mechanicId !== CONVERSATION_RECONSTRUCTION_MECHANIC_ID ||
    typeof submission.attemptId !== "string" ||
    submission.attemptId.length === 0 ||
    typeof submission.completedAt !== "string" ||
    Number.isNaN(Date.parse(submission.completedAt)) ||
    !Array.isArray(submission.orderedArtifactIds) ||
    !sameStringSet(
      submission.orderedArtifactIds,
      contentPackage.allowlists.messageIds,
    ) ||
    !contentPackage.allowlists.messageIds.includes(
      submission.turningPointArtifactId,
    ) ||
    !Array.isArray(submission.evidenceAssessments) ||
    submission.evidenceAssessments.length < 3 ||
    new Set(
      submission.evidenceAssessments.map((assessment) => assessment.evidenceId),
    ).size !== submission.evidenceAssessments.length
  ) {
    return false;
  }

  const allowlists = contentPackage.allowlists;
  const allowedReportDetailIds = new Set<string>(allowlists.reportDetailIds);
  const evidenceIsValid = submission.evidenceAssessments.every(
    (assessment) =>
      allowlists.evidenceIds.includes(assessment.evidenceId) &&
      allowlists.evidenceClassificationIds.includes(
        assessment.classificationId,
      ),
  );
  const reportDetailsAreValid =
    new Set(submission.reportDetailIds).size ===
      submission.reportDetailIds.length &&
    submission.reportDetailIds.every((detailId) =>
      allowedReportDetailIds.has(detailId),
    ) &&
    (allowlists.requiresIncidentReport
      ? submission.reportDetailIds.length > 0
      : submission.reportDetailIds.length === 0);

  return (
    evidenceIsValid &&
    allowlists.conclusionIds.includes(submission.provisionalConclusionId) &&
    allowlists.conclusionIds.includes(submission.finalConclusionId) &&
    allowlists.confirmationRouteIds.includes(submission.confirmationRouteId) &&
    allowlists.finalActionIds.includes(submission.finalActionId) &&
    reportDetailsAreValid &&
    allowlists.transferDecisionIds.includes(submission.transferDecisionId)
  );
}

function calculateOrderRatio(
  submitted: readonly string[],
  correct: readonly string[],
): number {
  const submittedPosition = new Map(
    submitted.map((artifactId, index) => [artifactId, index]),
  );
  let correctPairs = 0;
  let totalPairs = 0;

  for (let left = 0; left < correct.length; left += 1) {
    for (let right = left + 1; right < correct.length; right += 1) {
      totalPairs += 1;
      if (
        (submittedPosition.get(correct[left]) ?? Number.MAX_SAFE_INTEGER) <
        (submittedPosition.get(correct[right]) ?? Number.MAX_SAFE_INTEGER)
      ) {
        correctPairs += 1;
      }
    }
  }

  return totalPairs === 0 ? 1 : correctPairs / totalPairs;
}

export function evaluateConversationReconstructionV2(
  submission: ConversationReconstructionV2Submission,
): ConversationReconstructionV2Result {
  if (!isValidConversationReconstructionV2Submission(submission)) {
    throw new Error(
      "Tentativa de reconstrução inválida ou incompatível com o pacote.",
    );
  }

  const contentPackage = findConversationReconstructionPackage(
    submission.casePackageId,
  );
  if (!contentPackage) {
    throw new Error("Pacote de reconstrução não publicado.");
  }

  const allowlists = contentPackage.allowlists;
  const reconstructionPoints = Math.round(
    calculateOrderRatio(
      submission.orderedArtifactIds,
      allowlists.correctMessageOrder,
    ) * 20,
  );
  const turningPointIsCorrect = allowlists.acceptedTurningPointIds.includes(
    submission.turningPointArtifactId,
  );
  const turningPointPoints = turningPointIsCorrect ? 20 : 0;
  const correctEvidenceAssessments = submission.evidenceAssessments.filter(
    (assessment) =>
      allowlists.correctEvidenceClassifications[assessment.evidenceId] ===
      assessment.classificationId,
  ).length;
  const totalEvidenceAssessments = allowlists.evidenceIds.length;
  const evidencePoints = Math.round(
    (correctEvidenceAssessments / totalEvidenceAssessments) * 20,
  );
  const provisionalIsCorrect =
    allowlists.correctProvisionalConclusionIds.includes(
      submission.provisionalConclusionId,
    );
  const finalConclusionIsCorrect =
    submission.finalConclusionId === allowlists.correctFinalConclusionId;
  const transferIsCorrect =
    submission.transferDecisionId === allowlists.correctTransferDecisionId;
  const calibrationPoints =
    (provisionalIsCorrect ? 5 : 0) +
    (finalConclusionIsCorrect ? 5 : 0) +
    (transferIsCorrect ? 5 : 0);
  const confirmationIsCorrect =
    submission.confirmationRouteId === allowlists.correctConfirmationRouteId;
  const confirmationPoints = confirmationIsCorrect ? 15 : 0;
  const actionIsCorrect =
    submission.finalActionId === allowlists.correctFinalActionId;
  const reportIsCorrect = sameStringSet(
    submission.reportDetailIds,
    allowlists.safeReportDetailIds,
  );
  const responsePoints =
    (actionIsCorrect ? 5 : 0) + (reportIsCorrect ? 5 : 0);
  const criticalFailureIds = [
    ...(!turningPointIsCorrect ? ["turning-point"] : []),
    ...(!confirmationIsCorrect ? ["independent-route"] : []),
    ...(!actionIsCorrect ? ["safe-action"] : []),
    ...(allowlists.requiresIncidentReport && !reportIsCorrect
      ? ["safe-report"]
      : []),
  ];
  const score = Math.max(
    0,
    Math.min(
      100,
      reconstructionPoints +
        turningPointPoints +
        evidencePoints +
        calibrationPoints +
        confirmationPoints +
        responsePoints,
    ),
  );

  return {
    score,
    reconstructionPoints,
    turningPointPoints,
    evidencePoints,
    calibrationPoints,
    confirmationPoints,
    responsePoints,
    correctEvidenceAssessments,
    totalEvidenceAssessments,
    criticalFailureIds,
    teamPoints:
      criticalFailureIds.length === 0
        ? 12
        : criticalFailureIds.length === 1
          ? 8
          : 4,
    needsReview: score < 75 || criticalFailureIds.length > 0,
    potentialReward: calculateMissionReward(score),
  };
}

export function createConversationReconstructionV2CompetencyEvidence(
  submission: ConversationReconstructionV2Submission,
  result: ConversationReconstructionV2Result,
): CompetencyEvidence[] {
  const values: Array<[CompetencyId, number]> = [
    [
      "observar",
      Math.round(
        ((result.reconstructionPoints + result.turningPointPoints) / 40) *
          100,
      ),
    ],
    [
      "investigar",
      Math.round(((result.evidencePoints + result.calibrationPoints) / 35) * 100),
    ],
    ["verificar", Math.round((result.confirmationPoints / 15) * 100)],
    ["reportar", Math.round((result.responsePoints / 10) * 100)],
  ];

  return values.map(([competencyId, score]) => ({
    key: `${submission.activityId}:${competencyId}:${submission.attemptId}`,
    competencyId,
    activityId: submission.activityId,
    attemptId: submission.attemptId,
    score: Math.max(0, Math.min(100, score)),
    context: "independent",
    createdAt: submission.completedAt,
  }));
}

export function isValidMfaConsoleV2Submission(
  submission: MfaConsoleV2Submission,
): boolean {
  const contentPackage = findMfaConsoleV2Package(submission.casePackageId);

  if (
    !contentPackage ||
    submission.activityId !== MFA_CONSOLE_ACTIVITY_ID ||
    submission.activityVersion !== MFA_CONSOLE_ACTIVITY_VERSION ||
    submission.mechanicId !== MFA_CONSOLE_MECHANIC_ID ||
    typeof submission.attemptId !== "string" ||
    submission.attemptId.length === 0 ||
    typeof submission.completedAt !== "string" ||
    Number.isNaN(Date.parse(submission.completedAt)) ||
    !Array.isArray(submission.eventInitiationAssociations) ||
    !Array.isArray(submission.eventActions) ||
    !Array.isArray(submission.supportResponseIds) ||
    !Array.isArray(submission.officialConsoleActionIds) ||
    !Array.isArray(submission.reportDetailIds)
  ) {
    return false;
  }

  const allowlists = contentPackage.allowlists;
  const submittedAssociationEventIds = submission.eventInitiationAssociations.map(
    (item) => item.eventId,
  );
  const submittedActionEventIds = submission.eventActions.map(
    (item) => item.eventId,
  );
  const associationsAreValid =
    sameStringSet(submittedAssociationEventIds, allowlists.eventIds) &&
    submission.eventInitiationAssociations.every(
      (item) =>
        allowlists.eventIds.includes(item.eventId) &&
        allowlists.associationIds.includes(item.associationId),
    );
  const eventActionsAreValid =
    sameStringSet(submittedActionEventIds, allowlists.eventIds) &&
    submission.eventActions.every(
      (item) =>
        allowlists.eventIds.includes(item.eventId) &&
        allowlists.eventActionIds.includes(item.actionId),
    );
  const supportResponsesAreValid =
    submission.supportResponseIds.length >= 1 &&
    submission.supportResponseIds.length <= 2 &&
    submission.supportResponseIds.every((responseId) =>
      allowlists.supportResponseIds.includes(responseId),
    );
  const consoleActionsAreValid =
    new Set(submission.officialConsoleActionIds).size ===
      submission.officialConsoleActionIds.length &&
    submission.officialConsoleActionIds.every((actionId) =>
      allowlists.officialConsoleActionIds.includes(actionId),
    );
  const reportDetailsAreValid =
    new Set(submission.reportDetailIds).size === submission.reportDetailIds.length &&
    submission.reportDetailIds.every((detailId) =>
      allowlists.reportDetailIds.includes(detailId),
    );

  return (
    associationsAreValid &&
    eventActionsAreValid &&
    supportResponsesAreValid &&
    allowlists.officialEntryRouteIds.includes(submission.officialEntryRouteId) &&
    consoleActionsAreValid &&
    reportDetailsAreValid &&
    allowlists.transferAssociationIds.includes(
      submission.transferAssociationId,
    ) &&
    allowlists.transferActionIds.includes(submission.transferActionId)
  );
}

export function evaluateMfaConsoleV2(
  submission: MfaConsoleV2Submission,
): MfaConsoleV2Result {
  if (!isValidMfaConsoleV2Submission(submission)) {
    throw new Error("Tentativa do console de MFA inválida ou incompatível.");
  }

  const contentPackage = findMfaConsoleV2Package(submission.casePackageId);
  if (!contentPackage) {
    throw new Error("Pacote do console de MFA não publicado.");
  }

  const allowlists = contentPackage.allowlists;
  const correctAssociationsInEvents =
    submission.eventInitiationAssociations.filter(
      (item) =>
        allowlists.correctAssociationByEventId[item.eventId] ===
        item.associationId,
    ).length;
  const transferAssociationIsCorrect =
    submission.transferAssociationId ===
    allowlists.correctTransferAssociationId;
  const correctAssociations =
    correctAssociationsInEvents + (transferAssociationIsCorrect ? 1 : 0);
  const totalAssociations = allowlists.eventIds.length + 1;
  const contextAssociationPoints = Math.round(
    (correctAssociations / totalAssociations) * 15,
  );

  const correctActionsInEvents = submission.eventActions.filter(
    (item) =>
      allowlists.correctActionByEventId[item.eventId] === item.actionId,
  ).length;
  const transferActionIsCorrect =
    submission.transferActionId === allowlists.correctTransferActionId;
  const correctEventActions =
    correctActionsInEvents + (transferActionIsCorrect ? 1 : 0);
  const totalEventActions = allowlists.eventIds.length + 1;
  const eventDecisionPoints = Math.round(
    (correctEventActions / totalEventActions) * 25,
  );

  const unsafeSupportResponse = submission.supportResponseIds.some(
    (responseId) => !allowlists.safeSupportResponseIds.includes(responseId),
  );
  const supportEndsSafely =
    submission.supportResponseIds.at(-1) === "end-contact";
  const unsafeEventApproval = submission.eventActions.some(
    (item) =>
      item.actionId === "approve" &&
      allowlists.correctActionByEventId[item.eventId] !== "approve",
  );
  const factorSupportPoints =
    !unsafeSupportResponse && supportEndsSafely && !unsafeEventApproval ? 20 : 0;

  const officialRouteIsCorrect =
    submission.officialEntryRouteId === allowlists.correctOfficialEntryRouteId;
  const officialRoutePoints = officialRouteIsCorrect ? 15 : 0;
  const harmfulConsoleAction = submission.officialConsoleActionIds.includes(
    "keep-everything",
  );
  const requiredConsoleActionsSelected =
    allowlists.requiredOfficialConsoleActionIds.filter((actionId) =>
      submission.officialConsoleActionIds.includes(actionId),
    ).length;
  const consolePoints = harmfulConsoleAction
    ? 0
    : Math.round(
        (requiredConsoleActionsSelected /
          allowlists.requiredOfficialConsoleActionIds.length) *
          15,
      );
  const reportIsSafe = sameStringSet(
    submission.reportDetailIds,
    allowlists.safeReportDetailIds,
  );
  const recoveryReportPoints = consolePoints + (reportIsSafe ? 10 : 0);

  const criticalFailureIds = [
    ...(unsafeEventApproval ? ["unsafe-factor-approval"] : []),
    ...(!supportEndsSafely || unsafeSupportResponse
      ? ["unsafe-support-contact"]
      : []),
    ...(!officialRouteIsCorrect ? ["independent-route"] : []),
    ...(harmfulConsoleAction ||
    requiredConsoleActionsSelected <
      allowlists.requiredOfficialConsoleActionIds.length
      ? ["recovery-actions"]
      : []),
    ...(!reportIsSafe ? ["safe-report"] : []),
    ...(!transferAssociationIsCorrect || !transferActionIsCorrect
      ? ["transfer"]
      : []),
  ];
  const score = Math.max(
    0,
    Math.min(
      100,
      contextAssociationPoints +
        eventDecisionPoints +
        factorSupportPoints +
        officialRoutePoints +
        recoveryReportPoints,
    ),
  );

  return {
    score,
    contextAssociationPoints,
    eventDecisionPoints,
    factorSupportPoints,
    officialRoutePoints,
    recoveryReportPoints,
    correctAssociations,
    totalAssociations,
    correctEventActions,
    totalEventActions,
    criticalFailureIds,
    teamPoints:
      criticalFailureIds.length === 0
        ? 12
        : criticalFailureIds.length === 1
          ? 8
          : 4,
    needsReview: score < 75 || criticalFailureIds.length > 0,
    potentialReward: calculateMissionReward(score),
  };
}

export function createMfaConsoleV2CompetencyEvidence(
  submission: MfaConsoleV2Submission,
  result: MfaConsoleV2Result,
): CompetencyEvidence[] {
  const values: Array<[CompetencyId, number]> = [
    ["investigar", Math.round((result.contextAssociationPoints / 15) * 100)],
    ["verificar", Math.round((result.officialRoutePoints / 15) * 100)],
    [
      "decidir",
      Math.round(
        ((result.eventDecisionPoints + result.factorSupportPoints) / 45) * 100,
      ),
    ],
    ["reportar", Math.round((result.recoveryReportPoints / 25) * 100)],
  ];

  return values.map(([competencyId, score]) => ({
    key: `${submission.activityId}:${competencyId}:${submission.attemptId}`,
    competencyId,
    activityId: submission.activityId,
    attemptId: submission.attemptId,
    score: Math.max(0, Math.min(100, score)),
    context: "independent",
    createdAt: submission.completedAt,
  }));
}

const RECOVERY_INCIDENT_IDS = new Set(
  RECOVERY_INCIDENTS.map((incident) => incident.id),
);
const RECOVERY_IMMEDIATE_ACTION_IDS = new Set(
  RECOVERY_IMMEDIATE_OPTIONS.map((option) => option.id),
);
const RECOVERY_ACTION_IDS = new Set(
  RECOVERY_ACTION_OPTIONS.map((option) => option.id),
);
const RECOVERY_REPORT_DETAIL_IDS = new Set(
  RECOVERY_REPORT_DETAIL_OPTIONS.map((option) => option.id),
);
const RECOVERY_IMMEDIATE_POINTS: Record<
  RecoveryImmediateActionId,
  number
> = {
  "report-now": 35,
  "secure-alone-first": 22,
  "wait-for-signs": 7,
  "hide-incident": 0,
};

export function isValidRecoveryMissionSubmission(
  submission: RecoveryMissionSubmission,
): boolean {
  return (
    submission.activityId === RECOVERY_MISSION_ID &&
    submission.activityVersion === RECOVERY_MISSION_VERSION &&
    typeof submission.attemptId === "string" &&
    submission.attemptId.length > 0 &&
    typeof submission.completedAt === "string" &&
    !Number.isNaN(Date.parse(submission.completedAt)) &&
    RECOVERY_INCIDENT_IDS.has(submission.incidentType) &&
    RECOVERY_IMMEDIATE_ACTION_IDS.has(submission.immediateActionId) &&
    Array.isArray(submission.selectedRecoveryActionIds) &&
    submission.selectedRecoveryActionIds.length > 0 &&
    new Set(submission.selectedRecoveryActionIds).size ===
      submission.selectedRecoveryActionIds.length &&
    submission.selectedRecoveryActionIds.every((actionId) =>
      RECOVERY_ACTION_IDS.has(actionId),
    ) &&
    Array.isArray(submission.selectedReportDetailIds) &&
    submission.selectedReportDetailIds.length > 0 &&
    new Set(submission.selectedReportDetailIds).size ===
      submission.selectedReportDetailIds.length &&
    submission.selectedReportDetailIds.every((detailId) =>
      RECOVERY_REPORT_DETAIL_IDS.has(detailId),
    )
  );
}

export function evaluateRecoveryMission(
  submission: RecoveryMissionSubmission,
): RecoveryMissionResult {
  if (!isValidRecoveryMissionSubmission(submission)) {
    throw new Error(
      "Tentativa de recuperação inválida ou incompatível com o catálogo.",
    );
  }

  const incident = findRecoveryIncident(submission.incidentType);
  const expectedActions = new Set<RecoveryActionId>(
    incident.expectedActionIds,
  );
  const selectedActions = new Set(submission.selectedRecoveryActionIds);
  const selectedReportDetails = new Set(
    submission.selectedReportDetailIds,
  );
  const correctRecoveryActions = [...selectedActions].filter((actionId) =>
    expectedActions.has(actionId),
  ).length;
  const harmfulActions = [...selectedActions].filter((actionId) =>
    HARMFUL_RECOVERY_ACTION_IDS.has(actionId),
  ).length;
  const correctReportDetails = [...selectedReportDetails].filter((detailId) =>
    SAFE_RECOVERY_REPORT_DETAIL_IDS.has(detailId),
  ).length;
  const exposedSecret = selectedReportDetails.has("password-or-code");
  const immediatePoints = RECOVERY_IMMEDIATE_POINTS[submission.immediateActionId];
  const recoveryPoints = Math.round(
    (correctRecoveryActions / expectedActions.size) * 40,
  );
  const reportPoints = Math.round((correctReportDetails / 5) * 25);
  const score = Math.max(
    0,
    Math.min(
      100,
      immediatePoints +
        recoveryPoints +
        reportPoints -
        harmfulActions * 10 -
        (exposedSecret ? 15 : 0),
    ),
  );
  const reportedThroughOfficialChannel = selectedActions.has(
    "report-official",
  );

  return {
    score,
    incidentType: submission.incidentType,
    immediatePoints,
    recoveryPoints,
    reportPoints,
    correctRecoveryActions,
    expectedRecoveryActions: expectedActions.size,
    harmfulActions,
    correctReportDetails,
    exposedSecret,
    teamPoints:
      submission.immediateActionId === "report-now"
        ? 12
        : submission.immediateActionId === "secure-alone-first"
          ? 8
          : submission.immediateActionId === "wait-for-signs"
            ? 4
            : 0,
    needsReview:
      score < 75 ||
      submission.immediateActionId !== "report-now" ||
      !reportedThroughOfficialChannel ||
      exposedSecret,
    potentialReward: calculateActivityReward(POINT_RULES.mainMission, score),
  };
}

export function createRecoveryMissionCompetencyEvidence(
  submission: RecoveryMissionSubmission,
  result: RecoveryMissionResult,
): CompetencyEvidence[] {
  const reportScore = Math.min(
    100,
    Math.round(
      (result.reportPoints / 25) * 70 +
        (submission.selectedRecoveryActionIds.includes("report-official")
          ? 30
          : 0),
    ),
  );
  const values: Array<[CompetencyId, number]> = [
    ["decidir", Math.round((result.immediatePoints / 35) * 100)],
    ["reportar", reportScore],
    ["recuperar", Math.round((result.recoveryPoints / 40) * 100)],
  ];

  return values.map(([competencyId, score]) => ({
    key: `${submission.activityId}:${competencyId}:${submission.attemptId}`,
    competencyId,
    activityId: submission.activityId,
    attemptId: submission.attemptId,
    score,
    context: "independent",
    createdAt: submission.completedAt,
  }));
}

function hasContiguousPlacementPositions(
  submission: RecoveryBuilderV2Submission,
): boolean {
  return ["now", "next", "do-not"].every((groupId) => {
    const positions = submission.actionPlacements
      .filter((placement) => placement.groupId === groupId)
      .map((placement) => placement.position)
      .sort((left, right) => left - right);
    return positions.every((position, index) => position === index);
  });
}

export function isValidRecoveryBuilderV2Submission(
  submission: RecoveryBuilderV2Submission,
): boolean {
  const contentPackage = findRecoveryBuilderV2Package(submission.casePackageId);
  if (
    !contentPackage ||
    submission.activityId !== RECOVERY_BUILDER_ACTIVITY_ID ||
    submission.activityVersion !== RECOVERY_BUILDER_ACTIVITY_VERSION ||
    submission.mechanicId !== RECOVERY_BUILDER_MECHANIC_ID ||
    typeof submission.attemptId !== "string" ||
    submission.attemptId.length === 0 ||
    typeof submission.completedAt !== "string" ||
    Number.isNaN(Date.parse(submission.completedAt)) ||
    !Array.isArray(submission.timelineFactIds) ||
    !Array.isArray(submission.actionPlacements) ||
    !Array.isArray(submission.reportBlockIds) ||
    !Array.isArray(submission.transferFirstActionIds)
  ) {
    return false;
  }

  const allowlists = contentPackage.allowlists;
  const actionIds = submission.actionPlacements.map((placement) => placement.actionId);
  return (
    sameStringSet(submission.timelineFactIds, allowlists.timelineFactIds) &&
    allowlists.exposureStageIds.includes(submission.exposureStageId) &&
    sameStringSet(actionIds, allowlists.actionIds) &&
    submission.actionPlacements.every(
      (placement) =>
        allowlists.actionIds.includes(placement.actionId) &&
        allowlists.actionGroupIds.includes(placement.groupId) &&
        Number.isInteger(placement.position) &&
        placement.position >= 0,
    ) &&
    hasContiguousPlacementPositions(submission) &&
    submission.reportBlockIds.length > 0 &&
    new Set(submission.reportBlockIds).size === submission.reportBlockIds.length &&
    submission.reportBlockIds.every((blockId) =>
      allowlists.reportBlockIds.includes(blockId),
    ) &&
    allowlists.officialRouteIds.includes(submission.officialRouteActionId) &&
    allowlists.transferExposureIds.includes(submission.transferExposureId) &&
    submission.transferFirstActionIds.length === 2 &&
    new Set(submission.transferFirstActionIds).size === 2 &&
    submission.transferFirstActionIds.every((actionId) =>
      allowlists.transferFirstActionIds.includes(actionId),
    )
  );
}

function placementRank(
  placement: RecoveryBuilderV2Submission["actionPlacements"][number],
): number {
  const groupRank = placement.groupId === "now" ? 0 : placement.groupId === "next" ? 1 : 2;
  return groupRank * 100 + placement.position;
}

export function evaluateRecoveryBuilderV2(
  submission: RecoveryBuilderV2Submission,
): RecoveryBuilderV2Result {
  if (!isValidRecoveryBuilderV2Submission(submission)) {
    throw new Error("Tentativa do montador de resposta inválida ou incompatível com o pacote publicado.");
  }
  const contentPackage = findRecoveryBuilderV2Package(submission.casePackageId);
  if (!contentPackage) throw new Error("Pacote de recuperação não publicado.");
  const allowlists = contentPackage.allowlists;
  const placements = new Map(
    submission.actionPlacements.map((placement) => [placement.actionId, placement]),
  );
  const timelineCorrect = submission.timelineFactIds.every(
    (factId, index) => factId === allowlists.correctTimelineFactIds[index],
  );
  const exposureCorrect = submission.exposureStageId === allowlists.correctExposureStageId;
  const exposurePoints = (timelineCorrect ? 10 : 0) + (exposureCorrect ? 10 : 0);
  const correctPlacements = submission.actionPlacements.filter(
    (placement) => allowlists.correctGroupByActionId[placement.actionId] === placement.groupId,
  ).length;
  const classificationPoints = Math.round(
    (correctPlacements / allowlists.actionIds.length) * 30,
  );
  const correctPrecedencePairs = allowlists.precedencePairs.filter(([beforeId, afterId]) => {
    const before = placements.get(beforeId);
    const after = placements.get(afterId);
    return before && after ? placementRank(before) < placementRank(after) : false;
  }).length;
  const precedencePoints = allowlists.precedencePairs.length
    ? Math.round((correctPrecedencePairs / allowlists.precedencePairs.length) * 15)
    : 15;
  const harmfulPlacementErrors = allowlists.harmfulActionIds.filter(
    (actionId) => placements.get(actionId)?.groupId !== "do-not",
  ).length;
  const persistentRecoveryErrors = allowlists.persistentRecoveryActionIds.filter(
    (actionId) => placements.get(actionId)?.groupId === "do-not",
  ).length;
  const proportionalityPoints = Math.max(
    0,
    15 - harmfulPlacementErrors * 5 - persistentRecoveryErrors * 5,
  );
  const selectedReportBlocks = new Set(submission.reportBlockIds);
  const safeReportBlocks = allowlists.safeReportBlockIds.filter((blockId) =>
    selectedReportBlocks.has(blockId),
  ).length;
  const hasUnsafeReportBlock = submission.reportBlockIds.some(
    (blockId) => !allowlists.safeReportBlockIds.includes(blockId),
  );
  const routeCorrect =
    submission.officialRouteActionId === allowlists.correctOfficialRouteId;
  const transferCorrect =
    submission.transferExposureId === allowlists.correctTransferExposureId &&
    submission.transferFirstActionIds.every(
      (actionId, index) => actionId === allowlists.correctTransferFirstActionIds[index],
    );
  const reportPoints =
    (routeCorrect ? 5 : 0) +
    (hasUnsafeReportBlock
      ? 0
      : Math.round((safeReportBlocks / allowlists.safeReportBlockIds.length) * 10)) +
    (transferCorrect ? 5 : 0);
  const criticalFailureIds: string[] = [];
  if (
    placements.get("stop-interaction")?.groupId !== "now" ||
    placements.get("reopen-content")?.groupId !== "do-not"
  ) criticalFailureIds.push("stop-and-do-not-reopen");
  if (!routeCorrect || placements.get("report-official")?.groupId === "do-not") {
    criticalFailureIds.push("official-route");
  }
  if (hasUnsafeReportBlock) criticalFailureIds.push("safe-report");
  if (
    placements.get("delete-evidence")?.groupId !== "do-not" ||
    placements.get("forward-content")?.groupId !== "do-not"
  ) criticalFailureIds.push("preserve-and-do-not-forward");
  if (persistentRecoveryErrors > 0) criticalFailureIds.push("persistent-recovery");
  if (!transferCorrect) criticalFailureIds.push("transfer");
  const score = Math.max(
    0,
    Math.min(
      100,
      exposurePoints + classificationPoints + precedencePoints + proportionalityPoints + reportPoints,
    ),
  );
  return {
    score,
    casePackageId: submission.casePackageId,
    exposurePoints,
    classificationPoints,
    precedencePoints,
    proportionalityPoints,
    reportPoints,
    correctPlacements,
    totalPlacements: allowlists.actionIds.length,
    correctPrecedencePairs,
    totalPrecedencePairs: allowlists.precedencePairs.length,
    safeReportBlocks,
    criticalFailureIds,
    teamPoints: criticalFailureIds.length === 0 ? 12 : criticalFailureIds.length <= 2 ? 8 : 4,
    needsReview: score < 75 || criticalFailureIds.length > 0,
    potentialReward: calculateActivityReward(POINT_RULES.mainMission, score),
  };
}

export function createRecoveryBuilderV2CompetencyEvidence(
  submission: RecoveryBuilderV2Submission,
  result: RecoveryBuilderV2Result,
): CompetencyEvidence[] {
  const values: Array<[CompetencyId, number]> = [
    [
      "decidir",
      Math.round(
        ((result.classificationPoints + result.precedencePoints + result.proportionalityPoints) /
          60) *
          100,
      ),
    ],
    ["reportar", Math.round((result.reportPoints / 20) * 100)],
    [
      "recuperar",
      Math.round(((result.exposurePoints + result.classificationPoints + result.proportionalityPoints) / 65) * 100),
    ],
  ];
  return values.map(([competencyId, score]) => ({
    key: `${submission.activityId}:${competencyId}:${submission.attemptId}`,
    competencyId,
    activityId: submission.activityId,
    attemptId: submission.attemptId,
    score: Math.max(0, Math.min(100, score)),
    context: "independent",
    createdAt: submission.completedAt,
  }));
}

const LINK_VERDICTS = new Set<LinkVerdict>([
  "legitimate",
  "suspicious",
  "inconclusive",
]);

type PhishLabScoringDefinition = {
  tools: ReadonlySet<LinkToolKey>;
  evidence: ReadonlySet<LinkEvidenceKey>;
  correctEvidence: ReadonlySet<LinkEvidenceKey>;
  incorrectEvidence: ReadonlySet<LinkEvidenceKey>;
  guidedVerdict: LinkVerdict;
  independentVerdict: LinkVerdict;
};

const PHISHLAB_SCORING_DEFINITIONS: Readonly<
  Record<string, PhishLabScoringDefinition>
> = {
  [PHISHLAB_ACTIVITY_ID]: {
    tools: new Set<LinkToolKey>(
      DOMAIN_UNDER_MAGNIFIER_V1_PACKAGE.allowlists.toolIds,
    ),
    evidence: new Set<LinkEvidenceKey>(
      DOMAIN_UNDER_MAGNIFIER_V1_PACKAGE.allowlists.evidenceIds,
    ),
    correctEvidence: new Set<LinkEvidenceKey>(
      DOMAIN_UNDER_MAGNIFIER_V1_PACKAGE.allowlists.correctEvidenceIds,
    ),
    incorrectEvidence: new Set<LinkEvidenceKey>(
      DOMAIN_UNDER_MAGNIFIER_V1_PACKAGE.allowlists.incorrectEvidenceIds,
    ),
    guidedVerdict:
      DOMAIN_UNDER_MAGNIFIER_V1_PACKAGE.allowlists.guidedVerdict,
    independentVerdict:
      DOMAIN_UNDER_MAGNIFIER_V1_PACKAGE.allowlists.independentVerdict,
  },
  [SENDER_INSPECTOR_ACTIVITY_ID]: {
    tools: new Set<LinkToolKey>([
      "displayName",
      "fromAddress",
      "replyTo",
      "messageContext",
    ]),
    evidence: new Set<LinkEvidenceKey>([
      "known-address",
      "changed-request",
      "reply-to-proves-safety",
      "display-name-proof",
    ]),
    correctEvidence: new Set<LinkEvidenceKey>([
      "known-address",
      "changed-request",
    ]),
    incorrectEvidence: new Set<LinkEvidenceKey>([
      "reply-to-proves-safety",
      "display-name-proof",
    ]),
    guidedVerdict: "suspicious",
    independentVerdict: "inconclusive",
  },
};

export function isValidPhishLabSubmission(
  submission: PhishLabSubmission,
): boolean {
  const runtimeDefinition = getPhishLabRuntimeDefinition(submission.activityId);
  const scoringDefinition = PHISHLAB_SCORING_DEFINITIONS[submission.activityId];

  return (
    Boolean(runtimeDefinition) &&
    Boolean(scoringDefinition) &&
    submission.activityVersion === runtimeDefinition?.activityVersion &&
    typeof submission.attemptId === "string" &&
    submission.attemptId.length > 0 &&
    typeof submission.completedAt === "string" &&
    !Number.isNaN(Date.parse(submission.completedAt)) &&
    Array.isArray(submission.usedTools) &&
    submission.usedTools.every((tool) => scoringDefinition?.tools.has(tool)) &&
    typeof submission.usedHint === "boolean" &&
    LINK_VERDICTS.has(submission.guidedVerdict) &&
    LINK_VERDICTS.has(submission.independentVerdict) &&
    Array.isArray(submission.independentEvidence) &&
    submission.independentEvidence.every((evidence) =>
      scoringDefinition?.evidence.has(evidence),
    )
  );
}

export function evaluatePhishLab(
  submission: PhishLabSubmission,
): PhishLabResult {
  if (!isValidPhishLabSubmission(submission)) {
    throw new Error("Tentativa de PhishLab inválida ou incompatível com o catálogo.");
  }

  const scoringDefinition = PHISHLAB_SCORING_DEFINITIONS[submission.activityId];
  const tools = new Set(submission.usedTools);
  const selectedEvidence = new Set(submission.independentEvidence);
  const correctEvidence = [...selectedEvidence].filter((evidence) =>
    scoringDefinition.correctEvidence.has(evidence),
  ).length;
  const incorrectEvidence = [...selectedEvidence].filter((evidence) =>
    scoringDefinition.incorrectEvidence.has(evidence),
  ).length;
  const evidencePoints = Math.max(
    0,
    Math.min(30, correctEvidence * 15 - incorrectEvidence * 5),
  );
  const conclusionPoints =
    submission.guidedVerdict === scoringDefinition.guidedVerdict ? 25 : 0;
  const toolsPoints = Math.round(
    (tools.size / scoringDefinition.tools.size) * 20,
  );
  const independentPoints =
    submission.independentVerdict === scoringDefinition.independentVerdict
      ? 25
      : 0;
  const score = Math.min(
    100,
    evidencePoints + conclusionPoints + toolsPoints + independentPoints,
  );

  return {
    score,
    evidencePoints,
    conclusionPoints,
    toolsPoints,
    independentPoints,
    usedTools: tools.size,
    selectedEvidence: selectedEvidence.size,
    teamPoints: 3,
    needsReview: score < 60 || independentPoints === 0,
    potentialReward: calculateActivityReward(POINT_RULES.phishLab, score),
  };
}

export function createPhishLabCompetencyEvidence(
  submission: PhishLabSubmission,
  result: PhishLabResult,
): CompetencyEvidence[] {
  const observationScore = Math.min(
    100,
    Math.round(((result.toolsPoints + result.evidencePoints) / 50) * 100),
  );
  const verificationScore = Math.min(
    100,
    Math.round(((result.evidencePoints + result.independentPoints) / 55) * 100),
  );
  const values: Array<[CompetencyId, number]> = [
    ["observar", observationScore],
    ["investigar", result.score],
    ["verificar", verificationScore],
  ];

  return values.map(([competencyId, score]) => ({
    key: `${submission.activityId}:${competencyId}:${submission.attemptId}`,
    competencyId,
    activityId: submission.activityId,
    attemptId: submission.attemptId,
    score,
    context: "review",
    createdAt: submission.completedAt,
  }));
}

export function isValidDomainAnalyzerV2Submission(
  submission: DomainAnalyzerV2Submission,
): boolean {
  const contentPackage = findDomainAnalyzerV2Package(submission.casePackageId);
  if (
    !contentPackage ||
    submission.activityId !== DOMAIN_ANALYZER_V2_ACTIVITY_ID ||
    submission.activityVersion !== DOMAIN_ANALYZER_V2_ACTIVITY_VERSION ||
    submission.mechanicId !== URL_ANATOMY_MECHANIC_ID ||
    typeof submission.attemptId !== "string" ||
    submission.attemptId.length === 0 ||
    typeof submission.completedAt !== "string" ||
    Number.isNaN(Date.parse(submission.completedAt)) ||
    !submission.answerPayload ||
    typeof submission.answerPayload !== "object"
  ) {
    return false;
  }

  const answer = submission.answerPayload;
  const mainSegmentIds = contentPackage.content.mainCase.segments.map(
    (segment) => segment.id,
  );
  const transferSegmentIds = contentPackage.content.transferCase.segments.map(
    (segment) => segment.id,
  );
  const assignmentEntries = Object.entries(answer.segmentRoleById ?? {});
  const allowedRoles = new Set<string>(contentPackage.allowlists.segmentRoleIds);
  const allowedVerdicts = new Set<string>(contentPackage.allowlists.verdictIds);
  const allowedRoutes = new Set<string>(contentPackage.allowlists.safeRouteIds);
  const allowedHelpIds = new Set<string>(contentPackage.allowlists.helpIds);

  return (
    assignmentEntries.length === mainSegmentIds.length &&
    mainSegmentIds.every((segmentId) =>
      Object.prototype.hasOwnProperty.call(answer.segmentRoleById, segmentId),
    ) &&
    assignmentEntries.every(
      ([segmentId, roleId]) =>
        mainSegmentIds.includes(segmentId) && allowedRoles.has(roleId),
    ) &&
    mainSegmentIds.includes(answer.registeredDomainSelectionId) &&
    Array.isArray(answer.inspectedSegmentIds) &&
    new Set(answer.inspectedSegmentIds).size ===
      answer.inspectedSegmentIds.length &&
    answer.inspectedSegmentIds.every((segmentId) =>
      mainSegmentIds.includes(segmentId),
    ) &&
    allowedVerdicts.has(answer.verdictId) &&
    allowedRoutes.has(answer.safeRouteId) &&
    transferSegmentIds.includes(
      answer.transferRegisteredDomainSelectionId,
    ) &&
    allowedVerdicts.has(answer.transferVerdictId) &&
    Array.isArray(answer.usedHelpIds) &&
    new Set(answer.usedHelpIds).size === answer.usedHelpIds.length &&
    answer.usedHelpIds.every((helpId) => allowedHelpIds.has(helpId))
  );
}

export function evaluateDomainAnalyzerV2(
  submission: DomainAnalyzerV2Submission,
): DomainAnalyzerV2Result {
  if (!isValidDomainAnalyzerV2Submission(submission)) {
    throw new Error(
      "Tentativa de anatomia de URL inválida ou incompatível com o pacote.",
    );
  }

  const contentPackage = findDomainAnalyzerV2Package(
    submission.casePackageId,
  );
  if (!contentPackage) {
    throw new Error("Pacote de anatomia de URL não publicado.");
  }

  const answer = submission.answerPayload;
  const mainCase = contentPackage.content.mainCase;
  const transferCase = contentPackage.content.transferCase;
  const correctlyAssignedSegments = mainCase.segments.filter(
    (segment) => answer.segmentRoleById[segment.id] === segment.roleId,
  ).length;
  const totalSegments = mainCase.segments.length;
  const anatomyPoints = Math.round(
    (correctlyAssignedSegments / totalSegments) * 30,
  );
  const registeredDomainIsCorrect =
    answer.registeredDomainSelectionId ===
    mainCase.correctRegisteredDomainSegmentId;
  const verdictIsCorrect = answer.verdictId === mainCase.correctVerdictId;
  const domainConclusionPoints =
    (registeredDomainIsCorrect ? 15 : 0) + (verdictIsCorrect ? 10 : 0);
  const safeRouteIsCorrect =
    answer.safeRouteId === contentPackage.allowlists.correctSafeRouteId;
  const safeRoutePoints = safeRouteIsCorrect ? 20 : 0;
  const transferDomainIsCorrect =
    answer.transferRegisteredDomainSelectionId ===
    transferCase.correctRegisteredDomainSegmentId;
  const transferVerdictIsCorrect =
    answer.transferVerdictId === transferCase.correctVerdictId;
  const transferPoints =
    (transferDomainIsCorrect ? 15 : 0) +
    (transferVerdictIsCorrect ? 10 : 0);
  const score = Math.max(
    0,
    Math.min(
      100,
      anatomyPoints +
        domainConclusionPoints +
        safeRoutePoints +
        transferPoints,
    ),
  );
  const criticalFailureIds = [
    ...(!registeredDomainIsCorrect ? ["registered-domain"] : []),
    ...(!safeRouteIsCorrect ? ["safe-route"] : []),
    ...(!transferDomainIsCorrect ? ["transfer-origin"] : []),
  ];

  return {
    score,
    anatomyPoints,
    domainConclusionPoints,
    safeRoutePoints,
    transferPoints,
    correctlyAssignedSegments,
    totalSegments,
    criticalFailureIds,
    teamPoints: 3,
    needsReview: score < 60 || criticalFailureIds.length > 0,
    potentialReward: calculateActivityReward(POINT_RULES.phishLab, score),
  };
}

export function createDomainAnalyzerV2CompetencyEvidence(
  submission: DomainAnalyzerV2Submission,
  result: DomainAnalyzerV2Result,
): CompetencyEvidence[] {
  const values: Array<[CompetencyId, number]> = [
    ["observar", Math.round((result.anatomyPoints / 30) * 100)],
    ["investigar", result.score],
    [
      "verificar",
      Math.round(
        ((result.safeRoutePoints + result.transferPoints) / 45) * 100,
      ),
    ],
  ];

  return values.map(([competencyId, score]) => ({
    key: `${submission.activityId}:${competencyId}:${submission.attemptId}`,
    competencyId,
    activityId: submission.activityId,
    attemptId: submission.attemptId,
    score: Math.max(0, Math.min(100, score)),
    context: "review",
    createdAt: submission.completedAt,
  }));
}

export function isValidTrueSenderV2Submission(
  submission: TrueSenderV2Submission,
): boolean {
  const contentPackage = findTrueSenderV2Package(submission.casePackageId);
  if (
    !contentPackage ||
    submission.activityId !== TRUE_SENDER_V2_ACTIVITY_ID ||
    submission.activityVersion !== TRUE_SENDER_V2_ACTIVITY_VERSION ||
    submission.mechanicId !== IDENTITY_MAP_MECHANIC_ID ||
    typeof submission.attemptId !== "string" ||
    submission.attemptId.length === 0 ||
    typeof submission.completedAt !== "string" ||
    Number.isNaN(Date.parse(submission.completedAt)) ||
    !submission.answerPayload ||
    typeof submission.answerPayload !== "object"
  ) {
    return false;
  }

  const answer = submission.answerPayload;
  const fieldIds = contentPackage.content.fields.map((field) => field.id);
  const claimIds = contentPackage.content.claims.map((claim) => claim.id);
  const relationEntries = Object.entries(answer.fieldRelationById ?? {});
  const claimEntries = Object.entries(answer.claimAssessmentById ?? {});
  const allowedRelations = new Set<string>(contentPackage.allowlists.relationIds);
  const allowedAssessments = new Set<string>(
    contentPackage.allowlists.claimAssessmentIds,
  );
  const allowedVerdicts = new Set<string>(contentPackage.allowlists.verdictIds);
  const allowedRoutes = new Set<string>(
    contentPackage.allowlists.verificationRouteIds,
  );
  const allowedHelpIds = new Set<string>(contentPackage.allowlists.helpIds);

  return (
    relationEntries.length === fieldIds.length &&
    fieldIds.every((fieldId) =>
      Object.prototype.hasOwnProperty.call(answer.fieldRelationById, fieldId),
    ) &&
    relationEntries.every(
      ([fieldId, relationId]) =>
        fieldIds.includes(fieldId) && allowedRelations.has(relationId),
    ) &&
    claimEntries.length === claimIds.length &&
    claimIds.every((claimId) =>
      Object.prototype.hasOwnProperty.call(answer.claimAssessmentById, claimId),
    ) &&
    claimEntries.every(
      ([claimId, assessmentId]) =>
        claimIds.includes(claimId) && allowedAssessments.has(assessmentId),
    ) &&
    Array.isArray(answer.inspectedEvidenceIds) &&
    new Set(answer.inspectedEvidenceIds).size ===
      answer.inspectedEvidenceIds.length &&
    answer.inspectedEvidenceIds.every((fieldId) => fieldIds.includes(fieldId)) &&
    allowedVerdicts.has(answer.verdictId) &&
    allowedRoutes.has(answer.verificationRouteId) &&
    allowedVerdicts.has(answer.transferVerdictId) &&
    allowedRoutes.has(answer.transferVerificationRouteId) &&
    Array.isArray(answer.usedHelpIds) &&
    new Set(answer.usedHelpIds).size === answer.usedHelpIds.length &&
    answer.usedHelpIds.every((helpId) => allowedHelpIds.has(helpId))
  );
}

export function evaluateTrueSenderV2(
  submission: TrueSenderV2Submission,
): TrueSenderV2Result {
  if (!isValidTrueSenderV2Submission(submission)) {
    throw new Error(
      "Tentativa do mapa de identidade inválida ou incompatível com o pacote.",
    );
  }

  const contentPackage = findTrueSenderV2Package(submission.casePackageId);
  if (!contentPackage) {
    throw new Error("Pacote de identidade não publicado.");
  }

  const answer = submission.answerPayload;
  const fields = contentPackage.content.fields;
  const claims = contentPackage.content.claims;
  const correctlyMappedFields = fields.filter(
    (field) =>
      answer.fieldRelationById[field.id] === field.correctRelationId,
  ).length;
  const correctClaimAssessments = claims.filter(
    (claim) => {
      const assessment = answer.claimAssessmentById[claim.id];
      return (
        assessment === claim.correctAssessmentId ||
        (assessment === "inference" && claim.id.includes("-hypothesis"))
      );
    },
  ).length;
  const mapPoints = Math.round((correctlyMappedFields / fields.length) * 20);
  const evidencePoints = Math.round(
    (correctClaimAssessments / claims.length) * 30,
  );
  const verdictIsCorrect =
    answer.verdictId === contentPackage.content.correctVerdictId;
  const verificationRouteIsCorrect =
    answer.verificationRouteId ===
    contentPackage.content.correctVerificationRouteId;
  const conclusionPoints =
    (verdictIsCorrect ? 10 : 0) + (verificationRouteIsCorrect ? 15 : 0);
  const transferVerdictIsCorrect =
    answer.transferVerdictId ===
    contentPackage.content.transferCase.correctVerdictId;
  const transferRouteIsCorrect =
    answer.transferVerificationRouteId ===
    contentPackage.content.transferCase.correctVerificationRouteId;
  const transferPoints =
    (transferVerdictIsCorrect ? 10 : 0) +
    (transferRouteIsCorrect ? 15 : 0);
  const claimsHumanControl = claims.some(
    (claim) =>
      claim.id.includes("person-controls") &&
      answer.claimAssessmentById[claim.id] !== "unproven",
  );
  const mapsHumanControl = Object.values(answer.fieldRelationById).includes(
    "current-controller",
  );
  const secretSharingSelected =
    answer.verificationRouteId === "share-secret" ||
    answer.transferVerificationRouteId === "share-secret";
  const criticalFailureIds = [
    ...(claimsHumanControl || mapsHumanControl ? ["human-control"] : []),
    ...(!verificationRouteIsCorrect || !transferRouteIsCorrect
      ? ["independent-route"]
      : []),
    ...(secretSharingSelected ? ["secret-sharing"] : []),
  ];
  const score = Math.max(
    0,
    Math.min(
      100,
      mapPoints + evidencePoints + conclusionPoints + transferPoints,
    ),
  );

  return {
    score,
    evidencePoints,
    conclusionPoints,
    mapPoints,
    transferPoints,
    correctlyMappedFields,
    totalMappedFields: fields.length,
    correctClaimAssessments,
    totalClaimAssessments: claims.length,
    criticalFailureIds,
    teamPoints: 3,
    needsReview: score < 60 || criticalFailureIds.length > 0,
    potentialReward: calculateActivityReward(POINT_RULES.phishLab, score),
  };
}

export function createTrueSenderV2CompetencyEvidence(
  submission: TrueSenderV2Submission,
  result: TrueSenderV2Result,
): CompetencyEvidence[] {
  const values: Array<[CompetencyId, number]> = [
    [
      "observar",
      Math.round(((result.mapPoints + result.evidencePoints) / 50) * 100),
    ],
    ["investigar", result.score],
    [
      "verificar",
      Math.round(
        ((result.conclusionPoints + result.transferPoints) / 50) * 100,
      ),
    ],
  ];

  return values.map(([competencyId, score]) => ({
    key: `${submission.activityId}:${competencyId}:${submission.attemptId}`,
    competencyId,
    activityId: submission.activityId,
    attemptId: submission.attemptId,
    score: Math.max(0, Math.min(100, score)),
    context: "review",
    createdAt: submission.completedAt,
  }));
}

const SIMULATION_ACTIONS = new Set(["keep", "verify", "report", "delete"]);

export function isValidSimulationSubmission(
  submission: SimulationSubmission,
): boolean {
  if (
    submission.activityId !== SIMULATION_ACTIVITY_ID ||
    submission.activityVersion !== SIMULATION_ACTIVITY_VERSION ||
    typeof submission.attemptId !== "string" ||
    submission.attemptId.length === 0 ||
    typeof submission.completedAt !== "string" ||
    Number.isNaN(Date.parse(submission.completedAt)) ||
    !Array.isArray(submission.messageDecisions) ||
    submission.messageDecisions.length !== WORKDAY_MESSAGES.length
  ) {
    return false;
  }

  const expectedIds = new Set(WORKDAY_MESSAGES.map((message) => message.id));
  const receivedIds = new Set(
    submission.messageDecisions.map((decision) => decision.messageId),
  );

  return (
    receivedIds.size === expectedIds.size &&
    [...expectedIds].every((id) => receivedIds.has(id)) &&
    submission.messageDecisions.every(
      (decision) =>
        SIMULATION_ACTIONS.has(decision.action) &&
        Array.isArray(decision.inspectedEvidence) &&
        decision.inspectedEvidence.every((evidence) =>
          EVIDENCE_IDS.has(evidence),
        ),
    )
  );
}

function correctlyIdentified(
  kind: (typeof WORKDAY_MESSAGES)[number]["kind"],
  action: SimulationSubmission["messageDecisions"][number]["action"],
): boolean {
  if (kind === "phishing") return action === "report" || action === "delete";
  if (kind === "verify") return action === "verify";
  return action === "keep" || action === "verify";
}

export function evaluateSimulation(
  submission: SimulationSubmission,
): SimulationResult {
  if (!isValidSimulationSubmission(submission)) {
    throw new Error(
      "Tentativa de Simulação inválida ou incompatível com o catálogo.",
    );
  }

  const decisions = new Map(
    submission.messageDecisions.map((decision) => [decision.messageId, decision]),
  );
  let correctIdentifications = 0;
  let correctActions = 0;
  let relevantEvidenceFound = 0;
  let totalRelevantEvidence = 0;
  let inspectedMessages = 0;
  let falsePositives = 0;

  for (const message of WORKDAY_MESSAGES) {
    const decision = decisions.get(message.id);
    if (!decision) continue;

    if (correctlyIdentified(message.kind, decision.action)) {
      correctIdentifications += 1;
    }
    if (decision.action === message.expectedAction) correctActions += 1;
    if (decision.inspectedEvidence.length > 0) inspectedMessages += 1;
    if (
      message.kind === "legitimate" &&
      (decision.action === "report" || decision.action === "delete")
    ) {
      falsePositives += 1;
    }

    const inspected = new Set(decision.inspectedEvidence);
    totalRelevantEvidence += message.relevantEvidence.length;
    relevantEvidenceFound += message.relevantEvidence.filter((evidence) =>
      inspected.has(evidence),
    ).length;
  }

  const identificationPoints = Math.round(
    (correctIdentifications / WORKDAY_MESSAGES.length) * 30,
  );
  const actionPoints = Math.round(
    (correctActions / WORKDAY_MESSAGES.length) * 30,
  );
  const evidencePoints = Math.round(
    (relevantEvidenceFound / totalRelevantEvidence) * 25,
  );
  const falsePositivePoints = Math.max(0, 15 - falsePositives * 5);
  const score = Math.min(
    100,
    identificationPoints + actionPoints + evidencePoints + falsePositivePoints,
  );

  return {
    score,
    identificationPoints,
    actionPoints,
    evidencePoints,
    falsePositivePoints,
    correctIdentifications,
    correctActions,
    inspectedMessages,
    falsePositives,
    teamPoints: score >= 60 ? 5 : 2,
    needsReview: score < 60 || falsePositives > 1,
    potentialReward: calculateActivityReward(POINT_RULES.simulation, score),
  };
}

export function createSimulationCompetencyEvidence(
  submission: SimulationSubmission,
  result: SimulationResult,
): CompetencyEvidence[] {
  const phishingIds = new Set(
    WORKDAY_MESSAGES.filter((message) => message.kind === "phishing").map(
      (message) => message.id,
    ),
  );
  const phishingReported = submission.messageDecisions.filter(
    (decision) => phishingIds.has(decision.messageId) && decision.action === "report",
  ).length;
  const verificationDecision = submission.messageDecisions.find(
    (decision) => decision.messageId === "manager-stock-request",
  );
  const values: Array<[CompetencyId, number]> = [
    [
      "observar",
      Math.round((result.correctIdentifications / WORKDAY_MESSAGES.length) * 100),
    ],
    ["investigar", Math.round((result.evidencePoints / 25) * 100)],
    ["verificar", verificationDecision?.action === "verify" ? 100 : 35],
    ["decidir", Math.round((result.correctActions / WORKDAY_MESSAGES.length) * 100)],
    ["reportar", Math.round((phishingReported / phishingIds.size) * 100)],
  ];

  return values.map(([competencyId, score]) => ({
    key: `${submission.activityId}:${competencyId}:${submission.attemptId}`,
    competencyId,
    activityId: submission.activityId,
    attemptId: submission.attemptId,
    score,
    context: "independent",
    createdAt: submission.completedAt,
  }));
}

export function isValidWorkdayTriageV2Submission(
  submission: WorkdayTriageV2Submission,
): boolean {
  const contentPackage = findWorkdayTriageV2Package(submission.casePackageId);
  if (
    !contentPackage ||
    submission.activityId !== WORKDAY_TRIAGE_ACTIVITY_ID ||
    submission.activityVersion !== WORKDAY_TRIAGE_ACTIVITY_VERSION ||
    submission.mechanicId !== WORKDAY_TRIAGE_MECHANIC_ID ||
    typeof submission.attemptId !== "string" ||
    submission.attemptId.length === 0 ||
    typeof submission.completedAt !== "string" ||
    Number.isNaN(Date.parse(submission.completedAt)) ||
    !Array.isArray(submission.itemDecisions) ||
    submission.itemDecisions.length !== contentPackage.allowlists.itemIds.length
  ) {
    return false;
  }

  const receivedItemIds = new Set(
    submission.itemDecisions.map((decision) => decision.itemId),
  );
  if (
    receivedItemIds.size !== contentPackage.allowlists.itemIds.length ||
    !contentPackage.allowlists.itemIds.every((itemId) =>
      receivedItemIds.has(itemId),
    )
  ) {
    return false;
  }

  const validDecisions = submission.itemDecisions.every((decision) => {
    const allowedEvidenceIds =
      contentPackage.allowlists.evidenceIdsByItemId[decision.itemId];
    return (
      (decision.queueId === "resolved" || decision.queueId === "inconclusive") &&
      contentPackage.allowlists.transferActionIds.includes(decision.actionId) &&
      Array.isArray(allowedEvidenceIds) &&
      Array.isArray(decision.inspectedEvidenceIds) &&
      new Set(decision.inspectedEvidenceIds).size ===
        decision.inspectedEvidenceIds.length &&
      decision.inspectedEvidenceIds.every((evidenceId) =>
        allowedEvidenceIds.includes(evidenceId),
      )
    );
  });

  return (
    validDecisions &&
    contentPackage.allowlists.transferActionIds.includes(
      submission.transferActionId,
    ) &&
    contentPackage.allowlists.transferEvidenceIds.includes(
      submission.transferEvidenceId,
    )
  );
}

export function evaluateWorkdayTriageV2(
  submission: WorkdayTriageV2Submission,
): WorkdayTriageV2Result {
  if (!isValidWorkdayTriageV2Submission(submission)) {
    throw new Error(
      "Tentativa de triagem em lote inválida ou incompatível com o pacote publicado.",
    );
  }

  const contentPackage = findWorkdayTriageV2Package(submission.casePackageId);
  if (!contentPackage) {
    throw new Error("Pacote de triagem não encontrado.");
  }

  let correctQueues = 0;
  let correctActions = 0;
  let inspectedEvidence = 0;
  let requiredEvidence = 0;
  let falsePositives = 0;
  const criticalFailureIds: string[] = [];

  for (const decision of submission.itemDecisions) {
    const expectedQueue =
      contentPackage.allowlists.correctQueueByItemId[decision.itemId];
    const expectedAction =
      contentPackage.allowlists.correctActionByItemId[decision.itemId];
    const kind = contentPackage.allowlists.kindByItemId[decision.itemId];
    const required =
      contentPackage.allowlists.requiredEvidenceIdsByItemId[decision.itemId];
    const inspected = new Set(decision.inspectedEvidenceIds);

    if (decision.queueId === expectedQueue) correctQueues += 1;
    if (decision.actionId === expectedAction) correctActions += 1;
    requiredEvidence += required.length;
    inspectedEvidence += required.filter((evidenceId) =>
      inspected.has(evidenceId),
    ).length;

    if (kind === "legitimate" && decision.actionId !== "proceed") {
      falsePositives += 1;
    }
    if (
      contentPackage.allowlists.highImpactItemIds.includes(decision.itemId) &&
      expectedAction !== "proceed" &&
      decision.actionId === "proceed"
    ) {
      criticalFailureIds.push(`unsafe-release:${decision.itemId}`);
    }
    if (
      kind === "inconclusive" &&
      (decision.queueId !== "inconclusive" || decision.actionId !== "verify")
    ) {
      criticalFailureIds.push(`forced-certainty:${decision.itemId}`);
    }
  }

  if (
    submission.itemDecisions.every(
      (decision) => decision.actionId === "contain-report",
    )
  ) {
    criticalFailureIds.push("blanket-reporting");
  }

  const totalItems = contentPackage.allowlists.itemIds.length;
  const triagePoints = Math.round((correctQueues / totalItems) * 30);
  const actionPoints = Math.round((correctActions / totalItems) * 30);
  const evidencePoints = Math.round(
    (inspectedEvidence / Math.max(1, requiredEvidence)) * 25,
  );
  const transferCorrect =
    submission.transferActionId ===
      contentPackage.allowlists.correctTransferActionId &&
    submission.transferEvidenceId ===
      contentPackage.allowlists.correctTransferEvidenceId;
  const calibrationPoints = Math.max(0, 10 - falsePositives * 3) +
    (transferCorrect ? 5 : 0);
  const score = Math.max(
    0,
    Math.min(
      100,
      triagePoints + actionPoints + evidencePoints + calibrationPoints,
    ),
  );

  return {
    score,
    triagePoints,
    actionPoints,
    evidencePoints,
    calibrationPoints,
    correctQueues,
    correctActions,
    totalItems,
    inspectedEvidence,
    requiredEvidence,
    falsePositives,
    criticalFailureIds: [...new Set(criticalFailureIds)],
    teamPoints: score >= 60 ? 5 : 2,
    needsReview: score < 60 || criticalFailureIds.length > 0,
    potentialReward: calculateActivityReward(POINT_RULES.simulation, score),
  };
}

export function createWorkdayTriageV2CompetencyEvidence(
  submission: WorkdayTriageV2Submission,
  result: WorkdayTriageV2Result,
): CompetencyEvidence[] {
  const values: Array<[CompetencyId, number]> = [
    ["observar", Math.round((result.triagePoints / 30) * 100)],
    ["investigar", Math.round((result.evidencePoints / 25) * 100)],
    ["verificar", Math.round((result.calibrationPoints / 15) * 100)],
    ["decidir", Math.round((result.actionPoints / 30) * 100)],
    ["reportar", Math.max(0, 100 - result.falsePositives * 25)],
  ];

  return values.map(([competencyId, score]) => ({
    key: `${submission.activityId}:${competencyId}:${submission.attemptId}`,
    competencyId,
    activityId: submission.activityId,
    attemptId: submission.attemptId,
    score,
    context: "independent",
    createdAt: submission.completedAt,
  }));
}

const RADAR_OPTION_IDS: ReadonlySet<string> = new Set(
  RADAR_QUESTION_OPTIONS.map((option) => option.id),
);

export function isValidRadarSubmission(submission: RadarSubmission): boolean {
  return (
    submission.activityId === RADAR_ACTIVITY_ID &&
    submission.activityVersion === RADAR_ACTIVITY_VERSION &&
    typeof submission.attemptId === "string" &&
    submission.attemptId.length > 0 &&
    typeof submission.completedAt === "string" &&
    !Number.isNaN(Date.parse(submission.completedAt)) &&
    RADAR_OPTION_IDS.has(submission.selectedOptionId)
  );
}

export function evaluateRadar(submission: RadarSubmission): RadarResult {
  if (!isValidRadarSubmission(submission)) {
    throw new Error(
      "Tentativa de Radar inválida ou incompatível com o catálogo.",
    );
  }

  const correct = submission.selectedOptionId === RADAR_CORRECT_OPTION_ID;
  return {
    score: correct ? 100 : 0,
    correct,
    points: correct ? POINT_RULES.radar : 0,
    alreadyCompleted: false,
  };
}

export function createRadarCompetencyEvidence(
  submission: RadarSubmission,
): CompetencyEvidence[] {
  const values: Array<[CompetencyId, number]> = [
    ["investigar", 75],
    ["verificar", 75],
  ];

  return values.map(([competencyId, score]) => ({
    key: `${submission.activityId}:${competencyId}:${submission.attemptId}`,
    competencyId,
    activityId: submission.activityId,
    attemptId: submission.attemptId,
    score,
    context: "guided",
    createdAt: submission.completedAt,
  }));
}

export function calculateSectorMetrics(
  aggregate: SectorAggregate,
): SectorMetrics {
  const percentage = (value: number, total: number) =>
    total <= 0 ? 0 : Math.max(0, Math.min(100, (value / total) * 100));
  const participation = percentage(
    aggregate.validParticipants,
    aggregate.eligibleParticipants,
  );
  const precision = percentage(
    aggregate.correctDecisions,
    aggregate.validDecisions,
  );
  const coverage = percentage(
    aggregate.coveredCompetencyIds.length,
    aggregate.requiredCompetencyIds.length,
  );
  const score = Math.round(
    participation * 0.4 + precision * 0.4 + coverage * 0.2,
  );
  const shieldLevel =
    score >= 75
      ? "Resiliente"
      : score >= 50
        ? "Protegido"
        : score >= 25
          ? "Reforçado"
          : "Em construção";

  return {
    participation: Math.round(participation * 100) / 100,
    precision: Math.round(precision * 100) / 100,
    coverage: Math.round(coverage * 100) / 100,
    score,
    shieldLevel,
  };
}

export function isValidTeamChallengeSubmission(
  submission: TeamChallengeSubmission,
): boolean {
  if (
    submission.activityId !== TEAM_CHALLENGE_ACTIVITY_ID ||
    submission.activityVersion !== TEAM_CHALLENGE_ACTIVITY_VERSION ||
    typeof submission.attemptId !== "string" ||
    submission.attemptId.length === 0 ||
    typeof submission.completedAt !== "string" ||
    Number.isNaN(Date.parse(submission.completedAt)) ||
    !Array.isArray(submission.caseDecisions) ||
    submission.caseDecisions.length !== TEAM_CHALLENGE_CASES.length
  ) {
    return false;
  }

  const expectedIds = new Set(TEAM_CHALLENGE_CASES.map((item) => item.id));
  const receivedIds = new Set(
    submission.caseDecisions.map((decision) => decision.caseId),
  );

  return (
    receivedIds.size === expectedIds.size &&
    [...expectedIds].every((id) => receivedIds.has(id)) &&
    submission.caseDecisions.every(
      (decision) =>
        SIMULATION_ACTIONS.has(decision.action) &&
        Array.isArray(decision.inspectedEvidence) &&
        decision.inspectedEvidence.every((evidence) =>
          EVIDENCE_IDS.has(evidence),
        ),
    )
  );
}

export function evaluateTeamChallenge(
  submission: TeamChallengeSubmission,
): TeamChallengeResult {
  if (!isValidTeamChallengeSubmission(submission)) {
    throw new Error(
      "Tentativa de Equipes inválida ou incompatível com o catálogo.",
    );
  }

  const decisions = new Map(
    submission.caseDecisions.map((decision) => [decision.caseId, decision]),
  );
  let correctDecisions = 0;
  let falsePositives = 0;
  const competencyTotals = {
    observar: 0,
    verificar: 0,
    decidir: 0,
  };
  const competencyCorrect = {
    observar: 0,
    verificar: 0,
    decidir: 0,
  };

  for (const challengeCase of TEAM_CHALLENGE_CASES) {
    const decision = decisions.get(challengeCase.id);
    if (!decision) continue;
    competencyTotals[challengeCase.competencyId] += 1;
    if (decision.action === challengeCase.expectedAction) {
      correctDecisions += 1;
      competencyCorrect[challengeCase.competencyId] += 1;
    }
    if (
      challengeCase.kind === "legitimate" &&
      (decision.action === "report" || decision.action === "delete")
    ) {
      falsePositives += 1;
    }
  }

  const competencyScores = {
    observar: Math.round(
      (competencyCorrect.observar / competencyTotals.observar) * 100,
    ),
    verificar: Math.round(
      (competencyCorrect.verificar / competencyTotals.verificar) * 100,
    ),
    decidir: Math.round(
      (competencyCorrect.decidir / competencyTotals.decidir) * 100,
    ),
  };
  const score = Math.round(
    (correctDecisions / TEAM_CHALLENGE_CASES.length) * 100,
  );
  const coveredCompetencyIds = (
    Object.entries(competencyScores) as Array<
      [keyof typeof competencyScores, number]
    >
  )
    .filter(([, value]) => value >= 60)
    .map(([competencyId]) => competencyId);

  return {
    score,
    correctDecisions,
    totalDecisions: TEAM_CHALLENGE_CASES.length,
    falsePositives,
    competencyScores,
    coveredCompetencyIds,
    potentialReward: calculateActivityReward(POINT_RULES.teamOperation, score),
  };
}

export function createTeamChallengeCompetencyEvidence(
  submission: TeamChallengeSubmission,
  result: TeamChallengeResult,
): CompetencyEvidence[] {
  return (
    Object.entries(result.competencyScores) as Array<
      [keyof typeof result.competencyScores, number]
    >
  ).map(([competencyId, score]) => ({
    key: `${submission.activityId}:${competencyId}:${submission.attemptId}`,
    competencyId,
    activityId: submission.activityId,
    attemptId: submission.attemptId,
    score,
    context: "independent",
    createdAt: submission.completedAt,
  }));
}

const BANK_CHANGE_INITIAL_ACTION_IDS = new Set(
  BANK_CHANGE_INITIAL_ACTIONS.map((option) => option.id),
);
const BANK_CHANGE_EVIDENCE_ASSESSMENT_IDS = new Set(
  BANK_CHANGE_EVIDENCE_ASSESSMENTS.map((option) => option.id),
);
const BANK_CHANGE_VERIFICATION_ROUTE_IDS = new Set(
  BANK_CHANGE_VERIFICATION_ROUTES.map((option) => option.id),
);
const BANK_CHANGE_PROCESS_ACTION_IDS = new Set(
  BANK_CHANGE_PROCESS_ACTIONS.map((option) => option.id),
);
const BANK_CHANGE_REPORT_ACTION_IDS = new Set(
  BANK_CHANGE_REPORT_ACTIONS.map((option) => option.id),
);
const BANK_CHANGE_EVIDENCE_IDS = new Set(
  BANK_CHANGE_EVIDENCE.map((evidence) => evidence.id),
);

export function isValidBankChangeSubmission(
  submission: BankChangeSubmission,
): boolean {
  if (
    submission.activityId !== BANK_CHANGE_ACTIVITY_ID ||
    submission.activityVersion !== BANK_CHANGE_ACTIVITY_VERSION ||
    typeof submission.attemptId !== "string" ||
    submission.attemptId.length === 0 ||
    typeof submission.completedAt !== "string" ||
    Number.isNaN(Date.parse(submission.completedAt)) ||
    !BANK_CHANGE_INITIAL_ACTION_IDS.has(submission.initialActionId) ||
    !BANK_CHANGE_EVIDENCE_ASSESSMENT_IDS.has(
      submission.evidenceAssessmentId,
    ) ||
    !BANK_CHANGE_VERIFICATION_ROUTE_IDS.has(submission.verificationRouteId) ||
    !BANK_CHANGE_PROCESS_ACTION_IDS.has(submission.processActionId) ||
    !BANK_CHANGE_REPORT_ACTION_IDS.has(submission.reportActionId) ||
    !Array.isArray(submission.inspectedEvidenceIds)
  ) {
    return false;
  }

  const inspectedEvidenceIds = new Set(submission.inspectedEvidenceIds);
  return (
    inspectedEvidenceIds.size === submission.inspectedEvidenceIds.length &&
    submission.inspectedEvidenceIds.every((evidenceId) =>
      BANK_CHANGE_EVIDENCE_IDS.has(evidenceId),
    )
  );
}

function findChoicePoints<Id extends string>(
  options: readonly { id: Id; points: number }[],
  selectedId: Id,
): number {
  return options.find((option) => option.id === selectedId)?.points ?? 0;
}

export function evaluateBankChange(
  submission: BankChangeSubmission,
): BankChangeResult {
  const stageScores = {
    "initial-action": findChoicePoints(
      BANK_CHANGE_INITIAL_ACTIONS,
      submission.initialActionId,
    ),
    "evidence-assessment": findChoicePoints(
      BANK_CHANGE_EVIDENCE_ASSESSMENTS,
      submission.evidenceAssessmentId,
    ),
    "verification-route": findChoicePoints(
      BANK_CHANGE_VERIFICATION_ROUTES,
      submission.verificationRouteId,
    ),
    "process-action": findChoicePoints(
      BANK_CHANGE_PROCESS_ACTIONS,
      submission.processActionId,
    ),
    "report-action": findChoicePoints(
      BANK_CHANGE_REPORT_ACTIONS,
      submission.reportActionId,
    ),
  } satisfies Record<BankChangeStageId, number>;
  const score = Math.max(
    0,
    Math.min(
      100,
      Object.values(stageScores).reduce((total, value) => total + value, 0),
    ),
  );
  const exactChoices = [
    submission.initialActionId === BANK_CHANGE_CORRECT_CHOICES.initialActionId,
    submission.evidenceAssessmentId ===
      BANK_CHANGE_CORRECT_CHOICES.evidenceAssessmentId,
    submission.verificationRouteId ===
      BANK_CHANGE_CORRECT_CHOICES.verificationRouteId,
    submission.processActionId === BANK_CHANGE_CORRECT_CHOICES.processActionId,
    submission.reportActionId === BANK_CHANGE_CORRECT_CHOICES.reportActionId,
  ];
  const criticalFailureStageIds = BANK_CHANGE_CRITICAL_STAGES.filter(
    (stageId) => {
      if (stageId === "initial-action") return !exactChoices[0];
      if (stageId === "verification-route") return !exactChoices[2];
      if (stageId === "process-action") return !exactChoices[3];
      return !exactChoices[4];
    },
  );
  const competencyScores = {
    verificar: Math.round(
      ((stageScores["evidence-assessment"] +
        stageScores["verification-route"]) /
        45) *
        100,
    ),
    decidir: Math.round(
      ((stageScores["initial-action"] + stageScores["process-action"]) / 40) *
        100,
    ),
    reportar: Math.round((stageScores["report-action"] / 15) * 100),
    orientar: Math.round((stageScores["process-action"] / 20) * 100),
  };
  const coveredCompetencyIds = (
    Object.entries(competencyScores) as Array<
      [keyof typeof competencyScores, number]
    >
  )
    .filter(([, competencyScore]) => competencyScore >= 60)
    .map(([competencyId]) => competencyId);

  return {
    score,
    correctDecisions: exactChoices.filter(Boolean).length,
    totalDecisions: 5,
    stageScores,
    competencyScores,
    coveredCompetencyIds,
    needsReview: score < 75 || criticalFailureStageIds.length > 0,
    criticalFailureStageIds,
    potentialReward: calculateActivityReward(POINT_RULES.teamOperation, score),
  };
}

export function createBankChangeCompetencyEvidence(
  submission: BankChangeSubmission,
  result: BankChangeResult,
): CompetencyEvidence[] {
  return (
    Object.entries(result.competencyScores) as Array<
      [keyof typeof result.competencyScores, number]
    >
  ).map(([competencyId, score]) => ({
    key: `${submission.activityId}:${competencyId}:${submission.attemptId}`,
    competencyId,
    activityId: submission.activityId,
    attemptId: submission.attemptId,
    score,
    context: result.needsReview ? "review" : "independent",
    createdAt: submission.completedAt,
  }));
}

export function isValidBankProcessV2Submission(
  submission: BankProcessV2Submission,
): boolean {
  const contentPackage = findBankChangeProcessV2Package(
    submission.casePackageId,
  );
  if (
    !contentPackage ||
    submission.activityId !== BANK_CHANGE_PROCESS_ACTIVITY_ID ||
    submission.activityVersion !== BANK_CHANGE_PROCESS_ACTIVITY_VERSION ||
    submission.mechanicId !== BANK_CHANGE_PROCESS_MECHANIC_ID ||
    typeof submission.attemptId !== "string" ||
    submission.attemptId.length === 0 ||
    typeof submission.completedAt !== "string" ||
    Number.isNaN(Date.parse(submission.completedAt)) ||
    typeof submission.contactResponseViewed !== "boolean" ||
    !contentPackage.allowlists.contactSourceIds.includes(
      submission.contactSourceId,
    ) ||
    !Array.isArray(submission.selectedComparisonIds) ||
    !Array.isArray(submission.processPlacements) ||
    !Array.isArray(submission.selectedReportBlockIds)
  ) {
    return false;
  }

  const comparisonIds = new Set(submission.selectedComparisonIds);
  const reportIds = new Set(submission.selectedReportBlockIds);
  const placementIds = new Set(
    submission.processPlacements.map((placement) => placement.cardId),
  );
  const processPositions = submission.processPlacements
    .filter((placement) => placement.groupId === "process")
    .map((placement) => placement.position);
  const outsidePositions = submission.processPlacements
    .filter((placement) => placement.groupId === "outside-process")
    .map((placement) => placement.position);

  return (
    comparisonIds.size === submission.selectedComparisonIds.length &&
    submission.selectedComparisonIds.every((id) =>
      contentPackage.allowlists.comparisonIds.includes(id),
    ) &&
    reportIds.size === submission.selectedReportBlockIds.length &&
    submission.selectedReportBlockIds.every((id) =>
      contentPackage.allowlists.reportBlockIds.includes(id),
    ) &&
    submission.processPlacements.length ===
      contentPackage.allowlists.processCardIds.length &&
    placementIds.size === contentPackage.allowlists.processCardIds.length &&
    contentPackage.allowlists.processCardIds.every((id) =>
      placementIds.has(id),
    ) &&
    submission.processPlacements.every(
      (placement) =>
        (placement.groupId === "process" ||
          placement.groupId === "outside-process") &&
        Number.isInteger(placement.position) &&
        placement.position >= 0,
    ) &&
    new Set(processPositions).size === processPositions.length &&
    new Set(outsidePositions).size === outsidePositions.length &&
    processPositions.every(
      (position) => position < processPositions.length,
    ) &&
    outsidePositions.every(
      (position) => position < outsidePositions.length,
    )
  );
}

export function evaluateBankProcessV2(
  submission: BankProcessV2Submission,
): BankProcessV2Result {
  if (!isValidBankProcessV2Submission(submission)) {
    throw new Error(
      "Tentativa da estação bancária inválida ou incompatível com o pacote publicado.",
    );
  }
  const contentPackage = findBankChangeProcessV2Package(
    submission.casePackageId,
  );
  if (!contentPackage) throw new Error("Pacote bancário não encontrado.");

  const selectedComparisonIds = new Set(submission.selectedComparisonIds);
  const correctComparisons =
    contentPackage.allowlists.requiredComparisonIds.filter((id) =>
      selectedComparisonIds.has(id),
    ).length;
  const incorrectComparisons = submission.selectedComparisonIds.filter(
    (id) => !contentPackage.allowlists.requiredComparisonIds.includes(id),
  ).length;
  const comparisonPoints = Math.max(
    0,
    Math.round(
      (correctComparisons /
        contentPackage.allowlists.requiredComparisonIds.length) *
        20,
    ) -
      incorrectComparisons * 5,
  );

  const correctContact =
    submission.contactSourceId ===
      contentPackage.allowlists.correctContactSourceId &&
    submission.contactResponseViewed;
  const contactPoints = correctContact
    ? 25
    : submission.contactResponseViewed &&
        submission.contactSourceId === "public-search"
      ? 5
      : 0;

  const placementById = new Map(
    submission.processPlacements.map((placement) => [
      placement.cardId,
      placement,
    ]),
  );
  const correctlyClassified = contentPackage.allowlists.processCardIds.filter(
    (cardId) => {
      const placement = placementById.get(cardId);
      const expectedGroup = contentPackage.allowlists.requiredProcessCardIds.includes(
        cardId,
      )
        ? "process"
        : "outside-process";
      return placement?.groupId === expectedGroup;
    },
  ).length;
  const processClassificationPoints = Math.round(
    (correctlyClassified / contentPackage.allowlists.processCardIds.length) *
      20,
  );
  const satisfiedRelations = contentPackage.allowlists.requiredRelations.filter(
    (relation) => {
      const before = placementById.get(relation.before);
      const after = placementById.get(relation.after);
      return (
        before?.groupId === "process" &&
        after?.groupId === "process" &&
        before.position < after.position
      );
    },
  ).length;
  const processRelationPoints = Math.round(
    (satisfiedRelations /
      contentPackage.allowlists.requiredRelations.length) *
      20,
  );

  const selectedReportIds = new Set(submission.selectedReportBlockIds);
  const requiredReportCount = contentPackage.allowlists.requiredReportBlockIds.filter(
    (id) => selectedReportIds.has(id),
  ).length;
  const unsafeReportCount = contentPackage.allowlists.unsafeReportBlockIds.filter(
    (id) => selectedReportIds.has(id),
  ).length;
  const reportPoints = Math.max(
    0,
    Math.round(
      (requiredReportCount /
        contentPackage.allowlists.requiredReportBlockIds.length) *
        15,
    ) -
      unsafeReportCount * 5,
  );

  const normalizedControlScores = {
    "initial-action": processClassificationPoints,
    "evidence-assessment": comparisonPoints,
    "verification-route": contactPoints,
    "process-action": processRelationPoints,
    "report-action": reportPoints,
  } satisfies Record<BankChangeStageId, number>;
  const exactScores = [20, 20, 25, 20, 15];
  const correctDecisions = Object.values(normalizedControlScores).filter(
    (score, index) => score === exactScores[index],
  ).length;
  const criticalFailureIds: string[] = [];
  const suspend = placementById.get("suspend-change");
  const confirm = placementById.get("confirm-registered-contact");
  if (
    suspend?.groupId !== "process" ||
    confirm?.groupId !== "process" ||
    suspend.position >= confirm.position
  ) {
    criticalFailureIds.push("contain-before-change");
  }
  if (!correctContact) criticalFailureIds.push("independent-contact");
  if (processRelationPoints < 20)
    criticalFailureIds.push("official-flow-and-second-approval");
  if (reportPoints < 15) criticalFailureIds.push("safe-report");

  const score = Math.max(
    0,
    Math.min(
      100,
      comparisonPoints +
        contactPoints +
        processClassificationPoints +
        processRelationPoints +
        reportPoints,
    ),
  );
  const competencyScores = {
    verificar: Math.round(((comparisonPoints + contactPoints) / 45) * 100),
    decidir: Math.round(
      ((processClassificationPoints + processRelationPoints) / 40) * 100,
    ),
    reportar: Math.round((reportPoints / 15) * 100),
    orientar: Math.round((processRelationPoints / 20) * 100),
  };
  const coveredCompetencyIds = (
    Object.entries(competencyScores) as Array<
      [keyof typeof competencyScores, number]
    >
  )
    .filter(([, value]) => value >= 60)
    .map(([id]) => id);

  return {
    score,
    comparisonPoints,
    contactPoints,
    processClassificationPoints,
    processRelationPoints,
    reportPoints,
    correctDecisions,
    totalDecisions: 5,
    normalizedControlScores,
    competencyScores,
    coveredCompetencyIds,
    needsReview: score < 75 || criticalFailureIds.length > 0,
    criticalFailureIds,
    potentialReward: calculateActivityReward(POINT_RULES.teamOperation, score),
  };
}

export function createBankProcessV2CompetencyEvidence(
  submission: BankProcessV2Submission,
  result: BankProcessV2Result,
): CompetencyEvidence[] {
  return (
    Object.entries(result.competencyScores) as Array<
      [keyof typeof result.competencyScores, number]
    >
  ).map(([competencyId, score]) => ({
    key: `${submission.activityId}:${competencyId}:${submission.attemptId}`,
    competencyId,
    activityId: submission.activityId,
    attemptId: submission.attemptId,
    score,
    context: result.needsReview ? "review" : "independent",
    createdAt: submission.completedAt,
  }));
}
