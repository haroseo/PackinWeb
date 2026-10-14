import { Link } from "wouter";
import { ArrowUpRight, Bookmark, GitCompareArrows, Search } from "lucide-react";
import { BrandMark } from "@/components/webzip/Icons";
import { features, categories } from "@/data/catalog";
export default function About() {
  return (
    <div className="page about-page">
      <div className="about-brand">
        <BrandMark />
        <span>PackinWeb</span>
      </div>
      <div className="eyebrow">웹 기능 안내서</div>
      <h1>
        웹을 이루는 기능을,
        <br />
        누구나 이해할 수 있게<span>.</span>
      </h1>
      <p className="about-lead">
        좋은 아이디어가 있어도, 어떤 기능이 필요한지 막막할 때가 있습니다.
        패킨웹은 기획자, 디자이너, 개발자가 같은 언어로 이야기할 수 있도록 웹
        기능을 정리한 한국어 레퍼런스입니다.
      </p>
      <div className="about-stats">
        <div>
          <strong>{features.length}</strong>
          <span>기능 가이드</span>
        </div>
        <div>
          <strong>{categories.length}</strong>
          <span>핵심 카테고리</span>
        </div>
        <div>
          <strong>0</strong>
          <span>시작에 필요한 계정</span>
        </div>
      </div>
      <section>
        <h2>필요한 만큼, 이렇게 사용하세요.</h2>
        <div className="about-steps">
          {[
            {
              Icon: Search,
              title: "발견하고 이해하기",
              text: "이름이나 키워드로 검색하고 카테고리, 목적, 난이도를 좁혀보세요. 상세 가이드에서 흐름과 구현 점검 항목을 확인할 수 있습니다.",
            },
            {
              Icon: GitCompareArrows,
              title: "나란히 비교하기",
              text: "카드에서 최대 3개 기능을 선택해 목적과 구성 요소를 비교하세요. 상세 가이드에는 기능별 구현 접근법의 장단점도 정리되어 있습니다.",
            },
            {
              Icon: Bookmark,
              title: "내 아이디어에 모아두기",
              text: "필요한 기능을 저장하고 서비스별 체크리스트를 확인하세요. 저장과 체크 상태는 계정 없이 현재 브라우저의 로컬 저장소에 유지됩니다.",
            },
          ].map(({ Icon, title, text }) => (
            <div key={title}>
              <Icon size={23} strokeWidth={1.5} />
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2>읽기 쉬운 콘텐츠, 단정한 화면.</h2>
        <p>
          화면의 단순함, 일관성, 사용자 주도권, 피드백과 접근성을 기준으로
          구성했습니다. 흑백의 절제된 화면은 기능 설명과 내용에 집중하기 위한
          선택입니다.
        </p>
        <a
          className="text-link"
          href="https://developer.apple.com/design/human-interface-guidelines/design-principles"
          target="_blank"
          rel="noopener noreferrer"
        >
          화면 구성 원칙 <ArrowUpRight size={14} />
        </a>
      </section>
      <section>
        <h2>알아두면 좋은 점</h2>
        <p>
          웹 기능은 계속 변화합니다. 이 라이브러리는 주요 기능 {features.length}
          개를 폭넓게 다루지만, 존재하는 모든 기능이나 산업별 요구사항을 완전히
          망라하지는 않습니다. 난이도는 일반적인 구현 범위를 기준으로 한 참고
          분류입니다.
        </p>
        <p>
          로그인, 결제 등은 작동 원리와 구현 방법을 설명하는 가이드입니다.
          패킨웹 자체에서 실제 회원가입이나 금융 거래를 수행하지 않습니다. 공식
          참고 자료를 통해 적용 시점의 최신 내용을 확인하세요. 법적 고려사항은
          일반적인 점검 안내이며 법률 자문이 아닙니다.
        </p>
        <p>
          컬렉션과 체크리스트는 이 브라우저에만 저장됩니다. 브라우저 데이터를
          지우면 삭제될 수 있으며 다른 기기와 동기화되지 않습니다. 패킨웹은 이
          저장 데이터를 서버로 전송하지 않습니다.
        </p>
      </section>
      <Link className="button dark" href="/">
        필요한 기능 찾아보기 <ArrowUpRight size={15} />
      </Link>
    </div>
  );
}
