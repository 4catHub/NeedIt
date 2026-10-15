# 굳이? NeedIt?

민간 서비스를 이용하기 전에 직접 처리할 방법과 비용을 확인하는 독립 프론트엔드입니다. 첫 서비스는 종합소득세(Tax)입니다. 백엔드 코드, DB, 회원가입, 세금 계산식은 포함하지 않습니다.

**현재는 명확히 표시된 Mock 체험 모드입니다.** 조사한 4d4cat 저장소에는 Needit API와 OpenAPI가 없었습니다. 신고 의무를 판단하거나 환급액을 만들지 않습니다. 실제 API 연동 완료를 의미하지 않습니다.

## 실행

Node.js 22.12 이상(검증 환경: 24.11.1), npm을 사용합니다.

```powershell
npm ci
Copy-Item .env.example .env.local
npm run dev
```

<http://localhost:3000> 에 접속합니다. `.env.local` 변경 후 서버를 재시작하세요.

## 제공 기능

- 홈 서비스 카탈로그: Tax 활성, 나머지 6개 서비스 준비 중
- `/tax`: 정적 소개, 유의사항, 공식 출처와 직접 처리 가이드
- `/tax/check`: 연도 → 소득 유형 → 금액 → 확인의 4단계 폼
- `/tax/result`: 진단 상태·예상액 유무·오류·수수료 비교·공식 가이드
- 반응형, 시스템/수동 다크모드, 키보드 탐색, 입력 오류와 로딩 상태
- 페이지별 메타데이터, canonical, Open Graph PNG, sitemap, robots
- 개인정보는 메모리에서만 보관. 새로고침 시 삭제. 결과 URL에 입력값 미포함

실제 세금 신고, 환급액 계산, Tax 이외 서비스, 로그인은 지원하지 않습니다. 사용자가 입력한 서비스 수수료 차액만 표시하며 시간 비용과 임의 업체 가격을 추정하지 않습니다.

## 환경 변수

| 변수                                   | 용도                                                                   |
| -------------------------------------- | ---------------------------------------------------------------------- |
| `NEXT_PUBLIC_NEEDIT_API_MODE`          | `mock`(기본) 또는 `live`                                               |
| `NEXT_PUBLIC_NEEDIT_API_BASE_URL`      | 브라우저에서 호출할 API 기본 URL. 경로에 `/api/needit/...`가 추가됨    |
| `NEXT_PUBLIC_NEEDIT_CONTRACT_VERIFIED` | 실제 계약 교체·검증 후에만 `true`. 미검증 live 모드는 진단 요청을 막음 |
| `NEXT_PUBLIC_SITE_URL`                 | 배포 원점. canonical·sitemap·OG 기준. 로컬 원점은 검색 노출 차단       |

`NEXT_PUBLIC_` 값은 빌드 시 브라우저 번들에 포함됩니다. 비밀 키와 인증정보를 넣지 마세요. 실제 모드 설정은 [API 연결 문서](docs/api-integration.md)를 따르세요.

## 검증

```powershell
npm run api:check
npm run typecheck
npm run lint
npm run format:check
npm test
npx playwright install chromium
npm run test:e2e
npm run build
npm run test:production
```

Playwright는 별도 출력 폴더를 사용하는 Mock/live 두 개발 서버를 실행하고 종료합니다(3100, 3101). live 테스트도 브라우저에서 검증용 응답을 주입하며 실제 백엔드를 호출하지 않습니다. Chromium 데스크톱·모바일과 axe 접근성 검사를 포함합니다. `test:production`은 빌드 후 3310 포트에서 실제 앱 흐름과 OG PNG를 확인하고 서버를 종료합니다. [검증 결과](docs/implementation-report.md)를 참고하세요.

## 배포

Vercel의 Next.js 프로젝트 또는 Node.js 서버로 배포할 수 있습니다. 운영 도메인과 API 환경 변수를 **빌드 전에** 지정하세요.

```powershell
npm ci
npm run build
npm run start
```

Node 서버는 기본 3000 포트이며 앞단 HTTPS 프록시를 구성합니다. 실제 API는 HTTPS 및 프론트 도메인에 대한 CORS가 필요합니다. `POST`와 `Content-Type: application/json`의 OPTIONS preflight도 허용해야 합니다. Mock은 배포 후에도 체험 표시를 유지합니다. 실제 서비스 출시는 백엔드 계약 검증 후 진행하세요.

## 문서와 구성

- [구조와 설계](docs/architecture.md)
- [API 연결·계약 교체](docs/api-integration.md)
- [Tax 사용자 흐름](docs/tax-flow.md)
- [Phase별 구현·검증 보고](docs/implementation-report.md)
- [원본 플랜](plans/261015-plan.md)

기술: Next.js 16 / React 19 / TypeScript / Tailwind 4 / shadcn/ui Button 패턴과 Radix Slot / Lucide / Zod / Vitest / Playwright. 실제 고정 버전은 `package-lock.json`으로 관리합니다. [Next.js 설치 지침](https://nextjs.org/docs/app/getting-started/installation)과 [shadcn Tailwind 4 호환 지침](https://ui.shadcn.com/docs/tailwind-v4)을 기준으로 구성했습니다.
