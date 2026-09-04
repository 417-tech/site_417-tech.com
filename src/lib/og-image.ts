import sharp from "sharp";
// Reuses the exact wordmark paths from public/logo-purple-long.svg (same source as Logo.astro).
// `?raw` inlines the file contents at build time, so it survives bundling (unlike a runtime fs read).
import logoSvg from "../../public/logo-purple-long.svg?raw";

const WIDTH = 1200;
const HEIGHT = 630;

const LOGO_PATHS = logoSvg
  .match(/<(?:path|rect)\b[^>]*>\s*<\/(?:path|rect)>/g)!
  .join("");
const LOGO_VIEWBOX_WIDTH = 1822.7473;

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// no measureText in Node/SVG-land, so wrap by an estimated bold-sans char width
// rather than pulling in a text-shaping dependency. Good enough for a social-card blurb.
function wrapText(text: string, maxChars: number, maxLines: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  let truncated = false;
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > maxChars && line) {
      lines.push(line);
      line = word;
      if (lines.length === maxLines) {
        truncated = true;
        break;
      }
    } else {
      line = next;
    }
  }
  if (lines.length < maxLines && line) lines.push(line);
  if (truncated) {
    const last = lines[maxLines - 1];
    lines[maxLines - 1] =
      last.length >= maxChars
        ? `${last.slice(0, maxChars - 1).trimEnd()}…`
        : `${last}…`;
  }
  return lines;
}

function tspans(lines: string[], x: number, lineHeight: number): string {
  return lines
    .map(
      (line, i) =>
        `<tspan x="${x}" dy="${i === 0 ? 0 : lineHeight}">${escapeXml(line)}</tspan>`,
    )
    .join("");
}

export async function generateOgImage(
  title: string,
  description: string,
): Promise<Buffer> {
  const margin = 80;
  const titleFontSize = 58;
  const titleLineHeight = 66;
  const descFontSize = 28;
  const descLineHeight = 38;

  const titleLines = wrapText(title, 30, 3);
  const descLines = wrapText(description, 62, 3);

  const titleStartY = 260;
  const descStartY =
    titleStartY + (titleLines.length - 1) * titleLineHeight + 46;

  const logoWidth = 240;
  const logoScale = logoWidth / LOGO_VIEWBOX_WIDTH;

  const svg = `
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="#161616" />
  <rect x="0" y="0" width="10" height="${HEIGHT}" fill="#ba68c8" />
  <g transform="translate(${margin}, 64) scale(${logoScale})">${LOGO_PATHS}</g>
  <text x="${margin}" y="${titleStartY}" font-family="Poppins, Arial, sans-serif" font-weight="700" font-size="${titleFontSize}" fill="#ffffff">${tspans(titleLines, margin, titleLineHeight)}</text>
  <text x="${margin}" y="${descStartY}" font-family="Poppins, Arial, sans-serif" font-weight="400" font-size="${descFontSize}" fill="#ffffff" fill-opacity="0.68">${tspans(descLines, margin, descLineHeight)}</text>
</svg>`;

  return sharp(Buffer.from(svg)).png().toBuffer();
}
