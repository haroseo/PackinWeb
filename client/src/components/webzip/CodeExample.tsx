import { useState } from "react";
import {
  Check,
  Code2,
  Copy,
  LockKeyhole,
  Search,
  Upload,
  Bell,
  AlertCircle,
} from "lucide-react";
import type { CodeExample } from "@/data/codeExamples";
import { categoryIcons } from "./Icons";
import { categories } from "@/data/catalog";

function explainCodeLine(line: string): string {
  const value = line.trim();
  if (!value) return "코드를 읽기 쉽게 나눈 빈 줄입니다.";
  if (value.startsWith("//")) return value.replace(/^\/\/\s?/, "설명: ");
  if (
    /^(export\s+)?type\s/.test(value) ||
    /^(export\s+)?interface\s/.test(value)
  )
    return "이 기능에서 주고받을 데이터의 필드와 타입을 선언합니다.";
  if (
    /^(export\s+)?(async\s+)?function\s/.test(value) ||
    /=>\s*\{?$/.test(value)
  )
    return "재사용할 로직의 시작점입니다. 괄호 안은 입력값, 반환 타입은 호출 결과입니다.";
  if (/^if\s*\(/.test(value) || /^}\s*else/.test(value))
    return "잘못된 입력이나 예외 조건을 먼저 분기해 뒤의 처리가 안전하게 실행되도록 합니다.";
  if (/throw new Error/.test(value))
    return "조건을 만족하지 않는 입력을 조용히 통과시키지 않고 호출자에게 오류로 알립니다.";
  if (/\.filter\(/.test(value))
    return "조건에 맞는 항목만 남기고 나머지는 결과에서 제외합니다.";
  if (/\.map\(/.test(value))
    return "각 항목을 필요한 형태로 바꾸며 원본 배열은 수정하지 않습니다.";
  if (/\.sort\(/.test(value))
    return "결과의 표시 순서를 정합니다. 동점 처리 조건도 확인하세요.";
  if (/\.reduce\(/.test(value))
    return "여러 항목을 하나의 누적 결과(예: 합계)로 계산합니다.";
  if (/\.every\(/.test(value))
    return "모든 항목이 조건을 만족하는지 확인합니다.";
  if (/\.some\(/.test(value))
    return "하나 이상의 항목이 조건을 만족하는지 확인합니다.";
  if (/\.slice\(/.test(value))
    return "원본을 바꾸지 않고 지정한 범위만 복사해 결과 크기를 제한합니다.";
  if (/new Set/.test(value))
    return "중복 값을 제거해 고유한 항목만 유지합니다.";
  if (/^SELECT\b/i.test(value))
    return "조회 결과에 포함할 데이터 열을 선택합니다.";
  if (/^FROM\b/i.test(value))
    return "조회할 테이블이나 데이터 원본을 지정합니다.";
  if (/^WHERE\b/i.test(value)) return "조건에 맞는 행만 결과에 포함합니다.";
  if (/^ORDER BY\b/i.test(value)) return "결과의 정렬 기준을 지정합니다.";
  if (/^LIMIT\b/i.test(value)) return "한 번에 반환할 최대 행 수를 제한합니다.";
  if (/^JOIN\b/i.test(value))
    return "관련 테이블의 행을 지정한 관계에 따라 결합합니다.";
  if (/\bawait\b/.test(value))
    return "비동기 작업이 끝난 뒤 결과를 받아 다음 처리를 진행합니다.";
  if (/^catch\b/.test(value))
    return "앞선 비동기 처리에서 발생한 오류를 받아 복구하거나 전달합니다.";
  if (/^try\b/.test(value))
    return "실패할 수 있는 작업을 감싸 아래 오류 처리 경로로 연결합니다.";
  if (/\.replace\(/.test(value))
    return "문자열에서 지정한 패턴을 찾아 새 값으로 치환합니다.";
  if (/\.split\(/.test(value))
    return "문자열을 구분자 기준으로 나누어 배열로 만듭니다.";
  if (/\.includes\(/.test(value))
    return "문자열 또는 배열에 지정한 값이 있는지 확인합니다.";
  if (/\?\s*\w+\s*:/.test(value))
    return "조건에 따라 둘 중 하나의 값을 선택합니다.";
  if (/=>/.test(value))
    return "배열 처리나 콜백에 전달되는 짧은 함수를 정의합니다.";
  if (/Math\.min|Math\.max/.test(value))
    return "값의 상한 또는 하한을 적용해 결과 범위를 제한합니다.";
  if (/Number\.is(SafeInteger|Finite)/.test(value))
    return "숫자 입력이 허용된 범위와 정밀도를 갖는지 검사합니다.";
  if (/\.trim\(/.test(value))
    return "문자열 앞뒤 공백을 제거해 빈 입력과 비교할 수 있게 합니다.";
  if (/^return\s/.test(value))
    return "현재 함수의 계산 결과를 호출한 쪽으로 돌려줍니다.";
  if (/\bconst\s/.test(value) || /^type\s/.test(value))
    return "아래 계산에서 다시 사용할 값을 선언합니다.";
  if (/^\}/.test(value)) return "현재 함수 또는 코드 블록을 닫습니다.";
  return "이 줄은 현재 기능의 핵심 로직 일부입니다. 앞뒤 조건과 함수 설명을 함께 확인하세요.";
}

export default function CodeExample({ example }: { example?: CodeExample }) {
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const [activeLine, setActiveLine] = useState<{
    number: number;
    text: string;
  } | null>(null);
  if (!example) {
    return (
      <section id="example" className="code-example-section">
        <div className="guide-section-label">09 / 구현 자료</div>
        <h2>코드 예시를 준비하고 있습니다</h2>
        <p className="code-intro">
          이 기능에 바로 적용할 수 있도록 검증된 예시를 정리하고 있습니다. 아래
          참고 문서에서 API 계약과 적용 조건을 확인하세요.
        </p>
      </section>
    );
  }
  const Icon = categoryIcons[example.preview];
  const code = example.code;
  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setCopyFailed(false);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      const field = document.createElement("textarea");
      field.value = code;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.appendChild(field);
      let copiedSuccessfully = false;
      try {
        field.select();
        copiedSuccessfully = document.execCommand("copy");
      } catch {
        copiedSuccessfully = false;
      } finally {
        field.remove();
      }
      setCopied(copiedSuccessfully);
      setCopyFailed(!copiedSuccessfully);
      if (copiedSuccessfully) setTimeout(() => setCopied(false), 1600);
    }
  }
  return (
    <section id="example" className="code-example-section">
      <div className="guide-section-label">09 / 참고 구현</div>
      <h2>
        {example.categoryPattern
          ? "카테고리 핵심 로직 패턴"
          : "핵심 로직 코드 예시"}
      </h2>
      <p className="code-intro">
        {example.categoryPattern
          ? "이 복사 가능한 예시는 기능의 카테고리에 맞춘 독립 실행형 핵심 로직 패턴입니다. 기능 전체나 특정 프레임워크 연동을 구현하지 않으므로 실제 API·데이터 구조·권한 검증은 참고 문서와 서비스 계약에 맞춰 연결하세요."
          : "이 코드는 PackinWeb이 참고 문서를 바탕으로 작성한 예시이며, 공식 문서의 코드 조각을 그대로 복사한 것이 아닙니다. 프로젝트에 붙이기 전에 입력 검증, 인증·권한, 오류 처리와 저장소 조건을 연결하세요."}
      </p>
      {example.prerequisites && example.prerequisites.length > 0 && (
        <div className="code-prerequisites">
          <strong>실행 전 준비</strong>
          <ul>
            {example.prerequisites.map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="code-example-grid">
        <div className="code-panel">
          <div className="code-panel-head">
            <span>
              <Code2 size={16} /> {example.title}
            </span>
            <button onClick={copy} aria-label="코드 복사">
              {copied ? (
                <>
                  <Check size={14} />
                  복사됨
                </>
              ) : (
                <>
                  <Copy size={14} />
                  복사
                </>
              )}
            </button>
          </div>
          <p className="code-hover-hint">
            각 줄에 마우스를 올리거나 Tab 키로 이동하면 설명을 볼 수 있습니다.
          </p>
          <pre>
            <code>
              {example.code.split("\n").map((line, index) => {
                const explanation = explainCodeLine(line);
                return (
                  <span
                    className={`code-line${activeLine?.number === index + 1 ? " is-active" : ""}`}
                    key={index}
                    data-line={index + 1}
                    tabIndex={0}
                    aria-label={`줄 ${index + 1}: ${explanation}`}
                    onMouseEnter={() =>
                      setActiveLine({ number: index + 1, text: explanation })
                    }
                    onFocus={() =>
                      setActiveLine({ number: index + 1, text: explanation })
                    }
                  >
                    {line || " "}
                  </span>
                );
              })}
            </code>
          </pre>
          <div className="code-line-explanation" aria-live="off">
            <strong>
              {activeLine ? `줄 ${activeLine.number} 설명` : "코드 설명"}
            </strong>
            <span>
              {activeLine?.text ??
                "코드 줄 위에 마우스를 올리거나 Tab 키로 선택하세요."}
            </span>
          </div>
          {copyFailed && (
            <p className="code-copy-error" role="status">
              <AlertCircle size={14} /> 복사하지 못했습니다. 브라우저의 클립보드
              권한을 확인한 뒤 다시 시도하세요.
            </p>
          )}
        </div>
        <div className={`code-preview preview-${example.preview}`}>
          <div className="preview-window-bar">
            <i />
            <i />
            <i />
            <span>패킨웹 미리보기</span>
          </div>
          <div className="preview-window-body">
            <div className="preview-brand">
              <span>
                <Icon size={16} />
              </span>
              <b>
                {example.steps
                  ? categories.find(c => c.id === example.preview)?.label
                  : example.preview === "auth"
                    ? "계정 센터"
                    : example.preview === "commerce"
                      ? "주문 확인"
                      : example.preview === "search"
                        ? "기능 찾기"
                        : example.preview === "content"
                          ? "파일 보관함"
                          : example.preview === "communication"
                            ? "알림 센터"
                            : "운영 현황"}
              </b>
            </div>
            {example.steps && (
              <div className="preview-flow">
                <p>사용자 흐름 요약</p>
                <ol>
                  {example.steps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </div>
            )}
            {example.preview === "auth" && (
              <>
                <div className="preview-line wide" />
                <div className="preview-input">이메일 주소</div>
                <div className="preview-input">
                  비밀번호 <LockKeyhole size={12} />
                </div>
                <div className="preview-button">로그인</div>
              </>
            )}
            {example.preview === "commerce" && (
              <>
                <div className="preview-product">
                  <span />
                  <div>
                    <b>선택한 상품</b>
                    <small>결제 준비 완료</small>
                  </div>
                  <strong>₩24,000</strong>
                </div>
                <div className="preview-button">안전하게 결제하기</div>
              </>
            )}
            {example.preview === "search" && (
              <>
                <div className="preview-search">
                  <Search size={13} /> 필요한 기능을 검색하세요
                </div>
                <div className="preview-result">
                  <b>통합 검색</b>
                  <small>검색 · 탐색 · 관련 가이드</small>
                </div>
                <div className="preview-result">
                  <b>필터 및 정렬</b>
                  <small>조건으로 결과를 좁혀보세요</small>
                </div>
              </>
            )}
            {example.preview === "content" && (
              <>
                <div className="preview-upload">
                  <Upload size={19} />
                  <b>파일을 여기에 놓으세요</b>
                  <small>PNG, JPG · 최대 10MB</small>
                </div>
                <div className="preview-progress">
                  <span />
                </div>
              </>
            )}
            {example.preview === "communication" && (
              <>
                <div className="preview-notice">
                  <Bell size={15} />
                  <div>
                    <b>새 알림이 있어요</b>
                    <small>주문 상태가 변경되었습니다.</small>
                  </div>
                  <em>방금</em>
                </div>
                <div className="preview-notice faded">
                  <div>
                    <b>새로운 소식</b>
                    <small>업데이트 내용을 확인해 보세요.</small>
                  </div>
                </div>
              </>
            )}
            {example.preview === "operations" && (
              <>
                <div className="preview-stat">
                  <span>요청 성공률</span>
                  <b>99.98%</b>
                  <em>정상 운영 중</em>
                </div>
                <div className="preview-bars">
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
