import type { Metadata } from "next";
import { TaxResult } from "@/features/tax/components/tax-result";
export const metadata: Metadata = {
  title: "Tax 확인 결과",
  description: "신고 관련 확인 사항과 직접 처리 방법을 살펴보세요.",
  alternates: { canonical: "/tax/result" },
  robots: { index: false, follow: false },
  openGraph: { title: "Tax 확인 결과 | NeedIt?", url: "/tax/result" },
};
export default function ResultPage() {
  return <TaxResult />;
}
