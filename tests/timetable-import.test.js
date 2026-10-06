const assert = require('assert');
const XLSX = require('../vendor/xlsx.full.min.js');
const { parseTimetableWorkbook } = require('../timetable-import.js');

const rows = [
  ['NMIMS weekly timetable'],
  ['Day/Time', '10:10 am - 11:40 am', '11:50 am - 1:20 pm', '2:00 pm - 3:30 pm'],
  ['Mon.', 'SBM Div A\nOther Professor\nL07', 'DM\nProf Venugopal\nLR 06', 'GOS\nDr Srividya\nLR06'],
  ['', 'SBM Div B\nProf Murtuza\nL06', 'VA\nDr Kamran\nL06', ''],
];
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(rows), 'TT');

const result = parseTimetableWorkbook(workbook);
assert.equal(result.slotCount, 4);
assert.deepEqual(
  result.timetable.Mon.map(slot => slot.subject),
  ['Strategic Brand Management', 'Digital Marketing', 'Visual Analytics', 'Games of Strategy']
);
assert(!result.timetable.Mon.some(slot => slot.prof.includes('Other Professor')));
assert.deepEqual(
  result.matchedSubjects.sort(),
  ['digital_marketing', 'games_of_strategy', 'strategic_brand_management', 'visual_analytics']
);

console.log('Timetable import tests passed');
