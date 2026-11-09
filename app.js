/**
 * ============================================================================
 * ICT Task & Project Management System | สพม.พัทลุง
 * Frontend Application & Business Logic (app.js)
 * สำหรับ: นักวิชาการคอมพิวเตอร์ สำนักงานเขตพื้นที่การศึกษามัธยมศึกษาพัทลุง
 * ============================================================================
 */

const STORAGE_KEYS = {
  TASKS: 'sesao_ptl_ict_tasks_v1',
  CONFIG: 'sesao_ptl_ict_config_v1',
  VIEW_MODE: 'sesao_ptl_ict_view_mode_v1',
  ANALYTICS_OPEN: 'sesao_ptl_ict_analytics_open_v1'
};

// 1. ประเภทงาน (Task Types - 5 รายการ)
const TASK_TYPES = [
  'โครงการ/กิจกรรม',
  'งานประจำ',
  'งานอีเว้นท์',
  'งานนอก',
  'งานแทรก/งานด่วน'
];

// 2. เรื่อง/รายการ (Categories - 23 รายการ)
const CATEGORIES = [
  '01. งาน Network Administrator',
  '02. งานระบบ Cyber Security',
  '03. งานระบบ Cloud Computing',
  '04. งาน Software Development',
  '05. งานระบบ Web Development',
  '06. งานระบบ DMC Obec Asset',
  '07. งานโครงการ Anywhere Anytime',
  '08. งานติดตามทุกระดับ ตัวชี้วัด PA ตรวจราชการ emenscr',
  '09. งานระบบ PDPA',
  '10. โครงการ DLICT',
  '11. งานระบบ Network สพท. รร.',
  '12. งานการศึกษาทางไกล DLIT',
  '13. งานตั้งงบครุภัณฑ์คอมพิวเตอร์และอุปกรณ์ต่อพ่วง',
  '14. งานระบบ Computer สพท.',
  '15. งานอบรม/ประชุม/สัมมนา',
  '16. คำสั่งที่เกี่ยวข้อง',
  '17. เอกสารเบิกจ่ายที่เกี่ยวข้อง',
  '18. หนังสือเวียน',
  '19. Big Data',
  '20. ระเบียบกฎหมายที่เกี่ยวข้อง',
  '21. DLTV',
  '22. (My Office)',
  '99. งานอื่นๆ ที่ได้รับมอบหมาย'
];

// 3. ชั้นความเร็ว (Priorities - 3 รายการ)
const PRIORITIES = ['ปกติ', 'ด่วน', 'ด่วนที่สุด'];

// 4. สถานะ (Statuses - 4 รายการ)
const STATUSES = [
  'รอดำเนินการ',
  'กำลังดำเนินการ',
  'เสร็จแล้ว',
  'ไม่เสร็จตามที่กำหนด'
];

// 5. กลุ่มงาน/ภาพรวม สพม.พัทลุง (12 รายการ)
const TARGET_GROUPS_OVERVIEW = [
  'ทุกโรงเรียนในสังกัด (27 โรงเรียน)',
  'สพม.พัทลุง (ภาพรวมสำนักงานเขตฯ)',
  'กลุ่มส่งเสริมการศึกษาทางไกล เทคโนโลยีสารสนเทศและการสื่อสาร (ICT)',
  'กลุ่มอำนวยการ',
  'กลุ่มนโยบายและแผน',
  'กลุ่มบริหารงานการเงินและสินทรัพย์',
  'กลุ่มบริหารงานบุคคล',
  'กลุ่มนิเทศ ติดตาม และประเมินผลการจัดการศึกษา',
  'กลุ่มส่งเสริมการจัดการศึกษา',
  'กลุ่มพัฒนาครูและบุคลากรทางการศึกษา',
  'กลุ่มกฎหมายและคดี',
  'หน่วยตรวจสอบภายใน'
];

// 6. โรงเรียนในสังกัด สพม.พัทลุง (27 โรงเรียน: 93012001 - 93012028)
const TARGET_SCHOOLS = [
  '93012001 - พัทลุง',
  '93012002 - เตรียมอุดมศึกษาพัฒนาการ พัทลุง',
  '93012003 - พรหมพินิตชัยบุรี',
  '93012004 - ประภัสสรรังสิต',
  '93012005 - วชิรธรรมสถิต',
  '93012006 - สตรีพัทลุง',
  '93012008 - กงหราพิชากร',
  '93012009 - ชะรัดชนูปถัมภ์',
  '93012010 - หานโพธิ์พิทยาคม',
  '93012011 - ประชาบำรุงอุทิตกิจจาทร',
  '93012012 - ตะโหมด',
  '93012013 - ควนขนุน',
  '93012014 - พนางตุง',
  '93012015 - ดอนศาลานำวิทยา',
  '93012016 - ปัญญาวุธ',
  '93012017 - ควนพระสาครินทร์',
  '93012018 - ปากพะยูนพิทยาคาร',
  '93012019 - หารเทารังสีประชาสรรค์',
  '93012020 - ศรีบรรพตพิทยาคม',
  '93012021 - ตะแพนพิทยา',
  '93012022 - ป่าบอนพิทยาคม',
  '93012023 - บางแก้วพิทยาคม',
  '93012024 - ป่าพะยอมพิทยาคม',
  '93012025 - นิคมควนขนุนวิทยา',
  '93012026 - เขาชัยสน',
  '93012027 - นาขยาดวิทยาคาร',
  '93012028 - อุดมวิทยายน'
];

const ALL_TARGET_OPTIONS = [...TARGET_GROUPS_OVERVIEW, ...TARGET_SCHOOLS];

/**
 * ============================================================================
 * DATE & REMAINING DAYS ENGINE
 * ============================================================================
 */

