"use client";
import { useId } from "react";
import { formatMoney, parseMoney } from "@/features/tax/schemas/tax";
export function MoneyInput({
  label,
  value,
  onChange,
  error,
  disabled,
  optional = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  optional?: boolean;
}) {
  const id = useId();
  return (
    <div>
      <label className="field-label" htmlFor={id}>
        {label}{" "}
        <span className="font-normal text-muted-foreground">({optional ? "선택" : "필수"})</span>
      </label>
      <div className="relative">
        <input
          id={id}
          className="field pr-12"
          type="text"
          inputMode="numeric"
          autoComplete="off"
          maxLength={32}
          value={value}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={`${id}-help${error ? ` ${id}-error` : ""}`}
          onChange={(event) => {
            const raw = event.target.value;
            const parsed = parseMoney(raw.replaceAll(",", ""));
            onChange(parsed === null ? raw : formatMoney(parsed));
          }}
        />
        <span className="absolute right-4 top-4 text-sm text-muted-foreground">원</span>
      </div>
      <p id={`${id}-help`} className="field-help">
        0원 이상 999,999,999,999원 이하의 정수로 입력해 주세요.
      </p>
      {error && (
        <p id={`${id}-error`} className="field-error">
          {error}
        </p>
      )}
    </div>
  );
}
