Add-Type -AssemblyName System.Drawing

function Resize-Image {
    param (
        [string]$srcPath,
        [string]$dstPath,
        [int]$w,
        [int]$h
    )
    $srcImg = [System.Drawing.Image]::FromFile($srcPath)
    $dstImg = New-Object System.Drawing.Bitmap $w, $h
    $graphics = [System.Drawing.Graphics]::FromImage($dstImg)
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $graphics.DrawImage($srcImg, 0, 0, $w, $h)
    $dstImg.Save($dstPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $graphics.Dispose()
    $dstImg.Dispose()
    $srcImg.Dispose()
}

$base = "c:\Users\elica\OneDrive\Desktop\Juani\Proyectos\LyL - Select\public"
$src = Join-Path $base "logo-background.png"

Resize-Image -srcPath $src -dstPath (Join-Path $base "favicon-16x16.png") -w 16 -h 16
Resize-Image -srcPath $src -dstPath (Join-Path $base "favicon-32x32.png") -w 32 -h 32
Resize-Image -srcPath $src -dstPath (Join-Path $base "apple-touch-icon.png") -w 180 -h 180

# Also generate favicon.ico (can be done from 32x32 bitmap using Icon.FromHandle)
$bmp32 = [System.Drawing.Bitmap]::FromFile((Join-Path $base "favicon-32x32.png"))
$iconHandle = $bmp32.GetHicon()
$icon = [System.Drawing.Icon]::FromHandle($iconHandle)
$fileStream = New-Object System.IO.FileStream((Join-Path $base "favicon.ico"), [System.IO.FileMode]::Create)
$icon.Save($fileStream)
$fileStream.Close()
$icon.Dispose()
$bmp32.Dispose()

Write-Output "Favicons generated successfully"
