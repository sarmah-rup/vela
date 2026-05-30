import { ImageResponse } from "next/og";
import { brand } from "@/lib/site";

// Default Open Graph / social card for the whole site (file-based convention).
export const alt = `${brand.name}, ${brand.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "90px",
          background: "#0b0c0e",
          color: "#ffffff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ display: "flex" }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: "#e6e5e1", opacity: 0.3 }} />
            <div style={{ width: 34, height: 34, borderRadius: 9, background: "#e6e5e1", opacity: 0.6, marginLeft: -14, marginTop: 8 }} />
            <div style={{ width: 34, height: 34, borderRadius: 9, background: "#f4f4f2", marginLeft: -14, marginTop: 16 }} />
          </div>
          <div style={{ display: "flex", fontSize: 38, fontWeight: 600, marginLeft: 8 }}>
            <span style={{ color: "#9a9da6" }}>Image</span>
            <span>Pipeline</span>
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 68, fontWeight: 600, marginTop: 48, lineHeight: 1.05, maxWidth: 940 }}>
          The image AI API for product &amp; fashion commerce
        </div>
        <div style={{ display: "flex", fontSize: 30, color: "#9a9da6", marginTop: 28 }}>
          On-model imagery · virtual try-on · background &amp; relight · ad creative
        </div>
      </div>
    ),
    size,
  );
}
