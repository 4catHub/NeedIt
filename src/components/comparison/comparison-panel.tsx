"use client";
import { useState } from "react";
import { MoneyInput } from "@/components/common/money-input";
import { parseMoney, formatMoney } from "@/features/tax/schemas/tax";
export function ComparisonPanel() {
  const [fee, setFee] = useState("");
  const amount = parseMoney(fee);
  return (
    <section className="mt-12">
      <p className="eyebrow">COMPARE YOUR OPTIONS</p>
      <h2 className="section-title">시간과 비용, 함께 살펴보세요.</h2>
      <div className="panel comparison-wrap mt-6">
        <table>
          <caption className="sr-only">직접 처리와 민간 서비스 비교</caption>
          <thead>
            <tr>
              <th scope="col">비교 항목</th>
              <th scope="col">직접 처리</th>
              <th scope="col">민간 서비스</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["이용 비용", "홈택스 이용 무료", "업체별 상이"],
              ["소요 시간", "본인 상황에 따라 확인 필요", "서비스별 확인 필요"],
              ["신고 경로", "홈택스", "해당 서비스"],
              ["처리 주체", "사용자 본인", "서비스별 상이"],
            ].map(([label, direct, service]) => (
              <tr key={label}>
                <th scope="row">{label}</th>
                <td>{direct}</td>
                <td>{service}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="panel mt-5">
        <h3 className="mb-5 font-bold">알고 있는 수수료가 있나요?</h3>
        <MoneyInput
          label="비교할 서비스 수수료"
          optional
          value={fee}
          onChange={setFee}
          error={
            fee !== "" && amount === null
              ? "수수료를 올바른 정수 금액으로 입력해 주세요."
              : undefined
          }
        />
        <div className="notice mt-5" aria-live="polite">
          {amount === null
            ? "서비스 수수료를 알 수 없어 차액을 계산하지 않았습니다."
            : `직접 신고하면 입력하신 서비스 수수료 ${formatMoney(amount)}원을 아낄 수 있습니다. 사용자 입력값만으로 비교한 금액이며, 시간·기타 비용이나 업체의 실제 견적은 반영하지 않았습니다.`}
        </div>
      </div>
    </section>
  );
}
