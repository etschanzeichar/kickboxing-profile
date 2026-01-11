#!/bin/bash

# Script to generate thumbnail images from videos using ffmpeg
# Extracts a frame from each video as a jpg image

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

THUMB_DIR="thumbnails"
mkdir -p "$THUMB_DIR"

# Time to capture thumbnail (in seconds from start)
CAPTURE_TIME=1

echo "Generating video thumbnails..."
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
        output="$THUMB_DIR/${name}_thumb.jpg"

        # Skip if thumbnail already exists and is newer than source
        if [ -f "$output" ] && [ "$output" -nt "$video" ]; then
            echo "Skipping $filename (thumbnail up to date)"
            continue
        fi

        echo "Creating thumbnail for: $filename"

        # Extract frame at CAPTURE_TIME seconds
        # Scale to max 600px width while maintaining aspect ratio
        ffmpeg -i "$video" \
            -ss "$CAPTURE_TIME" \
            -vframes 1 \
            -vf "scale=600:-2" \
            -q:v 2 \
            -y \
            "$output" 2>/dev/null

        if [ $? -eq 0 ]; then
            ((count++))
        else
            echo "  Error processing $filename"
        fi
    fi
done

echo ""
echo "Done! Created $count thumbnail(s) in '$THUMB_DIR/'"
