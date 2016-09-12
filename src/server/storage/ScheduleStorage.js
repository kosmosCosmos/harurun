import fs from 'fs';
import path from 'path';
const cacheFilePath = path.join(__dirname, '../../../caches/schedules.json');
let _schedules;

// todo move cachefilepath to config.json
// todo extract persist/recover method

const recover = () => {
  try {
    fs.accessSync(cacheFilePath, fs.F_OK);
    const schStr = fs.readFileSync(cacheFilePath, 'utf8');
    const schObj = JSON.parse(schStr);
    _schedules = schObj;
    // console.log('load from cached', _schedules);
  }
  catch(e) {
    console.log(e);
  }
};

const persist = () => {
  fs.writeFileSync(cacheFilePath, JSON.stringify(_schedules, null, 2));
};

// recover data from cached file
recover();

export default {
  get: () => {
    return _schedules;
  },
  set: (schedules) => {
    _schedules = schedules;
    persist();
  },
};
