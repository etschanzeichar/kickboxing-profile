#!/bin/bash

# Script to generate thumbnails for all images in the current directory
# Uses macOS sips command

# Configuration
THUMB_DIR="thumbnails"
MAX_SIZE=300  # Maximum dimension (width or height) in pixels

# Get the directory where the script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Create thumbnails directory if it doesn't exist
mkdir -p "$THUMB_DIR"

# Counter for processed images
count=0

# Find all image files in the current directory and all subdirectories,
# excluding the thumbnails/, web/, and svg/ output directories
find . -type f \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' -o -iname '*.gif' -o -iname '*.heic' \) \
    -not -path "./$THUMB_DIR/*" \
    -not -path "./web/*" \
    -not -path "./svg/*" | while read -r img; do
    # Preserve directory structure: ./new.photos/foo.jpg -> thumbnails/new.photos/thumb_foo.jpg
    rel="${img#./}"
    filename=$(basename "$rel")
    reldir=$(dirname "$rel")

    # Convert HEIC extension to jpg for thumbnail output
    if echo "$filename" | grep -iq '\.heic$'; then
        thumb_name="thumb_${filename%.*}.jpg"
    else
        thumb_name="thumb_$filename"
    fi

    if [ "$reldir" = "." ]; then
        thumb_path="$THUMB_DIR/$thumb_name"
    else
        thumb_path="$THUMB_DIR/$reldir/$thumb_name"
    fi

    # Create subdirectory if needed
    mkdir -p "$(dirname "$thumb_path")"

    # Skip if thumbnail already exists and is newer than source
    if [ -f "$thumb_path" ] && [ "$thumb_path" -nt "$img" ]; then
        echo "Skipping $filename (thumbnail up to date)"
        continue
    fi

    echo "Creating thumbnail for: $filename"

    # Create thumbnail using sips
    # -Z resizes to fit within a square of MAX_SIZE while maintaining aspect ratio
    sips -Z "$MAX_SIZE" "$img" --out "$thumb_path" >/dev/null 2>&1

    if [ $? -eq 0 ]; then
        ((count++))
    else
        echo "  Error processing $filename"
    fi
done

echo ""
echo "Done! Created $count thumbnail(s) in '$THUMB_DIR/'"
