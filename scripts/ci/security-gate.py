#!/usr/bin/env python3
"""Gates fail-closed para os JSONs reais do Trivy e do ZAP."""
import json
import sys


def trivy_gate(data, mode):
    if not isinstance(data, dict) or data.get("SchemaVersion") != 2 or not isinstance(data.get("Results"), list) or not data["Results"]:
        raise ValueError("Relatório Trivy ausente, incompatível ou sem alvos analisados")
    blocked = []
    for result in data["Results"]:
        for vuln in result.get("Vulnerabilities") or []:
            severity = str(vuln.get("Severity", "UNKNOWN")).upper()
            scores = [float(score) for source in (vuln.get("CVSS") or {}).values()
                      for key, score in source.items() if key in ("V3Score", "V4Score") and score is not None]
            # Mesma política do CLI Trivy no workflow: fs HIGH/CRITICAL;
            # imagem HIGH/CRITICAL somente quando há correção disponível.
            reject = severity in ("HIGH", "CRITICAL", "UNKNOWN")
            if mode == "image":
                reject = reject and bool(vuln.get("FixedVersion"))
            if reject:
                blocked.append(f"{vuln.get('VulnerabilityID')} | {vuln.get('PkgName')} | {severity} | CVSS={max(scores) if scores else 'indisponível'}")
    return blocked


def zap_gate(data):
    if not isinstance(data, dict) or not isinstance(data.get("site"), list) or not data["site"]:
        raise ValueError("Relatório ZAP sem site analisado")
    blocked = []
    for site in data["site"]:
        if "alerts" not in site or not isinstance(site["alerts"], list):
            raise ValueError("Relatório ZAP sem lista de alertas")
        for alert in site["alerts"]:
            risk = int(alert["riskcode"])
            if risk >= 3:  # ZAP usa 0 Info, 1 Low, 2 Medium, 3 High; não há Critical nativo.
                blocked.append(f"{alert.get('pluginid')} | {alert.get('name')} | riskcode={risk}")
    return blocked


def main():
    if len(sys.argv) != 3 or sys.argv[1] not in ("sca", "image", "zap"):
        raise SystemExit("Uso: security-gate.py sca|image|zap relatório.json")
    mode, path = sys.argv[1:]
    try:
        with open(path, encoding="utf-8-sig") as handle:
            data = json.load(handle)
        blocked = zap_gate(data) if mode == "zap" else trivy_gate(data, mode)
    except (OSError, ValueError, KeyError, TypeError, AttributeError) as exc:
        print(f"GATE ERRO (bloqueado): {exc}", file=sys.stderr)
        return 2
    print(f"Gate {mode}: {len(blocked)} achado(s) bloqueante(s)")
    for line in blocked:
        print(line)
    return 1 if blocked else 0


if __name__ == "__main__":
    sys.exit(main())
