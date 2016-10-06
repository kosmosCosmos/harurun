import fs from 'fs';
import path from 'path';
const cacheFilePath = path.join(__dirname, '../../../caches/users.json');
let users = [];

// todo move cachefilepath to config.json
// todo extract persist/recover method

const recover = () => {
  try {
    fs.accessSync(cacheFilePath, fs.F_OK);
    const usrStr = fs.readFileSync(cacheFilePath, 'utf8');
    const usrObj = JSON.parse(usrStr);
    users = usrObj;
  }
  catch (e) {
    console.log('Can\'t find caches/users.json fill schedules with empty array.');
  }
};

const persist = () => {
  fs.writeFileSync(cacheFilePath, JSON.stringify(users, null, 2));
};

// recover data from cached file
recover();

const _get = (uid) => {
  const user = users.find(u => u.uid === uid);
  // todo handle user not found
  return user;
};

export default {
  get: (uid) => {
    return _get(uid);
  },
  set: (user) => {
    if (!user || !user.uid) {
      return;
    }
    let _user = _get(user.uid);
    if (!_user) {
      _user = {
        uid: user.uid,
        os: user.os,
        osVersion: user.osVersion,
        browser: user.browser,
        browserVersion: user.browserVersion,
      };
      users.push(_user);
    }
    else {
      Object.assign(_user, user);
    }
    _user.lastAccess = new Date().getTime();
    persist();
  },
};
