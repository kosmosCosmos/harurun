import fs from 'fs';
import path from 'path';
const cacheFilePath = path.join(__dirname, '../../../caches/schedules.json');
let scheduleData = {
  timestamp: null,
  data: [],
};

// todo move cachefilepath to config.json
// todo extract persist/recover method

const recover = () => {
  try {
    fs.accessSync(cacheFilePath, fs.F_OK);
    const schStr = fs.readFileSync(cacheFilePath, 'utf8');
    const schObj = JSON.parse(schStr);
    scheduleData = schObj;
    // console.log('load from cached', _schedules);
  }
  catch(e) {
    // console.log(e);
    console.log('Can\'t find caches/schedules.json fill schedules with empty array.');
    // _schedules = [];
  }
};

const persist = () => {
  fs.writeFileSync(cacheFilePath, JSON.stringify(scheduleData, null, 2));
};

// recover data from cached file
recover();

export default {
  get: () => {
    return scheduleData;
  },
  set: (schedules) => {
    scheduleData.timestamp = new Date().getTime();
    scheduleData.data = schedules;
    persist();
  },
};
