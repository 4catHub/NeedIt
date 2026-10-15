"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MoneyInput } from "@/components/common/money-input";
import { Disclaimer } from "@/components/common/disclaimer";
import { useTax } from "../hooks/tax-provider";
import { incomeLabels, incomeTypes, parseMoney, formatMoney, taxSchema } from "../schemas/tax";
import { diagnose } from "../api";
import { ApiError } from "@/lib/api/client";
import { ModeNotice } from "./mode-notice";

const steps = ["귀속연도", "소득 유형", "수입 정보", "입력 확인"];
export function TaxForm() {
  const { draft, setDraft, setResult } = useTax();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [gross, setGross] = useState(
    draft.grossIncome === undefined ? "" : formatMoney(draft.grossIncome),
  );
  const [withholding, setWithholding] = useState(
    draft.withholdingTax == null ? "" : formatMoney(draft.withholdingTax),
  );
  const [unknown, setUnknown] = useState(draft.withholdingTax === null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [apiError, setApiError] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);
  const controller = useRef<AbortController | null>(null);
  const submitting = useRef(false);
  useEffect(() => () => controller.current?.abort(), []);
  function changeStep(next: number) {
    setErrors({});
    setApiError("");
    setStep(next);
    requestAnimationFrame(() => heading.current?.focus());
  }
  function next() {
    const nextErrors: Record<string, string> = {};
    if (step === 0 && !taxSchema.shape.taxYear.safeParse(draft.taxYear).success)
      nextErrors.year = "소득 귀속연도를 선택해 주세요.";
    if (step === 1 && !draft.incomeType) nextErrors.income = "소득 유형을 선택해 주세요.";
    if (step === 2) {
      const grossValue = parseMoney(gross);
      const withholdingValue = unknown ? null : parseMoney(withholding);
      if (grossValue === null)
        nextErrors.gross = "총수입금액을 올바른 정수 금액으로 입력해 주세요.";
      if (!unknown && withholdingValue === null)
        nextErrors.withholding = "원천징수세액을 입력하거나 모름을 선택해 주세요.";
      if (Object.keys(nextErrors).length === 0)
        setDraft((previous) => ({
          ...previous,
          grossIncome: grossValue!,
          withholdingTax: withholdingValue,
        }));
    }
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }
    changeStep(step + 1);
  }
  async function submit() {
    if (submitting.current) return;
    const parsed = taxSchema.safeParse(draft);
    if (!parsed.success) {
      setApiError("입력 정보를 확인해 주세요. 이전 단계에서 다시 입력할 수 있습니다.");
      return;
    }
    submitting.current = true;
    setBusy(true);
    setApiError("");
    setResult(null);
    controller.current = new AbortController();
    try {
      const result = await diagnose(parsed.data, undefined, controller.current.signal);
      setResult(result);
      router.push("/tax/result");
    } catch (error) {
      if (!controller.current.signal.aborted)
        setApiError(
          error instanceof ApiError
            ? error.message
            : "진단을 완료하지 못했습니다. 다시 시도해 주세요.",
        );
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  }
  return (
    <main id="main" className="shell form-shell page-space">
      <Link href="/tax" className="back-link">
        ← Tax 안내
      </Link>
      <ModeNotice />
      <ol className="step-progress" aria-label="진단 진행 단계">
        {steps.map((label, index) => (
          <li
            key={label}
            aria-current={step === index ? "step" : undefined}
            className={index < step ? "step-done" : ""}
          >
            <span className="block text-[10px]">STEP {index + 1}</span>
            {label}
            {index < step && <span className="sr-only"> 완료</span>}
          </li>
        ))}
      </ol>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (step < 3) next();
          else void submit();
        }}
        noValidate
        aria-busy={busy}
      >
        <h1 ref={heading} tabIndex={-1} className="page-title text-3xl">
          {
            [
              "어느 해의 소득인가요?",
              "어떤 소득이 있었나요?",
              "수입 정보를 알려주세요.",
              "입력한 내용을 확인해 주세요.",
            ][step]
          }
        </h1>
        <p className="page-lead text-sm">
          {
            [
              "돈을 받은 연도를 선택해 주세요. 신고하는 연도와 다를 수 있어요.",
              "가장 가까운 유형을 선택해 주세요. 잘 모르겠어도 괜찮아요.",
              "지급명세서 등에서 확인한 금액을 입력해 주세요. 임의로 세액을 계산하지 않아요.",
              "추가 개인정보는 필요하지 않아요. 결과는 참고용 안내입니다.",
            ][step]
          }
        </p>
        <div className="panel min-h-52">
          {step === 0 && (
            <div>
              <label className="field-label" htmlFor="tax-year">
                소득 귀속연도 (필수)
              </label>
              <select
                id="tax-year"
                className="field"
                value={draft.taxYear ?? ""}
                aria-invalid={!!errors.year}
                aria-describedby={errors.year ? "year-error" : undefined}
                onChange={(event) =>
                  setDraft((p) => ({
                    ...p,
                    taxYear: event.target.value ? Number(event.target.value) : undefined,
                  }))
                }
              >
                <option value="">연도를 선택해 주세요</option>
                {Array.from(
                  { length: new Date().getFullYear() - 2000 },
                  (_, i) => new Date().getFullYear() - 1 - i,
                ).map((year) => (
                  <option key={year} value={year}>
                    {year}년
                  </option>
                ))}
              </select>
              <p className="field-help">
                선택 가능 연도는 체험 UI 범위입니다. 실제 신고 가능 기간을 뜻하지 않습니다.
              </p>
              {errors.year && (
                <p id="year-error" className="field-error">
                  {errors.year}
                </p>
              )}
            </div>
          )}
          {step === 1 && (
            <fieldset aria-describedby={errors.income ? "income-error" : undefined}>
              <legend className="field-label">소득 유형 (필수)</legend>
              <div className="space-y-3">
                {incomeTypes.map((type) => (
                  <label className="choice" key={type}>
                    <input
                      type="radio"
                      name="income"
                      value={type}
                      checked={draft.incomeType === type}
                      onChange={() => setDraft((p) => ({ ...p, incomeType: type }))}
                    />
                    {incomeLabels[type]}
                  </label>
                ))}
              </div>
              {errors.income && (
                <p id="income-error" className="field-error">
                  {errors.income}
                </p>
              )}
            </fieldset>
          )}
          {step === 2 && (
            <div className="space-y-7">
              <MoneyInput
                label="총수입금액"
                value={gross}
                error={errors.gross}
                onChange={(value) => {
                  setGross(value);
                  setDraft((p) => ({ ...p, grossIncome: parseMoney(value) ?? undefined }));
                }}
              />
              <MoneyInput
                label="원천징수세액"
                value={withholding}
                error={errors.withholding}
                disabled={unknown}
                onChange={(value) => {
                  setWithholding(value);
                  setDraft((p) => ({ ...p, withholdingTax: parseMoney(value) ?? undefined }));
                }}
              />
              <label className="flex items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={unknown}
                  onChange={(event) => {
                    setUnknown(event.target.checked);
                    setDraft((p) => ({
                      ...p,
                      withholdingTax: event.target.checked
                        ? null
                        : (parseMoney(withholding) ?? undefined),
                    }));
                  }}
                />
                원천징수세액을 모르겠어요
              </label>
              <p className="field-help">모르는 금액은 추정해서 채우지 않아도 됩니다.</p>
            </div>
          )}
          {step === 3 && (
            <dl className="review-list">
              <div>
                <dt>소득 귀속연도</dt>
                <dd>{draft.taxYear}년</dd>
              </div>
              <div>
                <dt>소득 유형</dt>
                <dd>{draft.incomeType && incomeLabels[draft.incomeType]}</dd>
              </div>
              <div>
                <dt>총수입금액</dt>
                <dd>{formatMoney(draft.grossIncome ?? 0)}원</dd>
              </div>
              <div>
                <dt>원천징수세액</dt>
                <dd>
                  {draft.withholdingTax == null ? "모름" : `${formatMoney(draft.withholdingTax)}원`}
                </dd>
              </div>
            </dl>
          )}
        </div>
        {Object.keys(errors).length > 0 && (
          <p className="field-error" role="alert">
            입력하지 않았거나 올바르지 않은 항목을 확인해 주세요.
          </p>
        )}
        {apiError && (
          <div className="notice mt-5" role="alert">
            {apiError}
          </div>
        )}
        <div className="my-7 flex justify-between gap-4">
          <Button
            type="button"
            variant="outline"
            disabled={step === 0 || busy}
            onClick={() => changeStep(step - 1)}
          >
            이전
          </Button>
          <Button type="submit" disabled={busy}>
            {busy ? (
              <>
                <LoaderCircle className="animate-spin" aria-hidden="true" />
                확인 중…
              </>
            ) : step === 3 ? (
              "진단 결과 보기"
            ) : (
              <>
                다음 <ArrowRight aria-hidden="true" />
              </>
            )}
          </Button>
        </div>
      </form>
      <Disclaimer />
      <p className="field-help mt-4">
        입력값은 화면을 이동하는 동안 메모리에만 유지되며 새로고침하면 삭제됩니다.
      </p>
    </main>
  );
}
