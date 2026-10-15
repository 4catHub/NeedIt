import { TaxProvider } from "@/features/tax/hooks/tax-provider";
export default function TaxLayout({ children }: { children: React.ReactNode }) {
  return <TaxProvider>{children}</TaxProvider>;
}
