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

export const generateMonthTable = (monthMoment: Date) => {
  monthMoment.setDate(1);
  monthMoment.setHours(0);
  monthMoment.setMinutes(0);
  monthMoment.setSeconds(0);
  monthMoment.setMilliseconds(0);
  const firstDayOfCurrentMonth = monthMoment;
  firstDayOfCurrentMonth.setDate(1);
  const dayInMonth = firstDayOfCurrentMonth.getDay() || 7;
  const firstRowStart = new Date(firstDayOfCurrentMonth.valueOf() - (dayInMonth-1)*24*3600000);
  let indexMoment = new Date(firstRowStart.valueOf());
  const table = [[
    monthMoment,
  ]];
  for (let week = 0; week < 5; week++) {
    table[week] = [];
    for (let day = 0; day < 7; day++) {
      table[week][day] = indexMoment;
      indexMoment = new Date(indexMoment.valueOf() + 1 * 24 * 3600000);
    }
  }
  return table;
}

export function convertToYearMonthDate(date?: Date) {
  if (!date) {
    date = new Date();
  }
  return `${date.getFullYear()}-${fillZero(date.getMonth()+1)}-${date.getDate()}`;
}

export function convertToHHmmss(date?: Date) {
  if (!date) {
    date = new Date();
  }
  return `${fillZero(date.getHours())}:${fillZero(date.getMinutes()+1)}:${fillZero(date.getSeconds())}`;
}

export function fillZero(number: number): string {
  return number > 9 ? number.toString() : `0${number}`
}