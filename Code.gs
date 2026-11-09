/**
 * ============================================================================
 * ICT Task & Project Management System | สพม.พัทลุง
 * Google Apps Script Backend (Code.gs)
 * สำหรับ: นักวิชาการคอมพิวเตอร์ สำนักงานเขตพื้นที่การศึกษามัธยมศึกษาพัทลุง
 * Timezone: Asia/Bangkok (GMT+7)
 * ============================================================================
 */

const SHEET_TASKS = 'Tasks';
const SHEET_CONFIG = 'Config';
const DEFAULT_ADMIN_PIN = '2570';

const TASK_HEADERS = [
  'id',
  'taskType',
  'category',
  'priority',
  'title',
  'details',
  'targetGroup',
  'startDate',
  'dueDate',
  'remainingDays',
  'status',
  'remarks',
  'updatedAt'
];

const CONFIG_HEADERS = ['key', 'value', 'updatedAt'];

/**
 * 1. Initialize Google Sheets Database (`Tasks` and `Config` sheets)
 */
function setupDatabase() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Setup Tasks Sheet
  let taskSheet = ss.getSheetByName(SHEET_TASKS);
  if (!taskSheet) {
    taskSheet = ss.insertSheet(SHEET_TASKS);
    taskSheet.appendRow(TASK_HEADERS);
    const headerRange = taskSheet.getRange(1, 1, 1, TASK_HEADERS.length);
    headerRange.setBackground('#4F46E5');
    headerRange.setFontColor('#FFFFFF');
    headerRange.setFontWeight('bold');
    taskSheet.setFrozenRows(1);
  }

  // Setup Config Sheet
  let configSheet = ss.getSheetByName(SHEET_CONFIG);
  if (!configSheet) {
    configSheet = ss.insertSheet(SHEET_CONFIG);
    configSheet.appendRow(CONFIG_HEADERS);
    const configHeaderRange = configSheet.getRange(1, 1, 1, CONFIG_HEADERS.length);
    configHeaderRange.setBackground('#1E293B');
    configHeaderRange.setFontColor('#FFFFFF');
    configHeaderRange.setFontWeight('bold');
    configSheet.setFrozenRows(1);

    const nowIso = new Date().toISOString();
    configSheet.appendRow(['adminPin', DEFAULT_ADMIN_PIN, nowIso]);
    configSheet.appendRow(['telegramBotToken', '', nowIso]);
    configSheet.appendRow(['telegramChatId', '', nowIso]);
    configSheet.appendRow(['morningAlertTime', '07:30', nowIso]);
    configSheet.appendRow(['officerName', 'นักวิชาการคอมพิวเตอร์ สพม.พัทลุง', nowIso]);
  }

  return {
    success: true,
    message: 'Database initialized successfully (Tasks & Config sheets ready).'
  };
}

/**
 * Helper: Build CORS-friendly JSON response
 */
function createJsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Helper: Calculate remaining days (dueDate - today in Asia/Bangkok)
 */
function calculateRemainingDaysServer(dueDateStr) {
  if (!dueDateStr) return 0;
  const tz = 'Asia/Bangkok';
  const todayStr = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd');
  const todayParts = todayStr.split('-').map(Number);
  const dueParts = String(dueDateStr).substring(0, 10).split('-').map(Number);
  if (dueParts.length !== 3 || isNaN(dueParts[0])) return 0;

  const todayUtc = Date.UTC(todayParts[0], todayParts[1] - 1, todayParts[2]);
  const dueUtc = Date.UTC(dueParts[0], dueParts[1] - 1, dueParts[2]);
  return Math.round((dueUtc - todayUtc) / (1000 * 60 * 60 * 24));
}

/**
 * Helper: Read all tasks from `Tasks` sheet
 */
