#!/bin/bash

# 获取脚本所在目录
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$SCRIPT_DIR/.."

# 移除旧的打包文件
rm -f "$PROJECT_DIR/fast-requery.zip"

# 创建一个临时目录
mkdir -p "$SCRIPT_DIR/temp/js" "$SCRIPT_DIR/temp/css" "$SCRIPT_DIR/temp/images"

# 复制必要的文件，排除测试文件
cp "$PROJECT_DIR/js/popup.js" "$SCRIPT_DIR/temp/js/"
cp "$PROJECT_DIR/css/"* "$SCRIPT_DIR/temp/css/" 2>/dev/null || true
cp -r "$PROJECT_DIR/images/"* "$SCRIPT_DIR/temp/images/" 2>/dev/null || true
cp "$PROJECT_DIR/manifest.json" "$SCRIPT_DIR/temp/"
cp "$PROJECT_DIR/popup.html" "$SCRIPT_DIR/temp/"

# 进入临时目录并打包
cd "$SCRIPT_DIR/temp"
zip -r "$PROJECT_DIR/fast-requery.zip" *

# 清理临时目录
cd "$SCRIPT_DIR"
rm -rf temp

echo "打包完成：fast-requery.zip"
