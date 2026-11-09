/**
 * ============================================================================
 * ICT Task & Project Management System | สพม.พัทลุง
 * Automated Pre-Flight Test Suite (test-suite.js)
 * รันด้วยคำสั่ง: node test-suite.js
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const appModule = require('./app.js');

function runPreFlightVerification() {
  console.log('======================================================================');
  console.log('🚀 เริ่มต้นตรวจสอบระบบ Pre-Flight Test Suite | สพม.พัทลุง');
  console.log('======================================================================\n');

  // 1. Run Built-in Self-Test Suite from app.js
  const report = appModule.runBuiltInSelfTest();

  report.results.forEach((r) => {
    const icon = r.passed ? '✅ [PASS]' : '❌ [FAIL]';
    console.log(`${icon} ${r.name}`);
    console.log(`   └─ ${r.details}\n`);
  });

  // 2. Verify Project Files & Backend Code.gs Readiness
  let backendCheckPassed = true;
  const backendErrors = [];

  try {
    const codeGsPath = path.join(__dirname, 'Code.gs');
    const manifestPath = path.join(__dirname, 'appsscript.json');
    const htmlPath = path.join(__dirname, 'index.html');

    const codeGsContent = fs.readFileSync(codeGsPath, 'utf8');
    const manifestContent = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');

    // Compile Code.gs with V8 vm.Script to verify zero JS syntax errors
    new vm.Script(codeGsContent, { filename: 'Code.gs' });

    const requiredGasFunctions = [
      'function setupDatabase()',
      'function doGet(e)',
      'function doPost(e)',
      'function sendMorningTelegramDigest(',
      'function setupDailyTrigger()'
    ];

    requiredGasFunctions.forEach((fnSig) => {
      if (!codeGsContent.includes(fnSig)) {
        backendCheckPassed = false;
        backendErrors.push(`ไม่พบฟังก์ชัน ${fnSig} ใน Code.gs`);
      }
    });

    if (manifestContent.timeZone !== 'Asia/Bangkok') {
      backendCheckPassed = false;
      backendErrors.push(`Timezone ใน appsscript.json ไม่ใช่ Asia/Bangkok`);
    }

    if (!htmlContent.includes('openSelfTestModalAndRun()')) {
      backendCheckPassed = false;
      backendErrors.push('ไม่พบปุ่มตรวจสอบระบบ (Run Self-Test) ใน index.html');
    }
  } catch (err) {
    backendCheckPassed = false;
    backendErrors.push(err.message);
  }

  if (backendCheckPassed) {
    console.log('✅ [PASS] Test 5: ตรวจสอบความสมบูรณ์ของไฟล์ Code.gs, appsscript.json (Asia/Bangkok) และ index.html');
    console.log('   └─ พบฟังก์ชัน setupDatabase, doGet, doPost, sendMorningTelegramDigest, setupDailyTrigger ครบถ้วน\n');
  } else {
    console.log('❌ [FAIL] Test 5: ตรวจสอบไฟล์ระบบ');
    console.log(`   └─ ${backendErrors.join(', ')}\n`);
  }

  const finalPassed = report.allPassed && backendCheckPassed;
  const totalTests = report.totalCount + 1;
  const passedTests = report.passedCount + (backendCheckPassed ? 1 : 0);

  console.log('======================================================================');
  if (finalPassed) {
    console.log(`🎉 สรุปผลการทดสอบ: ผ่านครบทุกข้อ (${passedTests}/${totalTests}) ใช้เวลา ${report.durationMs} ms`);
    console.log('✅ ระบบพร้อมสำหรับเสนอผู้ใช้ตรวจสอบและทำ Git Push ต่อไป');
    console.log('======================================================================');
    process.exit(0);
  } else {
    console.error(`🚨 สรุปผลการทดสอบ: ไม่ผ่าน (${passedTests}/${totalTests}) กรุณาแก้ไขก่อนทำการ Push`);
    console.log('======================================================================');
    process.exit(1);
  }
}

runPreFlightVerification();
