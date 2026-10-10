(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('./vendor/xlsx.full.min.js'));
  } else {
    root.ClassTrackTimetableImport = factory(root.XLSX);
  }
}(typeof self !== 'undefined' ? self : this, function (XLSX) {
  'use strict';

  const trackedSubjects = [
    {
      id: 'digital_marketing',
      name: 'Digital Marketing',
      shortName: 'DM',
      total: 20,
      maxMiss: 4,
      sessionsPerWeek: 2,
      patterns: [/^DM\b/i],
    },
    {
      id: 'strategic_brand_management',
      name: 'Strategic Brand Management',
      shortName: 'SBM_B',
      total: 20,
      maxMiss: 4,
      sessionsPerWeek: 2,
      patterns: [/^SBM\s*(?:DIV(?:ISION)?\s*)?B\b/i, /^SBM_B\b/i],
    },
    {
      id: 'visual_analytics',
      name: 'Visual Analytics',
      shortName: 'VA',
      total: 20,
      maxMiss: 4,
      sessionsPerWeek: 2,
      patterns: [/^VA\b/i],
    },
    {
      id: 'games_of_strategy',
      name: 'Games of Strategy',
      shortName: 'GOS',
      total: 20,
      maxMiss: 4,
      sessionsPerWeek: 2,
      patterns: [/^GOS\b/i],
    },
  ];

  const dayPatterns = [
    [/^mon/i, 'Mon'],
    [/^tue/i, 'Tue'],
    [/^wed/i, 'Wed'],
    [/^thu/i, 'Thu'],
    [/^fri/i, 'Fri'],
    [/^sat/i, 'Sat'],
    [/^sun/i, 'Sun'],
  ];
  const dayByIndex = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  function normalizeText(value) {
    return String(value ?? '').replace(/\r/g, '').trim();
  }

  function normalizeDay(value) {
    const text = normalizeText(value);
    const match = dayPatterns.find(([pattern]) => pattern.test(text));
    return match ? match[1] : null;
  }

  function normalizeTime(value) {
    return normalizeText(value)
      .replace(/\s+/g, ' ')
      .replace(/\s*-\s*/g, ' - ');
  }

  function matchSubject(value) {
    const firstLine = normalizeText(value).split('\n')[0].trim();
    return trackedSubjects.find(subject =>
      subject.patterns.some(pattern => pattern.test(firstLine))
    ) || null;
  }

  function parseSlotDetails(value) {
    const lines = normalizeText(value)
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean);
    const details = lines.slice(1);
    const roomIndex = details.findIndex(line =>
      /\b(?:L|LR)\s*0?\d|floor|room/i.test(line)
    );
    const room = roomIndex >= 0 ? details[roomIndex] : '';
    const professor = details
      .filter((_, index) => index !== roomIndex)
      .join(' · ');
    return { room, professor };
  }

  function toDateInputValue(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function buildWeekFromStartDate(startDateValue) {
    const match = String(startDateValue || '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) return null;
    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const start = new Date(year, month - 1, day);
    if (
      start.getFullYear() !== year
      || start.getMonth() !== month - 1
      || start.getDate() !== day
      || start.getDay() !== 1
    ) return null;

    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    const datesByDay = {};
    const cursor = new Date(start);
    while (cursor <= end) {
      datesByDay[dayByIndex[cursor.getDay()]] = toDateInputValue(cursor);
      cursor.setDate(cursor.getDate() + 1);
    }

    return {
      startDate: toDateInputValue(start),
      endDate: toDateInputValue(end),
      datesByDay,
    };
  }

  function parseTimetableWorkbook(workbook) {
    if (!XLSX) throw new Error('Excel parser is unavailable.');
    const sheetName = workbook.SheetNames.find(name => name.trim().toUpperCase() === 'TT')
      || workbook.SheetNames[0];
    if (!sheetName) throw new Error('The workbook does not contain a timetable sheet.');

    const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
      header: 1,
      defval: '',
      raw: false,
    });
    const headerIndex = rows.findIndex(row =>
      /day\s*\/?\s*time/i.test(normalizeText(row[0]))
    );
    if (headerIndex < 0) {
      throw new Error('Could not find the Day/Time header in the timetable.');
    }

    const timeHeaders = rows[headerIndex];
    const timetable = { Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], Sun: [] };
    const matchedSubjects = new Set();
    let currentDay = null;

    rows.slice(headerIndex + 1).forEach((row, rowOffset) => {
      const rowDay = normalizeDay(row[0]);
      if (rowDay) currentDay = rowDay;
      if (!currentDay) return;

      for (let columnIndex = 1; columnIndex < row.length; columnIndex += 1) {
        const cell = normalizeText(row[columnIndex]);
        if (!cell) continue;
        const subject = matchSubject(cell);
        if (!subject) continue;

        const time = normalizeTime(timeHeaders[columnIndex]);
        if (!time) continue;
        const { room, professor } = parseSlotDetails(cell);
        timetable[currentDay].push({
          id: `import_${currentDay}_${rowOffset + headerIndex + 1}_${columnIndex}`,
          time,
          subject: subject.name,
          room,
          prof: professor,
          columnOrder: columnIndex,
        });
        matchedSubjects.add(subject.id);
      }
    });

    Object.values(timetable).forEach(slots => {
      slots.sort((a, b) => a.columnOrder - b.columnOrder);
      slots.forEach(slot => { delete slot.columnOrder; });
    });

    const slotCount = Object.values(timetable).reduce((sum, slots) => sum + slots.length, 0);
    if (slotCount === 0) {
      throw new Error('No DM, SBM Division B, VA, or GOS classes were found.');
    }

    return {
      timetable,
      matchedSubjects: Array.from(matchedSubjects),
      slotCount,
      sheetName,
    };
  }

  return { trackedSubjects, parseTimetableWorkbook, buildWeekFromStartDate };
}));
