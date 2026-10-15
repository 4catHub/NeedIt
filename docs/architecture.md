# 구조와 설계

독립 Next.js App Router 프론트엔드이며 모노레포나 백엔드 런타임은 없습니다. Route 파일은 페이지와 메타데이터를 구성하고 도메인 로직은 `features/tax`에 둡니다.

```text
src/app/                 홈, Tax 소개·입력·결과, SEO, 오류 화면
src/components/layout/   헤더와 테마
src/components/common/   서비스 카드, 금액 입력, 공식 링크, 유의사항
src/components/comparison/ 수수료 비교
src/components/ui/       shadcn/ui 방식의 Button
src/features/tax/
  components/            폼, 결과, 가이드, 모드 표시
  hooks/                 TaxProvider 메모리 상태
  schemas/               입력 검증·금액 파싱
  api/                   어댑터, 응답 검증, 진단 요청 흐름
src/lib/api/             fetch·타임아웃·오류 변환
src/config/              단일 서비스 카탈로그, 공식 출처, 사이트 URL
src/types/               OpenAPI에서 생성한 preview 타입
contracts/               프론트 체험용 명세 (실제 백엔드 계약 아님)
tests/                   단위·브라우저 핵심 흐름 테스트
```

## UI

밝은 아이보리·차분한 녹색의 정보 중심 UI를 사용합니다. 외부 폰트나 이미지 다운로드가 없어 빌드 시 외부 서비스에 의존하지 않습니다. 카드 그리드, 읽기 쉬운 간격, 44px 이상의 주요 컨트롤, 포커스 표시, 모션 감소 설정과 다크 테마를 제공합니다.

Button은 [shadcn/ui의 Radix 기반 패턴](https://ui.shadcn.com/docs/components/button)을 적용한 소스 소유 컴포넌트입니다. `components.json`, CSS 토큰과 alias를 구성했습니다. 접근성 있는 네이티브 select/radio/checkbox/details를 우선해 추가 UI 라이브러리를 줄였습니다. 단순한 4단계 폼은 React state와 Zod로 충분하여 React Hook Form과 TanStack Query는 추가하지 않았습니다.

## 상태와 개인정보

Tax 전용 layout 안의 Context가 입력·결과를 메모리에 보관합니다. Tax 화면 간 이동은 유지되며 새로고침과 Tax 레이아웃 이탈 후 재진입 시 초기화됩니다. 수수료 입력도 컴포넌트 메모리만 사용합니다. LocalStorage에는 `next-themes`가 선택한 테마만 저장할 수 있습니다. Tax 정보는 LocalStorage/SessionStorage/cookie/URL에 저장하지 않습니다.

분석·오류 전송 서비스는 추가하지 않았습니다. HTTP 오류 본문을 읽어 표시하거나 기록하지 않습니다. 실제 API 요청은 캐시와 credential을 사용하지 않고, 공식 외부 링크는 referrer를 보내지 않습니다. 화면 종료 시 진행 중 요청을 취소하고 중복 제출을 차단합니다.

## 확장

`src/config/services.ts`가 서비스 상태의 단일 설정입니다. 현재 Tax만 route를 제공합니다. 다음 서비스를 구현할 때 도메인 폴더와 route를 추가하고 카탈로그를 활성화합니다. 미구현 서비스에 빈 API나 계산 화면을 만들지 않습니다.

## SEO와 실행

홈과 Tax 소개는 서버에서 읽을 수 있는 정적 콘텐츠를 포함합니다. 입력·결과는 noindex이며 sitemap에서 제외됩니다. 공개 도메인 설정 시 robots가 홈·소개를 허용하고 입력·결과를 제외합니다. 로컬 기본 URL은 전체 noindex입니다. Open Graph 이미지는 Next ImageResponse가 PNG로 생성합니다.

서버는 페이지 제공에만 사용합니다. API proxy, 세금 계산, 신고 자동화, DB 연결은 없습니다. 설치·테스트·배포는 README를 참고하세요.
