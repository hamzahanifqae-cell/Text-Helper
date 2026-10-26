import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
      <path d="M5 9L22 15V40L5 33V9Z" fill="#23364a" />
      <path d="M26 15L43 9V33L26 40V15Z" fill="#2557b7" />
      <path d="M10 18L17 20.5M10 24L17 26.5M31 20.5L38 18M31 26.5L38 24" stroke="#ffffff" strokeWidth="2" strokeLinecap="square" />
      </svg>
    ),
    { ...size }
  );
}
