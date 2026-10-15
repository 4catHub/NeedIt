"use client";
import { createContext, useContext, useState } from "react";
import type { TaxForm } from "../schemas/tax";
import type { TaxResult } from "../api/types";
type Draft = Partial<TaxForm>;
type TaxState = {
  draft: Draft;
  setDraft: React.Dispatch<React.SetStateAction<Draft>>;
  result: TaxResult | null;
  setResult: React.Dispatch<React.SetStateAction<TaxResult | null>>;
  reset: () => void;
};
const TaxContext = createContext<TaxState | null>(null);
export function TaxProvider({ children }: { children: React.ReactNode }) {
  const [draft, setDraft] = useState<Draft>({});
  const [result, setResult] = useState<TaxResult | null>(null);
  return (
    <TaxContext.Provider
      value={{
        draft,
        setDraft,
        result,
        setResult,
        reset: () => {
          setDraft({});
          setResult(null);
        },
      }}
    >
      {children}
    </TaxContext.Provider>
  );
}
export function useTax() {
  const state = useContext(TaxContext);
  if (!state) throw new Error("TaxProvider required");
  return state;
}
