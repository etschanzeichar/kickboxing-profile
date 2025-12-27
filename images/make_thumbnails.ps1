# PowerShell script to generate thumbnails for all images in the current directory
# Windows equivalent of make_thumbnails.sh

# Configuration
$ThumbDir = "thumbnails"
$MaxSize = 300  # Maximum dimension (width or height) in pixels

# Get the directory where the script is located
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir

# Create thumbnails directory if it doesn't exist
if (-not (Test-Path $ThumbDir)) {
    New-Item -ItemType Directory -Path $ThumbDir | Out-Null
}

# Load System.Drawing assembly for image processing
Add-Type -AssemblyName System.Drawing

# Counter for processed images
$count = 0

# Get all image files (using wildcard path for -Include to work correctly)
$imageFiles = Get-ChildItem -Path ".\*" -Include *.jpg, *.jpeg, *.png, *.gif, *.JPG, *.JPEG, *.PNG, *.GIF -File

foreach ($img in $imageFiles) {
    $filename = $img.Name
    $thumbPath = Join-Path (Join-Path $ScriptDir $ThumbDir) "thumb_$filename"

    # Skip if thumbnail already exists and is newer than source
    if ((Test-Path $thumbPath) -and ((Get-Item $thumbPath).LastWriteTime -gt $img.LastWriteTime)) {
        Write-Host "Skipping $filename (thumbnail up to date)"
        continue
    }

    Write-Host "Creating thumbnail for: $filename"

    try {
        # Load image bytes into memory first to avoid file locking issues
        $bytes = [System.IO.File]::ReadAllBytes($img.FullName)
        $memStream = New-Object System.IO.MemoryStream($bytes, $false)
        $image = [System.Drawing.Image]::FromStream($memStream)

        # Calculate new dimensions maintaining aspect ratio
        $ratioX = $MaxSize / $image.Width
        $ratioY = $MaxSize / $image.Height
        $ratio = [Math]::Min($ratioX, $ratioY)

        $newWidth = [int]($image.Width * $ratio)
        $newHeight = [int]($image.Height * $ratio)

        # Create thumbnail bitmap
        $thumb = New-Object System.Drawing.Bitmap($newWidth, $newHeight)
        $graphics = [System.Drawing.Graphics]::FromImage($thumb)
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graphics.DrawImage($image, 0, 0, $newWidth, $newHeight)
        $graphics.Dispose()

        # Get JPEG encoder
        $jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
        $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
        $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 85L)

        # Save thumbnail
        $thumb.Save($thumbPath, $jpegCodec, $encoderParams)

        # Clean up
        $thumb.Dispose()
        $image.Dispose()
        $memStream.Dispose()

        $count++
    }
    catch {
        Write-Host "  Error processing $filename : $_"
    }
}

Write-Host ""
Write-Host "Done! Created $count thumbnail(s) in '$ThumbDir/'"
