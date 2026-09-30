#!/usr/bin/env bash

# Fix permissions for Hermes compiler binary on Linux build workers
HERMESC_PATH="node_modules/react-native/sdks/hermesc/linux64-bin/hermesc"

if [ -f "$HERMESC_PATH" ]; then
  chmod +x "$HERMESC_PATH"
  echo "Successfully set execute permissions on hermesc"
else
  echo "hermesc binary not found at $HERMESC_PATH"
fi
