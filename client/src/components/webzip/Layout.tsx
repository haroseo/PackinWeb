import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link, useLocation, useSearch } from "wouter";
import {
  ArrowUpRight,
  Bookmark,
  CheckCheck,
  ChevronRight,
  Command,
  Grid2X2,
  GitCompareArrows,
  Menu,
  Search,
  X,
  Layers,
  BookOpen,
} from "lucide-react";
import { categories, features } from "@/data/catalog";
import { useLibrary } from "@/contexts/LibraryContext";
import { BrandMark, categoryIcons } from "./Icons";
export default function Layout({ children }: { children: ReactNode }) {
  const [location, navigate] = useLocation();
  const query = useSearch();
  const category = new URLSearchParams(query).get("category");
  const [menu, setMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia("(max-width: 760px)").matches
  );
  const sidebarRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const { saved, compare, setCompare } = useLibrary();
  useEffect(() => {
    const media = window.matchMedia("(max-width: 760px)");
    const update = () => {
      setIsMobile(media.matches);
      if (!media.matches) setMenu(false);
    };
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (!menu || !isMobile) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    sidebarRef.current
      ?.querySelector<HTMLButtonElement>(".mobile-close")
      ?.focus();
    const trap = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const controls = Array.from(
        sidebarRef.current?.querySelectorAll<HTMLElement>(
          "a[href], button:not([disabled])"
        ) || []
      ).filter(item => item.getClientRects().length > 0);
      const first = controls[0],
        last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", trap);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", trap);
      triggerRef.current?.focus();
    };
  }, [menu, isMobile]);
  useEffect(() => {
    setMenu(false);
    window.scrollTo({ top: 0 });
  }, [location, query]);
  useEffect(() => {
    function key(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (location !== "/") navigate("/");
        setTimeout(
          () => document.getElementById("feature-search")?.focus(),
          80
        );
      }
      if (e.key === "Escape") setMenu(false);
    }
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [location, navigate]);
  const selected = location === "/" && !category;
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        본문으로 건너뛰기
      </a>
      {menu && (
        <button
          className="menu-scrim"
          aria-label="메뉴 닫기"
          tabIndex={-1}
          onClick={() => setMenu(false)}
        />
      )}
      <aside
        id="webzip-sidebar"
        ref={sidebarRef}
        className={`sidebar ${menu ? "is-open" : ""}`}
        aria-label="주 탐색"
        aria-hidden={isMobile && !menu ? true : undefined}
        inert={isMobile && !menu}
        role={isMobile && menu ? "dialog" : undefined}
        aria-modal={isMobile && menu ? true : undefined}
      >
        <Link className="wordmark" href="/">
          <BrandMark />
          <span>
            PackinWeb<span className="wordmark-dot">.</span>
          </span>
        </Link>
        <button
          className="mobile-close icon-button"
          onClick={() => setMenu(false)}
          aria-label="메뉴 닫기"
        >
          <X size={20} />
        </button>
        <div className="sidebar-caption">패킨웹 기능 모음</div>
        <nav className="primary-nav">
          <Link className={`nav-item ${selected ? "active" : ""}`} href="/">
            <Grid2X2 size={18} />
            <span>모든 기능</span>
            <span className="nav-count">{features.length}</span>
          </Link>
          <Link
            className={`nav-item ${location === "/saved" ? "active" : ""}`}
            href="/saved"
          >
            <Bookmark size={18} />
            <span>내 컬렉션</span>
            {saved.length > 0 && (
              <span className="nav-count">{saved.length}</span>
            )}
          </Link>
          <Link
            className={`nav-item ${location === "/compare" ? "active" : ""}`}
            href="/compare"
          >
            <GitCompareArrows size={18} />
            <span>기능 비교</span>
          </Link>
          <Link
            className={`nav-item ${location === "/checklist" ? "active" : ""}`}
            href="/checklist"
          >
            <CheckCheck size={18} />
            <span>서비스 체크리스트</span>
          </Link>
        </nav>
        <div className="nav-section-label">카테고리</div>
        <nav className="category-nav">
          {categories.map(c => {
            const Icon = categoryIcons[c.id];
            return (
              <Link
                className={`nav-item ${location === "/" && category === c.id ? "active" : ""}`}
                key={c.id}
                href={`/?category=${c.id}`}
              >
                <Icon size={18} />
                <span>{c.label}</span>
                <span className="category-count">
                  {features.filter(f => f.category === c.id).length}
                </span>
              </Link>
            );
          })}
        </nav>
        <div className="sidebar-bottom">
          <Link className="start-note" href="/checklist">
            <span className="start-note-icon">
              <Layers size={18} />
            </span>
            <strong>아이디어를 서비스로.</strong>
            <p>
              무엇부터 만들지 고민이라면
              <br />
              체크리스트로 시작해 보세요.
            </p>
            <span className="start-note-link">
              체크리스트 살펴보기 <ArrowUpRight size={14} />
            </span>
          </Link>
          <Link className="about-link" href="/about">
            <BookOpen size={15} /> 패킨웹 소개 <ArrowUpRight size={13} />
          </Link>
          <div className="sidebar-footer">
            작은 기능이 모여, 더 나은 웹이 됩니다.
            <br />
            <span>© 2026 PackinWeb</span>
          </div>
        </div>
      </aside>
      <div className="workspace" inert={isMobile && menu}>
        <header className="topbar">
          <div className="topbar-left">
            <button
              ref={triggerRef}
              className="mobile-toggle icon-button"
              aria-label="메뉴 열기"
              aria-expanded={menu}
              aria-controls="webzip-sidebar"
              onClick={() => setMenu(true)}
            >
              <Menu size={20} />
            </button>
            <span className="topbar-label">라이브러리</span>
            <ChevronRight size={13} />
            <span>
              {location === "/saved"
                ? "내 컬렉션"
                : location === "/compare"
                  ? "기능 비교"
                  : location === "/checklist"
                    ? "서비스 체크리스트"
                    : location === "/about"
                      ? "패킨웹 소개"
                      : location.startsWith("/features/")
                        ? "기능 가이드"
                        : "둘러보기"}
            </span>
          </div>
          <div className="topbar-actions">
            <button
              className="quick-search"
              onClick={() => {
                if (location !== "/") navigate("/");
                setTimeout(
                  () => document.getElementById("feature-search")?.focus(),
                  80
                );
              }}
            >
              <Search size={15} />
              <span>빠른 검색</span>
              <kbd>검색</kbd>
            </button>
            <div className="header-divider" />
            <Link className="header-bookmark" href="/saved">
              <Bookmark size={16} />
              <span>내 컬렉션</span>
            </Link>
          </div>
        </header>
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <footer className="main-footer">
          <span>필요한 기능을 찾고, 더 나은 웹을 만드세요.</span>
          <Link href="/about">
            패킨웹 소개 <ArrowUpRight size={12} />
          </Link>
        </footer>
      </div>
      {compare.length > 0 && location !== "/compare" && (
        <div className="compare-bar" inert={isMobile && menu}>
          <GitCompareArrows size={18} />
          <strong>{compare.length}개 기능 선택</strong>
          <span>차이를 한눈에 확인해 보세요.</span>
          <Link href="/compare" className="button dark small">
            비교하기 <ChevronRight size={14} />
          </Link>
          <button
            className="icon-button"
            aria-label="비교 선택 초기화"
            onClick={() => setCompare([])}
          >
            <X size={17} />
          </button>
        </div>
      )}
    </div>
  );
}
