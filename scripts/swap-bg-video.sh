#!/usr/bin/env bash
# Re-encode a source video to all-keyframe H.264 for smooth scroll-scrubbing.
# Usage: scripts/swap-bg-video.sh <path/to/source.mp4>
set -euo pipefail

INPUT="${1:-assets/videos/numidai-scroll-background-raw.mp4}"
OUTPUT="website/public/bg.mp4"

mkdir -p website/public

ffmpeg -y -i "$INPUT" -an \
  -c:v libx264 -preset slow -crf 20 \
  -g 1 -keyint_min 1 -sc_threshold 0 \
  -pix_fmt yuv420p \
  -movflags +faststart \
  "$OUTPUT"

echo "Encoded all-keyframe background video -> $OUTPUT"
