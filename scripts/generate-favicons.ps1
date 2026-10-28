Add-Type -AssemblyName System.Drawing

$srcPath = (Resolve-Path "Glossy Abstract A App Icon.png").Path
$src = [System.Drawing.Bitmap]::FromFile($srcPath)
$w = $src.Width
$h = $src.Height

# Create 32-bit ARGB bitmap for master icon
$master = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$rect = New-Object System.Drawing.Rectangle(0, 0, $w, $h)
$srcData = $src.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$outData = $master.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::WriteOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

$bytes = [byte[]]::new($w * $h * 4)
[System.Runtime.InteropServices.Marshal]::Copy($srcData.Scan0, $bytes, 0, $bytes.Length)

# Queue flood fill from 4 corners to remove outer black background
$visited = [bool[]]::new($w * $h)
$queue = New-Object System.Collections.Generic.Queue[int]

function AddSeed($x, $y) {
    $idx = $y * $w + $x
    if (-not $visited[$idx]) {
        $visited[$idx] = $true
        $queue.Enqueue($idx)
    }
}

AddSeed 0 0
AddSeed ($w - 1) 0
AddSeed 0 ($h - 1)
AddSeed ($w - 1) ($h - 1)

while ($queue.Count -gt 0) {
    $curr = $queue.Dequeue()
    $cx = $curr % $w
    $cy = [math]::Floor($curr / $w)
    $bIdx = $curr * 4

    $b = $bytes[$bIdx]
    $g = $bytes[$bIdx + 1]
    $r = $bytes[$bIdx + 2]

    $maxVal = [math]::Max($r, [math]::Max($g, $b))
    if ($maxVal -le 10) {
        $bytes[$bIdx + 3] = 0

        if ($cx -gt 0) {
            $n = $curr - 1
            if (-not $visited[$n]) { $visited[$n] = $true; $queue.Enqueue($n) }
        }
        if ($cx -lt $w - 1) {
            $n = $curr + 1
            if (-not $visited[$n]) { $visited[$n] = $true; $queue.Enqueue($n) }
        }
        if ($cy -gt 0) {
            $n = $curr - $w
            if (-not $visited[$n]) { $visited[$n] = $true; $queue.Enqueue($n) }
        }
        if ($cy -lt $h - 1) {
            $n = $curr + $w
            if (-not $visited[$n]) { $visited[$n] = $true; $queue.Enqueue($n) }
        }
    }
}

[System.Runtime.InteropServices.Marshal]::Copy($bytes, 0, $outData.Scan0, $bytes.Length)
$src.UnlockBits($srcData)
$master.UnlockBits($outData)
$src.Dispose()

function ResizeAndSave($bitmap, $targetSize, $targetPath) {
    $dest = New-Object System.Drawing.Bitmap($targetSize, $targetSize, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($dest)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $g.Clear([System.Drawing.Color]::Transparent)
    $g.DrawImage($bitmap, 0, 0, $targetSize, $targetSize)
    $g.Dispose()

    $dest.Save($targetPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $dest.Dispose()
    Write-Output "Generated: $targetPath ($($targetSize)x$($targetSize))"
}

$publicDir = (Resolve-Path "public").Path

# Generate all needed sizes
$sizes = @(16, 32, 48, 64, 128, 180, 192, 256, 512)
foreach ($s in $sizes) {
    ResizeAndSave $master $s (Join-Path $publicDir "icon-$s.png")
}

# Special copies
ResizeAndSave $master 32 (Join-Path $publicDir "favicon-32.png")
ResizeAndSave $master 180 (Join-Path $publicDir "apple-touch-icon.png")

$master.Dispose()
Write-Output "All PNG favicons successfully generated."
