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
