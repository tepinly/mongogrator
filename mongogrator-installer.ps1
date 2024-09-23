#!/usr/bin/env pwsh
param(
  [String]$Version = "latest",
  [Switch]$NoPathUpdate = $false
);

# Check if the system is 64-bit
if (-not ((Get-CimInstance Win32_ComputerSystem)).SystemType -match "x64-based") {
  Write-Output "Install Failed: Mongogrator for Windows is only available for x86 64-bit Windows."
  return 1
}

$ErrorActionPreference = "Stop"

function Get-Env {
  param([String] $Key)

  $RegisterKey = Get-Item -Path 'HKCU:'
  $EnvRegisterKey = $RegisterKey.OpenSubKey('Environment')
  $EnvRegisterKey.GetValue($Key, $null, [Microsoft.Win32.RegistryValueOptions]::DoNotExpandEnvironmentNames)
}

# Function to update environment variables
function Publish-Env {
  if (-not ("Win32.NativeMethods" -as [Type])) {
    Add-Type -Namespace Win32 -Name NativeMethods -MemberDefinition @"
[DllImport("user32.dll", SetLastError = true, CharSet = CharSet.Auto)]
public static extern IntPtr SendMessageTimeout(
    IntPtr hWnd, uint Msg, UIntPtr wParam, string lParam,
    uint fuFlags, uint uTimeout, out UIntPtr lpdwResult);
"@
  }
  $HWND_BROADCAST = [IntPtr] 0xffff
  $WM_SETTINGCHANGE = 0x1a
  $result = [UIntPtr]::Zero
  [Win32.NativeMethods]::SendMessageTimeout($HWND_BROADCAST,
    $WM_SETTINGCHANGE,
    [UIntPtr]::Zero,
    "Environment",
    2,
    5000,
    [ref] $result
  ) | Out-Null
}

function Write-Env {
  param([String]$Key, [String]$Value)

  $RegisterKey = Get-Item -Path 'HKCU:'
  $EnvRegisterKey = $RegisterKey.OpenSubKey('Environment', $true)
  if ($null -eq $Value) {
    $EnvRegisterKey.DeleteValue($Key)
  }
  else {
    $RegistryValueKind = if ($Value.Contains('%')) {
      [Microsoft.Win32.RegistryValueKind]::ExpandString
    }
    elseif ($EnvRegisterKey.GetValue($Key)) {
      $EnvRegisterKey.GetValueKind($Key)
    }
    else {
      [Microsoft.Win32.RegistryValueKind]::String
    }
    $EnvRegisterKey.SetValue($Key, $Value, $RegistryValueKind)
  }

  Publish-Env
}

# Main installation function
function Install-Mongogrator {
  param([string]$Version);

  $Arch = "x64"
  $MongogratorRoot = "${Home}\.mongogrator"
  $MongogratorBin = mkdir -Force "${MongogratorRoot}\bin"

  # https://github.com/tepinly/mongogrator/releases/download/v1.0.1/mongogrator-windows.zip
  $BaseURL = "https://github.com/tepinly/mongogrator/releases"
  $URL = "$BaseURL/$(if ($Version -eq "latest") { "latest/download" } else { "download/$Version" })/mongogrator-windows.zip"
  $ZipPath = "${MongogratorBin}\mongogrator-windows.zip"

  Remove-Item -Force $ZipPath -ErrorAction SilentlyContinue

  # Print the URL 
  Write-Output "Downloading Mongogrator from $URL"
  # Download the Mongogrator zip file
  Invoke-RestMethod -Uri $URL -OutFile $ZipPath

  if (!(Test-Path $ZipPath)) {
    Write-Output "Install Failed: Could not download $URL"
    return 1
  }

  try {
    Expand-Archive "$ZipPath" "$MongogratorBin" -Force
    if (!(Test-Path "${MongogratorBin}\bin\mongogrator-windows.exe")) {
      throw "The file '${MongogratorBin}\bin\mongogrator-windows.exe' does not exist. Download is corrupt or intercepted by antivirus."
    }
  }
  catch {
    Write-Output "Install Failed: Could not unzip $ZipPath"
    Write-Error $_
    return 1
  }

  Remove-Item $ZipPath -Force

  Write-Output "Mongogrator was installed successfully!"
  Write-Output "The binary is located at ${MongogratorBin}\bin\mongogrator-windows.exe"

  if (-not $NoPathUpdate) {
    $Path = (Get-Env -Key "Path") -split ';'
    if ($Path -notcontains "${MongogratorBin}\bin") {
      $Path += "${MongogratorBin}\bin"
      Write-Env -Key 'Path' -Value ($Path -join ';')
      $env:PATH = $Path;
    }
    Write-Output "To get started, restart your terminal/editor, then type 'mongogrator-windows'"
  }
}

Install-Mongogrator -Version $Version
