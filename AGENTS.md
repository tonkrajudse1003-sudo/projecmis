# Project MIS — Engineering, Testing & Git Push Rules

These rules apply across the `projecmis` workspace and must be strictly followed by the AI Agent on every build and change.

## 1. Mandatory Pre-Push Verification
- Before suggesting or executing any Git commit or push, ALWAYS run:
  1. Syntax validation: `node -c app.js` and `node -c Code.gs`
  2. Pre-Flight Automated Test Suite: `node test-suite.js`
  3. Local preview server check so the user can inspect the UI in their browser.
- Report the test results clearly in Thai to the user and **WAIT for the user's explicit confirmation** before executing `git push`.

## 2. Git Push Automation & Manual Production Control
- When the user confirms the test passed (e.g., says `"ผ่าน"`, `"ยืนยัน"`, or `"Push โค้ดเลย"`), execute the terminal commands directly to stage, commit with a clear message, and push (`git add . && git commit -m "..." && git push`, or `push-code.bat`).
- Never auto-deploy to production without explicit permission. Leave final Google Apps Script Web App Deployment under the user's manual control.

## 3. Data Schema & Architecture Integrity
- Preserve all 23 ICT categories (`01.` to `22.` and `99.`) and all 27 schools under สพม.พัทลุง (`93012001` to `93012028`).
- Maintain `localStorage` offline/preview caching so `index.html` works 100% standalone prior to connecting a production Google Apps Script URL.
