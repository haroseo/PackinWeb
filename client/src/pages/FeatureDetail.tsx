import { useEffect } from "react";
import { Link } from "wouter";
import {
  ArrowLeft,
  ArrowUpRight,
  Bookmark,
  Check,
  ChevronRight,
  GitCompareArrows,
  ShieldCheck,
  Eye,
  Accessibility,
  Scale,
  Link2,
} from "lucide-react";
import { toast } from "sonner";
import { features, categories } from "@/data/catalog";
import { useLibrary } from "@/contexts/LibraryContext";
import { featureIcons, categoryIcons } from "@/components/webzip/Icons";
import FeatureCard from "@/components/webzip/FeatureCard";
import NotFound from "./NotFound";
const sections = [
  ["overview", "기능 이해하기"],
  ["flow", "사용자 흐름"],
  ["components", "필수 구성 요소"],
  ["exceptions", "예외 상황"],
  ["considerations", "도입 전 고려사항"],
  ["options", "구현 방식 비교"],
  ["checklist", "구현 체크리스트"],
  ["sources", "공식 참고 자료"],
];
export default function FeatureDetail({ id }: { id: string }) {
  const feature = features.find(f => f.id === id);
  const { saved, toggleSaved, compare, toggleCompare, checked, toggleChecked } =
    useLibrary();
  useEffect(() => {
    if (feature) document.title = `${feature.title} 가이드 — Webzip`;
    return () => {
      document.title = "Webzip — 웹을 이루는 모든 기능";
    };
  }, [feature]);
  if (!feature) return <NotFound />;
  const Icon = featureIcons[id] || categoryIcons[feature.category];
  const category = categories.find(c => c.id === feature.category);
  const related = feature.related
    .map(id => features.find(f => f.id === id))
    .filter((f): f is NonNullable<typeof f> => !!f);
  const done = feature.checklist.filter((_, i) =>
    checked.includes(`${id}:${i}`)
  ).length;
  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("가이드 링크를 복사했어요.");
    } catch {
      toast.error("링크를 복사할 수 없습니다. 주소 표시줄에서 복사해 주세요.");
    }
  }
  return (
    <div className="page detail-page">
      <div className="breadcrumbs">
        <Link href="/">모든 기능</Link>
        <ChevronRight size={12} />
        <Link href={`/?category=${category?.id}`}>{category?.label}</Link>
        <ChevronRight size={12} />
        <span>{feature.title}</span>
      </div>
      <header className="detail-heading">
        <span className="detail-icon">
          <Icon size={31} strokeWidth={1.5} />
        </span>
        <div className="detail-title">
          <div className="eyebrow">{feature.english.toUpperCase()}</div>
          <h1>
            {feature.title}
            <span>.</span>
          </h1>
          <p>{feature.description}</p>
          <div className="detail-badges">
            <span>{feature.difficulty}</span>
            {feature.essential && <span>기본 기능</span>}
            {feature.purposes.map(p => (
              <span key={p}>{p}</span>
            ))}
          </div>
        </div>
      </header>
      <div className="detail-actions">
        <button
          className={`button ${saved.includes(id) ? "dark" : ""}`}
          onClick={() => toggleSaved(id)}
        >
          <Bookmark
            size={16}
            fill={saved.includes(id) ? "currentColor" : "none"}
          />
          {saved.includes(id) ? "컬렉션에 저장됨" : "컬렉션에 저장"}
        </button>
        <button className="button" onClick={() => toggleCompare(id)}>
          <GitCompareArrows size={16} />
          {compare.includes(id) ? "비교에서 제외" : "비교에 추가"}
        </button>
        <button
          className="button icon-only"
          onClick={copyLink}
          aria-label="가이드 링크 복사"
        >
          <Link2 size={17} />
        </button>
      </div>
      <div className="detail-layout">
        <article className="guide-content">
          <section id="overview">
            <div className="guide-section-label">01 / OVERVIEW</div>
            <h2>기능 이해하기</h2>
            <p>{feature.overview}</p>
            <div className="why-box">
              <strong>왜 필요한가요?</strong>
              <p>{feature.why}</p>
            </div>
          </section>
          <section id="flow">
            <div className="guide-section-label">02 / USER FLOW</div>
            <h2>사용자는 이렇게 경험해요</h2>
            <ol className="flow-list">
              {feature.flow.map((step, i) => (
                <li key={i}>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <p>{step}</p>
                </li>
              ))}
            </ol>
          </section>
          <section id="components">
            <div className="guide-section-label">03 / BUILDING BLOCKS</div>
            <h2>필수 구성 요소</h2>
            <div className="component-list">
              {feature.components.map((item, i) => (
                <div key={i}>
                  <Check size={15} />
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </section>
          <section id="exceptions">
            <div className="guide-section-label">04 / EDGE CASES</div>
            <h2>놓치기 쉬운 예외 상황</h2>
            {feature.exceptions.map((item, i) => (
              <div className="exception-item" key={i}>
                <span>0{i + 1}</span>
                <p>{item}</p>
              </div>
            ))}
          </section>
          <section id="considerations">
            <div className="guide-section-label">05 / CONSIDERATIONS</div>
            <h2>도입 전, 꼭 확인하세요</h2>
            <div className="considerations">
              {[
                { title: "보안", text: feature.security, Icon: ShieldCheck },
                { title: "개인정보", text: feature.privacy, Icon: Eye },
                {
                  title: "접근성",
                  text: feature.accessibility,
                  Icon: Accessibility,
                },
                { title: "법적 고려사항", text: feature.legal, Icon: Scale },
              ].map(({ title, text, Icon }) => (
                <div key={title}>
                  <h3>
                    <Icon size={17} />
                    {title}
                  </h3>
                  <p>{text}</p>
                </div>
              ))}
            </div>
            <p className="fine-print">
              기술 선택과 법적 의무는 서비스 환경과 관할 지역에 따라 달라집니다.
              실제 적용 전 최신 공식 문서와 필요한 전문 자문을 확인하세요.
            </p>
          </section>
          <section id="options">
            <div className="guide-section-label">06 / APPROACHES</div>
            <h2>어떤 방식으로 구현할까요?</h2>
            <div className="approach-grid">
              {feature.options.map(option => (
                <div className="approach-card" key={option.name}>
                  <h3>{option.name}</h3>
                  <dl>
                    <dt>장점</dt>
                    <dd>{option.pros}</dd>
                    <dt>고려할 점</dt>
                    <dd>{option.cons}</dd>
                    <dt>이럴 때 적합해요</dt>
                    <dd>{option.bestFor}</dd>
                  </dl>
                </div>
              ))}
            </div>
          </section>
          <section id="checklist">
            <div className="guide-section-label">07 / READY TO BUILD</div>
            <div className="checklist-heading">
              <h2>구현 체크리스트</h2>
              <span>
                {done} / {feature.checklist.length}
              </span>
            </div>
            <p className="checklist-intro">
              만들기 전부터 출시 전까지, 한 항목씩 확인해 보세요.
            </p>
            <div className="guide-checklist">
              {feature.checklist.map((item, i) => {
                const key = `${id}:${i}`;
                return (
                  <label
                    key={key}
                    className={checked.includes(key) ? "checked" : ""}
                  >
                    <input
                      type="checkbox"
                      checked={checked.includes(key)}
                      onChange={() => toggleChecked(key)}
                    />
                    <span>{item}</span>
                  </label>
                );
              })}
            </div>
            <span className="local-note">
              체크 상태는 이 브라우저에 저장됩니다.
            </span>
          </section>
          <section id="sources">
            <div className="guide-section-label">08 / GO DEEPER</div>
            <h2>공식 참고 자료</h2>
            <div className="source-links">
              {feature.sources.map(source => (
                <a
                  href={source.url}
                  key={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div>
                    <strong>{source.title}</strong>
                    <span>{new URL(source.url).hostname}</span>
                  </div>
                  <ArrowUpRight size={18} />
                </a>
              ))}
            </div>
          </section>
        </article>
        <aside className="guide-toc">
          <div className="toc-inner">
            <span className="nav-section-label">이 가이드에서</span>
            {sections.map(([id, title], i) => (
              <a key={id} href={`#${id}`}>
                <span>0{i + 1}</span>
                {title}
              </a>
            ))}
            <div className="toc-note">
              <strong>아는 것에서 만드는 것으로.</strong>
              <p>
                필요한 기능을 모아 서비스의
                <br />
                전체 흐름을 그려보세요.
              </p>
              <Link href="/checklist">
                서비스 체크리스트 <ArrowUpRight size={13} />
              </Link>
            </div>
          </div>
        </aside>
      </div>
      <section className="related-section">
        <div className="section-title">
          <div>
            <h2>함께 살펴보면 좋은 기능</h2>
            <p>이 기능과 연결되는 다음 단계도 알아보세요.</p>
          </div>
        </div>
        <div className="feature-grid">
          {related.map(f => (
            <FeatureCard key={f.id} feature={f} />
          ))}
        </div>
      </section>
      <Link className="back-library" href={`/?category=${feature.category}`}>
        <ArrowLeft size={15} />
        {category?.label} 목록으로
      </Link>
    </div>
  );
}
