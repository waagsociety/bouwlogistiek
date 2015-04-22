exports.diffDays = function(dateStart, dateEnd) {
  var oneDay = 24 * 60 * 60 * 1000;
  var d1 = new Date(dateStart);
  var d2 = new Date(dateEnd);

  return Math.round(Math.abs((d1.getTime() - d2.getTime()) / (oneDay)));
}
