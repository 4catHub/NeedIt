import type { TaxAdapter, Guide } from "./types";
import { official } from "@/config/official";

export const staticGuide: Guide = {
  title: "홈택스에서 직접 확인하기",
  preparation: [
    "홈택스 로그인 수단",
    "해당 연도 지급명세서와 원천징수 내역",
    "공제·필요경비 증빙과 본인 명의 환급 계좌",
  ],
  steps: [
    "홈택스에 접속해 본인 인증 후 로그인하세요.",
    "세금신고 → 종합소득세 신고에서 귀속연도와 본인에게 맞는 신고 유형을 확인하세요.",
    "수입, 원천징수, 필요경비와 공제 자료를 확인하세요. 자동 입력 자료도 직접 검토하세요.",
    "제출 전 세액을 확인하고, 제출 후 접수증과 신고 내역을 보관하세요. 지방소득세 신고 여부도 확인하세요.",
  ],
  officialUrl: official.hometax,
  sourceUrl: official.filing,
  checkedAt: official.checkedAt,
};
export const mockAdapter: TaxAdapter = {
  async eligibility(input) {
    // Deliberately no eligibility rules or tax calculation in the frontend.
    return {
      status: "MORE_INFO",
      message: "체험 화면입니다. 실제 신고 대상 여부는 판단하지 않았습니다.",
      items: [
        "홈택스에서 소득·원천징수 내역을 확인하세요.",
        ...(input.withholdingTax === null ? ["원천징수세액을 추가로 확인해야 합니다."] : []),
        "공제·경비·다른 소득 등 실제 신고 자료가 필요합니다.",
      ],
    };
  },
  async estimate() {
    return {
      status: "UNAVAILABLE",
      refundAmount: null,
      message:
        "체험 모드에서는 환급액을 계산하지 않습니다. 실제 금액은 홈택스 최종 신고에서 확인하세요.",
    };
  },
  async guide() {
    return staticGuide;
  },
};
