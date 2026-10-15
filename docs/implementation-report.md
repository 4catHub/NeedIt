# 구현 및 검증 보고

기준: `plans/261015-plan.md` · 검증일: 2026-10-15 · Windows / Node.js 24.11.1.

현재 구현은 플랜 11·18·22절에서 허용한 **독립 Mock Adapter 기반 Tax MVP**입니다. 실제 Needit OpenAPI와 서버 주소가 제공되지 않아 실제 백엔드 연결은 검증하지 못했습니다. Mock은 신고 의무 판단이나 환급액 계산을 수행하지 않으며 화면에 체험임을 표시합니다.

## [Phase 0]

완료 기능:

- 저장소와 인접 4d4cat 소스 조사. 현재 저장소에는 원본 플랜과 빈 README만 존재.
- 인접 백엔드에 Needit 도메인과 OpenAPI 명세가 없는 점을 확인.

생성/수정 파일:

- 원본 플랜 보존, 이 보고서에 조사 결과 기록.

실행 및 테스트 결과:

- 파일 목록, git 상태, `needit`·`openapi` 검색으로 근거 확인.

백엔드 연동 상태:

- 실제 계약과 URL 없음.

다음 단계:

- 독립 프론트 구성으로 진행. 완료.

## [Phase 1]

완료 기능:

- Next.js 16.4.1 / React 19.3.1 / TypeScript / Tailwind 4.
- shadcn/ui 방식 Button, Radix Slot, Lucide, Zod, 공통 테마·레이아웃.
- ESLint, Prettier, Vitest, Playwright 설정과 npm lockfile.

생성/수정 파일:

