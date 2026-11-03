#!/usr/bin/env bash
set -euo pipefail

echo "=== ConvertinAja Emergency Storage Sweep ==="

STORAGE_DIR="${STORAGE_DIR:-/tmp/convertinaja/jobs}"

if [ -d "$STORAGE_DIR" ]; then
    echo "Pruning temporary conversion directories older than 60 minutes in $STORAGE_DIR..."
    find "$STORAGE_DIR" -mindepth 1 -maxdepth 1 -type d -mmin +60 -exec rm -rf {} +
    echo "Pruning complete."
else
    echo "Directory $STORAGE_DIR does not exist."
fi
