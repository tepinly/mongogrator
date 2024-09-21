BIN_DIR = ./bin
SRC_FILE = ./src/index.ts
OUT_LINUX =  mongogrator-linux
OUT_LINUX_ARM =  mongogrator-linux-arm64
OUT_WINDOWS =  mongogrator-windows
OUT_MAC =  mongogrator-mac
OUT_MAC_ARM =  mongogrator-mac-arm64
MONGOGRATOR = mongogrator

linux:
	bun build  --compile --minify --sourcemap --target=bun-linux-x64 $(SRC_FILE) --outfile $(MONGOGRATOR)

linux-arm:
	bun build  --compile --minify --sourcemap --target=bun-linux-arm64 $(SRC_FILE) --outfile $(MONGOGRATOR)

windows:
	bun build  --compile --minify --sourcemap --target=bun-windows-x64 $(SRC_FILE) --outfile $(MONGOGRATOR)

macos:
	bun build  --compile --minify --sourcemap --target=bun-darwin-x64 $(SRC_FILE) --outfile $(MONGOGRATOR)

macos-arm:
	bun build  --compile --minify --sourcemap --target=bun-darwin-arm64 $(SRC_FILE) --outfile $(MONGOGRATOR)

clean:
	rm -rf $(BIN_DIR)

compress-all:
	tar -czvf $(BIN_DIR)/$(OUT_LINUX).tar.gz $(BIN_DIR)/$(MONGOGRATOR)
	tar -czvf $(BIN_DIR)/$(OUT_LINUX_ARM).tar.gz $(BIN_DIR)/$(MONGOGRATOR)
	tar -czvf $(BIN_DIR)/$(OUT_MAC).tar.gz $(BIN_DIR)/$(MONGOGRATOR)
	tar -czvf $(BIN_DIR)/$(OUT_MAC_ARM).tar.gz $(BIN_DIR)/$(MONGOGRATOR)
	zip -9 -y $(BIN_DIR)/$(OUT_WINDOWS).zip $(BIN_DIR)/$(MONGOGRATOR).exe

# Build and compress for all platforms 
ci: clean linux linux-arm macos macos-arm windows compress-all 

