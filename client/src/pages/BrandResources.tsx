import { useEffect } from "react";
import { ArrowDownToLine, ArrowUpRight } from "lucide-react";
import { applySeo } from "@/lib/seo";
import "./BrandResources.css";

const assetPath = "/brand";

const logoAssets = [
  {
    id: "symbol",
    number: "02",
    eyebrow: "SYMBOL",
    title: "심벌 로고",
    description:
      "PackinApp을 작은 크기에서도 알아볼 수 있게 하는 기본 심벌입니다.",
    image: `${assetPath}/packinapp-symbol.svg`,
    download: "packinapp-symbol.svg",
    previewClass: "brand-symbol-preview",
    criteria: [
      "작은 아이콘은 24 × 24px 이상으로 사용하고, 심벌 너비의 1/4 이상 여백을 둡니다.",
      "정사각형 비율을 유지하고 가로·세로로 늘이지 않습니다.",
      "검정 바탕과 흰색 심벌의 대비를 유지합니다.",
      "아이콘·프로필처럼 이름을 적기 어려운 작은 공간에 사용합니다.",
    ],
  },
  {
    id: "wordmark",
    number: "03",
    eyebrow: "WORDMARK",
    title: "글자 로고",
    description: "심벌 없이 PackinApp 이름만 표기할 때 쓰는 워드마크입니다.",
    image: `${assetPath}/packinapp-wordmark.svg`,
    download: "packinapp-wordmark.svg",
    previewClass: "brand-wordmark-preview",
    criteria: [
      "화면 표시 너비는 96px 이상으로 유지하고 글자 높이의 절반만큼 주변 여백을 둡니다.",
      "대소문자 표기 PackinApp을 그대로 유지합니다.",
      "Pretendard Bold 계열을 기준으로 쓰고 글자 간격을 임의로 벌리지 않습니다.",
      "배경과 충분한 대비를 확보하고 다른 글꼴과 섞지 않습니다.",
    ],
  },
  {
    id: "lockup",
    number: "04",
    eyebrow: "COMBINATION MARK",
    title: "심벌 + 글자 로고",
    description:
      "심벌과 PackinApp 워드마크를 한 덩어리로 보여주는 기본 조합입니다.",
    image: `${assetPath}/packinapp-lockup.svg`,
    download: "packinapp-lockup.svg",
    previewClass: "brand-lockup-preview",
    criteria: [
      "심벌과 글자의 크기 비율, 간격, 배치를 함께 유지합니다.",
      "가로 공간이 좁으면 조합 로고 대신 심벌 로고를 사용합니다.",
      "최소 너비 160px과 심벌 높이의 절반 이상 여백을 확보합니다.",
    ],
  },
];

