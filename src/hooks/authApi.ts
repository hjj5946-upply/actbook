import { supabase } from "./supabaseClient";

// Supabase에 저장된 사용자 타입
export type AppUser = {
  id: string;
  nickname: string;
  password_hash: string;
  created_at: string;
};

// 비밀번호를 해시하기 위한 간단한 유틸 (지금은 클라 SHA-256 그대로 사용)
async function sha256Hex(text: string): Promise<string> {
  const enc = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", enc);
  const bytes = Array.from(new Uint8Array(digest));
  return bytes.map(b => b.toString(16).padStart(2, "0")).join("");
}

/**
 * 회원가입: 닉네임 + 비밀번호를 받아 Supabase에 저장
 */
export async function registerUser(
  nickname: string,
  password: string
): Promise<{ ok: true; user: AppUser } | { ok: false; message: string }> {
  // 닉네임 양쪽 공백 제거
  const trimmed = nickname.trim();
  if (!trimmed) {
    return { ok: false, message: "닉네임을 입력해주세요." };
  }

  // 여기서는 일단 기존 룰 유지: 숫자 8자리
  if (!/^[0-9]{8}$/.test(password)) {
    return { ok: false, message: "비밀번호는 숫자 8자리여야 합니다." };
  }

  const pwHash = await sha256Hex(password);

  // 1) 닉네임 중복 체크
  const { data: exists, error: existsError } = await supabase
    .from("app_users")
    .select("id")
    .eq("nickname", trimmed)
    .maybeSingle();

  if (existsError) {
    console.error("nickname check error", existsError);
    return { ok: false, message: "닉네임 중복 확인 중 오류가 발생했습니다." };
  }

  if (exists) {
    return { ok: false, message: "이미 사용 중인 닉네임입니다." };
  }

  // 2) 신규 유저 insert
  const { data, error } = await supabase
    .from("app_users")
    .insert({
      nickname: trimmed,
      password_hash: pwHash,
    })
    .select("*")
    .single();

  if (error || !data) {
    console.error("register error", error);
    return { ok: false, message: "회원가입 중 오류가 발생했습니다." };
  }

  return { ok: true, user: data as AppUser };
}

/**
 * 로그인: 닉네임 + 비밀번호로 Supabase에서 유저 조회 후 검증
 */
export async function loginUser(
  nickname: string,
  password: string
): Promise<{ ok: true; user: AppUser } | { ok: false; message: string }> {
  const trimmed = nickname.trim();
  if (!trimmed) {
    return { ok: false, message: "닉네임을 입력해주세요." };
  }

  if (!/^[0-9]{8}$/.test(password)) {
    return { ok: false, message: "비밀번호는 숫자 8자리입니다." };
  }

  const { data, error } = await supabase
    .from("app_users")
    .select("*")
    .eq("nickname", trimmed)
    .maybeSingle();

  if (error) {
    console.error("login select error", error);
    return { ok: false, message: "로그인 중 오류가 발생했습니다." };
  }

  if (!data) {
    return { ok: false, message: "존재하지 않는 닉네임입니다." };
  }

  const user = data as AppUser;
  const pwHash = await sha256Hex(password);

  if (user.password_hash !== pwHash) {
    return { ok: false, message: "비밀번호가 올바르지 않습니다." };
  }

  return { ok: true, user };
}

/**
 * 회원탈퇴: 사용자 계정 및 관련 데이터 삭제
 */
export async function deleteUser(
  userId: string
): Promise<{ ok: true } | { ok: false; message: string }> {
  try {
    // app_users 테이블에서 사용자 삭제
    const { error } = await supabase
      .from("app_users")
      .delete()
      .eq("id", userId);

    if (error) {
      console.error("deleteUser error", error);
      return { ok: false, message: "회원탈퇴 중 오류가 발생했습니다." };
    }

    return { ok: true };
  } catch (e) {
    console.error("deleteUser exception", e);
    return { ok: false, message: "회원탈퇴 중 오류가 발생했습니다." };
  }
}