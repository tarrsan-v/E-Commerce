# Aura Commerce - Lightweight Static HTTP Server in PowerShell
# Runs on Windows without requiring Node.js or Python!

$Port = 5000
$Root = $PSScriptRoot

$Listener = New-Object System.Net.HttpListener
$Prefix = "http://localhost:$Port/"
$Listener.Prefixes.Add($Prefix)

try {
    $Listener.Start()
    Write-Host "=========================================================" -ForegroundColor Cyan
    Write-Host "  ✨ Aura E-Commerce UI/UX Project is LIVE!             " -ForegroundColor Green
    Write-Host "=========================================================" -ForegroundColor Cyan
    Write-Host "  Customer Storefront URL : http://localhost:$Port/#/" -ForegroundColor White
    Write-Host "  Customer Login URL      : http://localhost:$Port/#/login" -ForegroundColor White
    Write-Host "  Customer Sign Up URL    : http://localhost:$Port/#/signup" -ForegroundColor White
    Write-Host "  Customer Spend Limit    : http://localhost:$Port/#/limit" -ForegroundColor White
    Write-Host "  Admin Login URL         : http://localhost:$Port/#/admin/login" -ForegroundColor Yellow
    Write-Host "  Admin Products CRUD     : http://localhost:$Port/#/admin/products" -ForegroundColor Yellow
    Write-Host "=========================================================" -ForegroundColor Cyan
    Write-Host "Press Ctrl+C in this console to stop the server." -ForegroundColor Gray

    # Automatically launch browser
    Start-Process $Prefix

    while ($Listener.IsListening) {
        $Context = $Listener.GetContext()
        $Request = $Context.Request
        $Response = $Context.Response

        $UrlPath = $Request.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrEmpty($UrlPath)) {
            $UrlPath = "index.html"
        }

        $FilePath = Join-Path $Root $UrlPath

        if (Test-Path $FilePath -PathType Leaf) {
            $Bytes = [System.IO.File]::ReadAllBytes($FilePath)
            
            # Content Type
            $Ext = [System.IO.Path]::GetExtension($FilePath).ToLower()
            $ContentType = switch ($Ext) {
                ".html" { "text/html; charset=utf-8" }
                ".css"  { "text/css; charset=utf-8" }
                ".js"   { "application/javascript; charset=utf-8" }
                ".json" { "application/json; charset=utf-8" }
                ".png"  { "image/png" }
                ".jpg"  { "image/jpeg" }
                ".jpeg" { "image/jpeg" }
                ".svg"  { "image/svg+xml" }
                default { "application/octet-stream" }
            }

            $Response.ContentType = $ContentType
            $Response.ContentLength64 = $Bytes.Length
            $Response.OutputStream.Write($Bytes, 0, $Bytes.Length)
        } else {
            # Fallback to index.html for client side routing
            $IndexPath = Join-Path $Root "index.html"
            if (Test-Path $IndexPath) {
                $Bytes = [System.IO.File]::ReadAllBytes($IndexPath)
                $Response.ContentType = "text/html; charset=utf-8"
                $Response.ContentLength64 = $Bytes.Length
                $Response.OutputStream.Write($Bytes, 0, $Bytes.Length)
            } else {
                $Response.StatusCode = 404
            }
        }

        $Response.OutputStream.Close()
    }
}
finally {
    $Listener.Stop()
}
