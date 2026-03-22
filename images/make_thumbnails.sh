#!/bin/bash

# Script to generate gallery-sized thumbnails for all images
# These are used in the website for gallery items, video thumbnails,
# and partner cards where full-resolution web images are unnecessary.
# Uses macOS sips command

# Configuration
THUMB_DIR="thumbnails"
MAX_SIZE=800  # Max dimension - covers 2x retina for gallery items (350px CSS)

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
    # Preserve directory structure: ./new.photos/foo.jpg -> thumbnails/new.photos/foo.jpg
    rel="${img#./}"
    filename=$(basename "$rel")
    reldir=$(dirname "$rel")

    # Convert HEIC extension to jpg for output
    if echo "$filename" | grep -iq '\.heic$'; then
        out_name="${filename%.*}.jpg"
    else
        out_name="$filename"
    fi

    if [ "$reldir" = "." ]; then
        thumb_path="$THUMB_DIR/$out_name"
    else
        thumb_path="$THUMB_DIR/$reldir/$out_name"
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
