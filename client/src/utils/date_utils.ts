export const displayDate = (time: number): string => {
  if (time < (24 * 60 * 60)) {
    return '10min';
  }
  if (time >= (24 * 60 * 60) && time < (2 * 24 * 60 * 60)) {
    return '1day';
  }
  if (time >= (2 * 24 * 60 * 60) && time <= (30 * 24 * 60 * 60)) {
    return `${(time/(24 * 60 * 60)).toFixed(0)}days`;
  }
  if (time > (30 * 24 * 60 * 60) && time < (365 * 24 * 60 * 60)) {
    return `${(time/(30 * 24 * 60 * 60)).toFixed(1)}months`;
  }
  if (time > (365 * 24 * 60 * 60)) {
    return `${(time/(365 * 24 * 60 * 60)).toFixed(1)}years`;
  }
  return time + 'days';
}

export const generateMonthTable = (monthMoment) => {
  const firstDayOfCurrentMonth = monthMoment.clone().startOf('month');
  const dayInMonth = firstDayOfCurrentMonth.clone().weekday();
  const firstRowStart = firstDayOfCurrentMonth.clone().subtract(dayInMonth, 'day');
  const indexMoment = firstRowStart.clone();
  const table = [[
    monthMoment,
  ]];
  for (let week = 0; week < 5; week++) {
    table[week] = [];
    for (let day = 0; day < 7; day++) {
      table[week][day] = indexMoment.clone();
      indexMoment.add(1, 'day');
    }
  }
  return table;
}
