import {
  fetchAKB48Schedule,
  fetchHKT48Schedule,
  fetchSKE48Schedule,
 } from '../src/workers/ScheduleMonitor';

(async () => {
  const result = await fetchSKE48Schedule();
  // console.log(result);
  // console.log(result.data.thismonth['2016_7_1']);

  console.log(result);
  console.log('done.');
})();
