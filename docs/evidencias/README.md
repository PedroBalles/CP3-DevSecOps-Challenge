# Evidências

## Já disponível: execuções locais reais

Os relatórios de [relatorios-locais](relatorios-locais/) foram gerados por execução real
nesta máquina (Gitleaks, Semgrep, Trivy, typecheck, testes, lint) e estão versionados com
origem e significado descritos no [LEIA-ME](relatorios-locais/LEIA-ME.md). Não são prints
do GitHub Actions.

## Pendente: prints da esteira remota

Nada aqui foi fabricado. Adicionar somente após executar na conta do grupo:

- `01-esteira-completa.png`: 8 etapas + resumo com sucesso e URL do run.
- `02-gate-bloqueado.png`: execução do PR de demonstração bloqueada pelo Semgrep.
- `03-gate-corrigido.png`: execução seguinte após remover a fixture.
- `04-aprovacao-producao.png`: revisão do Environment, pessoa/data reais.
- `05-ghcr.png`: imagem publicada com SHA e digest.
- `06-producao.png`: aplicação aberta na URL real e revisão servida.
- `07-resumo.png`: Job Summary consolidado da execução completa.

Guardar também links dos artifacts correspondentes. Remover tokens, dados pessoais e informações de conta que não sejam necessárias antes de publicar screenshots.
