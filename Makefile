BIN_DIR = ./bin
SRC_FILE = ./src/index.ts
OUT_LINUX = mg-linux
OUT_LINUX_ARM = mg-linux-arm64
OUT_WINDOWS = mg-windows
OUT_MAC = mg-mac
OUT_MAC_ARM = mg-mac-arm64

linux:
	bun build  --compile --minify --sourcemap --target=bun-linux-x64 $(SRC_FILE) --outfile $(BIN_DIR)/$(OUT_LINUX)

linux-arm:
	bun build  --compile --minify --sourcemap --target=bun-linux-arm64 $(SRC_FILE) --outfile $(BIN_DIR)/$(OUT_LINUX_ARM)

windows:
	bun build  --compile --minify --sourcemap --target=bun-windows-x64 $(SRC_FILE) --outfile $(BIN_DIR)/$(OUT_WINDOWS)

macos:
	bun build  --compile --minify --sourcemap --target=bun-darwin-x64 $(SRC_FILE) --outfile $(BIN_DIR)/$(OUT_MAC)

macos-arm:
	bun build  --compile --minify --sourcemap --target=bun-darwin-arm64 $(SRC_FILE) --outfile $(BIN_DIR)/$(OUT_MAC_ARM)

clean:
	rm -rf $(BIN_DIR)

compress-all:
	tar -czvf $(BIN_DIR)/$(OUT_LINUX).tar.gz $(BIN_DIR)/$(OUT_LINUX)
	tar -czvf $(BIN_DIR)/$(OUT_LINUX_ARM).tar.gz $(BIN_DIR)/$(OUT_LINUX_ARM)
	tar -czvf $(BIN_DIR)/$(OUT_MAC).tar.gz $(BIN_DIR)/$(OUT_MAC)
	tar -czvf $(BIN_DIR)/$(OUT_MAC_ARM).tar.gz $(BIN_DIR)/$(OUT_MAC_ARM)
	zip -9 -y $(BIN_DIR)/$(OUT_WINDOWS).zip $(BIN_DIR)/$(OUT_WINDOWS).exe

# Build and compress for all platforms 
ci: clean linux linux-arm macos macos-arm windows compress-all 

