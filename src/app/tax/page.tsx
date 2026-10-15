import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileSearch, ListChecks, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Disclaimer } from "@/components/common/disclaimer";
import { OfficialLink } from "@/components/common/official-link";
import { ModeNotice } from "@/features/tax/components/mode-notice";
import { GuidePanel } from "@/features/tax/components/guide-panel";
import { official } from "@/config/official";
export const metadata: Metadata = {
  title: "종합소득세 환급 확인",
  description:
    "종합소득세 신고 전, 이미 낸 세금과 직접 확인할 방법을 살펴보세요. 홈택스 공식 가이드와 비용 비교를 제공합니다.",
  alternates: { canonical: "/tax" },
  openGraph: {
    title: "종합소득세 환급 확인 | NeedIt?",
    description: "신고 전에 알아두고, 나에게 맞게 선택하세요.",
    url: "/tax",
  },
};
export default function TaxPage() {
  return (
    <main id="main" className="shell narrow page-space">
      <Link href="/#services" className="back-link">
        ← 서비스 목록
      </Link>
      <p className="eyebrow mt-10">TAX · 종합소득세</p>
      <h1 className="page-title">
        이미 낸 세금,
        <br />
        직접 확인해 볼까요?
      </h1>
      <p className="page-lead">
        환급 서비스를 이용하기 전, 내 소득을 정리하고
        <br className="hidden sm:block" /> 직접 신고하는 방법부터 알아보세요.
      </p>
      <ModeNotice />
      <div className="my-8">
        <Button asChild>
          <Link href="/tax/check">
            진단 시작하기 <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
        <p className="mt-3 text-sm text-muted-foreground">
          금액과 소득 유형만 입력해요. 이름·주민번호는 필요 없어요.
        </p>
      </div>
      <section className="info-grid">
        {[
          [
            FileSearch,
            "어떤 세금을 확인하나요?",
            "종합소득세는 여러 소득을 합산해 정산하는 세금입니다. 미리 납부한 세금이 최종 세액보다 많으면 환급이 생길 수 있어요.",
          ],
          [
            ListChecks,
            "누가 살펴보면 좋을까요?",
            "프리랜서·사업소득, 여러 곳의 소득, 기타소득 등이 있다면 홈택스에서 신고 안내와 자료를 확인해 보세요. 소득 유형만으로 의무가 정해지지는 않아요.",
          ],
          [
            Scale,
            "직접 처리하면 무엇이 다른가요?",
            "홈택스 이용 수수료 없이 직접 자료를 확인하고 신고할 수 있어요. 다만 자료를 준비하고 검토하는 시간과 책임은 직접 부담합니다.",
          ],
        ].map(([Icon, title, text]) => {
          const I = Icon as typeof FileSearch;
          return (
            <article className="panel" key={String(title)}>
              <I className="mb-5 text-primary" aria-hidden="true" />
              <h2 className="font-bold">{String(title)}</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{String(text)}</p>
            </article>
          );
        })}
      </section>
      <details className="panel my-6">
        <summary>원천징수된 금액이 모두 환급되나요?</summary>
        <p className="mt-4 text-sm leading-7 text-muted-foreground">
          아니요. 원천징수는 미리 낸 세금입니다. 실제 환급 여부는 다른 소득, 공제, 필요경비 등을
          반영한 최종 세액과 비교해야 알 수 있습니다. 추가 납부가 생길 수도 있어요.
        </p>
        <div className="mt-4">
          <OfficialLink href={official.overview}>국세청 종합소득세 안내</OfficialLink>
        </div>
      </details>
      <Disclaimer />
      <GuidePanel />
    </main>
  );
}