function getTodayStr() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function addDaysToDateStr(baseDateStr, offsetDays) {
  const parts = String(baseDateStr || getTodayStr()).split('-').map(Number);
  const dt = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
  dt.setUTCDate(dt.getUTCDate() + Number(offsetDays));
  const y = dt.getUTCFullYear();
  const m = String(dt.getUTCMonth() + 1).padStart(2, '0');
  const d = String(dt.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function calculateRemainingDays(dueDateStr, referenceDateStr) {
  if (!dueDateStr) return 0;
  const refStr = referenceDateStr || getTodayStr();
  const refParts = String(refStr).substring(0, 10).split('-').map(Number);
  const dueParts = String(dueDateStr).substring(0, 10).split('-').map(Number);

  if (refParts.length !== 3 || dueParts.length !== 3 || isNaN(dueParts[0])) {
    return 0;
  }

  const refUtc = Date.UTC(refParts[0], refParts[1] - 1, refParts[2]);
  const dueUtc = Date.UTC(dueParts[0], dueParts[1] - 1, dueParts[2]);
  return Math.round((dueUtc - refUtc) / (1000 * 60 * 60 * 24));
}

function getRemainingDaysBadgeInfo(remainingDays, status) {
  const days = Number(remainingDays);

  if (status === 'เสร็จแล้ว') {
    return {
      type: 'completed',
      label: 'เสร็จสมบูรณ์',
      className: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      icon: 'check-circle-2'
    };
  }

  if (days < 0) {
    return {
      type: 'overdue',
      label: `เลยกำหนด ${Math.abs(days)} วัน`,
      className: 'bg-rose-100 text-rose-800 border-rose-300 font-semibold animate-pulse',
      icon: 'alert-octagon'
    };
  }

  if (days === 0) {
    return {
      type: 'due_today',
      label: 'ครบกำหนดวันนี้!',
      className: 'bg-orange-100 text-orange-800 border-orange-300 font-semibold',
      icon: 'flame'
    };
  }

  if (days <= 3) {
    return {
      type: 'urgent',
      label: `เหลือ ${days} วัน (เร่งด่วน)`,
      className: 'bg-amber-100 text-amber-800 border-amber-300 font-medium',
      icon: 'clock-alert'
    };
  }

  return {
    type: 'normal',
    label: `เหลือ ${days} วัน`,
    className: 'bg-slate-100 text-slate-700 border-slate-200',
    icon: 'calendar-clock'
  };
}

function formatThaiShortDate(dateStr) {
  if (!dateStr) return '-';
  const parts = String(dateStr).substring(0, 10).split('-').map(Number);
  if (parts.length !== 3 || isNaN(parts[0])) return dateStr;
  const monthsShort = [
    'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
    'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
  ];
  const day = parts[2];
  const month = monthsShort[parts[1] - 1] || '';
  const yearBE = (parts[0] + 543).toString().slice(-2);
  return `${day} ${month} ${yearBE}`;
}

function generateTaskId(existingTasks, dateStr) {
  const baseDate = String(dateStr || getTodayStr()).replace(/-/g, '');
  const prefix = `TASK-${baseDate}-`;
  let maxSeq = 0;
  (existingTasks || []).forEach((t) => {
    if (t && typeof t.id === 'string' && t.id.startsWith(prefix)) {
      const seqPart = parseInt(t.id.slice(prefix.length), 10);
      if (!isNaN(seqPart) && seqPart > maxSeq) {
        maxSeq = seqPart;
      }
    }
  });
  return `${prefix}${String(maxSeq + 1).padStart(3, '0')}`;
}

/**
 * ============================================================================
 * REALISTIC INITIAL MOCK DATA FOR สพม.พัทลุง
 * ============================================================================
 */
function getInitialMockTasks(referenceTodayStr) {
  const today = referenceTodayStr || getTodayStr();
  const compactDate = today.replace(/-/g, '');

  const rawTasks = [
    {
      id: `TASK-${compactDate}-001`,
      taskType: 'งานแทรก/งานด่วน',
      category: '02. งานระบบ Cyber Security',
      priority: 'ด่วนที่สุด',
      title: 'ตรวจสอบช่องโหว่ Firewall และอัปเดต Policy ความมั่นคงปลอดภัยไซเบอร์ สพม.พัทลุง',
      details: '1. ตรวจสอบ Log การเข้าถึงระบบเครือข่ายหลัก\n2. อัปเดต Firmware อุปกรณ์ FortiGate\n3. รายงานผลการตรวจเช็คต่อ ผอ.กลุ่ม ICT',
      targetGroup: [
        'สพม.พัทลุง (ภาพรวมสำนักงานเขตฯ)',
        'กลุ่มส่งเสริมการศึกษาทางไกล เทคโนโลยีสารสนเทศและการสื่อสาร (ICT)'
      ],
      startDate: addDaysToDateStr(today, -2),
      dueDate: today,
      status: 'กำลังดำเนินการ',
      remarks: 'แจ้งเตือนจาก สพฐ. ให้ดำเนินการภายในวันนี้ https://www.obec.go.th',
      updatedAt: new Date().toISOString()
    },
    {
      id: `TASK-${compactDate}-002`,
      taskType: 'โครงการ/กิจกรรม',
      category: '08. งานติดตามทุกระดับ ตัวชี้วัด PA ตรวจราชการ emenscr',
      priority: 'ด่วนที่สุด',
      title: 'เร่งรัดการกรอกข้อมูลและรายงานผลตัวชี้วัด e-MENSCR ไตรมาสล่าสุด',
      details: 'ติดตามสถานะการรายงานผลโครงการในระบบ e-MENSCR ของทุกกลุ่มงาน และประสานโรงเรียนที่ยังกรอกไม่ครบ',
      targetGroup: [
        'สพม.พัทลุง (ภาพรวมสำนักงานเขตฯ)',
        'กลุ่มนโยบายและแผน',
        '93012001 - พัทลุง',
        '93012006 - สตรีพัทลุง'
      ],
      startDate: addDaysToDateStr(today, -7),
      dueDate: addDaysToDateStr(today, -2),
      status: 'กำลังดำเนินการ',
      remarks: 'รอข้อมูลเพิ่มเติมจากกลุ่มนโยบายและแผน 2 โครงการ',
      updatedAt: new Date().toISOString()
    },
    {
      id: `TASK-${compactDate}-003`,
      taskType: 'งานประจำ',
      category: '06. งานระบบ DMC Obec Asset',
      priority: 'ด่วน',
      title: 'ตรวจสอบและยืนยันข้อมูลครุภัณฑ์คอมพิวเตอร์ในระบบ OBEC Asset ประจำปี',
      details: 'ตรวจสอบความถูกต้องของข้อมูลครุภัณฑ์คอมพิวเตอร์ที่ใช้งานได้/ชำรุด ของโรงเรียนในสังกัด 27 โรงเรียน',
      targetGroup: [
        'ทุกโรงเรียนในสังกัด (27 โรงเรียน)',
        '93012013 - ควนขนุน',
        '93012016 - ปัญญาวุธ',
        '93012018 - ปากพะยูนพิทยาคาร'
      ],
      startDate: addDaysToDateStr(today, -4),
      dueDate: addDaysToDateStr(today, 2),
      status: 'รอดำเนินการ',
      remarks: 'ส่งหนังสือแจ้งเตือนรอบที่ 2 ไปยังโรงเรียนที่ยังไม่กดยืนยันข้อมูล',
      updatedAt: new Date().toISOString()
    },
    {
      id: `TASK-${compactDate}-004`,
      taskType: 'โครงการ/กิจกรรม',
      category: '13. งานตั้งงบครุภัณฑ์คอมพิวเตอร์และอุปกรณ์ต่อพ่วง',
      priority: 'ด่วนที่สุด',
      title: 'จัดทำคำขอตั้งงบประมาณครุภัณฑ์คอมพิวเตอร์และระบบเครือข่ายของโรงเรียนในสังกัด',
      details: 'รวบรวมเอกสารคำขอตั้งงบประมาณ Spec คอมพิวเตอร์ห้องปฏิบัติการ และตรวจสอบใบเสนอราคา 3 ราย',
      targetGroup: [
        '93012002 - เตรียมอุดมศึกษาพัฒนาการ พัทลุง',
        '93012008 - กงหราพิชากร',
        '93012012 - ตะโหมด',
        '93012022 - ป่าบอนพิทยาคม',
        '93012026 - เขาชัยสน'
      ],
      startDate: addDaysToDateStr(today, -3),
      dueDate: addDaysToDateStr(today, 1),
      status: 'กำลังดำเนินการ',
      remarks: 'ต้องสรุปเล่มส่ง สพฐ. ภายในวันพรุ่งนี้',
      updatedAt: new Date().toISOString()
    },
    {
      id: `TASK-${compactDate}-005`,
      taskType: 'โครงการ/กิจกรรม',
      category: '10. โครงการ DLICT',
      priority: 'ปกติ',
      title: 'นิเทศและติดตามคุณภาพระบบอินเทอร์เน็ตความเร็วสูงเพื่อการศึกษา (DLICT)',
      details: 'ลงพื้นที่ทดสอบความเร็วสัญญาณอินเทอร์เน็ตและจุดกระจายสัญญาณ Access Point ในโรงเรียนกลุ่มเป้าหมาย',
      targetGroup: [
        'กลุ่มส่งเสริมการศึกษาทางไกล เทคโนโลยีสารสนเทศและการสื่อสาร (ICT)',
        '93012003 - พรหมพินิตชัยบุรี',
        '93012004 - ประภัสสรรังสิต',
        '93012020 - ศรีบรรพตพิทยาคม'
      ],
      startDate: today,
      dueDate: addDaysToDateStr(today, 7),
      status: 'รอดำเนินการ',
      remarks: 'ประสานงานตารางนัดหมายกับรองผู้อำนวยการฝ่ายบริหารทั่วไปของโรงเรียน',
      updatedAt: new Date().toISOString()
    },
    {
      id: `TASK-${compactDate}-006`,
      taskType: 'งานประจำ',
      category: '09. งานระบบ PDPA',
      priority: 'ด่วน',
      title: 'จัดทำประกาศนโยบายคุ้มครองข้อมูลส่วนบุคคล (PDPA) และแบบฟอร์มขอความยินยอมออนไลน์',
      details: 'อัปเดตหน้าเว็บไซต์ สพม.พัทลุง ให้มีแบนเนอร์ Cookie Consent และคลังแบบฟอร์ม PDPA สำหรับข้าราชการครูและนักเรียน',
      targetGroup: [
        'สพม.พัทลุง (ภาพรวมสำนักงานเขตฯ)',
        'กลุ่มกฎหมายและคดี',
        'กลุ่มอำนวยการ'
      ],
      startDate: addDaysToDateStr(today, -10),
      dueDate: addDaysToDateStr(today, -4),
      status: 'ไม่เสร็จตามที่กำหนด',
      remarks: 'รอร่างประกาศฉบับแก้ไขจากคณะกรรมการ PDPA ระดับเขตพื้นที่',
      updatedAt: new Date().toISOString()
    },
    {
      id: `TASK-${compactDate}-007`,
      taskType: 'งานอีเว้นท์',
      category: '15. งานอบรม/ประชุม/สัมมนา',
      priority: 'ปกติ',
      title: 'เตรียมระบบประชุมทางไกล (Zoom / OBEC Conference) และถ่ายทอดสดการประชุมผู้บริหารสถานศึกษา',
      details: 'เซ็ตอัปไมโครโฟน กล้อง PTZ ระบบสลับภาพ OBS และทดสอบสัญญาณภาพ-เสียงห้องประชุม สพม.พัทลุง',
      targetGroup: [
        'ทุกโรงเรียนในสังกัด (27 โรงเรียน)',
        'สพม.พัทลุง (ภาพรวมสำนักงานเขตฯ)'
      ],
      startDate: addDaysToDateStr(today, -5),
      dueDate: addDaysToDateStr(today, -1),
      status: 'เสร็จแล้ว',
      remarks: 'ดำเนินการถ่ายทอดสดและบันทึกวิดีโอเรียบร้อยแล้ว',
      updatedAt: new Date().toISOString()
    },
    {
      id: `TASK-${compactDate}-008`,
      taskType: 'โครงการ/กิจกรรม',
      category: '05. งานระบบ Web Development',
      priority: 'ด่วน',
      title: 'พัฒนาระบบบริหารจัดการโครงการและภารกิจงาน ICT (Personal Project & Task Manager)',
      details: 'พัฒนา SPA เชื่อมต่อฐานข้อมูล Google Sheets และระบบแจ้งเตือนภารกิจรายวันผ่าน Telegram Bot เวลา 07:30 น.',
      targetGroup: [
        'กลุ่มส่งเสริมการศึกษาทางไกล เทคโนโลยีสารสนเทศและการสื่อสาร (ICT)'
      ],
      startDate: addDaysToDateStr(today, -1),
      dueDate: addDaysToDateStr(today, 5),
      status: 'เสร็จแล้ว',
      remarks: 'พร้อมใช้งานทั้งบน Desktop และสมาร์ทโฟน',
      updatedAt: new Date().toISOString()
    }
  ];

  return rawTasks.map((t) => ({
    ...t,
    remainingDays: calculateRemainingDays(t.dueDate, today)
  }));
}

/**
 * ============================================================================
 * TELEGRAM MESSAGE BUILDER (Client-Side Mirror for Pre-Flight Validation & Preview)
 * ============================================================================
 */
function buildClientTelegramDigestPreview(tasks) {
  const allTasks = Array.isArray(tasks) ? tasks : [];
  const pendingCount = allTasks.filter((t) => t.status === 'รอดำเนินการ').length;
  const inProgressCount = allTasks.filter((t) => t.status === 'กำลังดำเนินการ').length;
  const completedCount = allTasks.filter((t) => t.status === 'เสร็จแล้ว').length;

  const urgentTasks = allTasks.filter((t) => {
    const rem = Number(t.remainingDays);
    return t.status !== 'เสร็จแล้ว' && rem >= 0 && (t.priority === 'ด่วนที่สุด' || rem <= 3);
  });

  const overdueTasks = allTasks.filter((t) => {
    const rem = Number(t.remainingDays);
    return t.status !== 'เสร็จแล้ว' && (rem < 0 || t.status === 'ไม่เสร็จตามที่กำหนด');
  });

  let msg = `📅 <b>สรุปภารกิจประจำวัน | นักวิชาการคอมพิวเตอร์ สพม.พัทลุง</b>\n`;
  msg += `──────────────────────\n`;
  msg += `🔥 <b>งานด่วนที่สุด / ครบกำหนดภายใน 3 วัน (${urgentTasks.length} งาน)</b>\n`;
  if (urgentTasks.length === 0) {
    msg += `   ✅ ไม่มีงานเร่งด่วนในระยะ 3 วันนี้\n`;
  } else {
    urgentTasks.slice(0, 5).forEach((t, i) => {
      const rem = Number(t.remainingDays);
      const remTxt = rem === 0 ? 'ครบกำหนดวันนี้!' : `เหลืออีก ${rem} วัน`;
      const targets = Array.isArray(t.targetGroup) ? t.targetGroup.join(', ') : t.targetGroup;
      msg += `${i + 1}. <b>${t.title}</b> (${t.priority} | ${remTxt})\n   🎯 ${targets}\n`;
    });
  }
  msg += `\n🚨 <b>งานคงค้าง / เลยกำหนดส่ง (${overdueTasks.length} งาน)</b>\n`;
  if (overdueTasks.length === 0) {
    msg += `   🎉 ไม่มีงานคงค้าง\n`;
  } else {
    overdueTasks.slice(0, 5).forEach((t, i) => {
      const rem = Number(t.remainingDays);
      const overTxt = rem < 0 ? `เลยกำหนด ${Math.abs(rem)} วัน` : 'ไม่เสร็จตามที่กำหนด';
      msg += `${i + 1}. <b>${t.title}</b> (${overTxt})\n`;
    });
  }
  msg += `──────────────────────\n`;
  msg += `📊 <b>สถิติภาพรวม:</b> รอดำเนินการ ${pendingCount} งาน | กำลังดำเนินการ ${inProgressCount} งาน | เสร็จแล้ว ${completedCount} งาน`;
  return msg;
}

/**
 * ============================================================================
 * BUILT-IN PRE-FLIGHT SELF-TEST SUITE (UI & CLI Executable)
 * ============================================================================
 */
function runBuiltInSelfTest() {
  const startTime = Date.now();
  const results = [];

  // TEST 1: Data Schema & Dropdowns (23 Categories & 27 Schools)
  try {
    const has23Categories = CATEGORIES.length === 23;
    const hasFirstAndLastCat =
      CATEGORIES[0] === '01. งาน Network Administrator' &&
      CATEGORIES[22] === '99. งานอื่นๆ ที่ได้รับมอบหมาย';
    const has27Schools = TARGET_SCHOOLS.length === 27;
    const hasFirstAndLastSchool =
      TARGET_SCHOOLS[0] === '93012001 - พัทลุง' &&
      TARGET_SCHOOLS[26] === '93012028 - อุดมวิทยายน';
    const has5TaskTypes = TASK_TYPES.length === 5;
    const has4Statuses = STATUSES.length === 4;

    const passed =
      has23Categories &&
      hasFirstAndLastCat &&
      has27Schools &&
      hasFirstAndLastSchool &&
      has5TaskTypes &&
      has4Statuses;

    results.push({
      id: 'TEST-1',
      name: 'Test 1: ตรวจสอบโครงสร้างข้อมูล หมวดหมู่ 23 รายการ และโรงเรียน 27 แห่ง',
      passed,
      details: passed
        ? `ผ่านครบถ้วน: ประเภทงาน ${TASK_TYPES.length} รายการ, หมวดหมู่ ${CATEGORIES.length} รายการ (01-99), โรงเรียนในสังกัด ${TARGET_SCHOOLS.length} โรงเรียน (93012001 - 93012028), กลุ่มงาน ${TARGET_GROUPS_OVERVIEW.length} กลุ่ม`
        : `ข้อมูลไม่ตรงตามเกณฑ์: Categories=${CATEGORIES.length}, Schools=${TARGET_SCHOOLS.length}`
    });
  } catch (err) {
    results.push({
      id: 'TEST-1',
      name: 'Test 1: ตรวจสอบโครงสร้างข้อมูล หมวดหมู่ 23 รายการ และโรงเรียน 27 แห่ง',
      passed: false,
      details: err.message
    });
  }

  // TEST 2: Date & Remaining Days Logic
  try {
    const refDate = '2026-11-09';
    const overdueDays = calculateRemainingDays('2026-11-06', refDate); // -3
    const todayDays = calculateRemainingDays('2026-11-09', refDate); // 0
    const urgentDays = calculateRemainingDays('2026-11-11', refDate); // 2
    const normalDays = calculateRemainingDays('2026-11-19', refDate); // 10

    const badgeOverdue = getRemainingDaysBadgeInfo(overdueDays, 'กำลังดำเนินการ');
    const badgeToday = getRemainingDaysBadgeInfo(todayDays, 'รอดำเนินการ');
    const badgeUrgent = getRemainingDaysBadgeInfo(urgentDays, 'รอดำเนินการ');
    const badgeNormal = getRemainingDaysBadgeInfo(normalDays, 'รอดำเนินการ');
    const badgeDone = getRemainingDaysBadgeInfo(-5, 'เสร็จแล้ว');

    const passed =
      overdueDays === -3 &&
      badgeOverdue.label === 'เลยกำหนด 3 วัน' &&
      todayDays === 0 &&
      badgeToday.label === 'ครบกำหนดวันนี้!' &&
      urgentDays === 2 &&
      badgeUrgent.label === 'เหลือ 2 วัน (เร่งด่วน)' &&
      normalDays === 10 &&
      badgeNormal.label === 'เหลือ 10 วัน' &&
      badgeDone.label === 'เสร็จสมบูรณ์';

    results.push({
      id: 'TEST-2',
      name: 'Test 2: ตรวจสอบการคำนวณวันคงเหลือและป้ายสถานะ (Overdue / Today / Urgent / Normal / Done)',
      passed,
      details: passed
        ? `คำนวณแม่นยำ 100%: "${badgeOverdue.label}", "${badgeToday.label}", "${badgeUrgent.label}", "${badgeNormal.label}", และ "${badgeDone.label}"`
        : 'ผลการคำนวณวันคงเหลือหรือข้อความ Badge ไม่ถูกต้อง'
    });
  } catch (err) {
    results.push({
      id: 'TEST-2',
      name: 'Test 2: ตรวจสอบการคำนวณวันคงเหลือและป้ายสถานะ',
      passed: false,
      details: err.message
    });
  }

  // TEST 3: Isolated CRUD & Filtering Simulation (Does not corrupt user data)
  try {
    const sandboxTasks = getInitialMockTasks('2026-11-09');
    const initialCount = sandboxTasks.length;

    // Create temp task
    const tempId = generateTaskId(sandboxTasks, '2026-11-09');
    const newTask = {
      id: tempId,
      taskType: 'งานแทรก/งานด่วน',
      category: '01. งาน Network Administrator',
      priority: 'ด่วนที่สุด',
      title: '[SELF-TEST] ทดสอบระบบเครือข่ายโรงเรียนพัทลุง',
      details: 'จำลองการเพิ่มงานอัตโนมัติ',
      targetGroup: ['93012001 - พัทลุง'],
      startDate: '2026-11-09',
      dueDate: '2026-11-10',
      remainingDays: calculateRemainingDays('2026-11-10', '2026-11-09'),
      status: 'รอดำเนินการ',
      remarks: 'ทดสอบระบบ',
      updatedAt: new Date().toISOString()
    };
    sandboxTasks.unshift(newTask);
    const afterCreateCount = sandboxTasks.length;

    // Update status
    const targetIdx = sandboxTasks.findIndex((t) => t.id === tempId);
    sandboxTasks[targetIdx].status = 'เสร็จแล้ว';
    const updatedStatus = sandboxTasks[targetIdx].status;

    // Filter by school code 93012001
    const filteredBySchool = sandboxTasks.filter(
      (t) => Array.isArray(t.targetGroup) && t.targetGroup.some((g) => g.includes('93012001'))
    );

    // Delete temp task
    const afterDelete = sandboxTasks.filter((t) => t.id !== tempId);

    const passed =
      afterCreateCount === initialCount + 1 &&
      updatedStatus === 'เสร็จแล้ว' &&
      filteredBySchool.length >= 1 &&
      afterDelete.length === initialCount;

    results.push({
      id: 'TEST-3',
      name: 'Test 3: จำลองการทำ CRUD (เพิ่ม/อัปเดตสถานะ/กรองโรงเรียน/ลบ) ในโหมด Sandbox',
      passed,
      details: passed
        ? `จำลองสร้างรหัส ${tempId} -> เปลี่ยนสถานะเป็น "${updatedStatus}" -> ค้นหาโรงเรียนรหัส 93012001 (${filteredBySchool.length} งาน) -> ลบคืนค่าเดิม (${afterDelete.length} งาน) โดยไม่กระทบข้อมูลจริง`
        : 'การจำลอง CRUD ใน Sandbox ล้มเหลว'
    });
  } catch (err) {
    results.push({
      id: 'TEST-3',
      name: 'Test 3: จำลองการทำ CRUD ในโหมด Sandbox',
      passed: false,
      details: err.message
    });
  }

  // TEST 4: API & Telegram Payload Readiness
  try {
    const sampleTasks = getInitialMockTasks('2026-11-09');
    const samplePostPayload = JSON.stringify({
      action: 'createTask',
      task: sampleTasks[0]
    });
    const parsedPayload = JSON.parse(samplePostPayload);
    const telegramHtml = buildClientTelegramDigestPreview(sampleTasks);

    const hasRequiredFields =
      parsedPayload.action === 'createTask' &&
      parsedPayload.task.id &&
      parsedPayload.task.taskType &&
      parsedPayload.task.category &&
      Array.isArray(parsedPayload.task.targetGroup);

    const hasTelegramSections =
      telegramHtml.includes('สรุปภารกิจประจำวัน') &&
      telegramHtml.includes('งานด่วนที่สุด / ครบกำหนดภายใน 3 วัน') &&
      telegramHtml.includes('งานคงค้าง / เลยกำหนดส่ง') &&
      telegramHtml.includes('สถิติภาพรวม');

    const passed = hasRequiredFields && hasTelegramSections;

    results.push({
      id: 'TEST-4',
      name: 'Test 4: ตรวจสอบโครงสร้าง JSON Payload (GAS CORS text/plain) และรูปแบบข้อความ Telegram HTML',
      passed,
      details: passed
        ? `JSON Payload พร้อมส่งผ่าน POST (text/plain) และสร้างข้อความแจ้งเตือน Telegram 07:30 น. ครบทั้ง 3 หมวดหลัก (${telegramHtml.length} ตัวอักษร)`
        : 'โครงสร้าง JSON หรือรูปแบบข้อความ Telegram ไม่สมบูรณ์'
    });
  } catch (err) {
    results.push({
      id: 'TEST-4',
      name: 'Test 4: ตรวจสอบโครงสร้าง JSON Payload และข้อความ Telegram',
      passed: false,
      details: err.message
    });
  }

  const allPassed = results.every((r) => r.passed);
  const durationMs = Date.now() - startTime;

  return {
    allPassed,
    passedCount: results.filter((r) => r.passed).length,
    totalCount: results.length,
    durationMs,
    timestamp: new Date().toISOString(),
    results
  };
}

/**
 * ============================================================================
 * FRONTEND UI CONTROLLER (Browser Only)
 * ============================================================================
 */
const AppState = {
  tasks: [],
  config: {
    gasWebAppUrl: '',
    telegramBotToken: '',
    telegramChatId: '',
    morningAlertTime: '07:30'
  },
  filters: {
    search: '',
    taskType: 'ALL',
    category: 'ALL',
    priority: 'ALL',
    status: 'ALL',
    targetGroup: 'ALL',
    kpiFilter: 'ALL' // ALL | URGENT | IN_PROGRESS | OVERDUE
  },
  viewMode: 'table', // table | grid | kanban
  analyticsOpen: false,
  selectedTargetsInModal: [],
  editingTaskId: null,
  statusChartInstance: null,
  categoryChartInstance: null,
  isSyncing: false
};

function isBrowserEnv() {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

function loadStateFromStorage() {
  if (!isBrowserEnv()) return;

  try {
    const savedConfig = localStorage.getItem(STORAGE_KEYS.CONFIG);
    if (savedConfig) {
      AppState.config = { ...AppState.config, ...JSON.parse(savedConfig) };
    }

    const savedTasks = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (savedTasks) {
      const parsed = JSON.parse(savedTasks);
      if (Array.isArray(parsed) && parsed.length > 0) {
        AppState.tasks = parsed.map((t) => ({
          ...t,
          targetGroup: Array.isArray(t.targetGroup)
            ? t.targetGroup
            : t.targetGroup
            ? [String(t.targetGroup)]
            : [],
          remainingDays: calculateRemainingDays(t.dueDate)
        }));
      } else {
        AppState.tasks = getInitialMockTasks();
        saveTasksToStorage();
      }
    } else {
      AppState.tasks = getInitialMockTasks();
      saveTasksToStorage();
    }

    // Default responsive view mode: Card Grid on mobile (<768px), Table on Desktop
    const savedView = localStorage.getItem(STORAGE_KEYS.VIEW_MODE);
    if (savedView) {
      AppState.viewMode = savedView;
    } else {
      AppState.viewMode = window.innerWidth < 768 ? 'grid' : 'table';
    }

    const savedAnalytics = localStorage.getItem(STORAGE_KEYS.ANALYTICS_OPEN);
    AppState.analyticsOpen = savedAnalytics === 'true';
  } catch (err) {
    console.error('Error loading state from localStorage:', err);
    AppState.tasks = getInitialMockTasks();
  }
}

function saveTasksToStorage() {
  if (!isBrowserEnv()) return;
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(AppState.tasks));
}

function saveConfigToStorage() {
  if (!isBrowserEnv()) return;
  localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(AppState.config));
}

function escapeHtml(str) {
  if (str === undefined || str === null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function linkifyRemarks(text) {
  if (!text) return '<span class="text-slate-400">-</span>';
  const escaped = escapeHtml(text);
  const urlRegex = /(https?:\/\/[^\s<]+)/g;
  return escaped.replace(
    urlRegex,
    '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-indigo-600 hover:text-indigo-800 underline font-medium inline-flex items-center gap-1 break-all">$1</a>'
  );
}

function getPriorityBadgeHtml(priority) {
  if (priority === 'ด่วนที่สุด') {
    return `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
      <span class="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
      <span class="w-2 h-2 rounded-full bg-rose-600 -ml-3.5"></span>
      ด่วนที่สุด
    </span>`;
  }
  if (priority === 'ด่วน') {
    return `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
      <i data-lucide="zap" class="w-3 h-3"></i> ด่วน
    </span>`;
  }
  return `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
    ปกติ
  </span>`;
}

function getStatusBadgeHtml(status) {
  switch (status) {
    case 'เสร็จแล้ว':
      return `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <i data-lucide="check-circle" class="w-3.5 h-3.5"></i> เสร็จแล้ว
      </span>`;
    case 'กำลังดำเนินการ':
      return `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
        <i data-lucide="loader" class="w-3.5 h-3.5"></i> กำลังดำเนินการ
      </span>`;
    case 'ไม่เสร็จตามที่กำหนด':
      return `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
        <i data-lucide="x-circle" class="w-3.5 h-3.5"></i> ไม่เสร็จตามที่กำหนด
      </span>`;
    default:
      return `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
        <i data-lucide="clock" class="w-3.5 h-3.5"></i> รอดำเนินการ
      </span>`;
  }
}

function getTaskTypeBadgeHtml(taskType) {
  const colorMap = {
    'โครงการ/กิจกรรม': 'bg-violet-50 text-violet-700 border-violet-200',
    'งานประจำ': 'bg-sky-50 text-sky-700 border-sky-200',
    'งานอีเว้นท์': 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200',
    'งานนอก': 'bg-teal-50 text-teal-700 border-teal-200',
    'งานแทรก/งานด่วน': 'bg-rose-50 text-rose-700 border-rose-200'
  };
  const cls = colorMap[taskType] || 'bg-slate-100 text-slate-700 border-slate-200';
  return `<span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${cls}">${escapeHtml(taskType)}</span>`;
}

/**
 * KPI Classification Helpers
 */
function isTaskUrgentKpi(task) {
  const rem = calculateRemainingDays(task.dueDate);
  return task.status !== 'เสร็จแล้ว' && (task.priority === 'ด่วนที่สุด' || rem <= 3);
}

function isTaskOverdueKpi(task) {
  const rem = calculateRemainingDays(task.dueDate);
  return task.status !== 'เสร็จแล้ว' && (rem < 0 || task.status === 'ไม่เสร็จตามที่กำหนด');
}

function getFilteredTasks() {
  const { search, taskType, category, priority, status, targetGroup, kpiFilter } = AppState.filters;
  const q = (search || '').trim().toLowerCase();

  return AppState.tasks
    .map((t) => ({
      ...t,
      remainingDays: calculateRemainingDays(t.dueDate)
    }))
    .filter((task) => {
      // KPI Card Filter
      if (kpiFilter === 'URGENT' && !isTaskUrgentKpi(task)) return false;
      if (kpiFilter === 'IN_PROGRESS' && task.status !== 'กำลังดำเนินการ') return false;
      if (kpiFilter === 'OVERDUE' && !isTaskOverdueKpi(task)) return false;

      // Dropdown Filters
      if (taskType !== 'ALL' && task.taskType !== taskType) return false;
      if (category !== 'ALL' && task.category !== category) return false;
      if (priority !== 'ALL' && task.priority !== priority) return false;
      if (status !== 'ALL' && task.status !== status) return false;
      if (targetGroup !== 'ALL') {
        const targets = Array.isArray(task.targetGroup) ? task.targetGroup : [String(task.targetGroup || '')];
        const hasMatch = targets.some(
          (tg) => tg === targetGroup || tg.includes(targetGroup)
        );
        if (!hasMatch) return false;
      }

      // Search Query
      if (q) {
        const targetsStr = Array.isArray(task.targetGroup) ? task.targetGroup.join(' ') : String(task.targetGroup || '');
        const haystack = [
          task.id,
          task.title,
          task.details,
          task.category,
          task.taskType,
          task.remarks,
          targetsStr
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      return true;
    })
    .sort((a, b) => {
      // Incomplete tasks first, sorted by remainingDays ascending
      const aDone = a.status === 'เสร็จแล้ว' ? 1 : 0;
      const bDone = b.status === 'เสร็จแล้ว' ? 1 : 0;
      if (aDone !== bDone) return aDone - bDone;
      return a.remainingDays - b.remainingDays;
    });
}

/**
 * ============================================================================
 * UI RENDERING FUNCTIONS
 * ============================================================================
 */
function renderConnectionBadge() {
  const badgeEl = document.getElementById('connectionStatusBadge');
  if (!badgeEl) return;

  const hasGasUrl = Boolean(AppState.config.gasWebAppUrl && AppState.config.gasWebAppUrl.startsWith('https://'));
  if (hasGasUrl) {
    badgeEl.className =
      'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200';
    badgeEl.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> เชื่อมต่อ Google Sheets แล้ว`;
  } else {
    badgeEl.className =
      'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200';
    badgeEl.innerHTML = `<span class="w-2 h-2 rounded-full bg-amber-500"></span> โหมดจำลองข้อมูลในเครื่อง (Local Demo Cache)`;
  }
}

function renderKpiCards() {
  const totalCount = AppState.tasks.length;
  const urgentCount = AppState.tasks.filter(isTaskUrgentKpi).length;
  const inProgressCount = AppState.tasks.filter((t) => t.status === 'กำลังดำเนินการ').length;
  const overdueCount = AppState.tasks.filter(isTaskOverdueKpi).length;

  const elTotal = document.getElementById('kpiTotalCount');
  const elUrgent = document.getElementById('kpiUrgentCount');
  const elInProgress = document.getElementById('kpiInProgressCount');
  const elOverdue = document.getElementById('kpiOverdueCount');

  if (elTotal) elTotal.textContent = totalCount;
  if (elUrgent) elUrgent.textContent = urgentCount;
  if (elInProgress) elInProgress.textContent = inProgressCount;
  if (elOverdue) elOverdue.textContent = overdueCount;

  // Highlight active KPI card
  const kpiCards = {
    ALL: document.getElementById('kpiCardAll'),
    URGENT: document.getElementById('kpiCardUrgent'),
    IN_PROGRESS: document.getElementById('kpiCardInProgress'),
    OVERDUE: document.getElementById('kpiCardOverdue')
  };

  Object.keys(kpiCards).forEach((key) => {
    const card = kpiCards[key];
    if (!card) return;
    if (AppState.filters.kpiFilter === key) {
      card.classList.add('ring-2', 'ring-indigo-600', 'shadow-md');
    } else {
      card.classList.remove('ring-2', 'ring-indigo-600', 'shadow-md');
    }
  });
}

function renderPriorityFocusZone() {
  const container = document.getElementById('priorityFocusList');
  const countBadge = document.getElementById('priorityFocusCount');
  if (!container) return;

  const focusTasks = AppState.tasks
    .map((t) => ({ ...t, remainingDays: calculateRemainingDays(t.dueDate) }))
    .filter((t) => t.status !== 'เสร็จแล้ว' && (t.remainingDays <= 3 || t.priority === 'ด่วนที่สุด' || t.status === 'ไม่เสร็จตามที่กำหนด'))
    .sort((a, b) => a.remainingDays - b.remainingDays);

  if (countBadge) {
    countBadge.textContent = `${focusTasks.length} รายการเร่งด่วน`;
  }

  if (focusTasks.length === 0) {
    container.innerHTML = `
      <div class="col-span-full bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 flex items-center gap-3 text-emerald-800">
        <i data-lucide="check-circle-2" class="w-5 h-5 text-emerald-600 shrink-0"></i>
        <span class="text-sm font-medium">ยอดเยี่ยม! วันนี้ไม่มีงานค้างหรือภารกิจเร่งด่วนในระยะ 3 วัน</span>
      </div>
    `;
    return;
  }

  container.innerHTML = focusTasks
    .slice(0, 4)
    .map((task) => {
      const remBadge = getRemainingDaysBadgeInfo(task.remainingDays, task.status);
      const isOverdue = task.remainingDays < 0 || task.status === 'ไม่เสร็จตามที่กำหนด';
      const borderCls = isOverdue
        ? 'border-l-4 border-l-rose-500 border-rose-200 bg-rose-50/30'
        : 'border-l-4 border-l-amber-500 border-amber-200 bg-amber-50/30';
      const targets = Array.isArray(task.targetGroup) ? task.targetGroup : [task.targetGroup];

      return `
        <div class="rounded-xl border ${borderCls} bg-white p-3.5 shadow-sm hover:shadow-md transition flex flex-col justify-between gap-2">
          <div>
            <div class="flex items-center justify-between gap-2 mb-1.5">
              ${getPriorityBadgeHtml(task.priority)}
              <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border ${remBadge.className}">
                ${escapeHtml(remBadge.label)}
              </span>
            </div>
            <h4 class="font-semibold text-slate-800 text-sm line-clamp-1" title="${escapeHtml(task.title)}">
              ${escapeHtml(task.title)}
            </h4>
            <p class="text-xs text-slate-500 mt-0.5 line-clamp-1">${escapeHtml(task.category)}</p>
          </div>
          <div class="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
            <span class="text-slate-600 truncate max-w-[65%]" title="${escapeHtml(targets.join(', '))}">
              🎯 ${escapeHtml(targets[0] || '-')}${targets.length > 1 ? ` +${targets.length - 1}` : ''}
            </span>
            <div class="flex items-center gap-1">
              <button onclick="quickCompleteTask('${escapeHtml(task.id)}')" class="px-2 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition" title="ทำเครื่องหมายว่าเสร็จแล้ว">
                เสร็จแล้ว
              </button>
              <button onclick="openEditTaskModal('${escapeHtml(task.id)}')" class="p-1 rounded-md text-slate-500 hover:bg-slate-100" title="แก้ไข">
                <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    })
    .join('');
}

function renderTargetTagsHtml(targetGroup, maxVisible = 2) {
  const targets = Array.isArray(targetGroup)
    ? targetGroup
    : targetGroup
    ? [String(targetGroup)]
    : [];

  if (targets.length === 0) return '<span class="text-xs text-slate-400">-</span>';

  const visible = targets.slice(0, maxVisible);
  const extra = targets.length - visible.length;

  return `
    <div class="flex flex-wrap gap-1">
      ${visible
        .map(
          (t) =>
            `<span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-indigo-50 text-indigo-700 border border-indigo-100 max-w-[210px] truncate" title="${escapeHtml(t)}">${escapeHtml(t)}</span>`
        )
        .join('')}
      ${
        extra > 0
          ? `<span class="inline-flex items-center px-1.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200" title="${escapeHtml(targets.join(', '))}">+${extra} แห่ง</span>`
          : ''
      }
    </div>
  `;
}

function renderTasksTableView(filteredTasks) {
  const tbody = document.getElementById('tasksTableBody');
  if (!tbody) return;

  if (filteredTasks.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="9" class="py-12 text-center text-slate-500">
          <div class="flex flex-col items-center justify-center gap-2">
            <i data-lucide="inbox" class="w-10 h-10 text-slate-300"></i>
            <p class="font-medium text-slate-600">ไม่พบรายการงานที่ตรงกับเงื่อนไขการค้นหา</p>
            <button onclick="resetAllFilters()" class="mt-1 text-xs text-indigo-600 hover:underline font-medium">ล้างตัวกรองทั้งหมด</button>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filteredTasks
    .map((task) => {
      const remBadge = getRemainingDaysBadgeInfo(task.remainingDays, task.status);
      const isOverdueRow =
        task.status !== 'เสร็จแล้ว' &&
        (task.remainingDays < 0 || task.status === 'ไม่เสร็จตามที่กำหนด');

      const rowBg = isOverdueRow
        ? 'bg-rose-50/40 hover:bg-rose-50/80'
        : task.status === 'เสร็จแล้ว'
        ? 'bg-emerald-50/20 hover:bg-slate-50/80 opacity-85'
        : 'hover:bg-slate-50/90';

      return `
        <tr class="border-b border-slate-100 transition ${rowBg}">
          <td class="py-3.5 px-4 align-top whitespace-nowrap">
            <div class="text-xs font-mono text-slate-400 mb-1">${escapeHtml(task.id)}</div>
            ${getTaskTypeBadgeHtml(task.taskType)}
          </td>
          <td class="py-3.5 px-4 align-top max-w-xs">
            <div class="font-semibold text-slate-800 text-sm mb-0.5">${escapeHtml(task.title)}</div>
            <div class="text-xs text-indigo-600 font-medium mb-1">${escapeHtml(task.category)}</div>
            ${
              task.details
                ? `<div class="text-xs text-slate-500 line-clamp-2 whitespace-pre-line" title="${escapeHtml(task.details)}">${escapeHtml(task.details)}</div>`
                : ''
            }
          </td>
          <td class="py-3.5 px-4 align-top whitespace-nowrap">
            ${getPriorityBadgeHtml(task.priority)}
          </td>
          <td class="py-3.5 px-4 align-top max-w-[230px]">
            ${renderTargetTagsHtml(task.targetGroup, 2)}
          </td>
          <td class="py-3.5 px-4 align-top whitespace-nowrap text-xs text-slate-600">
            <div><span class="text-slate-400">เริ่ม:</span> ${formatThaiShortDate(task.startDate)}</div>
            <div class="font-semibold text-slate-800 mt-0.5"><span class="text-slate-400 font-normal">ส่ง:</span> ${formatThaiShortDate(task.dueDate)}</div>
          </td>
          <td class="py-3.5 px-4 align-top whitespace-nowrap">
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border ${remBadge.className}">
              <i data-lucide="${remBadge.icon}" class="w-3.5 h-3.5"></i>
              ${escapeHtml(remBadge.label)}
            </span>
          </td>
          <td class="py-3.5 px-4 align-top whitespace-nowrap">
            <select
              onchange="handleQuickStatusChange('${escapeHtml(task.id)}', this.value)"
              class="text-xs font-medium rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              ${STATUSES.map(
                (st) =>
                  `<option value="${escapeHtml(st)}" ${task.status === st ? 'selected' : ''}>${escapeHtml(st)}</option>`
              ).join('')}
            </select>
          </td>
          <td class="py-3.5 px-4 align-top max-w-[180px] text-xs text-slate-600">
            <div class="line-clamp-2">${linkifyRemarks(task.remarks)}</div>
          </td>
          <td class="py-3.5 px-4 align-top whitespace-nowrap text-right">
            <div class="inline-flex items-center gap-1">
              <button
                onclick="openEditTaskModal('${escapeHtml(task.id)}')"
                class="p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition"
                title="แก้ไขงาน"
              >
                <i data-lucide="edit" class="w-4 h-4"></i>
              </button>
              <button
                onclick="confirmDeleteTask('${escapeHtml(task.id)}')"
                class="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
                title="ลบงาน"
              >
                <i data-lucide="trash-2" class="w-4 h-4"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    })
    .join('');
}

