function getRangeByDates(start, end) {
  const numberOfDays = end.diff(start, 'days') + 1;
  const arrDays = [];
  for (let i = 0; i < numberOfDays; i++) {
    arrDays.push(start.clone().add(i, 'day'))
  }
  return arrDays;
}

export {getRangeByDates}