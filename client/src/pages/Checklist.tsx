import { useState } from "react";
import { Link } from "wouter";
import {
  ArrowUpRight,
  Bookmark,
  Check,
  ChevronRight,
  Download,
  Layers,
} from "lucide-react";
import { features, serviceTemplates } from "@/data/catalog";
import { featureIcons } from "@/components/webzip/Icons";
import { useLibrary } from "@/contexts/LibraryContext";
import { toast } from "sonner";
export default function Checklist() {
  const [templateId, setTemplateId] = useState("saas");
  const { checked, toggleChecked, saved, toggleSaved } = useLibrary();
  const template = serviceTemplates.find(t => t.id === templateId)!;
  const selected = template.ids
    .map(id => features.find(f => f.id === id))
    .filter((f): f is NonNullable<typeof f> => !!f);
  const done = selected.filter(f =>
    checked.includes(`service:${template.id}:${f.id}`)
  ).length;
  function download() {
    const data = {
      name: template.name,
      source: "Webzip",
      note: "서비스 기획을 위한 참고 체크리스트이며 전체 법적·기술적 요건을 보장하지 않습니다.",
      features: selected.map(f => ({
        id: f.id,
        title: f.title,
        completed: checked.includes(`service:${template.id}:${f.id}`),
        implementationChecklist: f.checklist,
      })),
    };
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json;charset=utf-8",
      })
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `webzip-${template.id}-checklist.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("체크리스트를 다운로드했어요.");
  }
  return (
    <div className="page checklist-page">
      <section className="hero small-hero">
        <div className="eyebrow">
          <span />
          FROM IDEA TO LAUNCH
        </div>
        <h1>
          만들고 싶은 서비스,
          <br />
          필요한 기능부터<span>.</span>
        </h1>
        <p>
          서비스 유형에 맞는 기본 기능을 한눈에 확인하세요.
          <br />
          작은 체크 하나가, 더 완성도 높은 서비스를 만듭니다.
        </p>
      </section>
      <div className="template-tabs" role="tablist" aria-label="서비스 유형">
        {serviceTemplates.map(t => (
          <button
            key={t.id}
            id={`tab-${t.id}`}
            role="tab"
            aria-controls="template-panel"
            aria-selected={templateId === t.id}
            className={templateId === t.id ? "active" : ""}
            onClick={() => setTemplateId(t.id)}
          >
            {t.name}
          </button>
        ))}
      </div>
      <section
        id="template-panel"
        role="tabpanel"
        aria-labelledby={`tab-${template.id}`}
      >
        <div className="template-header">
          <div className="template-title">
            <span>
              <Layers size={22} />
            </span>
            <div>
              <h2>{template.name}</h2>
              <p>{template.description}</p>
            </div>
          </div>
          <button className="button small" onClick={download}>
            <Download size={15} />
            체크리스트 다운로드
          </button>
        </div>
        <div className="progress-panel">
          <div>
            <strong>
              {done === selected.length && selected.length > 0
                ? "모든 기본 기능을 확인했어요."
                : "차근차근, 하나씩 확인해 보세요."}
            </strong>
            <span>
              {done} / {selected.length}개 확인
            </span>
          </div>
          <div
            className="progress-track"
            role="progressbar"
            aria-label="서비스 기능 확인 진행률"
            aria-valuemin={0}
            aria-valuemax={selected.length}
            aria-valuenow={done}
          >
            <span
              style={{
                width: `${selected.length ? (done / selected.length) * 100 : 0}%`,
              }}
            />
          </div>
        </div>
        <div className="service-checklist">
          {selected.map((f, i) => {
            const Icon = featureIcons[f.id];
            const key = `service:${template.id}:${f.id}`;
            return (
              <div
                className={`service-check-row ${checked.includes(key) ? "complete" : ""}`}
                key={key}
              >
                <label className="service-checkbox">
                  <input
                    aria-label={`${f.title} 확인 완료`}
                    type="checkbox"
                    checked={checked.includes(key)}
                    onChange={() => toggleChecked(key)}
                  />
                </label>
                <span className="service-row-number">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="service-row-icon">
                  {Icon && <Icon size={20} strokeWidth={1.6} />}
                </span>
                <Link className="service-row-copy" href={`/features/${f.id}`}>
                  <h3>{f.title}</h3>
                  <p>{f.description}</p>
                </Link>
                <span className="row-difficulty">{f.difficulty}</span>
                <button
                  className="icon-button"
                  onClick={() => toggleSaved(f.id)}
                  aria-label={`${f.title} ${saved.includes(f.id) ? "저장 해제" : "저장"}`}
                  aria-pressed={saved.includes(f.id)}
                >
                  <Bookmark
                    size={17}
                    fill={saved.includes(f.id) ? "currentColor" : "none"}
                  />
                </button>
                <Link
                  className="icon-button"
                  aria-label={`${f.title} 가이드 읽기`}
                  href={`/features/${f.id}`}
                >
                  <ChevronRight size={18} />
                </Link>
              </div>
            );
          })}
        </div>
      </section>
      <div className="checklist-disclaimer">
        <Check size={18} />
        <div>
          <strong>서비스에 맞게 더하고, 덜어보세요.</strong>
          <p>
            이 목록은 시작을 돕는 추천 구성입니다. 실제로 필요한 기능은 비즈니스
            모델, 사용자, 운영 환경에 따라 달라집니다. 체크 상태는 이 브라우저에
            저장됩니다.
          </p>
          <Link href="/">
            모든 기능 살펴보기 <ArrowUpRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
}
