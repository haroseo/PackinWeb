import { useEffect, useMemo, useState } from "react";
import { Link, useSearch } from "wouter";
import {
  ArrowRight,
  ArrowUpRight,
  Search,
  X,
  SlidersHorizontal,
  Grid2X2,
  List,
  Bookmark,
  Layers,
  ChevronDown,
} from "lucide-react";
import { categories, features, filterFeatures } from "@/data/catalog";
import { useLibrary } from "@/contexts/LibraryContext";
import FeatureCard from "@/components/webzip/FeatureCard";
import { applySeo } from "@/lib/seo";
export default function Home({ savedOnly = false }: { savedOnly?: boolean }) {
  const params = useSearch();
  const category = new URLSearchParams(params).get("category") || "all";
  const [query, setQuery] = useState(""),
    [difficulty, setDifficulty] = useState("all"),
    [purpose, setPurpose] = useState("all"),
    [sort, setSort] = useState("popular"),
    [view, setView] = useState("grid"),
    [limit, setLimit] = useState(12),
    [filtersOpen, setFiltersOpen] = useState(false);
  const { saved } = useLibrary();
  const activeCategory = categories.find(c => c.id === category);
  const items = useMemo(
    () =>
      filterFeatures(
        savedOnly ? features.filter(f => saved.includes(f.id)) : features,
        {
          query,
          category: savedOnly ? "all" : category,
          difficulty,
          purpose,
          sort,
        }
      ),
    [savedOnly, saved, query, category, difficulty, purpose, sort]
  );
  useEffect(
    () => setLimit(12),
    [query, category, difficulty, purpose, sort, savedOnly]
  );
  useEffect(() => {
    if (savedOnly) {
      applySeo({
        title: "내 컬렉션 — 패킨웹",
        description:
          "저장한 웹 기능과 체크리스트를 다시 확인하는 패킨웹 컬렉션",
        path: "/saved",
        noindex: true,
      });
      return;
    }
    if (activeCategory) {
      applySeo({
        title: `${activeCategory.label} 기능 가이드 — 패킨웹`,
        description: `${activeCategory.description} 패킨웹에서 관련 기능의 흐름과 구현 기준을 확인하세요.`,
        path: "/",
        noindex: true,
      });
      return;
    }
    applySeo({
      title: "패킨웹 — 웹사이트 기능 라이브러리",
      description:
        "로그인, 결제, 콘텐츠, 검색, 커뮤니케이션, 운영에 필요한 웹 기능을 한국어 가이드와 코드 예시로 정리했습니다.",
      path: "/",
    });
  }, [activeCategory, savedOnly]);
  function reset() {
    setQuery("");
    setDifficulty("all");
    setPurpose("all");
  }
  const filtered = query || difficulty !== "all" || purpose !== "all";
  return (
    <div className="page library-page">
      <section className={`hero ${savedOnly ? "small-hero" : ""}`}>
        {savedOnly ? (
          <>
            <h1>
              다음 아이디어를 위한
              <br />
              나만의 컬렉션.
            </h1>
            <p>
              눈여겨본 기능들을 모아두고, 필요할 때 다시 꺼내보세요.
              <br />이 브라우저에 저장되며, 계정 없이 사용할 수 있습니다.
            </p>
          </>
        ) : activeCategory ? (
          <>
            <h1>{activeCategory.label}</h1>
            <p>
              {activeCategory.description}
              <br />
              기능의 동작 방식부터 구현할 때 놓치기 쉬운 부분까지.
            </p>
          </>
        ) : (
          <>
            <h1>
              좋은 웹사이트의 시작,
              <br />
              웹서비스 기능 가이드를 한곳에
            </h1>
            <p>
              로그인부터 결제까지, 웹을 이루는 기능들을 한눈에.
              <br />
              무엇이 필요한지 이해하고, 어떻게 만들지 알아보세요.
            </p>
          </>
        )}
        <div className="hero-meta">
          <span>
            <Layers size={14} />
            {savedOnly
              ? `${saved.length}개 저장된 기능`
              : `${activeCategory ? features.filter(f => f.category === category).length : features.length}개 기능 가이드`}
          </span>
          <i />
          <span>
            {savedOnly
              ? "브라우저 로컬 저장"
              : `${categories.length}개 카테고리`}
          </span>
          <i />
          <span>구현 체크리스트 제공</span>
        </div>
      </section>
      {!savedOnly && !activeCategory && (
        <Link href="/checklist" className="guide-banner">
          <span className="guide-banner-icon">
            <Layers size={21} strokeWidth={1.6} />
          </span>
          <div>
            <strong>어디서부터 시작해야 할까요?</strong>
            <span>
              서비스 유형별 체크리스트로 필요한 기능을 빠짐없이 확인하세요.
            </span>
          </div>
          <span className="guide-banner-cta">
            체크리스트 보기 <ArrowRight size={15} />
          </span>
        </Link>
      )}
      <section className="catalog-section" aria-label="기능 목록">
        <div className="section-title">
          <div>
            <h2>
              {savedOnly
                ? "저장한 기능"
                : activeCategory
                  ? "카테고리 기능"
                  : "기능 라이브러리"}
              <span>{items.length}</span>
            </h2>
            <p>
              {savedOnly
                ? "당신의 다음 프로젝트를 위한 작은 준비."
                : "작은 기능 하나부터, 서비스의 큰 그림까지."}
            </p>
          </div>
          <div className="view-switch" aria-label="보기 방식">
            <button
              onClick={() => setView("grid")}
              className={view === "grid" ? "active" : ""}
              aria-label="카드 보기"
              aria-pressed={view === "grid"}
            >
              <Grid2X2 size={16} />
            </button>
            <button
              onClick={() => setView("list")}
              className={view === "list" ? "active" : ""}
              aria-label="목록 보기"
              aria-pressed={view === "list"}
            >
              <List size={18} />
            </button>
          </div>
        </div>
        <div className="search-filter-row">
          <div className="search-input-wrap">
            <Search size={19} strokeWidth={1.7} />
            <input
              id="feature-search"
              aria-label="기능 검색"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="어떤 기능을 찾고 있나요? 이름이나 키워드로 검색해 보세요."
            />
            {query ? (
              <button
                className="icon-button"
                aria-label="검색어 지우기"
                onClick={() => setQuery("")}
              >
                <X size={15} />
              </button>
            ) : (
              <kbd>검색</kbd>
            )}
          </div>
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={`filter-button ${filtersOpen || difficulty !== "all" || purpose !== "all" ? "active" : ""}`}
            aria-expanded={filtersOpen}
          >
            <SlidersHorizontal size={16} />
            필터
            {(difficulty !== "all" || purpose !== "all") && (
              <span className="filter-dot" />
            )}
          </button>
        </div>
        {filtersOpen && (
          <div className="expanded-filters">
            <label>
              구현 난이도
              <select
                value={difficulty}
                onChange={e => setDifficulty(e.target.value)}
              >
                <option value="all">모든 난이도</option>
                {["입문", "중급", "고급"].map(v => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </label>
            <label>
              사용 목적
              <select
                value={purpose}
                onChange={e => setPurpose(e.target.value)}
              >
                <option value="all">모든 서비스</option>
                {["SaaS", "커머스", "콘텐츠", "커뮤니티"].map(v => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </label>
            <button className="text-button" onClick={reset}>
              필터 초기화 <X size={13} />
            </button>
          </div>
        )}
        <div className="catalog-controls">
          {!savedOnly ? (
            <div className="category-pills">
              <Link className={category === "all" ? "active" : ""} href="/">
                전체
              </Link>
              {categories.map(c => (
                <Link
                  key={c.id}
                  className={category === c.id ? "active" : ""}
                  href={`/?category=${c.id}`}
                >
                  {c.name}
                </Link>
              ))}
            </div>
          ) : (
            <span className="saved-hint">
              <Bookmark size={13} /> 저장한 항목만 표시하고 있어요
            </span>
          )}
        </div>
        <div className="results-toolbar">
          <span aria-live="polite">
            {query ? (
              <>
                <strong>“{query}”</strong> 검색 결과{" "}
              </>
            ) : savedOnly ? (
              "저장된 기능 "
            ) : (
              "둘러볼 수 있는 기능 "
            )}
            <strong>{items.length}</strong>개
            {filtered && (
              <button onClick={reset} className="reset-inline">
                초기화 <X size={11} />
              </button>
            )}
          </span>
          <label className="sort-select">
            <select
              aria-label="기능 정렬"
              value={sort}
              onChange={e => setSort(e.target.value)}
            >
              <option value="popular">기본순</option>
              <option value="name">이름순</option>
              <option value="difficulty">쉬운 난이도순</option>
            </select>
            <ChevronDown size={12} />
          </label>
        </div>
        {items.length > 0 ? (
          <>
            <div
              className={`feature-grid ${view === "list" ? "list-view" : ""}`}
            >
              {items.slice(0, limit).map(feature => (
                <FeatureCard key={feature.id} feature={feature} />
              ))}
            </div>
            {limit < items.length && (
              <button
                className="load-more"
                onClick={() => setLimit(current => current + 12)}
              >
                기능 더 보기 <span>{items.length - limit}개</span>
                <ChevronDown size={15} />
              </button>
            )}
          </>
        ) : (
          <div className="empty-state">
            {savedOnly && !filtered ? (
              <Bookmark size={32} strokeWidth={1.3} />
            ) : (
              <Search size={32} strokeWidth={1.3} />
            )}
            <h3>
              {savedOnly && !filtered
                ? "아직 저장한 기능이 없어요."
                : "일치하는 기능을 찾지 못했어요."}
            </h3>
            <p>
              {savedOnly && !filtered
                ? "카드의 북마크 아이콘을 눌러 나만의 컬렉션을 만들어 보세요."
                : "다른 검색어를 입력하거나 필터 조건을 바꿔 보세요."}
            </p>
            {savedOnly && !filtered ? (
              <Link className="button dark" href="/">
                기능 둘러보기 <ArrowUpRight size={15} />
              </Link>
            ) : (
              <button className="button" onClick={reset}>
                검색과 필터 초기화
              </button>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
