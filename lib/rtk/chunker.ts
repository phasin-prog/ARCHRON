import type { RawChunk } from "./types";
import { estimateTokens } from "./tokens";

const MERGE_THRESHOLD = 150; // tokens — chunks smaller than this merge into previous

type Segment = {
  heading: string | null;
  headingLevel: number | null;
  lines: string[];
};

// Split markdown into segments by ## or ### headings (single # is NOT a section)
function splitSegments(markdown: string): Segment[] {
  const lines = markdown.split("\n");
  const segments: Segment[] = [];
  let current: Segment = { heading: null, headingLevel: null, lines: [] };

  for (const line of lines) {
    const match = /^(#{2,3})\s+(.+?)\s*$/.exec(line);
    if (match) {
      // Start a new segment
      if (current.lines.length > 0 || current.heading !== null) {
        segments.push(current);
      }
      current = {
        heading: match[2],
        headingLevel: match[1].length,
        lines: [line],
      };
    } else {
      current.lines.push(line);
    }
  }
  // Push the last segment (even if empty lines only — filtered later)
  if (current.lines.length > 0 || current.heading !== null) {
    segments.push(current);
  }

  return segments;
}

export function chunkByHeading(markdown: string): RawChunk[] {
  if (!markdown.trim()) return [];

  const segments = splitSegments(markdown);

  // Convert segments to raw chunks with sequential chunkNo
  const chunks: RawChunk[] = segments
    .map((seg, idx) => ({
      chunkNo: idx,
      heading: seg.heading,
      headingLevel: seg.headingLevel,
      markdown: seg.lines.join("\n").trim(),
    }))
    .filter((c) => c.markdown.length > 0);

  // Re-index chunkNo after filtering
  chunks.forEach((c, i) => (c.chunkNo = i));

  // Merge tiny chunks (< MERGE_THRESHOLD tokens) into the previous chunk —
  // but only when the previous chunk is itself substantial (>= threshold).
  // This absorbs a tiny "tail" fragment into a real section without collapsing
  // a run of small sections into one (which would destroy heading structure).
  const merged: RawChunk[] = [];
  for (const chunk of chunks) {
    const prev = merged[merged.length - 1];
    if (
      prev !== undefined &&
      estimateTokens(chunk.markdown) < MERGE_THRESHOLD &&
      estimateTokens(prev.markdown) >= MERGE_THRESHOLD
    ) {
      prev.markdown = `${prev.markdown}\n\n${chunk.markdown}`.trim();
    } else {
      merged.push({ ...chunk });
    }
  }

  // Re-index chunkNo after merging
  merged.forEach((c, i) => (c.chunkNo = i));

  return merged;
}
