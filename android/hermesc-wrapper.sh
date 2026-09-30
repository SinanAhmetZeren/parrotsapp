#!/usr/bin/env bash
HERMESC_BIN="$(dirname "$0")/../node_modules/react-native/sdks/hermesc/linux64-bin/hermesc"
chmod +x "$HERMESC_BIN" 2>/dev/null || true
exec "$HERMESC_BIN" "$@"
