#!/bin/bash

# Variables
BINARY_NAME="mongogrator"

# Display options for users
echo "Select the version of Mongogrator to download:"
echo "1) Linux (x64)"
echo "2) Linux (ARM64)"
echo "3) macOS (x64)"
echo "4) macOS (ARM64)"
echo "5) Windows (ZIP)"

# Read user input
read -p "Enter the number corresponding to your system: " choice

# Set download URL based on user's choice
case $choice in
1)
  ARCH="linux"
  FILE_EXT=".tar.gz"
  ;;
2)
  ARCH="linux-arm64"
  FILE_EXT=".tar.gz"
  ;;
3)
  ARCH="mac"
  FILE_EXT=".tar.gz"
  ;;
4)
  ARCH="mac-arm64"
  FILE_EXT=".tar.gz"
  ;;
5)
  ARCH="windows"
  FILE_EXT=".zip"
  ;;
*)
  echo "Invalid option. Exiting..."
  exit 1
  ;;
esac

# Construct the download URL
DOWNLOAD_URL="https://github.com/tepinly/mongogrator/releases/latest/download/${BINARY_NAME}-${ARCH}${FILE_EXT}"

# Download the release using curl
echo "Downloading Mongogrator ${VERSION} for ${ARCH}..."
curl -L -o ${BINARY_NAME}${FILE_EXT} ${DOWNLOAD_URL}

# Check if download was successful
if [ $? -ne 0 ]; then
  echo "Download failed. Please check the URL or your network connection."
  exit 1
fi

# Extract the file if it's a tar.gz (for Linux and macOS)
if [[ $FILE_EXT == ".tar.gz" ]]; then
  echo "Extracting ${BINARY_NAME}${FILE_EXT}..."
  tar -xzf ${BINARY_NAME}${FILE_EXT}

  if [[ -d "bin" ]]; then
    echo "Found bin/ directory, moving executable..."
    mv bin/${BINARY_NAME}-${ARCH} ${BINARY_NAME}
    sudo mv ${BINARY_NAME} /usr/local/bin/
  else
    echo "Moving ${BINARY_NAME}-${ARCH} to /usr/local/bin..."
    mv ${BINARY_NAME}-${ARCH} ${BINARY_NAME}
    sudo mv ${BINARY_NAME} /usr/local/bin/
  fi
elif [[ $FILE_EXT == ".zip" ]]; then
  echo "Extracting ${BINARY_NAME}${FILE_EXT}..."
  unzip ${BINARY_NAME}${FILE_EXT} -d ${BINARY_NAME}

  # Move the Windows binary
  sudo mv ${BINARY_NAME}/${BINARY_NAME}.exe /usr/local/bin/${BINARY_NAME}.exe
fi

# Ensure /usr/local/bin is in the PATH (for Linux and macOS)
if [[ ":$PATH:" != *":/usr/local/bin:"* ]]; then
  echo "Adding /usr/local/bin to PATH..."
  if [ -f ~/.bash_profile ]; then
    echo 'export PATH=$PATH:/usr/local/bin' >>~/.bash_profile
    source ~/.bash_profile
  fi
  if [ -f ~/.zshrc ]; then
    echo 'export PATH=$PATH:/usr/local/bin' >>~/.zshrc
    source ~/.zshrc
  fi
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