function renderTasksGridView(filteredTasks) {
  const grid = document.getElementById('tasksCardGrid');
  if (!grid) return;

  if (filteredTasks.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full bg-white rounded-2xl border border-slate-200 p-10 text-center text-slate-500">
        <i data-lucide="inbox" class="w-10 h-10 text-slate-300 mx-auto mb-2"></i>
        <p class="font-medium text-slate-600">ไม่พบรายการงานที่ตรงกับตัวกรอง</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filteredTasks
    .map((task) => {
      const remBadge = getRemainingDaysBadgeInfo(task.remainingDays, task.status);
      const isOverdue =
        task.status !== 'เสร็จแล้ว' &&
        (task.remainingDays < 0 || task.status === 'ไม่เสร็จตามที่กำหนด');

      const cardBorder = isOverdue
        ? 'border-rose-300 ring-1 ring-rose-200 bg-rose-50/20'
        : 'border-slate-200 bg-white';

      return `
        <div class="rounded-2xl border ${cardBorder} p-4 shadow-sm hover:shadow-md transition flex flex-col justify-between gap-3">
          <div>
            <div class="flex items-center justify-between gap-2 mb-2">
              ${getTaskTypeBadgeHtml(task.taskType)}
              ${getPriorityBadgeHtml(task.priority)}
            </div>
            <h3 class="font-semibold text-slate-800 text-base leading-snug mb-1">${escapeHtml(task.title)}</h3>
            <p class="text-xs font-medium text-indigo-600 mb-2">${escapeHtml(task.category)}</p>
            ${
              task.details
                ? `<p class="text-xs text-slate-600 bg-slate-50 rounded-lg p-2.5 border border-slate-100 whitespace-pre-line line-clamp-3 mb-2.5">${escapeHtml(task.details)}</p>`
                : ''
            }
            <div class="mb-2.5">
              <div class="text-[11px] font-medium text-slate-400 mb-1">กลุ่มงาน / โรงเรียนเป้าหมาย:</div>
              ${renderTargetTagsHtml(task.targetGroup, 3)}
            </div>
          </div>

          <div class="pt-3 border-t border-slate-100 space-y-2.5">
            <div class="flex items-center justify-between text-xs">
              <span class="text-slate-500">กำหนดส่ง: <strong class="text-slate-800">${formatThaiShortDate(task.dueDate)}</strong></span>
              <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs border ${remBadge.className}">
                <i data-lucide="${remBadge.icon}" class="w-3 h-3"></i>
                ${escapeHtml(remBadge.label)}
              </span>
            </div>

            ${
              task.remarks
                ? `<div class="text-xs text-slate-500 truncate">💬 ${linkifyRemarks(task.remarks)}</div>`
                : ''
            }

            <div class="flex items-center justify-between gap-2 pt-1">
              <select
                onchange="handleQuickStatusChange('${escapeHtml(task.id)}', this.value)"
                class="flex-1 text-xs font-medium rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                ${STATUSES.map(
                  (st) =>
                    `<option value="${escapeHtml(st)}" ${task.status === st ? 'selected' : ''}>${escapeHtml(st)}</option>`
                ).join('')}
              </select>
              <div class="inline-flex items-center gap-1">
                <button
                  onclick="openEditTaskModal('${escapeHtml(task.id)}')"
                  class="p-2 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200"
                  title="แก้ไข"
                >
                  <i data-lucide="edit-3" class="w-4 h-4"></i>
                </button>
                <button
                  onclick="confirmDeleteTask('${escapeHtml(task.id)}')"
                  class="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200"
                  title="ลบ"
                >
                  <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    })
    .join('');
}

function renderTasksKanbanView(filteredTasks) {
  const board = document.getElementById('tasksKanbanBoard');
  if (!board) return;

  const columnConfig = [
    { status: 'รอดำเนินการ', headerBg: 'bg-amber-50 border-amber-200 text-amber-800', dot: 'bg-amber-500' },
    { status: 'กำลังดำเนินการ', headerBg: 'bg-indigo-50 border-indigo-200 text-indigo-800', dot: 'bg-indigo-500' },
    { status: 'เสร็จแล้ว', headerBg: 'bg-emerald-50 border-emerald-200 text-emerald-800', dot: 'bg-emerald-500' },
    { status: 'ไม่เสร็จตามที่กำหนด', headerBg: 'bg-rose-50 border-rose-200 text-rose-800', dot: 'bg-rose-500' }
  ];

  board.innerHTML = columnConfig
    .map((col) => {
      const colTasks = filteredTasks.filter((t) => t.status === col.status);
      return `
        <div class="bg-slate-100/80 rounded-2xl p-3 border border-slate-200 flex flex-col min-h-[380px]">
          <div class="flex items-center justify-between px-3 py-2 rounded-xl border ${col.headerBg} mb-3">
            <div class="flex items-center gap-2 font-semibold text-sm">
              <span class="w-2.5 h-2.5 rounded-full ${col.dot}"></span>
              ${escapeHtml(col.status)}
            </div>
            <span class="px-2 py-0.5 text-xs font-bold rounded-full bg-white/80">${colTasks.length}</span>
          </div>

          <div class="space-y-2.5 flex-1">
            ${
              colTasks.length === 0
                ? `<div class="text-center py-10 text-xs text-slate-400">ไม่มีรายการในสถานะนี้</div>`
                : colTasks
                    .map((task) => {
                      const remBadge = getRemainingDaysBadgeInfo(task.remainingDays, task.status);
                      return `
                        <div class="bg-white rounded-xl p-3 border border-slate-200 shadow-sm hover:shadow transition space-y-2">
                          <div class="flex items-center justify-between gap-1">
                            ${getPriorityBadgeHtml(task.priority)}
                            <span class="text-[11px] px-2 py-0.5 rounded-full border ${remBadge.className}">${escapeHtml(remBadge.label)}</span>
                          </div>
                          <h4 class="font-semibold text-slate-800 text-sm leading-snug">${escapeHtml(task.title)}</h4>
                          <p class="text-[11px] text-indigo-600 font-medium">${escapeHtml(task.category)}</p>
                          ${renderTargetTagsHtml(task.targetGroup, 1)}
                          <div class="flex items-center justify-between pt-2 border-t border-slate-100">
                            <span class="text-[11px] text-slate-500">ส่ง: ${formatThaiShortDate(task.dueDate)}</span>
                            <div class="flex items-center gap-1">
                              <button onclick="openEditTaskModal('${escapeHtml(task.id)}')" class="p-1 text-slate-500 hover:text-indigo-600" title="แก้ไข">
                                <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
                              </button>
                              <button onclick="confirmDeleteTask('${escapeHtml(task.id)}')" class="p-1 text-slate-400 hover:text-rose-600" title="ลบ">
                                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      `;
                    })
                    .join('')
            }
          </div>
        </div>
      `;
    })
    .join('');
}

function renderAnalyticsCharts() {
  if (!isBrowserEnv() || typeof Chart === 'undefined') return;
  const statusCanvas = document.getElementById('statusDoughnutChart');
  const categoryCanvas = document.getElementById('categoryBarChart');
  if (!statusCanvas || !categoryCanvas) return;

  // 1. Doughnut Chart by Status
  const statusCounts = STATUSES.map(
    (st) => AppState.tasks.filter((t) => t.status === st).length
  );

  if (AppState.statusChartInstance) {
    AppState.statusChartInstance.destroy();
  }

  AppState.statusChartInstance = new Chart(statusCanvas, {
    type: 'doughnut',
    data: {
      labels: STATUSES,
      datasets: [
        {
          data: statusCounts,
          backgroundColor: ['#F59E0B', '#4F46E5', '#10B981', '#F43F5E'],
          borderWidth: 2,
          borderColor: '#FFFFFF'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { font: { family: 'Prompt, sans-serif', size: 12 } }
        }
      }
    }
  });

  // 2. Bar Chart by Task Type
  const typeCounts = TASK_TYPES.map(
    (tp) => AppState.tasks.filter((t) => t.taskType === tp).length
  );

  if (AppState.categoryChartInstance) {
    AppState.categoryChartInstance.destroy();
  }

  AppState.categoryChartInstance = new Chart(categoryCanvas, {
    type: 'bar',
    data: {
      labels: TASK_TYPES,
      datasets: [
        {
          label: 'จำนวนงาน (รายการ)',
          data: typeCounts,
          backgroundColor: ['#8B5CF6', '#0EA5E9', '#EC4899', '#14B8A6', '#F43F5E'],
          borderRadius: 8
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { beginAtZero: true, ticks: { stepSize: 1 } }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
}

function renderAll() {
  if (!isBrowserEnv()) return;

  renderConnectionBadge();
  renderKpiCards();
  renderPriorityFocusZone();

  const filteredTasks = getFilteredTasks();
  const countEl = document.getElementById('filteredTaskCountLabel');
  if (countEl) {
    countEl.textContent = `แสดง ${filteredTasks.length} จากทั้งหมด ${AppState.tasks.length} งาน`;
  }

  // Toggle active view containers
  const tableWrapper = document.getElementById('tableViewContainer');
  const gridWrapper = document.getElementById('gridViewContainer');
  const kanbanWrapper = document.getElementById('kanbanViewContainer');

  if (tableWrapper) tableWrapper.classList.toggle('hidden', AppState.viewMode !== 'table');
  if (gridWrapper) gridWrapper.classList.toggle('hidden', AppState.viewMode !== 'grid');
  if (kanbanWrapper) kanbanWrapper.classList.toggle('hidden', AppState.viewMode !== 'kanban');

  // Update View Switcher button styles
  ['table', 'grid', 'kanban'].forEach((mode) => {
    const btn = document.getElementById(`viewBtn_${mode}`);
    if (!btn) return;
    if (AppState.viewMode === mode) {
      btn.className =
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white shadow-sm transition';
    } else {
      btn.className =
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition';
    }
  });

  if (AppState.viewMode === 'table') {
    renderTasksTableView(filteredTasks);
  } else if (AppState.viewMode === 'grid') {
    renderTasksGridView(filteredTasks);
  } else {
    renderTasksKanbanView(filteredTasks);
  }

  if (AppState.analyticsOpen) {
    renderAnalyticsCharts();
  }

  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

/**
 * ============================================================================
 * INTERACTIVE ACTIONS, FILTERS & MODALS
 * ============================================================================
 */
function populateDropdownsAndFilters() {
  if (!isBrowserEnv()) return;

  // Filter bar dropdowns
  const filterType = document.getElementById('filterTaskType');
  const filterCat = document.getElementById('filterCategory');
  const filterPrio = document.getElementById('filterPriority');
  const filterStat = document.getElementById('filterStatus');
  const filterTarget = document.getElementById('filterTargetGroup');

  if (filterType) {
    filterType.innerHTML =
      `<option value="ALL">ทุกประเภทงาน (${TASK_TYPES.length})</option>` +
      TASK_TYPES.map((t) => `<option value="${escapeHtml(t)}">${escapeHtml(t)}</option>`).join('');
  }
  if (filterCat) {
    filterCat.innerHTML =
      `<option value="ALL">ทุกหมวดหมู่เรื่อง (${CATEGORIES.length})</option>` +
      CATEGORIES.map((c) => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join('');
  }
  if (filterPrio) {
    filterPrio.innerHTML =
      `<option value="ALL">ทุกชั้นความเร็ว</option>` +
      PRIORITIES.map((p) => `<option value="${escapeHtml(p)}">${escapeHtml(p)}</option>`).join('');
  }
  if (filterStat) {
    filterStat.innerHTML =
      `<option value="ALL">ทุกสถานะงาน</option>` +
      STATUSES.map((s) => `<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`).join('');
  }
  if (filterTarget) {
    filterTarget.innerHTML =
      `<option value="ALL">ทุกกลุ่มงาน / โรงเรียน (27 แห่ง)</option>` +
      `<optgroup label="กลุ่มงาน / ภาพรวม สพม.พัทลุง">` +
      TARGET_GROUPS_OVERVIEW.map((g) => `<option value="${escapeHtml(g)}">${escapeHtml(g)}</option>`).join('') +
      `</optgroup>` +
      `<optgroup label="โรงเรียนในสังกัด 27 โรงเรียน">` +
      TARGET_SCHOOLS.map((s) => `<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`).join('') +
      `</optgroup>`;
  }

  // Modal form dropdowns
  const modalTaskType = document.getElementById('modalTaskType');
  const modalCategory = document.getElementById('modalCategory');
  const modalPriority = document.getElementById('modalPriority');
  const modalStatus = document.getElementById('modalStatus');

  if (modalTaskType) {
    modalTaskType.innerHTML = TASK_TYPES.map(
      (t) => `<option value="${escapeHtml(t)}">${escapeHtml(t)}</option>`
    ).join('');
  }
  if (modalCategory) {
    modalCategory.innerHTML = CATEGORIES.map(
      (c) => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`
    ).join('');
  }
  if (modalPriority) {
    modalPriority.innerHTML = PRIORITIES.map(
      (p) => `<option value="${escapeHtml(p)}">${escapeHtml(p)}</option>`
    ).join('');
  }
  if (modalStatus) {
    modalStatus.innerHTML = STATUSES.map(
      (s) => `<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`
    ).join('');
  }

  renderTargetPickerOptions('');
}

function filterModalCategoryDropdown(searchVal) {
  const modalCategory = document.getElementById('modalCategory');
  if (!modalCategory) return;
  const q = (searchVal || '').trim().toLowerCase();
  const currentSelected = modalCategory.value;

  const matched = CATEGORIES.filter((c) => c.toLowerCase().includes(q));
  const listToRender = matched.length > 0 ? matched : CATEGORIES;

  modalCategory.innerHTML = listToRender
    .map((c) => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`)
    .join('');

  if (listToRender.includes(currentSelected)) {
    modalCategory.value = currentSelected;
  }
}

function renderTargetPickerOptions(query) {
  const listEl = document.getElementById('targetComboboxList');
  if (!listEl) return;
  const q = (query || '').trim().toLowerCase();

  const matchedOverview = TARGET_GROUPS_OVERVIEW.filter((g) => g.toLowerCase().includes(q));
  const matchedSchools = TARGET_SCHOOLS.filter((s) => s.toLowerCase().includes(q));

  let html = '';

  if (matchedOverview.length > 0) {
    html += `<div class="px-2.5 py-1 text-[11px] font-bold text-slate-400 uppercase bg-slate-50">กลุ่มงาน / ภาพรวม สพม.พัทลุง</div>`;
    matchedOverview.forEach((item) => {
      const isSelected = AppState.selectedTargetsInModal.includes(item);
      html += `
        <button type="button" onclick="toggleTargetSelection('${escapeHtml(item)}')"
          class="w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-indigo-50 transition ${
            isSelected ? 'bg-indigo-50/80 font-semibold text-indigo-700' : 'text-slate-700'
          }">
          <span>${escapeHtml(item)}</span>
          ${isSelected ? '<span class="text-indigo-600 font-bold">✓</span>' : ''}
        </button>
      `;
    });
  }

  if (matchedSchools.length > 0) {
    html += `<div class="px-2.5 py-1 text-[11px] font-bold text-slate-400 uppercase bg-slate-50 border-t border-slate-100">โรงเรียนในสังกัด 27 โรงเรียน</div>`;
    matchedSchools.forEach((item) => {
      const isSelected = AppState.selectedTargetsInModal.includes(item);
      html += `
        <button type="button" onclick="toggleTargetSelection('${escapeHtml(item)}')"
          class="w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-indigo-50 transition ${
            isSelected ? 'bg-indigo-50/80 font-semibold text-indigo-700' : 'text-slate-700'
          }">
          <span>${escapeHtml(item)}</span>
          ${isSelected ? '<span class="text-indigo-600 font-bold">✓</span>' : ''}
        </button>
      `;
    });
  }

  if (q && !ALL_TARGET_OPTIONS.some((opt) => opt.toLowerCase() === q)) {
    html += `
      <button type="button" onclick="addCustomTargetFromSearch()"
        class="w-full text-left px-3 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50/50 hover:bg-indigo-100 border-t border-indigo-100">
        + เพิ่ม "${escapeHtml(query.trim())}" เป็นกลุ่มเป้าหมายเพิ่มเติม
      </button>
    `;
  }

  listEl.innerHTML = html || `<div class="p-3 text-xs text-slate-400 text-center">ไม่พบรายการที่ค้นหา</div>`;
}

function renderSelectedTargetTagsInModal() {
  const container = document.getElementById('selectedTargetTagsContainer');
  if (!container) return;

  if (AppState.selectedTargetsInModal.length === 0) {
    container.innerHTML = `<span class="text-xs text-slate-400 italic">ยังไม่ได้เลือกกลุ่มงานหรือโรงเรียน (คลิกเลือกจากรายการด้านล่าง)</span>`;
    return;
  }

  container.innerHTML = AppState.selectedTargetsInModal
    .map(
      (item) => `
      <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 border border-indigo-200">
        ${escapeHtml(item)}
        <button type="button" onclick="removeTargetSelection('${escapeHtml(item)}')" class="hover:text-rose-600 font-bold leading-none">&times;</button>
      </span>
    `
    )
    .join('');
}

function toggleTargetSelection(item) {
  const idx = AppState.selectedTargetsInModal.indexOf(item);
  if (idx >= 0) {
    AppState.selectedTargetsInModal.splice(idx, 1);
  } else {
    AppState.selectedTargetsInModal.push(item);
  }
  renderSelectedTargetTagsInModal();
  const searchInput = document.getElementById('targetSearchInput');
  renderTargetPickerOptions(searchInput ? searchInput.value : '');
}

function removeTargetSelection(item) {
  AppState.selectedTargetsInModal = AppState.selectedTargetsInModal.filter((i) => i !== item);
  renderSelectedTargetTagsInModal();
  const searchInput = document.getElementById('targetSearchInput');
  renderTargetPickerOptions(searchInput ? searchInput.value : '');
}

function addCustomTargetFromSearch() {
  const searchInput = document.getElementById('targetSearchInput');
  if (!searchInput) return;
  const val = searchInput.value.trim();
  if (val && !AppState.selectedTargetsInModal.includes(val)) {
    AppState.selectedTargetsInModal.push(val);
    searchInput.value = '';
    renderSelectedTargetTagsInModal();
    renderTargetPickerOptions('');
  }
}

function selectQuickTargetPreset(presetType) {
  if (presetType === 'ALL_SCHOOLS') {
    const label = 'ทุกโรงเรียนในสังกัด (27 โรงเรียน)';
    if (!AppState.selectedTargetsInModal.includes(label)) {
      AppState.selectedTargetsInModal.push(label);
    }
  } else if (presetType === 'OFFICE_ICT') {
    const label = 'กลุ่มส่งเสริมการศึกษาทางไกล เทคโนโลยีสารสนเทศและการสื่อสาร (ICT)';
    if (!AppState.selectedTargetsInModal.includes(label)) {
      AppState.selectedTargetsInModal.push(label);
    }
  } else if (presetType === 'CLEAR') {
    AppState.selectedTargetsInModal = [];
  }
  renderSelectedTargetTagsInModal();
  const searchInput = document.getElementById('targetSearchInput');
  renderTargetPickerOptions(searchInput ? searchInput.value : '');
}

function updateModalRemainingDaysPreview() {
  const dueDateEl = document.getElementById('modalDueDate');
  const statusEl = document.getElementById('modalStatus');
  const previewEl = document.getElementById('modalRemainingPreview');
  if (!dueDateEl || !statusEl || !previewEl) return;

  const remDays = calculateRemainingDays(dueDateEl.value);
  const badge = getRemainingDaysBadgeInfo(remDays, statusEl.value);
  previewEl.className = `inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border ${badge.className}`;
  previewEl.innerHTML = `${escapeHtml(badge.label)}`;
}

function openAddTaskModal() {
  AppState.editingTaskId = null;
  AppState.selectedTargetsInModal = [
    'กลุ่มส่งเสริมการศึกษาทางไกล เทคโนโลยีสารสนเทศและการสื่อสาร (ICT)'
  ];

  const today = getTodayStr();
  const nextId = generateTaskId(AppState.tasks, today);

  document.getElementById('taskModalTitle').textContent = 'เพิ่มภารกิจ / โครงการใหม่';
  document.getElementById('modalTaskId').value = nextId;
  document.getElementById('modalTaskType').value = 'งานประจำ';
  document.getElementById('modalCategorySearch').value = '';
  filterModalCategoryDropdown('');
  document.getElementById('modalCategory').value = CATEGORIES[0];
  document.getElementById('modalPriority').value = 'ปกติ';
  document.getElementById('modalTitle').value = '';
  document.getElementById('modalDetails').value = '';
  document.getElementById('modalStartDate').value = today;
  document.getElementById('modalDueDate').value = addDaysToDateStr(today, 3);
  document.getElementById('modalStatus').value = 'รอดำเนินการ';
  document.getElementById('modalRemarks').value = '';

  renderSelectedTargetTagsInModal();
  renderTargetPickerOptions('');
  updateModalRemainingDaysPreview();

  const modal = document.getElementById('taskFormModal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function openEditTaskModal(taskId) {
  const task = AppState.tasks.find((t) => t.id === taskId);
  if (!task) return;

  AppState.editingTaskId = task.id;
  AppState.selectedTargetsInModal = Array.isArray(task.targetGroup)
    ? [...task.targetGroup]
    : task.targetGroup
    ? [String(task.targetGroup)]
    : [];

  document.getElementById('taskModalTitle').textContent = `แก้ไขข้อมูลภารกิจ (${task.id})`;
  document.getElementById('modalTaskId').value = task.id;
  document.getElementById('modalTaskType').value = task.taskType || TASK_TYPES[0];
  document.getElementById('modalCategorySearch').value = '';
  filterModalCategoryDropdown('');
  document.getElementById('modalCategory').value = task.category || CATEGORIES[0];
  document.getElementById('modalPriority').value = task.priority || 'ปกติ';
  document.getElementById('modalTitle').value = task.title || '';
  document.getElementById('modalDetails').value = task.details || '';
  document.getElementById('modalStartDate').value = task.startDate || getTodayStr();
  document.getElementById('modalDueDate').value = task.dueDate || getTodayStr();
  document.getElementById('modalStatus').value = task.status || 'รอดำเนินการ';
  document.getElementById('modalRemarks').value = task.remarks || '';

  renderSelectedTargetTagsInModal();
  renderTargetPickerOptions('');
  updateModalRemainingDaysPreview();

  const modal = document.getElementById('taskFormModal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeTaskModal() {
  const modal = document.getElementById('taskFormModal');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

async function handleSaveTaskForm(event) {
  if (event) event.preventDefault();

  const title = document.getElementById('modalTitle').value.trim();
  const dueDate = document.getElementById('modalDueDate').value;

  if (!title || !dueDate) {
    if (typeof Swal !== 'undefined') {
      Swal.fire({
        icon: 'warning',
        title: 'ข้อมูลไม่ครบถ้วน',
        text: 'กรุณาระบุ "กิจกรรม/รายงาน" และ "กำหนดส่ง" ให้ครบถ้วน',
        confirmButtonColor: '#4F46E5'
      });
    }
    return;
  }

  const taskPayload = {
    id: document.getElementById('modalTaskId').value.trim() || generateTaskId(AppState.tasks),
    taskType: document.getElementById('modalTaskType').value,
    category: document.getElementById('modalCategory').value,
    priority: document.getElementById('modalPriority').value,
    title,
    details: document.getElementById('modalDetails').value.trim(),
    targetGroup:
      AppState.selectedTargetsInModal.length > 0
        ? [...AppState.selectedTargetsInModal]
        : ['สพม.พัทลุง (ภาพรวมสำนักงานเขตฯ)'],
    startDate: document.getElementById('modalStartDate').value || getTodayStr(),
    dueDate,
    remainingDays: calculateRemainingDays(dueDate),
    status: document.getElementById('modalStatus').value,
    remarks: document.getElementById('modalRemarks').value.trim(),
    updatedAt: new Date().toISOString()
  };

  const isEditing = Boolean(AppState.editingTaskId);

  if (isEditing) {
    const idx = AppState.tasks.findIndex((t) => t.id === AppState.editingTaskId);
    if (idx >= 0) {
      AppState.tasks[idx] = taskPayload;
    }
  } else {
    AppState.tasks.unshift(taskPayload);
  }

  saveTasksToStorage();
  closeTaskModal();
  renderAll();

  // Sync to GAS if URL is configured
  if (AppState.config.gasWebAppUrl) {
    await postToGasBackend({
      action: isEditing ? 'updateTask' : 'createTask',
      task: taskPayload
    });
  }

  if (typeof Swal !== 'undefined') {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: isEditing ? 'บันทึกการแก้ไขงานเรียบร้อย' : 'เพิ่มภารกิจใหม่เรียบร้อย',
      showConfirmButton: false,
      timer: 2000
    });
  }
}

async function handleQuickStatusChange(taskId, newStatus) {
  const idx = AppState.tasks.findIndex((t) => t.id === taskId);
  if (idx < 0) return;

  AppState.tasks[idx].status = newStatus;
  AppState.tasks[idx].updatedAt = new Date().toISOString();
  saveTasksToStorage();
  renderAll();

  if (AppState.config.gasWebAppUrl) {
    await postToGasBackend({
      action: 'updateStatus',
      id: taskId,
      status: newStatus
    });
  }

  if (typeof Swal !== 'undefined') {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: `อัปเดตสถานะเป็น "${newStatus}"`,
      showConfirmButton: false,
      timer: 1600
    });
  }
}

async function quickCompleteTask(taskId) {
  await handleQuickStatusChange(taskId, 'เสร็จแล้ว');
}

async function confirmDeleteTask(taskId) {
  const task = AppState.tasks.find((t) => t.id === taskId);
  if (!task) return;

  if (typeof Swal !== 'undefined') {
    const res = await Swal.fire({
      icon: 'warning',
      title: 'ยืนยันการลบรายการงาน?',
      html: `ต้องการลบงาน <b>"${escapeHtml(task.title)}"</b> (${escapeHtml(task.id)}) หรือไม่?`,
      showCancelButton: true,
      confirmButtonColor: '#E11D48',
      cancelButtonColor: '#64748B',
      confirmButtonText: 'ลบรายการ',
      cancelButtonText: 'ยกเลิก'
    });
    if (!res.isConfirmed) return;
  }

  AppState.tasks = AppState.tasks.filter((t) => t.id !== taskId);
  saveTasksToStorage();
  renderAll();

  if (AppState.config.gasWebAppUrl) {
    await postToGasBackend({
      action: 'deleteTask',
      id: taskId
    });
  }

  if (typeof Swal !== 'undefined') {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'info',
      title: 'ลบรายการงานเรียบร้อยแล้ว',
      showConfirmButton: false,
      timer: 1800
    });
  }
}

/**
 * ============================================================================
 * GOOGLE APPS SCRIPT & TELEGRAM API INTEGRATION
 * ============================================================================
 */
async function postToGasBackend(payloadObj) {
  const url = (AppState.config.gasWebAppUrl || '').trim();
  if (!url) return { success: false, offline: true };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(payloadObj)
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.warn('GAS Backend Sync Warning:', error);
    return { success: false, error: error.message };
  }
}

async function syncWithGasBackend() {
  const url = (AppState.config.gasWebAppUrl || '').trim();
  if (!url) {
    if (typeof Swal !== 'undefined') {
      Swal.fire({
        icon: 'info',
        title: 'โหมดใช้งานในเครื่อง (Local Demo Cache)',
        html: 'ขณะนี้ข้อมูลถูกบันทึกในเบราว์เซอร์เรียบร้อยแล้ว<br><span class="text-xs text-slate-500">หากต้องการซิงค์ขึ้น Google Sheets จริง กรุณาคลิกปุ่ม <b>"ตั้งค่าระบบ"</b> เพื่อวาง Web App URL ของ Google Apps Script</span>',
        confirmButtonColor: '#4F46E5'
      });
    }
    renderAll();
    return;
  }

  try {
    if (typeof Swal !== 'undefined') {
      Swal.fire({
        title: 'กำลังซิงค์ข้อมูลกับ Google Sheets...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });
    }

    const res = await fetch(`${url}?action=getAll&t=${Date.now()}`);
    const data = await res.json();

    if (data && data.success) {
      if (Array.isArray(data.tasks) && data.tasks.length > 0) {
        AppState.tasks = data.tasks.map((t) => ({
          ...t,
          remainingDays: calculateRemainingDays(t.dueDate)
        }));
        saveTasksToStorage();
      } else if (AppState.tasks.length > 0) {
        // Push local tasks to initialize empty sheet
        await postToGasBackend({
          action: 'syncAllTasks',
          tasks: AppState.tasks
        });
      }

      renderAll();
      if (typeof Swal !== 'undefined') {
        Swal.fire({
          icon: 'success',
          title: 'ซิงค์ข้อมูลสำเร็จ!',
          text: `อัปเดตข้อมูลล่าสุด ${AppState.tasks.length} รายการกับ Google Sheets เรียบร้อยแล้ว`,
          timer: 2000,
          showConfirmButton: false
        });
      }
    } else {
      throw new Error((data && data.error) || 'ไม่สามารถดึงข้อมูลจาก Google Sheets ได้');
    }
  } catch (err) {
    if (typeof Swal !== 'undefined') {
      Swal.fire({
        icon: 'error',
        title: 'ซิงค์ข้อมูลไม่สำเร็จ',
        text: `ระบบยังเก็บข้อมูลไว้ในเครื่องอย่างปลอดภัย (${err.message})`,
        confirmButtonColor: '#4F46E5'
      });
    }
  }
}

async function handleTestTelegramAlert() {
  const token = (AppState.config.telegramBotToken || '').trim();
  const chatId = (AppState.config.telegramChatId || '').trim();
  const htmlPreview = buildClientTelegramDigestPreview(AppState.tasks);

  if (!token || !chatId) {
    if (typeof Swal !== 'undefined') {
      const res = await Swal.fire({
        icon: 'info',
        title: 'ตัวอย่างข้อความแจ้งเตือน Telegram (07:30 น.)',
        html: `
          <div class="text-left text-xs bg-slate-900 text-slate-100 p-3.5 rounded-xl font-mono whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto">${htmlPreview}</div>
          <p class="text-xs text-slate-500 mt-3">💡 หากต้องการยิงข้อความจริงเข้ามือถือ กรุณาตั้งค่า <b>Telegram Bot Token</b> และ <b>Chat ID</b> ในเมนู "ตั้งค่าระบบ"</p>
        `,
        showCancelButton: true,
        confirmButtonText: 'เปิดหน้าตั้งค่า Telegram',
        cancelButtonText: 'ปิดหน้าต่าง',
        confirmButtonColor: '#4F46E5'
      });
      if (res.isConfirmed) {
        openSettingsModal();
      }
    }
    return;
  }

  try {
    if (typeof Swal !== 'undefined') {
      Swal.fire({
        title: 'กำลังส่งแจ้งเตือนเข้า Telegram...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });
    }

    // Send directly via Telegram API or via GAS backend
    const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: htmlPreview,
        parse_mode: 'HTML',
        disable_web_page_preview: true
      })
    });
    const tgData = await tgRes.json();

    if (tgData && tgData.ok) {
      if (typeof Swal !== 'undefined') {
        Swal.fire({
          icon: 'success',
          title: 'ส่งแจ้งเตือนเข้า Telegram สำเร็จ!',
          text: 'ตรวจสอบข้อความสรุปภารกิจประจำวันได้ในแอป Telegram ของคุณ',
          confirmButtonColor: '#10B981'
        });
      }
    } else {
      throw new Error((tgData && tgData.description) || 'ไม่สามารถส่งข้อความได้');
    }
  } catch (err) {
    if (typeof Swal !== 'undefined') {
      Swal.fire({
        icon: 'error',
        title: 'ส่ง Telegram ไม่สำเร็จ',
        text: err.message,
        confirmButtonColor: '#E11D48'
      });
    }
  }
}

/**
 * ============================================================================
 * SETTINGS MODAL & SELF-TEST MODAL HANDLERS
 * ============================================================================
 */
function openSettingsModal() {
  document.getElementById('settingGasUrl').value = AppState.config.gasWebAppUrl || '';
  document.getElementById('settingTelegramToken').value = AppState.config.telegramBotToken || '';
  document.getElementById('settingTelegramChatId').value = AppState.config.telegramChatId || '';

  const modal = document.getElementById('settingsModal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeSettingsModal() {
  const modal = document.getElementById('settingsModal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

async function handleSaveSettings(event) {
  if (event) event.preventDefault();

  AppState.config.gasWebAppUrl = document.getElementById('settingGasUrl').value.trim();
  AppState.config.telegramBotToken = document.getElementById('settingTelegramToken').value.trim();
  AppState.config.telegramChatId = document.getElementById('settingTelegramChatId').value.trim();

  saveConfigToStorage();
  closeSettingsModal();
  renderAll();

  if (AppState.config.gasWebAppUrl) {
    await postToGasBackend({
      action: 'saveConfig',
      config: {
        telegramBotToken: AppState.config.telegramBotToken,
        telegramChatId: AppState.config.telegramChatId,
        morningAlertTime: '07:30'
      }
    });
  }

  if (typeof Swal !== 'undefined') {
    Swal.fire({
      icon: 'success',
      title: 'บันทึกการตั้งค่าระบบสำเร็จ',
      text: 'จำค่าการเชื่อมต่อไว้ในระบบเรียบร้อยแล้ว',
      timer: 1800,
      showConfirmButton: false
    });
  }
}

function resetDemoMockData() {
  AppState.tasks = getInitialMockTasks();
  saveTasksToStorage();
  closeSettingsModal();
  renderAll();
  if (typeof Swal !== 'undefined') {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'รีเซ็ตข้อมูลตัวอย่าง สพม.พัทลุง เรียบร้อยแล้ว',
      showConfirmButton: false,
      timer: 2000
    });
  }
}

function openSelfTestModalAndRun() {
  const modal = document.getElementById('selfTestModal');
  const container = document.getElementById('selfTestResultsContainer');
  const summaryBanner = document.getElementById('selfTestSummaryBanner');
  if (!modal || !container || !summaryBanner) return;

  modal.classList.remove('hidden');
  modal.classList.add('flex');

  const report = runBuiltInSelfTest();

  if (report.allPassed) {
    summaryBanner.className =
      'rounded-xl p-4 bg-emerald-50 border border-emerald-200 flex items-center justify-between text-emerald-900';
    summaryBanner.innerHTML = `
      <div class="flex items-center gap-3">
        <span class="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">✓</span>
        <div>
          <div class="font-bold text-sm">ผลการตรวจสอบระบบ (Pre-Flight Self-Test): ผ่านครบทุกข้อ (${report.passedCount}/${report.totalCount})</div>
          <div class="text-xs text-emerald-700">ใช้เวลาประมวลผล ${report.durationMs} ms • ระบบพร้อมสำหรับ Git Push และใช้งานจริง</div>
        </div>
      </div>
      <span class="px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white">PASS 100%</span>
    `;
  } else {
    summaryBanner.className =
      'rounded-xl p-4 bg-rose-50 border border-rose-200 flex items-center justify-between text-rose-900';
    summaryBanner.innerHTML = `
      <div class="flex items-center gap-3">
        <span class="w-9 h-9 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold">!</span>
        <div>
          <div class="font-bold text-sm">พบข้อผิดพลาดในการตรวจสอบระบบ (${report.passedCount}/${report.totalCount})</div>
          <div class="text-xs text-rose-700">กรุณาตรวจสอบรายการที่ขึ้นสถานะ FAIL ด้านล่าง</div>
        </div>
      </div>
      <span class="px-3 py-1 rounded-full text-xs font-bold bg-rose-600 text-white">FAIL</span>
    `;
  }

  container.innerHTML = report.results
    .map(
      (r) => `
      <div class="p-3.5 rounded-xl border ${
        r.passed ? 'border-emerald-200 bg-white' : 'border-rose-300 bg-rose-50/40'
      } flex items-start justify-between gap-3">
        <div class="space-y-1">
          <div class="font-semibold text-sm text-slate-800">${escapeHtml(r.name)}</div>
          <div class="text-xs text-slate-600">${escapeHtml(r.details)}</div>
        </div>
        <span class="shrink-0 px-2.5 py-1 rounded-full text-xs font-bold ${
          r.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
        }">
          ${r.passed ? 'PASS' : 'FAIL'}
        </span>
      </div>
    `
    )
    .join('');

  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

function closeSelfTestModal() {
  const modal = document.getElementById('selfTestModal');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

/**
 * Filter & View Switcher Event Helpers
 */
function setKpiFilter(kpiKey) {
  if (AppState.filters.kpiFilter === kpiKey && kpiKey !== 'ALL') {
    AppState.filters.kpiFilter = 'ALL';
  } else {
    AppState.filters.kpiFilter = kpiKey;
  }
  renderAll();
}

function setViewMode(mode) {
  AppState.viewMode = mode;
  if (isBrowserEnv()) {
    localStorage.setItem(STORAGE_KEYS.VIEW_MODE, mode);
  }
  renderAll();
}

function toggleAnalyticsSection() {
  AppState.analyticsOpen = !AppState.analyticsOpen;
  if (isBrowserEnv()) {
    localStorage.setItem(STORAGE_KEYS.ANALYTICS_OPEN, String(AppState.analyticsOpen));
  }
  const body = document.getElementById('analyticsCollapsibleBody');
  const chevron = document.getElementById('analyticsChevronIcon');
  if (body) body.classList.toggle('hidden', !AppState.analyticsOpen);
  if (chevron) chevron.style.transform = AppState.analyticsOpen ? 'rotate(180deg)' : 'rotate(0deg)';
  if (AppState.analyticsOpen) {
    renderAnalyticsCharts();
  }
}

function resetAllFilters() {
  AppState.filters = {
    search: '',
    taskType: 'ALL',
    category: 'ALL',
    priority: 'ALL',
    status: 'ALL',
    targetGroup: 'ALL',
    kpiFilter: 'ALL'
  };

  const sInput = document.getElementById('searchInput');
  const fType = document.getElementById('filterTaskType');
  const fCat = document.getElementById('filterCategory');
  const fPrio = document.getElementById('filterPriority');
  const fStat = document.getElementById('filterStatus');
  const fTarget = document.getElementById('filterTargetGroup');

  if (sInput) sInput.value = '';
  if (fType) fType.value = 'ALL';
  if (fCat) fCat.value = 'ALL';
  if (fPrio) fPrio.value = 'ALL';
  if (fStat) fStat.value = 'ALL';
  if (fTarget) fTarget.value = 'ALL';

  renderAll();
}

function initApp() {
  if (!isBrowserEnv()) return;
  loadStateFromStorage();
  populateDropdownsAndFilters();

  // Bind filter change listeners
  const searchEl = document.getElementById('searchInput');
  if (searchEl) {
    searchEl.addEventListener('input', (e) => {
      AppState.filters.search = e.target.value;
      renderAll();
    });
  }

  const bindSelect = (id, key) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('change', (e) => {
        AppState.filters[key] = e.target.value;
        renderAll();
      });
    }
  };

  bindSelect('filterTaskType', 'taskType');
  bindSelect('filterCategory', 'category');
  bindSelect('filterPriority', 'priority');
  bindSelect('filterStatus', 'status');
  bindSelect('filterTargetGroup', 'targetGroup');

  // Restore analytics open state
  const analyticsBody = document.getElementById('analyticsCollapsibleBody');
  if (analyticsBody) {
    analyticsBody.classList.toggle('hidden', !AppState.analyticsOpen);
  }

  renderAll();
}

if (isBrowserEnv()) {
  window.addEventListener('DOMContentLoaded', initApp);
}

// Export for Node.js Pre-Flight Automated Test Suite (`test-suite.js`)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    TASK_TYPES,
    CATEGORIES,
    PRIORITIES,
    STATUSES,
    TARGET_GROUPS_OVERVIEW,
    TARGET_SCHOOLS,
    ALL_TARGET_OPTIONS,
    getTodayStr,
    addDaysToDateStr,
    calculateRemainingDays,
    getRemainingDaysBadgeInfo,
    generateTaskId,
    getInitialMockTasks,
    buildClientTelegramDigestPreview,
    runBuiltInSelfTest
  };
}

