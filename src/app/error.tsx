"use client";
import { Button } from "@/components/ui/button";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="main" className="shell narrow page-space">
      <h1 className="page-title">화면을 불러오지 못했어요.</h1>
      <p className="page-lead">잠시 후 다시 시도해 주세요.</p>
      <Button onClick={reset}>다시 시도</Button>
    </main>
  );
}
