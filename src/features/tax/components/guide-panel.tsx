import { OfficialLink } from "@/components/common/official-link";
import { staticGuide } from "../api/mock";
import type { Guide } from "../api/types";
export function GuidePanel({ guide }: { guide?: Guide | null }) {
  const content = guide ?? staticGuide;
  return (
    <section id="guide" className="guide-section">
      <p className="eyebrow">DO IT YOURSELF</p>
      <h2 className="section-title">{content.title}</h2>
      <p className="mt-3 text-sm text-muted-foreground">
        {guide
          ? "공식 출처를 바탕으로 제공된 안내입니다."
          : "국세청 공개 안내를 바탕으로 정리했습니다."}{" "}
        실제 신고는 홈택스에서 진행합니다.
      </p>
      <div className="panel mt-6">
        <h3 className="font-bold">먼저 준비하세요</h3>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
          {content.preparation.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
      <ol className="guide-steps">
        {content.steps.map((step, index) => (
          <li key={index}>
            <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            <p>{step}</p>
          </li>
        ))}
      </ol>
      <div className="flex flex-wrap items-center gap-5">
        <OfficialLink href={content.officialUrl}>홈택스 바로가기</OfficialLink>
        <OfficialLink href={content.sourceUrl}>국세청 공식 출처</OfficialLink>
      </div>
      <p className="mt-4 text-xs leading-6 text-muted-foreground">
        출처 확인일: <time dateTime={content.checkedAt}>{content.checkedAt}</time> · 법령과 홈택스
        화면 변경에 따라 메뉴 및 절차가 달라질 수 있습니다. 귀속연도와 신고 유형은 공식 안내에서
        다시 확인하세요.
      </p>
    </section>
  );
}
