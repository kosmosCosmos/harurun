import request from 'request';
import { ROOM_STATUS } from './common';

const fetchRoomInfo = (room) => {
  const requestPath = `http://www.zhanqi.tv/api/static/live.roomid/${room.id}.json`;
  return new Promise((resolve, reject) => {
    request({
      url: requestPath,
      headers: {
        Accept: 'application/json',
      },
    }, (err, res, body) => {

      if (err) {
        reject(err);
      }
      else if (res.statusCode !== 200) {
        reject({ message: 'Error on request room info.' });
      }
      else {
        // zhanqi api returns 'text/html; charset=utf-8' for content type
        // so superagent cant parse it,
        // parse the body manually
        try {
          const parsed = JSON.parse(body);
          if (parsed && parsed.code === 0) {
            const { data } = parsed;

            let status = ROOM_STATUS.OFFLINE;
            if (data.status === '4') {
              status = ROOM_STATUS.ONLINE;
            }

            room.domain = data.domain;
            room.title = data.title;
            room.snapshotUrl = data.bpic;
            room.online = +data.online;
            room.avatarUrl = `${data.avatar}-big`;
            room.username = data.nickname;
            room.follows = data.follows;
            room.liveStartAt = data.liveTime;
            room.status = status;
            room.roomUrl = `http://www.zhanqi.tv/${room.domain}`;
          }
        }
        catch (e) {
          console.log('Failed on parsing room info: ', body);
          reject(e);
        }
        resolve(room);
      }
    });
  });
};

export default {
  fetchRoomInfo,
};