# capitals_downloader.ps1
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12
$ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"

New-Item -ItemType Directory -Force -Path "public/capitals"

$capitals = @{
    "washington" = "https://upload.wikimedia.org/wikipedia/commons/4/4f/US_Capitol_west_side.jpg"
}

foreach ($name in $capitals.Keys) {
    $url = $capitals[$name]
    $dest = "public/capitals/$name.jpg"
    Write-Host "Downloading $name from $url..."
    try {
        Invoke-WebRequest -UserAgent $ua -Uri $url -OutFile $dest
        Write-Host "Successfully downloaded $name."
    } catch {
        Write-Host "Failed to download $name. Reason: $_"
        Write-Host "Exception details: $($_.Exception.ToString())"
    }
}
