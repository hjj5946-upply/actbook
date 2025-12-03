/**
 * 숫자를 한국 원화 형식으로 포맷팅합니다.
 * @param n - 포맷팅할 숫자
 * @returns "1,234원" 형식의 문자열
 */
export function formatKRW(n: number): string {
  return n.toLocaleString("ko-KR") + "원";
}

