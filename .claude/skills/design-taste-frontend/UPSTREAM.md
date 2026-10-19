# 출처

이 폴더는 [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill)의
`skills/taste-skill`(tasteskill v2, 플러그인 버전 2.1.2)을 그대로 복사한 것입니다.

- 기준 커밋: `b9ca2fd8047f4c72d7da90ebc1c1203e57c72cd2` (2026-10-19)
- 라이선스: MIT (같은 폴더의 `LICENSE`)
- 수정 사항: 없음. 이 파일과 `LICENSE`만 추가했습니다.

## 업데이트

```bash
git clone --depth 1 https://github.com/Leonxlnx/taste-skill /tmp/taste-skill
rm -rf .claude/skills/design-taste-frontend
cp -r /tmp/taste-skill/skills/taste-skill .claude/skills/design-taste-frontend
cp /tmp/taste-skill/LICENSE .claude/skills/design-taste-frontend/
```

업데이트한 뒤에는 이 파일의 기준 커밋을 고치고, 바뀐 `SKILL.md`와 `scripts/`를 읽어 본 다음 커밋하세요.
스킬은 Claude가 따르는 지시문이므로, 내용을 확인하지 않은 채 갱신하지 않는 것이 안전합니다.
