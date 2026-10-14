import { useState } from "react";
import {
  Check,
  Code2,
  Copy,
  LockKeyhole,
  Search,
  ShoppingBag,
  Upload,
  UserRound,
  Bell,
  Activity,
} from "lucide-react";
import type { CodeExample } from "@/data/codeExamples";
const icons = {
  auth: UserRound,
  commerce: ShoppingBag,
  content: Upload,
  search: Search,
  communication: Bell,
  operations: Activity,
};
export default function CodeExample({ example }: { example: CodeExample }) {
  const [copied, setCopied] = useState(false);
  const Icon = icons[example.preview];
  async function copy() {
    try {
      await navigator.clipboard.writeText(example.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  }
  return (
    <section id="example" className="code-example-section">
      <div className="guide-section-label">09 / 실제 구현 예시</div>
      <h2>코드로 바로 시작하기</h2>
      <p className="code-intro">
        아래 예시는 기능의 핵심 흐름을 단순화한 출발점입니다. 운영 환경에서는
        인증, 오류 처리, 로깅과 개인정보 보호를 함께 적용하세요.
      </p>
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
          <pre>
            <code>{example.code}</code>
          </pre>
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
                {example.preview === "auth"
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
