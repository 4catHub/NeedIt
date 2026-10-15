"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Disclaimer } from "@/components/common/disclaimer";
import { ComparisonPanel } from "@/components/comparison/comparison-panel";
import { useTax } from "../hooks/tax-provider";
import { formatMoney } from "../schemas/tax";
import { GuidePanel } from "./guide-panel";

export function TaxResult() {
  const { result, reset } = useTax();
  if (!result)
    return (
      <main id="main" className="shell narrow page-space">
        <p className="eyebrow">TAX · RESULT</p>
        <h1 className="page-title">아직 확인한 결과가 없어요.</h1>
        <p className="page-lead">
          결과와 입력값은 메모리에만 보관합니다. 새로고침하거나 새 창을 열면 다시 입력해 주세요.
        </p>
        <Button asChild>
          <Link href="/tax/check">정보 입력하기</Link>
        </Button>
        <GuidePanel />
      </main>
    );
  const { eligibility, estimate } = result;
  const title = {
    REVIEW_REQUIRED: "신고 관련 내용을 확인해 보세요.",
    MORE_INFO: "추가로 확인할 정보가 있어요.",
    UNSUPPORTED: "이 소득 유형은 현재 진단을 지원하지 않아요.",
  }[eligibility.status];
  return (
    <main id="main" className="shell narrow page-space">
      <p className="eyebrow">TAX · RESULT</p>
      {result.mode === "mock" && (
        <div className="preview-notice">
          <strong>체험 결과</strong>
          <span>실제 세금 진단 결과가 아닙니다. 환급액과 신고 의무를 판단하지 않았습니다.</span>
        </div>
      )}
      <h1 className="page-title">{title}</h1>
      <p className="page-lead">{eligibility.message}</p>
      <section className="panel">
        <h2 className="font-bold">신고 전 확인할 내용</h2>
        <ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-7 text-muted-foreground">
          {eligibility.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </section>
      {result.warnings.map((warning, i) => (
        <p className="notice mt-4" role="status" key={i}>
          {warning}
        </p>
      ))}
      <section className="panel mt-5">
        <p className="eyebrow">ESTIMATED REFUND</p>
        <h2 className="mt-2 text-lg font-bold">예상 환급액</h2>
        {estimate?.status === "AVAILABLE" && estimate.refundAmount !== null ? (
          <>
            <p className="result-amount">{formatMoney(estimate.refundAmount)}원</p>
            <p className="mt-3 text-sm text-muted-foreground">
              진단 서비스가 제공한 참고용 예상액이며 확정 금액이 아닙니다.
            </p>
          </>
        ) : (
          <p className="mt-4 text-xl font-bold">
            {estimate?.status === "MORE_INFO"
              ? "추가 정보가 필요합니다."
              : "현재 입력값만으로는 계산할 수 없습니다."}
          </p>
        )}
        <p className="mt-4 text-sm leading-7 text-muted-foreground">
          {estimate?.message ??
            "예상 환급액을 제공할 수 없습니다. 홈택스에서 실제 신고 자료를 확인하세요."}
        </p>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          원천징수세액은 환급금과 같지 않습니다. 공제·경비·다른 소득에 따라 달라지며 추가 납부가
          생길 수도 있습니다.
        </p>
      </section>
      <ComparisonPanel />
      <div className="my-8">
        <Disclaimer />
      </div>
      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <a href="#guide">직접 처리 방법 보기</a>
        </Button>
        <Button asChild variant="outline">
          <Link href="/#services">다른 서비스 알아보기</Link>
        </Button>
      </div>
      <GuidePanel guide={result.guide} />
      <div className="mt-10 flex flex-wrap gap-4">
        <Button asChild variant="outline">
          <Link href="/tax/check">입력 수정하기</Link>
        </Button>
        <Button variant="ghost" onClick={reset}>
          입력값과 결과 지우기
        </Button>
      </div>
    </main>
  );
}
