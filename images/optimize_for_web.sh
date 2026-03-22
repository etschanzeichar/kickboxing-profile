#!/bin/bash

# Script to create web-optimized versions of images
# Creates smaller, compressed versions for fast web loading

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

WEB_DIR="web"
MAX_SIZE=1600  # Max dimension for web images

mkdir -p "$WEB_DIR"

echo "Creating web-optimized images..."
echo ""

# Find all image files in the current directory and all subdirectories,
# excluding the web/ and thumbnails/ output directories
find . -type f \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' -o -iname '*.gif' -o -iname '*.heic' \) \
    -not -path "./$WEB_DIR/*" \
    -not -path "./thumbnails/*" \
    -not -path "./svg/*" | while read -r img; do
    # Preserve directory structure: ./new.photos/foo.jpg -> web/new.photos/foo.jpg
    rel="${img#./}"
    output="$WEB_DIR/$rel"

    # Convert HEIC to JPG
    if echo "$rel" | grep -iq '\.heic$'; then
        output="$WEB_DIR/${rel%.*}.jpg"
    fi

    # Create subdirectory if needed
    mkdir -p "$(dirname "$output")"

    echo "Processing: $img"

    # Resize to max dimension while maintaining aspect ratio
    sips -Z "$MAX_SIZE" "$img" --out "$output" >/dev/null 2>&1

    # Get original and new file sizes
    orig_size=$(ls -lh "$img" | awk '{print $5}')
    new_size=$(ls -lh "$output" 2>/dev/null | awk '{print $5}')

    if [ -f "$output" ]; then
        echo "  $orig_size -> $new_size"
    else
        echo "  WARNING: failed to create $output"
    fi
done

echo ""
echo "Done! Web-optimized images saved to '$WEB_DIR/'"
echo ""

# Show total size comparison
orig_total=$(du -sh . --exclude="$WEB_DIR" --exclude="thumbnails" 2>/dev/null | cut -f1)
web_total=$(du -sh "$WEB_DIR" 2>/dev/null | cut -f1)
echo "Web folder size: $web_total"
