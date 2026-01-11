#!/bin/bash

# Script to optimize videos for web playback using ffmpeg
# Creates compressed H.264 MP4 files for fast web loading

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

WEB_DIR="web"
mkdir -p "$WEB_DIR"

echo "Optimizing videos for web..."
echo ""

# Check if ffmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo "Error: ffmpeg is not installed."
    echo "Install it with: brew install ffmpeg"
    exit 1
fi

count=0

for video in *.mp4 *.MP4 *.mov *.MOV *.m4v *.M4V *.avi *.AVI; do
    if [ -f "$video" ]; then
        filename=$(basename "$video")
        name="${filename%.*}"
        output="$WEB_DIR/${name}_web.mp4"

        echo "Processing: $video"

        # Get original file size
        orig_size=$(ls -lh "$video" | awk '{print $5}')

        # Optimize video:
        # - H.264 codec for broad compatibility
        # - CRF 28 for good quality/size balance (lower = better quality, larger file)
        # - Scale to max 1080p height while maintaining aspect ratio
        # - AAC audio at 128kbps
        # - Fast start for web streaming (moov atom at beginning)
        ffmpeg -i "$video" \
            -c:v libx264 \
            -preset medium \
            -crf 28 \
            -vf "scale=-2:min(1080\,ih)" \
            -c:a aac \
            -b:a 128k \
            -movflags +faststart \
            -y \
            "$output" 2>/dev/null

        if [ $? -eq 0 ]; then
            new_size=$(ls -lh "$output" | awk '{print $5}')
            echo "  $orig_size -> $new_size"
            ((count++))
        else
            echo "  Error processing $video"
        fi
    fi
done

echo ""
echo "Done! Optimized $count video(s) in '$WEB_DIR/'"

# Show total size
if [ -d "$WEB_DIR" ]; then
    web_total=$(du -sh "$WEB_DIR" 2>/dev/null | cut -f1)
    echo "Web folder size: $web_total"
fi
