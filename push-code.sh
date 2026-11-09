#!/usr/bin/env bash
set -e

echo "======================================================================"
echo "[1/3] Running Syntax Check & Pre-Flight Test Suite..."
echo "======================================================================"
node -c app.js
node -e "const fs=require('fs'),vm=require('vm'); new vm.Script(fs.readFileSync('Code.gs','utf8'),{filename:'Code.gs'}); console.log('Code.gs syntax OK');"
node test-suite.js

echo ""
echo "======================================================================"
echo "[2/3] Staging & Committing Changes to Git..."
echo "======================================================================"
COMMIT_MSG="${1:-chore: update ICT Task & Project Manager (Verified by Pre-Flight Test)}"
git add .
git commit -m "$COMMIT_MSG"

echo ""
echo "======================================================================"
echo "[3/3] Pushing to Remote Git Repository..."
echo "======================================================================"
git push

if [ -f ".clasp.json" ]; then
  echo "Found .clasp.json - Pushing backend files to Google Apps Script via clasp..."
  npx @google/clasp push
fi

echo "Done!"
