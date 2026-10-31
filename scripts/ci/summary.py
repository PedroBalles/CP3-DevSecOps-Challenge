#!/usr/bin/env python3
"""Consolida status reais de needs e achados dos artifacts, sem simular ausências."""
import json
import os
from pathlib import Path

ROOT = Path("reports")
NAMES = [("secrets-scan", "1. Gitleaks", "gitleaks.json"),
         ("sast", "2. Semgrep", "semgrep.json"),
         ("build", "3. Build / npm audit", "npm-audit.json"),
         ("sca", "4. Trivy SCA", "trivy-fs.json"),
         ("docker-build", "5. Docker / GHCR", None),
         ("image-scan", "6. Trivy imagem", "trivy-image.json"),
         ("dast-staging", "7. Homologação / ZAP", "report_json.json"),
         ("deploy-prod", "8. Aprovação / produção", None)]


def findings(filename):
    if filename is None:
        return "—"
    paths = list((ROOT / "etapas").rglob(filename))
    if not paths:
        return "não disponível (etapa não executada ou relatório ausente)"
    try:
        data = json.loads(paths[0].read_text(encoding="utf-8-sig"))
        if filename == "gitleaks.json":
            return f"{len(data)} segredo(s), valores redigidos"
        if filename == "semgrep.json":
            return f"{len(data.get('results', []))} achado(s), {len(data.get('errors', []))} erro(s)"
        if filename == "npm-audit.json":
            vulns = data.get("metadata", {}).get("vulnerabilities", {})
            return ", ".join(f"{key}: {value}" for key, value in vulns.items()) or "metadados ausentes"
        if filename == "report_json.json":
            counts = {"High": 0, "Medium": 0, "Low": 0, "Info": 0}
            for site in data.get("site", []):
                for alert in site.get("alerts", []):
                    counts[{0: "Info", 1: "Low", 2: "Medium", 3: "High"}.get(int(alert["riskcode"]), "High")] += 1
            return ", ".join(f"{key}: {value}" for key, value in counts.items())
        counts = {"HIGH": 0, "CRITICAL": 0, "misconfig": 0, "secrets": 0}
        for result in data.get("Results", []):
            for vuln in result.get("Vulnerabilities") or []:
                severity = vuln.get("Severity")
                if severity in counts:
                    counts[severity] += 1
            counts["misconfig"] += len(result.get("Misconfigurations") or [])
            counts["secrets"] += len(result.get("Secrets") or [])
        return ", ".join(f"{key}: {value}" for key, value in counts.items())
    except (ValueError, TypeError, KeyError, OSError) as exc:
        return f"relatório inválido: {str(exc)[:120]}"


def main():
    needs = json.loads(os.environ["NEEDS_JSON"])
    rows = ["# Resumo da Esteira", "", "| Etapa | Resultado | Achados |", "|---|---|---|"]
    for key, name, filename in NAMES:
        result = needs.get(key, {}).get("result", "não disponível")
        rows.append(f"| {name} | {result} | {findings(filename)} |")
    rows += ["", f"Commit: `{os.environ.get('GITHUB_SHA', 'local')}`", "",
             "ZAP é informativo; achados não equivalem a aprovação. Revisar artifacts e deployment review.",
             "Relatório ausente nunca significa zero achados."]
    text = "\n".join(rows) + "\n"
    ROOT.mkdir(exist_ok=True)
    (ROOT / "resumo-esteira.md").write_text(text, encoding="utf-8")
    summary = os.environ.get("GITHUB_STEP_SUMMARY")
    if summary:
        with open(summary, "a", encoding="utf-8") as handle:
            handle.write(text)
    print(text)


if __name__ == "__main__":
    main()