function getAllTasksFromSheet() {
  setupDatabase();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_TASKS);
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) return [];

  const data = sheet.getRange(1, 1, lastRow, TASK_HEADERS.length).getValues();
  const headers = data[0];
  const tasks = [];
  const tz = 'Asia/Bangkok';

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row[0]) continue;
    const item = {};
    for (let c = 0; c < headers.length; c++) {
      const key = headers[c];
      let val = row[c];
      if ((key === 'startDate' || key === 'dueDate') && val instanceof Date) {
        val = Utilities.formatDate(val, tz, 'yyyy-MM-dd');
      }
      item[key] = val !== undefined && val !== null ? String(val) : '';
    }
    try {
      if (item.targetGroup && item.targetGroup.startsWith('[')) {
        item.targetGroup = JSON.parse(item.targetGroup);
      } else if (item.targetGroup) {
        item.targetGroup = item.targetGroup.split(',').map(function(s) { return s.trim(); }).filter(Boolean);
      } else {
        item.targetGroup = [];
      }
    } catch (err) {
      item.targetGroup = item.targetGroup ? [String(item.targetGroup)] : [];
    }

    item.remainingDays = calculateRemainingDaysServer(item.dueDate);
    tasks.push(item);
  }
  return tasks;
}

/**
 * Helper: Read Config key-value pairs from `Config` sheet
 */
function getConfigFromSheet() {
  setupDatabase();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_CONFIG);
  const data = sheet.getDataRange().getValues();
  const config = {};
  for (let i = 1; i < data.length; i++) {
    const key = data[i][0];
    const value = data[i][1];
    if (key) {
      config[String(key)] = value !== undefined && value !== null ? String(value) : '';
    }
  }
  if (!config.adminPin) {
    config.adminPin = DEFAULT_ADMIN_PIN;
  }
  return config;
}

/**
 * Helper: Verify PIN
 */
function verifyAdminPin(suppliedPin, configObj) {
  const cfg = configObj || getConfigFromSheet();
  const activePin = String(cfg.adminPin || DEFAULT_ADMIN_PIN).trim();
  // Allow if suppliedPin matches activePin
  return String(suppliedPin || '').trim() === activePin;
}

/**
 * Helper: Save Config key-value pairs to `Config` sheet
 */
function saveConfigToSheet(newConfig) {
  setupDatabase();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_CONFIG);
  const data = sheet.getDataRange().getValues();
  const nowIso = new Date().toISOString();

  const existingIndexMap = {};
  for (let i = 1; i < data.length; i++) {
    const key = data[i][0];
    if (key) existingIndexMap[String(key)] = i + 1;
  }

  Object.keys(newConfig || {}).forEach(function(key) {
    const val = newConfig[key] !== undefined && newConfig[key] !== null ? String(newConfig[key]) : '';
    if (existingIndexMap[key]) {
      sheet.getRange(existingIndexMap[key], 2).setValue(val);
      sheet.getRange(existingIndexMap[key], 3).setValue(nowIso);
    } else {
      sheet.appendRow([key, val, nowIso]);
    }
  });

  return getConfigFromSheet();
}

/**
 * 2. HTTP GET Handler (`doGet`)
 */
