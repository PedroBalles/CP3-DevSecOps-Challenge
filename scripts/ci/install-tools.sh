#!/usr/bin/env bash
set -euo pipefail
TOOL=${1:?gitleaks ou trivy}
VERSION=${2:?versão obrigatória}
DIR=$(mktemp -d)
trap 'rm -rf "$DIR"' EXIT
case "$TOOL" in
  gitleaks) REPO=gitleaks/gitleaks; FILE="gitleaks_${VERSION}_linux_x64.tar.gz"; CHECKSUM="gitleaks_${VERSION}_checksums.txt" ;;
  trivy) REPO=aquasecurity/trivy; FILE="trivy_${VERSION}_Linux-64bit.tar.gz"; CHECKSUM="trivy_${VERSION}_checksums.txt" ;;
  *) echo 'Ferramenta não permitida' >&2; exit 1 ;;
esac
curl -fsSL --retry 3 "https://github.com/$REPO/releases/download/v$VERSION/$FILE" -o "$DIR/$FILE"
curl -fsSL --retry 3 "https://github.com/$REPO/releases/download/v$VERSION/$CHECKSUM" -o "$DIR/checksums.txt"
python3 - "$DIR" "$FILE" <<'PY'
import hashlib, pathlib, sys
root, filename = pathlib.Path(sys.argv[1]), sys.argv[2]
entries = dict((line.split()[1].lstrip('*'), line.split()[0]) for line in (root/'checksums.txt').read_text().splitlines() if len(line.split()) == 2)
expected = entries[filename]
actual = hashlib.sha256((root/filename).read_bytes()).hexdigest()
if actual != expected:
    raise SystemExit('Checksum inválido')
print(f'Checksum SHA-256 verificado: {filename}')
PY
tar -xzf "$DIR/$FILE" -C "$DIR" "$TOOL"
mkdir -p "$HOME/.local/bin"
install -m 0755 "$DIR/$TOOL" "$HOME/.local/bin/$TOOL"
if [[ -n "${GITHUB_PATH:-}" ]]; then printf '%s\n' "$HOME/.local/bin" >> "$GITHUB_PATH"; fi