export default function BrandResources() {
  useEffect(() => {
    applySeo({
      title: "패킨앱 브랜드 리소스 센터 — PackinApp",
      description:
        "패킨앱 브랜드 소개와 심벌 로고, 글자 로고, 조합 로고, 공유용 OG 이미지 및 자산별 사용 기준을 확인하세요.",
      path: "/brand-resources",
    });
  }, []);

  return (
    <div className="brand-resource-page">
      <nav className="brand-breadcrumb" aria-label="현재 위치">
        <a href="/">전체 기능</a>
        <span aria-hidden="true">/</span>
        <span>패킨앱 브랜드 리소스</span>
      </nav>

      <header className="brand-page-header">
        <p className="brand-kicker">PACKINAPP / BRAND RESOURCES</p>
        <h1>패킨앱 브랜드 리소스</h1>
        <p>
          소개와 로고 파일, 화면 공유에 쓸 OG 이미지, 각 자산의 사용 기준을
          한곳에 모았습니다.
        </p>
      </header>

      <section
        className="brand-resource-section brand-intro"
        aria-labelledby="brand-intro-title"
      >
        <div className="brand-section-index">
          <span>01</span> INTRODUCTION
        </div>
        <div className="brand-intro-content">
          <div>
            <h2 id="brand-intro-title">
              작은 기능을 모아
              <br />
              웹을 이해하는 도구로
            </h2>
            <p>
              패킨앱은 웹서비스에 필요한 기능을 목적, 사용자 흐름, 구현 로직과
              함께 살펴볼 수 있도록 정리하는 프로젝트입니다. 현재 공개 사이트는
              PackinWeb 이름으로 운영됩니다.
            </p>
            <h3 className="brand-intro-criteria-title">소개·표기 기준</h3>
            <ul className="brand-intro-criteria">
              <li>
                프로젝트 이름은 패킨앱(PackinApp), 공개 서비스 이름은
                패킨웹(PackinWeb)으로 구분합니다.
              </li>
              <li>실제 제공 기능과 확인된 범위 안에서만 소개합니다.</li>
            </ul>
          </div>
          <div className="brand-intro-note">
            <span>BRAND IDEA / DRAFT</span>
            <strong>
              기능을 모으고
              <br />
              이해하기 쉽게 연결합니다.
            </strong>
            <small>
              이 시안은 기존 PackinWeb 심벌과 인터페이스를 바탕으로
              정리했습니다.
            </small>
          </div>
        </div>
      </section>

      {logoAssets.map(asset => (
        <section
          key={asset.id}
          className="brand-resource-section brand-asset-section"
          aria-labelledby={`${asset.id}-title`}
        >
          <div className="brand-section-index">
            <span>{asset.number}</span> {asset.eyebrow}
          </div>
          <div className="brand-asset-grid">
            <div className={`brand-asset-preview ${asset.previewClass}`}>
              <img src={asset.image} alt={`${asset.title} 미리보기`} />
              <a href={asset.image} download={asset.download}>
                SVG 내려받기 <ArrowDownToLine size={15} aria-hidden="true" />
              </a>
            </div>
            <div className="brand-asset-details">
              <h2 id={`${asset.id}-title`}>{asset.title}</h2>
              <p>{asset.description}</p>
              <h3>사용 기준</h3>
              <ul>
                {asset.criteria.map(criterion => (
                  <li key={criterion}>{criterion}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ))}

      <section
        className="brand-resource-section brand-og-section"
        aria-labelledby="brand-og-title"
      >
        <div className="brand-section-index">
          <span>05</span> OPEN GRAPH IMAGE
        </div>
        <div className="brand-og-grid">
          <div className="brand-og-preview">
            <img
              src={`${assetPath}/packinapp-og.png`}
              alt="PackinApp 브랜드 리소스 OG 이미지 미리보기"
            />
            <a
              href={`${assetPath}/packinapp-og.png`}
              download="packinapp-og.png"
            >
              PNG 내려받기 <ArrowDownToLine size={15} aria-hidden="true" />
            </a>
          </div>
          <div className="brand-asset-details">
            <h2 id="brand-og-title">OG 이미지</h2>
            <p>
              링크를 공유할 때 페이지 제목과 브랜드를 함께 보여주는 1200 × 630px
              이미지입니다.
            </p>
            <h3>사용 기준</h3>
            <ul>
              <li>원본 1200 × 630px, PNG 형식과 1.91:1 비율을 유지합니다.</li>
              <li>
                가장자리에서 60px 이상 안쪽에 제목과 심벌을 두어 미리보기
                자르기에 대비합니다.
              </li>
              <li>
                브랜드 소개 페이지의 공유 이미지로 사용하고, 내용이 달라지면
                제목과 이미지도 함께 갱신합니다.
              </li>
            </ul>
            <a
              className="brand-og-source"
              href={`${assetPath}/packinapp-og.svg`}
              download="packinapp-og-source.svg"
            >
              편집 가능한 SVG 원본 <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <aside className="brand-resource-note">
        <strong>자산 상태</strong>
        <p>
          PackinApp 전용의 기존 승인 파일은 저장소에서 확인하지 못했습니다. 이
          페이지의 글자 로고, 조합 로고와 OG 이미지는 현재 심벌과 제품 화면을
          바탕으로 만든 PackinApp용 시안입니다. 공개 사이트의 기존 PackinWeb
          로고 파일은 바꾸지 않았습니다.
        </p>
        <a href="/brand-guide.md" download>
          전체 기준 문서 내려받기{" "}
          <ArrowDownToLine size={14} aria-hidden="true" />
        </a>
      </aside>
    </div>
  );
}
