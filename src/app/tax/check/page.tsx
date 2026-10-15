import type { Metadata } from "next";
import { TaxForm } from "@/features/tax/components/tax-form";
export const metadata: Metadata = {
  title: "Tax 정보 입력",
  description: "귀속연도, 소득 유형과 수입 정보를 단계별로 확인하세요.",
  alternates: { canonical: "/tax/check" },
  robots: { index: false, follow: false },
  openGraph: { title: "Tax 정보 입력 | NeedIt?", url: "/tax/check" },
};
export default function CheckPage() {
  return <TaxForm />;
}
