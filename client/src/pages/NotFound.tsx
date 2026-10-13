import { Link } from "wouter";
import { ArrowLeft, FileQuestion } from "lucide-react";
export default function NotFound() {
  return (
    <div className="page">
      <div className="empty-state not-found">
        <FileQuestion size={42} strokeWidth={1.2} />
        <span className="eyebrow">404 / NOT FOUND</span>
        <h1>이 페이지는 아직 없어요.</h1>
        <p>주소를 확인하거나 기능 라이브러리에서 다시 찾아보세요.</p>
        <Link className="button dark" href="/">
          <ArrowLeft size={15} />
          라이브러리로 돌아가기
        </Link>
      </div>
    </div>
  );
}
