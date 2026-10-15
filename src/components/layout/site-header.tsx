import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ThemeToggle } from "./theme-provider";
export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell flex items-center justify-between gap-3 py-4">
        <Link href="/" aria-label="NeedIt? 홈" className="brand">
          굳이<span>?</span>
          <span className="brand-en">NeedIt?</span>
        </Link>
        <nav aria-label="주 메뉴" className="flex items-center gap-2 sm:gap-5">
          <Link href="/#services" className="nav-link">
            서비스 둘러보기
          </Link>
          <Link href="/tax" className="nav-link hidden sm:inline-flex">
            Tax <ArrowUpRight size={14} aria-hidden="true" />
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
