#!/usr/bin/env bash

HERMESC_PATH="node_modules/react-native/sdks/hermesc/linux64-bin/hermesc"

echo "=== DIAGNOSTIC: Checking hermesc Binary ==="
if [ -f "$HERMESC_PATH" ]; then
  ls -la "$HERMESC_PATH"
  file "$HERMESC_PATH"
  chmod +x "$HERMESC_PATH"
  echo "After chmod:"
  ls -la "$HERMESC_PATH"
else
  echo "CRITICAL: hermesc binary does not exist at $HERMESC_PATH"
  ls -la node_modules/react-native/sdks/hermesc/
fi
echo "=========================================="