- `package.json`, `package-lock.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `components.json`.
- `src/app/layout.tsx`, `globals.css`, `src/components/layout/*`, `src/components/ui/button.tsx`.
- Next.js가 개발 서버 실행 시 생성한 `AGENTS.md` 포함.

실행 및 테스트 결과:

- 타입 검사·Lint·포맷 검사·프로덕션 빌드 통과.

백엔드 연동 상태:

- 프론트만 구성.

다음 단계:

- 홈과 Tax UI 구현. 완료.

## [Phase 2]

완료 기능:

- 브랜드 Hero, 중립적인 비용·시간 선택 메시지, 7개 서비스 카탈로그.
- Tax만 활성화. 나머지 6개는 Coming Soon, 기능 화면 미생성.
- 밝은/어두운 테마, 모바일 1열·중간 2열·데스크톱 3열.

생성/수정 파일:

- `src/app/page.tsx`, `src/config/services.ts`, `src/components/common/service-card.tsx`.

실행 및 테스트 결과:

- desktop/mobile 홈 렌더링·카드 상태·Tax 이동·테마 저장·Tab 탐색·색상 대비 axe 검사 통과.

백엔드 연동 상태:

- 홈은 API 없이 렌더링.

다음 단계:

- Tax 폼과 가이드. 완료.

## [Phase 3]

완료 기능:

- `/tax` 소개와 접기/펼치기 설명, API 없이 읽을 수 있는 직접 처리 가이드.
- `/tax/check` 4단계 입력, 진행 표시, 이전/다음, 확인 화면.
- 금액 포맷·필수 검증·오류·모름 선택·모바일 숫자 키보드·로딩·재시도.
- 메모리 상태 유지, 새로고침 초기화, 입력값 지우기.

생성/수정 파일:

- `src/app/tax/*`, `src/features/tax/components/*`, `hooks/tax-provider.tsx`, `schemas/tax.ts`.
- `src/components/common/money-input.tsx`, `disclaimer.tsx`, `official-link.tsx`.

실행 및 테스트 결과:

- 누락·음수·소수·범위 초과·금액 형식, 단계 왕복과 값 유지, 새로고침 삭제 검증.
- 결과 URL·LocalStorage·SessionStorage에 Tax 정보가 없는 점 검증.

백엔드 연동 상태:

- 계약이 없어 추가 조건과 개인정보는 수집하지 않음. 선택 연도는 명시된 체험 UI 범위.

다음 단계:

- 어댑터 분리와 결과 연결. 완료.

## [Phase 4]

완료 기능:

- 분리된 Mock/live HTTP 어댑터, 취소·12초 타임아웃·공통 오류 변환.
- 임시 OpenAPI fixture에서 타입 생성, 생성 결과 일치 검사.
- eligibility 실패는 재시도, estimate/guide 실패는 부분 결과와 정적 공식 안내 유지.
- 실제 계약 검증 전 live 요청 차단.

생성/수정 파일:

- `contracts/tax-preview.openapi.json`, `src/types/tax-preview.generated.ts`.
- `src/features/tax/api/*`, `src/lib/api/client.ts`, `scripts/check-contract.mjs`, `.env.example`.

실행 및 테스트 결과:

- HTTP 메서드·JSON payload·캐시·credential 설정, 정상·계산 불가·미지원·400/422·5xx·네트워크·timeout·취소·잘못된 응답 검증.
- 브라우저 오류 메시지와 재시도 검증. 서버 오류 본문은 화면에 노출하지 않음.

백엔드 연동 상태:

- **Mock 사용 중. 실제 서버 연동 미검증.** live E2E는 임시 계약 응답을 브라우저에서 주입.

다음 단계:

- 백엔드 OpenAPI가 제공되면 `api-integration.md`의 교체 절차 진행. 외부 계약 제공 전까지 이 단계는 Mock 범위로 검증됨.

## [Phase 5]

완료 기능:

- 신고 확인/추가 정보/미지원 상태, 예상액 있음·없음·추가 정보·부분 장애 표시.
- 직접 처리/민간 서비스 비교. 근거 없는 시간·수수료 숫자 미사용.
- 사용자 입력 수수료만 차액 계산, 비교 불가 상태와 입력 근거 명시.
- 직접 처리/다른 서비스 선택, 출처·확인일·준비물·메뉴·제출 후 확인사항·공식 링크.

생성/수정 파일:

- `src/features/tax/components/tax-result.tsx`, `guide-panel.tsx`, `src/components/comparison/comparison-panel.tsx`, `src/config/official.ts`.

실행 및 테스트 결과:

- 금액 제공·계산 불가·정보 부족·미지원·가이드 장애·수수료 비교, 공식 도메인 제한 검증.
- Mock 실제 화면에서는 금액을 생성하지 않음. 금액 있는 테스트는 fixture에서만 사용.

백엔드 연동 상태:

- 실제 응답 대신 임시 계약 fixture로 표시 분기를 검증.

다음 단계:

- 실제 API 계약 수신 후 상태값 매핑 검증.

## [Phase 6]

완료 기능:

- 페이지별 title/description/OG/canonical, PNG OG 이미지, 아이콘, sitemap, robots, noindex 입력·결과.
- 404·오류 화면, 반응형·접근성·모션 감소, 요청 취소와 중복 제출 방지.
- README, 구조·API·Tax 흐름·테스트·환경 변수·배포 문서.

생성/수정 파일:

- `src/app/{robots,sitemap,opengraph-image,not-found,error}.*`, `src/config/site.ts`.
- `tests/unit/*`, `tests/e2e/*`, `playwright.config.ts`, `vitest.config.ts`, `scripts/production-smoke.mjs`.
- `README.md`, `docs/architecture.md`, `docs/api-integration.md`, `docs/tax-flow.md`, 이 보고서.

실행 및 테스트 결과:

- `npm test`: **44개 통과**, 테스트 파일 3개.
- `npm run test:e2e`: **16개 통과**. Chromium 데스크톱 4개·모바일 4개·live HTTP adapter fixture 8개.
- axe WCAG A/AA 검사: 홈 밝은/다크, 입력, 결과에 위반 없음(자동 검사 범위).
- `npm run api:check`, `npm run lint`, `npm run typecheck`, `npm run format:check`, `npm run build`: 통과.
- `npm run test:production`: 1440px/390px 홈 → Tax → 입력 → 결과, 경로 응답·보안 헤더·OG PNG 통과. 런타임/하이드레이션 오류·가로 넘침 없음.
- `test-results/home-{1440,390}.png`, `result-{1440,390}.png` 캡처 확인. 재생성 가능한 테스트 결과물로 git에서는 제외.
- 주요 화면 모두 정적 사전 렌더링 확인. 외부 폰트·데이터 요청 없이 홈과 소개 제공. 실사용 네트워크에서의 성능 수치를 측정했다는 의미는 아님.
- 운영 의존성 `npm audit --omit=dev --audit-level=high`: 취약점 0.
- 전체 의존성 감사에는 ESLint의 `fast-glob → micromatch → braces` 개발 의존성 경고 5개가 남음(원인 advisory 1개). [공식 advisory](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) 기준 braces 3.0.3까지 영향, 확인 시점 패치 없음. Next.js와 호환되지 않는 구버전 ESLint 설정으로 강제 변경하지 않음.

백엔드 연동 상태:

- 명시된 Mock 체험 모드. 실제 세금 진단·환급 계산·실제 API/CORS 연결은 검증 대상에 포함되지 않음.

다음 단계:

- 백엔드 계약이 제공되면 실제 연동 검증. 배포 절차는 README에 제공, 외부 배포는 수행하지 않음.

## 요구사항 대조

| 플랜 항목                               | 구현 근거                                                | 검증 근거                                         |
| --------------------------------------- | -------------------------------------------------------- | ------------------------------------------------- |
| 독립 프론트·기술 구성·구조 (1–4)        | package, App Router, features 구조                       | build, typecheck, lint                            |
| 단일 서비스 카탈로그·Tax 활성 (5·7)     | services.ts, 홈 카드                                     | desktop/mobile catalogue E2E                      |
| 브랜드·밝은/다크·반응형·접근성 (6)      | globals.css, ThemeProvider, native form                  | 두 화면 크기, theme, Tab, axe, 캡처               |
| 홈 → 소개 → 입력 → 결과 → 가이드 (8–10) | tax routes, TaxForm, GuidePanel                          | E2E + production 전체 흐름                        |
| 계약 우선·어댑터·환경 변수·오류 (11)    | 생성 preview 타입, 분리 어댑터, 미검증 live 차단         | api:check, HTTP 단위 테스트, live-adapter E2E     |
| 금액·계산 불가·추가 정보·비교·행동 (12) | TaxResult, ComparisonPanel                               | 결과 분기·수수료·공식 링크 테스트                 |
| 사전 정보·절차·공식 출처·확인일 (13)    | staticGuide, API GuidePanel                              | 서버 HTML, 공식 링크 E2E                          |
| 메모리 상태·개인정보·로그인 미도입 (14) | TaxProvider, 요청 설정, 결과 URL                         | 새로고침·storage·URL·오류 본문 테스트             |
| 필요한 공통 UI만 구현 (15)              | Button, ServiceCard, MoneyInput, OfficialLink, 비교·안내 | 사용 페이지와 컴포넌트 검사                       |
| SEO·정적 안내 (16)                      | metadata, sitemap, robots, OG PNG                        | SEO E2E, 공개 도메인 단위 테스트, production 응답 |
| UI·Form·API·Result 테스트 (17)          | 단위 44 + E2E 16 + production smoke                      | 위 실행 결과                                      |
| Phase 0–6 (18)                          | 각 Phase 구현 내용                                       | 이 보고서의 Phase별 결과                          |
| 금지 작업 (19)                          | 백엔드·DB·로그인·세금 계산·타 서비스 기능 없음           | 현재 소스 구조, Mock의 계산 불가 응답 검사        |
| 문서·실행·배포·결과 보고 (20–22)        | README와 docs 4개, npm scripts                           | 문서와 스크립트 대조                              |

실제 백엔드 연결은 명세가 존재할 때의 조건부 작업입니다. 현재는 플랜에 허용된 Mock 구현·검증 범위를 충족하며, backend 호환성이 증명된 상태는 아닙니다.
