import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { services } from "@/config/services";
export function ServiceCard({ service }: { service: (typeof services)[number] }) {
  const Icon = service.icon;
  const active = service.status === "available";
  return (
    <article className={`service-card ${active ? "service-active" : ""}`}>
      <div className="flex items-center justify-between">
        <span className="service-icon">
          <Icon size={24} strokeWidth={1.6} aria-hidden="true" />
        </span>
        <span className={`status ${active ? "status-active" : ""}`}>
          {active ? "지금 이용 가능" : "Coming Soon · 준비 중"}
        </span>
      </div>
      <p className="eyebrow mt-7">{service.category}</p>
      <h3 className="mt-2 text-xl font-bold">{service.name}</h3>
      <p className="mt-3 text-sm leading-7 text-muted-foreground">{service.description}</p>
      {active ? (
        <Link className="card-link" href={service.href}>
          직접 확인하기 <ArrowUpRight size={19} aria-hidden="true" />
        </Link>
      ) : (
        <span className="card-link text-muted-foreground">
          준비하고 있어요 <ArrowRight size={18} aria-hidden="true" />
        </span>
      )}
    </article>
  );
}
