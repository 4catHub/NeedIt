import { ExternalLink } from "lucide-react";
import { isOfficialUrl } from "@/config/official";
export function OfficialLink({ href, children }: { href: string; children: React.ReactNode }) {
  if (!isOfficialUrl(href)) return <span>공식 링크를 확인할 수 없습니다.</span>;
  return (
    <a
      className="official-link"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      referrerPolicy="no-referrer"
    >
      {children}
      <ExternalLink size={14} aria-hidden="true" />
      <span className="sr-only"> (새 창)</span>
    </a>
  );
}
