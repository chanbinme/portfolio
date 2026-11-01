#!/usr/bin/env bash
# PostToolUse(Write|Edit) 훅: src/ 아래 TS·JSON 파일을 고치면 타입 검사(tsc -b)를 돌립니다.
# 콘텐츠 JSON이 src/data/profile.ts 타입과 어긋나면 배포 빌드가 멈추므로, 고친 즉시 잡습니다.
# 실패하면 exit 2로 오류를 Claude에게 돌려줘 바로 고치게 합니다.
set -u
file=$(jq -r '.tool_input.file_path // .tool_response.filePath // empty')
case "$file" in
  */src/*.ts|*/src/*.tsx|*/src/*.json) ;;
  *) exit 0 ;;
esac
cd "${CLAUDE_PROJECT_DIR:-$(dirname "$0")/../..}" || exit 0
[ -d node_modules ] || exit 0
if ! out=$(npx --no-install tsc -b 2>&1); then
  echo "타입 검사 실패 ($file 수정 후). src/data/profile.ts 타입과 맞는지 확인하세요:" >&2
  echo "$out" | head -30 >&2
  exit 2
fi
exit 0
