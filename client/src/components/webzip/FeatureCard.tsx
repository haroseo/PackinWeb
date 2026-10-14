import { Link } from "wouter";
import { Bookmark, ArrowUpRight, GitCompareArrows, Check } from "lucide-react";
import { categories, type Feature } from "@/data/catalog";
import { useLibrary } from "@/contexts/LibraryContext";
import { featureIcons, categoryIcons } from "./Icons";
export default function FeatureCard({
  feature,
  compact = false,
}: {
  feature: Feature;
  compact?: boolean;
}) {
  const { saved, toggleSaved, compare, toggleCompare } = useLibrary();
  const Icon = featureIcons[feature.id] || categoryIcons[feature.category];
  const isSaved = saved.includes(feature.id),
    isCompared = compare.includes(feature.id);
  return (
    <article
      className={`feature-card ${compact ? "compact" : ""} ${isCompared ? "compared" : ""}`}
    >
      <div className="card-top">
        <span className="feature-icon">
          <Icon size={23} strokeWidth={1.6} />
        </span>
        <button
          className={`bookmark-button ${isSaved ? "is-saved" : ""}`}
          onClick={() => toggleSaved(feature.id)}
          aria-label={`${feature.title} ${isSaved ? "저장 해제" : "저장"}`}
          aria-pressed={isSaved}
        >
          <Bookmark
            size={18}
            fill={isSaved ? "currentColor" : "none"}
            strokeWidth={1.5}
          />
        </button>
      </div>
      <Link href={`/features/${feature.id}`} className="card-link">
        <div className="card-category">
          {categories.find(c => c.id === feature.category)?.label}
        </div>
        <h3>
          {feature.title}
          <ArrowUpRight size={17} />
        </h3>
        <p>{feature.description}</p>
      </Link>
      <div className="card-footer">
        <div className="card-tags">
          <span className="difficulty">
            <span className={`level-dots level-${feature.difficulty}`}>
              <i />
              <i />
              <i />
            </span>
            {feature.difficulty}
          </span>
          {feature.essential && <span className="essential">기본 기능</span>}
        </div>
        <button
          className={`compare-toggle ${isCompared ? "selected" : ""}`}
          onClick={() => toggleCompare(feature.id)}
          aria-label={`${feature.title} 비교 ${isCompared ? "해제" : "선택"}`}
          aria-pressed={isCompared}
        >
          {isCompared ? <Check size={13} /> : <GitCompareArrows size={13} />}
          <span>비교</span>
        </button>
      </div>
    </article>
  );
}
