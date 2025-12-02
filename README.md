# 용돈기입장 (Jun) – 무료 웹 용돈·가계부

브라우저에서 바로 사용하는 **무료 웹 용돈기입장** 서비스입니다.  
용돈·지출을 빠르게 기록하고, 메모와 통계까지 한 화면에서 확인할 수 있습니다.

> 배포 주소  
> 👉 https://hjj5946-upply.github.io/actbook/

---

## ✨ 주요 기능

- **수입·지출 입력**
  - 금액, 카테고리, 메모 등을 빠르게 기록
  - 최근 내역 리스트 확인

- **거래 내역 리스트**
  - 날짜별·시간순 정렬
  - 카테고리/내용 기반 확인

- **통계 화면 (Stats)**
  - 월별·카테고리별 지출 패턴 확인
  - 사용 패턴 파악에 도움

- **메모 기능**
  - 지출과 분리된 메모 기록
  - 상세 메모/리스트 화면 분리

- **잠금 화면 / 비밀번호 게이트**
  - 단순한 비밀번호 잠금 기능
  - 기본적인 프라이버시 보호

- **반응형 UI**
  - 모바일 우선 설계
  - Tailwind CSS 기반 레이아웃

---

## 🛠 기술 스택

### Frontend

- **Framework:** React (TypeScript) + Vite
- **UI:** Tailwind CSS
- **State / Store:**
  - Context API (`LedgerStoreContext`, `MemoStoreContext`, `PasswordGateContext`, `ThemeContext`)
  - 커스텀 훅 (`useLedgerStore`, `useMemoStore`, `usePasswordGate`)

### Backend / Infra


- **Backend:** Fiber (Go) – API 서버
- **Auth & DB:** Supabase (Authentication + PostgreSQL)
- **Deployment (FE):** GitHub Pages



---

