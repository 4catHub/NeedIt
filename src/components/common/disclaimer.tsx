import { Info } from "lucide-react";
export function Disclaimer() {
  return (
    <aside className="notice">
      <Info size={18} aria-hidden="true" />
      <p>
        NeedIt?은 신고를 대신하지 않습니다. 진단은 참고용이며, 정확한 신고 의무와 환급금은 개인별
        소득·경비·공제와 최종 신고에 따라 달라집니다.
      </p>
    </aside>
  );
}
