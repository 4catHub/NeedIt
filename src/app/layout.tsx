import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { siteUrl, isPublicSite } from "@/config/site";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: { default: "굳이? NeedIt? — 선택하기 전에, 직접 확인", template: "%s | NeedIt?" },
  description:
    "민간 서비스 이용 전, 직접 처리하는 방법과 비용을 비교해 보세요. 나의 시간과 비용을 기준으로 선택하는 NeedIt?.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "굳이? NeedIt?",
    description: "돈을 내기 전에, 직접 할 수 있는지 확인해 보세요.",
    type: "website",
    locale: "ko_KR",
    siteName: "NeedIt?",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  robots: isPublicSite ? { index: true, follow: true } : { index: false, follow: false },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <a className="skip-link" href="#main">
            본문으로 건너뛰기
          </a>
          <SiteHeader />
          {children}
          <footer className="site-footer">
            <div className="shell flex flex-col justify-between gap-6 py-10 sm:flex-row">
              <div>
                <Link href="/" className="font-bold">
                  굳이? NeedIt?
                </Link>
                <p className="mt-2 text-sm text-muted-foreground">선택은 당신의 몫. 확인은 함께.</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Do you really need that service?
                <br />
                <span className="mt-2 inline-block">© {new Date().getFullYear()} NeedIt?</span>
              </p>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
