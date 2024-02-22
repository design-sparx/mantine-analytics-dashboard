let eventGuid = 0;
const d = new Date();
let todayStr = d.toISOString().replace(/T.*$/, ''); // YYYY-MM-DD of today

const INITIAL_EVENTS = [
  {
    id: createEventId(),
    title: 'All-day event',
    start: todayStr,
  },
  {
    id: createEventId(),
    title: 'Conference',
    start: dateOps(-3),
    end: todayStr,
  },
  {
    id: createEventId(),
    title: 'Happy Hour',
    start: dateOps(3) + 'T16:00:00',
  },
  {
    id: createEventId(),
    title: 'Dinner',
    daysOfWeek: [5],
    startTime: '19:00:00',
    endTime: '21:00:00',
  },
  {
    id: createEventId(),
    title: 'Meeting',
    start: todayStr + 'T12:00:00',
  },
  {
    id: createEventId(),
    title: 'Lunch',
    daysOfWeek: [1, 2, 3, 4, 5],
    startTime: '12:45:00',
    endTime: '13:45:00',
  },
  {
    id: createEventId(),
    title: 'Business Trip',
    start: dateOps(4),
    end: dateOps(7),
  },
];

function dateOps(value: number) {
  const x = new Date(d.setDate(d.getDate() + value));
  return x.toISOString().replace(/T.*$/, '');
}

function createEventId() {
  return String(eventGuid++);
}

export { INITIAL_EVENTS, dateOps, createEventId };
