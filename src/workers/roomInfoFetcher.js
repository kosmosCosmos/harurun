import request from 'request';
import config from '../../config';

const getRoomInfoPromise = (room) =>
  () =>
  new Promise((resolve, reject) => {
    const requestPath = `http://www.zhanqi.tv/api/static/live.roomid/${room.id}.json`;
    request({
      url: requestPath,
    }, (err, res, body) => {
      if (err) {
        return reject(err);
      }
      let roomInfo;
      try {
        roomInfo = JSON.parse(body).data;
      }
      catch (e) {
        return reject(e);
      }

      if (!roomInfo) {
        return reject(new Error('zhanqi responed an empty room info body'));
      }

      const result = {
        id: room.id,
        provider: room.provider,
        highlight: !!room.highlight,
        title: roomInfo.title,
        url: roomInfo.url,
        alias: room.alias,
      };

      return resolve(result);
    });
  });

export default () => new Promise((resolve, reject) => {
  const tasks = config.stockRooms.filter(c => c.is48g).map(r => {
    return getRoomInfoPromise(r);
  });
  Promise.all(tasks.map(t => t()))
    .then(results => {
      resolve(results);
    })
    .catch(e => {
      reject(e);
    });
});
