/**
 * ============================================================================
 * Direct Google Apps Script Auto-Pusher (push-gas.js)
 * อัปโหลดไฟล์ Code.gs และ appsscript.json ขึ้น Google Apps Script โดยตรงผ่าน API
 * ใช้สิทธิ์จาก ~/.clasprc.json (รองรับโฟลเดอร์ที่มีช่องว่างบน Windows 100%)
 * ============================================================================
 */

const fs = require('fs');
const os = require('os');
const path = require('path');

async function pushToAppsScript() {
  const claspJsonPath = path.join(__dirname, '.clasp.json');
  if (!fs.existsSync(claspJsonPath)) {
    console.log('ℹ️ ไม่พบไฟล์ .clasp.json ข้ามการอัปโหลดขึ้น Google Apps Script');
    return;
  }

  const { scriptId } = JSON.parse(fs.readFileSync(claspJsonPath, 'utf8'));
  const clasprcPath = path.join(os.homedir(), '.clasprc.json');
  if (!fs.existsSync(clasprcPath)) {
    throw new Error('ไม่พบไฟล์ ~/.clasprc.json กรุณารัน clasp login ก่อน');
  }

  const clasprc = JSON.parse(fs.readFileSync(clasprcPath, 'utf8'));
  const tok = (clasprc.tokens && clasprc.tokens.default) || clasprc.oauth2ClientSettings || clasprc;

  // Refresh access token
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: tok.client_id,
      client_secret: tok.client_secret,
      refresh_token: tok.refresh_token,
      grant_type: 'refresh_token'
    })
  });

  const tokenData = await tokenRes.json();
  const accessToken = tokenData.access_token;
  if (!accessToken) {
    throw new Error('ไม่สามารถขอ Access Token จาก ~/.clasprc.json ได้: ' + JSON.stringify(tokenData));
  }

  const codeGsSource = fs.readFileSync(path.join(__dirname, 'Code.gs'), 'utf8').replace(/^\uFEFF/, '');
  const manifestSource = fs.readFileSync(path.join(__dirname, 'appsscript.json'), 'utf8').replace(/^\uFEFF/, '');

  const payload = {
    files: [
      {
        name: 'appsscript',
        type: 'JSON',
        source: manifestSource
      },
      {
        name: 'Code',
        type: 'SERVER_JS',
        source: codeGsSource
      }
    ]
  };

  console.log(`🚀 กำลัง Push ไฟล์ Code.gs และ appsscript.json ไปยัง Script ID: ${scriptId} ...`);
  const res = await fetch(`https://script.googleapis.com/v1/projects/${scriptId}/content`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const resText = await res.text();
  if (!res.ok) {
    throw new Error(`Google Apps Script API Error (HTTP ${res.status}): ${resText}`);
  }

  const data = JSON.parse(resText);
  console.log(`✅ อัปโหลดขึ้น Google Apps Script สำเร็จ! (${data.files.map((f) => f.name).join(', ')})`);
  console.log(`🔗 เปิดดูสคริปต์ได้ที่: https://script.google.com/d/${scriptId}/edit`);
}

pushToAppsScript().catch((err) => {
  console.error('❌ Push to Google Apps Script failed:', err.message);
  process.exit(1);
});
