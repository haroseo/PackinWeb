import { Link } from "wouter";
import { ArrowUpRight, ChevronDown, GitCompareArrows, X } from "lucide-react";
import { features, categories } from "@/data/catalog";
import { useLibrary } from "@/contexts/LibraryContext";
import { featureIcons } from "@/components/webzip/Icons";
export default function Compare() {
  const { compare, setCompare } = useLibrary();
  const selected = compare
    .map(id => features.find(f => f.id === id))
    .filter((f): f is NonNullable<typeof f> => !!f);
  return (
    <div className="page compare-page">
      <section className="hero small-hero">
        <h1>
          같이 보면,
          <br />
          차이가 보입니다<span>.</span>
        </h1>
        <p>
          기능의 목적부터 구현할 때 고려할 점까지.
          <br />
          최대 3개 기능을 나란히 비교하고, 더 나은 선택을 하세요.
        </p>
      </section>
      <div className="comparison-presets">
        <span>빠르게 비교하기</span>
        <button
          className="button small"
          onClick={() => setCompare(["login", "social-login", "mfa"])}
        >
          로그인과 인증
        </button>
        <button
          className="button small"
          onClick={() => setCompare(["payments", "subscriptions", "checkout"])}
        >
          결제와 구독
        </button>
        <button
          className="button small"
          onClick={() => setCompare(["notifications", "email", "push"])}
        >
          알림 방식
        </button>
      </div>
      <div className="comparison-selector">
        {[0, 1, 2].map(index => (
          <label key={index}>
            <span>기능 {index + 1}</span>
            <div className="select-wrapper">
              <select
                aria-label={`비교할 기능 ${index + 1}`}
                value={compare[index] || ""}
                disabled={index > compare.length}
                onChange={e => {
                  const value = e.target.value;
                  const next = [...compare];
                  if (value) next[index] = value;
                  else next.splice(index, 1);
                  setCompare(next.filter(Boolean));
                }}
              >
                <option value="">비교할 기능 선택</option>
                {categories.map(category => (
                  <optgroup label={category.label} key={category.id}>
                    {features
                      .filter(
                        f =>
                          f.category === category.id &&
                          (!compare.includes(f.id) || compare[index] === f.id)
                      )
                      .map(f => (
                        <option key={f.id} value={f.id}>
                          {f.title}
                        </option>
                      ))}
                  </optgroup>
                ))}
              </select>
              <ChevronDown size={14} />
            </div>
          </label>
        ))}
      </div>
      {selected.length < 2 ? (
        <div className="empty-state">
          <GitCompareArrows size={35} strokeWidth={1.3} />
          <h3>두 가지 이상을 선택해 주세요.</h3>
          <p>
            위에서 기능을 고르거나, 빠른 비교로 시작해 보세요.
            <br />
            라이브러리 카드의 ‘비교’ 버튼으로도 추가할 수 있어요.
          </p>
          <Link href="/" className="button">
            라이브러리 둘러보기 <ArrowUpRight size={14} />
          </Link>
        </div>
      ) : (
        <div className="comparison-scroll">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>
                  기능 비교<span>{selected.length}개 기능</span>
                </th>
                {selected.map(f => {
                  const Icon = featureIcons[f.id];
                  return (
                    <th key={f.id}>
                      <button
                        aria-label={`${f.title} 비교에서 제거`}
                        className="compare-remove icon-button"
                        onClick={() =>
                          setCompare(compare.filter(id => id !== f.id))
                        }
                      >
                        <X size={14} />
                      </button>
                      {Icon && <Icon size={24} strokeWidth={1.5} />}
                      <h2>{f.title}</h2>
                      <span>{f.english}</span>
                      <Link href={`/features/${f.id}`}>
                        전체 가이드 <ArrowUpRight size={12} />
                      </Link>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>카테고리</th>
                {selected.map(f => (
                  <td key={f.id}>
                    {categories.find(c => c.id === f.category)?.label}
                  </td>
                ))}
              </tr>
              <tr>
                <th>구현 난이도</th>
                {selected.map(f => (
                  <td key={f.id}>
                    <span className="table-tag">{f.difficulty}</span>
                  </td>
                ))}
              </tr>
              <tr>
                <th>사용 목적</th>
                {selected.map(f => (
                  <td key={f.id}>{f.purposes.join(" · ")}</td>
                ))}
              </tr>
              <tr>
                <th>핵심 역할</th>
                {selected.map(f => (
                  <td key={f.id}>{f.overview}</td>
                ))}
              </tr>
              <tr>
                <th>구성 요소</th>
                {selected.map(f => (
                  <td key={f.id}>
                    <ul>
                      {f.components.map(c => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>
              <tr>
                <th>보안 고려사항</th>
                {selected.map(f => (
                  <td key={f.id}>{f.security}</td>
                ))}
              </tr>
              <tr>
                <th>개인정보</th>
                {selected.map(f => (
                  <td key={f.id}>{f.privacy}</td>
                ))}
              </tr>
              <tr>
                <th>구현 접근법</th>
                {selected.map(f => (
                  <td key={f.id}>
                    {f.options.map(o => (
                      <div className="compare-approach" key={o.name}>
                        <strong>{o.name}</strong>
                        <p>
                          <b>장점</b> {o.pros}
                        </p>
                        <p>
                          <b>고려할 점</b> {o.cons}
                        </p>
                        <p>
                          <b>적합한 경우</b> {o.bestFor}
                        </p>
                      </div>
                    ))}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
      <div className="quiet-note">
        서로 다른 기능은 대체 관계가 아니라 함께 필요한 기능일 수도 있습니다.
        상세 가이드의 구현 방식 비교에서 실제 선택지별 장단점을 확인하세요.
      </div>
    </div>
  );
}