function doGet(e) {
  try {
    const action = (e && e.parameter && e.parameter.action) ? e.parameter.action : 'getAll';
    const suppliedPin = (e && e.parameter && e.parameter.pin) ? e.parameter.pin : '';

    if (action === 'ping') {
      return createJsonResponse({
        success: true,
        status: 'online',
        service: 'ICT Task & Project Manager API | สพม.พัทลุง',
        timestamp: new Date().toISOString()
      });
    }

    const config = getConfigFromSheet();

    if (action === 'verifyPin') {
      const valid = verifyAdminPin(suppliedPin, config);
      return createJsonResponse({
        success: valid,
        authenticated: valid,
        error: valid ? null : 'รหัส PIN ไม่ถูกต้อง'
      });
    }

    if (!verifyAdminPin(suppliedPin, config)) {
      return createJsonResponse({
        success: false,
        authRequired: true,
        error: 'กรุณาใส่รหัส PIN ที่ถูกต้องเพื่อเข้าถึงข้อมูล'
      });
    }

    const tasks = getAllTasksFromSheet();

    return createJsonResponse({
      success: true,
      tasks: tasks,
      config: {
        telegramBotToken: config.telegramBotToken || '',
        telegramChatId: config.telegramChatId || '',
        morningAlertTime: '07:30',
        officerName: config.officerName || 'นักวิชาการคอมพิวเตอร์ สพม.พัทลุง'
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return createJsonResponse({
      success: false,
      error: error.message || String(error)
    });
  }
}

/**
 * 3. HTTP POST Handler (`doPost`)
 * Uses text/plain JSON payload parsing to avoid CORS preflight failures
 */
function doPost(e) {
  try {
    setupDatabase();
    const rawBody = (e && e.postData && e.postData.contents) ? e.postData.contents : '{}';
    const payload = JSON.parse(rawBody);
    const action = payload.action || '';
    const suppliedPin = payload.pin || '';

    const config = getConfigFromSheet();

    if (action === 'verifyPin') {
      const valid = verifyAdminPin(suppliedPin, config);
      return createJsonResponse({
        success: valid,
        authenticated: valid,
        error: valid ? null : 'รหัส PIN ไม่ถูกต้อง'
      });
    }

    if (action === 'changePin') {
      const oldPin = payload.oldPin || suppliedPin;
      const newPin = String(payload.newPin || '').trim();
      if (!verifyAdminPin(oldPin, config)) {
        return createJsonResponse({
          success: false,
          error: 'รหัส PIN เดิมไม่ถูกต้อง'
        });
      }
      if (!newPin || newPin.length < 4) {
        return createJsonResponse({
          success: false,
          error: 'กรุณาตั้งรหัส PIN ใหม่อย่างน้อย 4 หลัก'
        });
      }
      saveConfigToSheet({ adminPin: newPin });
      return createJsonResponse({
        success: true,
        message: 'เปลี่ยนรหัส PIN สำเร็จเรียบร้อยแล้ว'
      });
    }

    if (!verifyAdminPin(suppliedPin, config)) {
      return createJsonResponse({
        success: false,
        authRequired: true,
        error: 'รหัส PIN ไม่ถูกต้อง ไม่สามารถแก้ไขฐานข้อมูลได้'
      });
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const taskSheet = ss.getSheetByName(SHEET_TASKS);
    const nowIso = new Date().toISOString();

    if (action === 'createTask') {
      const task = payload.task || {};
      const taskId = task.id || ('TASK-' + Utilities.formatDate(new Date(), 'Asia/Bangkok', 'yyyyMMdd') + '-' + Math.floor(100 + Math.random() * 900));
      const remainingDays = calculateRemainingDaysServer(task.dueDate);
      const targetGroupStr = Array.isArray(task.targetGroup)
        ? JSON.stringify(task.targetGroup)
        : JSON.stringify(task.targetGroup ? [task.targetGroup] : []);

      const newRow = [
        taskId,
        task.taskType || 'งานประจำ',
        task.category || '99. งานอื่นๆ ที่ได้รับมอบหมาย',
        task.priority || 'ปกติ',
        task.title || '',
        task.details || '',
        targetGroupStr,
        task.startDate || '',
        task.dueDate || '',
        remainingDays,
        task.status || 'รอดำเนินการ',
        task.remarks || '',
        nowIso
      ];

      taskSheet.appendRow(newRow);
      return createJsonResponse({
        success: true,
        message: 'สร้างรายการงานสำเร็จ',
        task: Object.assign({}, task, { id: taskId, remainingDays: remainingDays, updatedAt: nowIso })
      });
    }

    if (action === 'updateTask') {
      const task = payload.task || {};
      const data = taskSheet.getDataRange().getValues();
      let updated = false;
      const remainingDays = calculateRemainingDaysServer(task.dueDate);
      const targetGroupStr = Array.isArray(task.targetGroup)
        ? JSON.stringify(task.targetGroup)
        : JSON.stringify(task.targetGroup ? [task.targetGroup] : []);

      for (let i = 1; i < data.length; i++) {
        if (String(data[i][0]) === String(task.id)) {
          const rowIndex = i + 1;
          const updatedRow = [
            task.id,
            task.taskType || 'งานประจำ',
            task.category || '99. งานอื่นๆ ที่ได้รับมอบหมาย',
            task.priority || 'ปกติ',
            task.title || '',
            task.details || '',
            targetGroupStr,
            task.startDate || '',
            task.dueDate || '',
            remainingDays,
            task.status || 'รอดำเนินการ',
            task.remarks || '',
            nowIso
          ];
          taskSheet.getRange(rowIndex, 1, 1, TASK_HEADERS.length).setValues([updatedRow]);
          updated = true;
          break;
        }
      }

      if (!updated) {
        const newRow = [
          task.id,
          task.taskType || 'งานประจำ',
          task.category || '99. งานอื่นๆ ที่ได้รับมอบหมาย',
          task.priority || 'ปกติ',
          task.title || '',
          task.details || '',
          targetGroupStr,
          task.startDate || '',
          task.dueDate || '',
          remainingDays,
          task.status || 'รอดำเนินการ',
          task.remarks || '',
          nowIso
        ];
        taskSheet.appendRow(newRow);
      }

      return createJsonResponse({
        success: true,
        message: 'อัปเดตข้อมูลงานสำเร็จ',
        task: Object.assign({}, task, { remainingDays: remainingDays, updatedAt: nowIso })
      });
    }

    if (action === 'updateStatus') {
      const taskId = payload.id;
      const newStatus = payload.status;
      const data = taskSheet.getDataRange().getValues();
      for (let i = 1; i < data.length; i++) {
        if (String(data[i][0]) === String(taskId)) {
          const rowIndex = i + 1;
          taskSheet.getRange(rowIndex, 11).setValue(newStatus);
          taskSheet.getRange(rowIndex, 13).setValue(nowIso);
          return createJsonResponse({
            success: true,
            message: 'อัปเดตสถานะเป็น "' + newStatus + '" สำเร็จ',
            id: taskId,
            status: newStatus,
            updatedAt: nowIso
          });
        }
      }
      return createJsonResponse({
        success: false,
        error: 'ไม่พบรหัสงานที่ต้องการอัปเดต: ' + taskId
      });
    }

    if (action === 'deleteTask') {
      const taskId = payload.id;
      const data = taskSheet.getDataRange().getValues();
      for (let i = 1; i < data.length; i++) {
        if (String(data[i][0]) === String(taskId)) {
          taskSheet.deleteRow(i + 1);
          return createJsonResponse({
            success: true,
            message: 'ลบรายการงานสำเร็จ',
            id: taskId
          });
        }
      }
      return createJsonResponse({
        success: true,
        message: 'ไม่พบในชีตหรือลบไปแล้ว',
        id: taskId
      });
    }

    if (action === 'clearAllTasks') {
      const lastRow = taskSheet.getLastRow();
      if (lastRow > 1) {
        taskSheet.deleteRows(2, lastRow - 1);
      }
      return createJsonResponse({
        success: true,
        message: 'ล้างข้อมูลงานทั้งหมดใน Google Sheets เรียบร้อยแล้ว',
        tasks: []
      });
    }

    if (action === 'syncAllTasks') {
      const tasks = Array.isArray(payload.tasks) ? payload.tasks : [];
      const lastRow = taskSheet.getLastRow();
      if (lastRow > 1) {
        taskSheet.deleteRows(2, lastRow - 1);
      }
      if (tasks.length > 0) {
        const rows = tasks.map(function(task) {
          const remainingDays = calculateRemainingDaysServer(task.dueDate);
          const targetGroupStr = Array.isArray(task.targetGroup)
            ? JSON.stringify(task.targetGroup)
            : JSON.stringify(task.targetGroup ? [task.targetGroup] : []);
          return [
            task.id,
            task.taskType || 'งานประจำ',
            task.category || '99. งานอื่นๆ ที่ได้รับมอบหมาย',
            task.priority || 'ปกติ',
            task.title || '',
            task.details || '',
            targetGroupStr,
            task.startDate || '',
            task.dueDate || '',
            remainingDays,
            task.status || 'รอดำเนินการ',
            task.remarks || '',
            task.updatedAt || nowIso
          ];
        });
        taskSheet.getRange(2, 1, rows.length, TASK_HEADERS.length).setValues(rows);
      }
      return createJsonResponse({
        success: true,
        message: 'ซิงค์ข้อมูลทั้งหมดสำเร็จ (' + tasks.length + ' รายการ)',
        count: tasks.length
      });
    }

    if (action === 'saveConfig') {
      const updatedConfig = saveConfigToSheet(payload.config || {});
      return createJsonResponse({
        success: true,
        message: 'บันทึกการตั้งค่าระบบลง Google Sheets สำเร็จ',
        config: {
          telegramBotToken: updatedConfig.telegramBotToken || '',
          telegramChatId: updatedConfig.telegramChatId || '',
          morningAlertTime: '07:30'
        }
      });
    }

    if (action === 'testTelegram') {
      if (payload.config) {
        saveConfigToSheet(payload.config);
      }
      const result = sendMorningTelegramDigest(payload.config, payload.tasks);
      return createJsonResponse(result);
    }

    return createJsonResponse({
      success: false,
      error: 'ไม่รู้จักคำสั่ง (Unknown action): ' + action
    });
  } catch (error) {
    return createJsonResponse({
      success: false,
      error: error.message || String(error)
    });
  }
}

/**
 * Helper: Escape HTML special characters for Telegram HTML parse_mode
 */
function escapeTelegramHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Helper: Format Thai Date string
 */
function getThaiDateHeader(dateObj) {
  const monthsThai = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];
  const daysThai = [
    'วันอาทิตย์', 'วันจันทร์', 'วันอังคาร', 'วันพุธ', 'วันพฤหัสบดี', 'วันศุกร์', 'วันเสาร์'
  ];
  const d = dateObj || new Date();
  const dayName = daysThai[d.getDay()];
  const dayNum = d.getDate();
  const monthName = monthsThai[d.getMonth()];
  const buddhistYear = d.getFullYear() + 543;
  return dayName + 'ที่ ' + dayNum + ' ' + monthName + ' พ.ศ. ' + buddhistYear;
}

/**
 * 4. Build and Send Morning Telegram Digest (07:30 AM Daily)
 */
function buildTelegramDigestMessage(tasks) {
  const allTasks = Array.isArray(tasks) ? tasks : [];

  const pendingCount = allTasks.filter(function(t) { return t.status === 'รอดำเนินการ'; }).length;
  const inProgressCount = allTasks.filter(function(t) { return t.status === 'กำลังดำเนินการ'; }).length;
  const completedCount = allTasks.filter(function(t) { return t.status === 'เสร็จแล้ว'; }).length;
  const failedDeadlineCount = allTasks.filter(function(t) { return t.status === 'ไม่เสร็จตามที่กำหนด'; }).length;

  const urgentTasks = allTasks.filter(function(t) {
    const rem = Number(t.remainingDays);
    return t.status !== 'เสร็จแล้ว' && rem >= 0 && (t.priority === 'ด่วนที่สุด' || rem <= 3);
  }).sort(function(a, b) {
    return Number(a.remainingDays) - Number(b.remainingDays);
  });

  const overdueTasks = allTasks.filter(function(t) {
    const rem = Number(t.remainingDays);
    return t.status !== 'เสร็จแล้ว' && (rem < 0 || t.status === 'ไม่เสร็จตามที่กำหนด');
  }).sort(function(a, b) {
    return Number(a.remainingDays) - Number(b.remainingDays);
  });

  const lines = [];
  lines.push('📅 <b>สรุปภารกิจประจำวัน | นักวิชาการคอมพิวเตอร์ สพม.พัทลุง</b>');
  lines.push('🗓 <i>' + escapeTelegramHtml(getThaiDateHeader(new Date())) + '</i>');
  lines.push('──────────────────────');

  // Section 1: Urgent / Due within 3 days
  lines.push('🔥 <b>งานด่วนที่สุด / ครบกำหนดภายใน 3 วัน (' + urgentTasks.length + ' งาน)</b>');
  if (urgentTasks.length === 0) {
    lines.push('   ✅ <i>ไม่มีงานเร่งด่วนในระยะ 3 วันนี้</i>');
  } else {
    urgentTasks.slice(0, 10).forEach(function(t, idx) {
      const rem = Number(t.remainingDays);
      const remText = rem === 0 ? 'ครบกำหนดวันนี้!' : ('เหลืออีก ' + rem + ' วัน');
      const targets = Array.isArray(t.targetGroup) ? t.targetGroup.join(', ') : String(t.targetGroup || '-');
      lines.push(
        (idx + 1) + '. <b>' + escapeTelegramHtml(t.title) + '</b>\n' +
        '   • ชั้นความเร็ว: <code>' + escapeTelegramHtml(t.priority) + '</code> | ' + escapeTelegramHtml(remText) + '\n' +
        '   • กลุ่ม/โรงเรียน: ' + escapeTelegramHtml(targets)
      );
    });
  }

  lines.push('');

  // Section 2: Overdue Tasks
  lines.push('🚨 <b>งานคงค้าง / เลยกำหนดส่ง (' + overdueTasks.length + ' งาน)</b>');
  if (overdueTasks.length === 0) {
    lines.push('   🎉 <i>ยอดเยี่ยม! ไม่มีงานคงค้างหรือเลยกำหนด</i>');
  } else {
    overdueTasks.slice(0, 10).forEach(function(t, idx) {
      const rem = Number(t.remainingDays);
      const overdueText = rem < 0 ? ('เลยกำหนด ' + Math.abs(rem) + ' วัน') : 'ไม่เสร็จตามที่กำหนด';
      const targets = Array.isArray(t.targetGroup) ? t.targetGroup.join(', ') : String(t.targetGroup || '-');
      lines.push(
        (idx + 1) + '. <b>' + escapeTelegramHtml(t.title) + '</b>\n' +
        '   • สถานะเตือน: <code>' + escapeTelegramHtml(overdueText) + '</code> (กำหนดส่ง ' + escapeTelegramHtml(t.dueDate) + ')\n' +
        '   • กลุ่ม/โรงเรียน: ' + escapeTelegramHtml(targets)
      );
    });
  }

  lines.push('──────────────────────');
  lines.push(
    '📊 <b>สถิติภาพรวมทั้งหมด (' + allTasks.length + ' งาน)</b>\n' +
    '⏳ รอดำเนินการ: <b>' + pendingCount + '</b> งาน | 🔄 กำลังดำเนินการ: <b>' + inProgressCount + '</b> งาน\n' +
    '✅ เสร็จแล้ว: <b>' + completedCount + '</b> งาน' +
    (failedDeadlineCount > 0 ? (' | ⚠️ ไม่เสร็จตามกำหนด: <b>' + failedDeadlineCount + '</b> งาน') : '')
  );

  return lines.join('\n');
}

function sendMorningTelegramDigest(overrideConfig, overrideTasks) {
  const sheetConfig = getConfigFromSheet();
  const config = Object.assign({}, sheetConfig, overrideConfig || {});
  const botToken = (config.telegramBotToken || '').trim();
  const chatId = (config.telegramChatId || '').trim();

  if (!botToken || !chatId) {
    return {
      success: false,
      error: 'ยังไม่ได้ตั้งค่า Telegram Bot Token หรือ Chat ID ในชีต Config'
    };
  }

  const tasks = Array.isArray(overrideTasks) ? overrideTasks : getAllTasksFromSheet();
  const htmlMessage = buildTelegramDigestMessage(tasks);
  const telegramUrl = 'https://api.telegram.org/bot' + botToken + '/sendMessage';

  const response = UrlFetchApp.fetch(telegramUrl, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({
      chat_id: chatId,
      text: htmlMessage,
      parse_mode: 'HTML',
      disable_web_page_preview: true
    }),
    muteHttpExceptions: true
  });

  const statusCode = response.getResponseCode();
  const responseBody = JSON.parse(response.getContentText() || '{}');

  if (statusCode === 200 && responseBody.ok) {
    return {
      success: true,
      message: 'ส่งแจ้งเตือนสรุปภารกิจเข้า Telegram สำเร็จ!'
    };
  }

  return {
    success: false,
    error: responseBody.description || ('Telegram API Error (HTTP ' + statusCode + ')')
  };
}

/**
 * 5. Register Daily Trigger at 07:30 AM (Asia/Bangkok)
 * Run this function once in the Apps Script Editor to activate daily notifications.
 */
function setupDailyTrigger() {
  const handlerName = 'sendMorningTelegramDigest';
  const existingTriggers = ScriptApp.getProjectTriggers();

  for (let i = 0; i < existingTriggers.length; i++) {
    if (existingTriggers[i].getHandlerFunction() === handlerName) {
      ScriptApp.deleteTrigger(existingTriggers[i]);
    }
  }

  ScriptApp.newTrigger(handlerName)
    .timeBased()
    .inTimezone('Asia/Bangkok')
    .everyDays(1)
    .atHour(7)
    .nearMinute(30)
    .create();

  return {
    success: true,
    message: 'ตั้งเวลาแจ้งเตือน Telegram อัตโนมัติทุกเช้าเวลา 07:30 น. (Asia/Bangkok) เรียบร้อยแล้ว'
  };
}
