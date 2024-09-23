#!/bin/bash

# Variables
VERSION="latest" # Replace with the latest version if necessary
BINARY_NAME="mongogrator"

# Detect platform and architecture
OS="$(uname -s)"
ARCH="$(uname -m)"

case "$OS" in
Linux)
  case "$ARCH" in
  x86_64)
    PLATFORM="linux"
    ;;
  aarch64)
    PLATFORM="linux-arm64"
    ;;
  *)
    echo "Unsupported architecture: $ARCH"
    exit 1
    ;;
  esac
  FILE_EXT=".tar.gz"
  ;;
Darwin)
  case "$ARCH" in
  x86_64)
    PLATFORM="mac"
    ;;
  arm64)
    PLATFORM="mac-arm64"
    ;;
  *)
    echo "Unsupported architecture: $ARCH"
    exit 1
    ;;
  esac
  FILE_EXT=".tar.gz"
  ;;
*)
  echo "Unsupported OS: $OS"
  exit 1
  ;;
esac

# Construct the download URL
DOWNLOAD_URL="https://github.com/tepinly/mongogrator/releases/${VERSION}/download/${BINARY_NAME}-${PLATFORM}${FILE_EXT}"

# Download the release using curl
echo "Downloading Mongogrator ${VERSION} for ${PLATFORM}..."
curl -L --progress-bar -o ${BINARY_NAME}${FILE_EXT} ${DOWNLOAD_URL}

# Check if download was successful
if [ $? -ne 0 ]; then
  echo "Download failed. Please check the URL or your network connection."
  exit 1
fi

# Extract the file if it's a tar.gz (for Linux and macOS)
if [[ $FILE_EXT == ".tar.gz" ]]; then
  echo "Extracting ${BINARY_NAME}${FILE_EXT}..."
  tar -xzf ${BINARY_NAME}${FILE_EXT}

  # Check if the binary is inside a bin/ folder
  if [[ -d "bin" ]]; then
    echo "Found bin/ directory, moving executable..."
    mv bin/${BINARY_NAME}-${PLATFORM} ${BINARY_NAME}
    sudo mv ${BINARY_NAME} /usr/local/bin/
  else
    echo "Moving ${BINARY_NAME}-${PLATFORM} to /usr/local/bin..."
    mv ${BINARY_NAME}-${PLATFORM} ${BINARY_NAME}
    sudo mv ${BINARY_NAME} /usr/local/bin/
  fi
fi

# Ensure /usr/local/bin is in the PATH (for Linux and macOS)
if [[ ":$PATH:" != *":/usr/local/bin:"* ]]; then
  echo "Adding /usr/local/bin to PATH..."
  echo 'export PATH=$PATH:/usr/local/bin' >>~/.bash_profile
  source ~/.bash_profile
fi

# Cleanup
rm ${BINARY_NAME}${FILE_EXT}

# Confirm success
if command -v ${BINARY_NAME} >/dev/null 2>&1; then
  echo "${BINARY_NAME} installed successfully and is available in your PATH."
else
  echo "Something went wrong. Please check the installation steps."
  exit 1
fi
