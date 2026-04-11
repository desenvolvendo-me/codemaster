#!/usr/bin/env bash

set -euo pipefail

command_name="${1:-}"
if [[ -z "${command_name}" ]]; then
  echo "Usage: with-node22.sh <dev|build|preview> [args...]" >&2
  exit 1
fi
shift || true

has_required_node() {
  node <<'EOF'
const [major, minor] = process.versions.node.split('.').map(Number);
process.exit(major > 22 || (major === 22 && minor >= 12) ? 0 : 1);
EOF
}

if ! has_required_node; then
  if [[ -s "${HOME}/.nvm/nvm.sh" ]]; then
    # shellcheck disable=SC1090
    . "${HOME}/.nvm/nvm.sh"
    nvm use 22 >/dev/null
  fi
fi

if ! has_required_node; then
  echo "The docs site requires Node 22.12+." >&2
  exit 1
fi

npm --prefix website run "${command_name}" -- "$@"
