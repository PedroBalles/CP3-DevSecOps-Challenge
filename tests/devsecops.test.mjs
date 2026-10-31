import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

function gate(mode, data, expected) {
  const dir = mkdtempSync(join(tmpdir(), "security-gate-"));
  try {
    const path = join(dir, "report.json");
    writeFileSync(path, JSON.stringify(data));
    const result = spawnSync("python3", ["scripts/ci/security-gate.py", mode, path], { encoding: "utf8" });
    assert.equal(result.status, expected, result.stdout + result.stderr);
  } finally { rmSync(dir, { recursive: true, force: true }); }
}
const trivy = (vulns) => ({ SchemaVersion: 2, Results: [{ Target: "test", Vulnerabilities: vulns }] });
test("relatório Trivy limpo é aceito", () => gate("sca", trivy([]), 0));
test("CVSS 9 bloqueia (limiar inclusivo)", () => gate("sca", trivy([{ Severity: "CRITICAL", CVSS: { nvd: { V3Score: 9 } } }]), 1));
test("SCA HIGH bloqueia mesmo abaixo de CVSS 9", () => gate("sca", trivy([{ Severity: "HIGH", CVSS: { nvd: { V3Score: 8.9 } } }]), 1));
test("imagem HIGH com correção bloqueia", () => gate("image", trivy([{ Severity: "HIGH", FixedVersion: "2.0" }]), 1));
test("imagem sem correção é informativa", () => gate("image", trivy([{ Severity: "HIGH" }]), 0));
test("relatório ausente não vira zero", () => gate("image", {}, 2));
test("relatório sem alvos não aprova", () => gate("image", { SchemaVersion: 2, Results: [] }, 2));
test("ZAP High identificado", () => gate("zap", { site: [{ alerts: [{ riskcode: "3", name: "fixture" }] }] }, 1));
test("ZAP Medium fica informativo", () => gate("zap", { site: [{ alerts: [{ riskcode: "2" }] }] }, 0));
test("ZAP sem alvo é erro, não sucesso", () => gate("zap", { site: [] }, 2));
