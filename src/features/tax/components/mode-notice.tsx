import { apiMode } from "../api";
export function ModeNotice() {
  return apiMode === "mock" ? (
    <div className="preview-notice" role="note">
      <strong>체험 모드</strong>
      <span>
        실제 API 연결 전입니다. 입력값은 전송되지 않으며 신고 대상 여부나 환급액을 계산하지
        않습니다.
      </span>
    </div>
  ) : (
    <div className="notice">
      입력 정보는 진단을 위해 연결된 API에 전송됩니다. 브라우저에 영구 저장하지 않습니다.
    </div>
  );
}
