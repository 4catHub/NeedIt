import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, Compass, Scale, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ServiceCard } from "@/components/common/service-card";
import { services } from "@/config/services";
export default function Home() {
  return (
    <main id="main">
      <section className="hero shell">
        <div className="hero-copy">
          <p className="eyebrow flex items-center gap-2">
            <span className="live-dot" /> A LITTLE QUESTION, A BETTER CHOICE
          </p>
          <h1>
            이 서비스,
            <br />
            <span className="hero-question">
              굳이 필요할까<span>?</span>
            </span>
          </h1>
          <p className="hero-english">Do you really need that service?</p>
          <p className="hero-description">
            돈을 내고 이용하기 전에,
            <br />
            직접 할 수 있는지 먼저 확인해 보세요.
          </p>
          <Button asChild>
            <Link href="#services">
              내가 할 수 있는 일 찾기 <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
          <p className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
            <Check size={14} aria-hidden="true" /> 회원가입 없이, 필요한 정보만
          </p>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="visual-top">
            <span>THE CHOICE IS YOURS</span>
            <Compass size={20} />
          </div>
          <div className="question-mark">?</div>
          <div className="visual-bottom">
            <div>
              <span className="visual-label">먼저 확인하고</span>
              <strong>나에게 맞게 선택하기</strong>
            </div>
            <ArrowUpRight size={28} />
          </div>
          <span className="floating-note">
            <Sparkles size={16} /> 조금 더 알아보는 선택
          </span>
        </div>
      </section>
      <section className="services-section" id="services">
        <div className="shell">
          <div className="section-heading">
            <div>
              <p className="eyebrow">EXPLORE SERVICES</p>
              <h2>어떤 일이 궁금하세요?</h2>
            </div>
            <p className="text-sm text-muted-foreground">작은 확인으로 시작하는 합리적인 선택</p>
          </div>
          <div className="service-grid">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>
      <section className="shell py-20">
        <div className="brand-panel">
          <div>
            <Scale size={30} strokeWidth={1.5} aria-hidden="true" />
            <p className="eyebrow mt-7">YOUR TIME. YOUR MONEY. YOUR CHOICE.</p>
            <h2>
              직접 해도, 맡겨도.
              <br />
              알고 선택하면 달라지니까.
            </h2>
          </div>
          <div className="brand-panel-copy">
            <p>
              직접 처리하면 비용을 아낄 수 있고,
              <br />
              서비스를 이용하면 시간을 아낄 수 있어요.
            </p>
            <p>
              어느 쪽이든 정답은 하나가 아니에요.
              <br />
              NeedIt?은 방법과 비용을 살펴보고,
              <br />
              나에게 맞는 선택을 하도록 돕습니다.
            </p>
            <Link href="/tax" className="official-link">
              첫 번째 서비스, Tax 살펴보기 <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
