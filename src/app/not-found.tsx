import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function NotFound() {
  return (
    <main id="main" className="shell narrow page-space">
      <p className="eyebrow">404</p>
      <h1 className="page-title">페이지를 찾지 못했어요.</h1>
      <p className="page-lead">주소를 확인하거나 홈에서 다시 시작해 주세요.</p>
      <Button asChild>
        <Link href="/">홈으로 돌아가기</Link>
      </Button>
    </main>
  );
}
