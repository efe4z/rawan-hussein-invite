/* ═══════════════════════════════════════════════════════════
   جدول تأكيد الحضور · خطوبة روان و حسين
   هاد الكود بينحط بـ Google Sheet ← Extensions ← Apps Script
   (الخطوات كاملة بملف README، قسم «جدول تأكيد الحضور»)
   ═══════════════════════════════════════════════════════════ */

const RESPONSES = "الردود";
const SUMMARY = "الملخص";
const HEADERS = ["الوقت", "الاسم", "الحضور", "عدد الأشخاص", "رسالة التهنئة", "الاسم على الظرف"];

// شغّل هالدالة مرة وحدة بس (من فوق اختار setup واكبس Run)
function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const r = ss.getSheetByName(RESPONSES) || ss.insertSheet(RESPONSES);
  if (r.getLastRow() === 0) r.appendRow(HEADERS);
  r.setFrozenRows(1);
  r.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold").setBackground("#13284a").setFontColor("#ecd496");
  r.setRightToLeft(true);
  r.setColumnWidths(1, HEADERS.length, 170);
  r.setColumnWidth(5, 320);

  const s = ss.getSheetByName(SUMMARY) || ss.insertSheet(SUMMARY, 0);
  s.clear();
  s.setRightToLeft(true);
  const R = "'" + RESPONSES + "'!";
  const rows = [
    ["مجموع الأشخاص الحاضرين", "=SUMIF(" + R + "C2:C,\"حاضر\"," + R + "D2:D)"],
    ["عدد الردود (حاضر)", "=COUNTIF(" + R + "C2:C,\"حاضر\")"],
    ["عدد المعتذرين", "=COUNTIF(" + R + "C2:C,\"معتذر\")"],
    ["كل الردود", "=COUNTA(" + R + "B2:B)"],
  ];
  s.getRange(1, 1, rows.length, 2).setValues(rows);
  s.getRange(1, 1, rows.length, 1).setFontWeight("bold");
  s.getRange(1, 2, rows.length, 1).setFontSize(16).setFontColor("#13284a");
  s.setColumnWidth(1, 240);

  s.getRange(6, 1).setValue("أسماء الحاضرين").setFontWeight("bold");
  s.getRange(7, 1).setFormula("=IFERROR(FILTER(" + R + "B2:B&\"  (\"&" + R + "D2:D&\")\"," + R + "C2:C=\"حاضر\"),\"\")");
  s.getRange(6, 2).setValue("أسماء المعتذرين").setFontWeight("bold");
  s.getRange(7, 2).setFormula("=IFERROR(FILTER(" + R + "B2:B," + R + "C2:C=\"معتذر\"),\"\")");
}

// بتستقبل التأكيد من الموقع
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sh = ss.getSheetByName(RESPONSES) || ss.insertSheet(RESPONSES);
    if (sh.getLastRow() === 0) sh.appendRow(HEADERS);
    const p = (e && e.parameter) || {};
    if (!p.name) return out({ ok: false });
    sh.appendRow([
      new Date(),
      clean(p.name, 80),
      p.attendance === "معتذر" ? "معتذر" : "حاضر",
      Math.max(0, Math.min(20, parseInt(p.guests, 10) || 0)),
      clean(p.message, 500),
      clean(p.guest_link, 60),
    ]);
    return out({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

function doGet() { return out({ ok: true, msg: "شغّال" }); }

function clean(v, max) {
  v = String(v || "").slice(0, max);
  return /^[=+\-@]/.test(v) ? "'" + v : v;   // منع المعادلات بالخانات
}
function out(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
