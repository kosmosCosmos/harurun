import bilibili from './bilibili';
import zhanqi from './zhanqi';
import { PROVIDER } from './common';
import { translateToLegacyRoomInfo } from '../../utils';

const _fetchRoomInfo = (room) => {
  let adapter = null;

  if (room.provider === PROVIDER.ZHANQI) {
    // console.log('provider matched ');
    adapter = zhanqi;
  }
  else if(room.provider === PROVIDER.BILIBILI) {
    adapter = bilibili;
  }
  // else if(provider === PROVIDER.DOUYU){

  // }

  if (adapter === null) {
    throw new Error('Can\'t find adapter for ' + room.provider);
  }
  // console.log(adapter);
  return adapter.fetchRoomInfo(room);
};

export default (rooms) => new Promise((resolve, reject) => {
  const promises = rooms.map(r => _fetchRoomInfo(r));

  Promise.all(promises).then(fetchedRoomInfoes => {
    const legacyRoomInfoes = fetchedRoomInfoes.map(translateToLegacyRoomInfo).sort((a, b) => {
      const aStock = rooms.find(r => r.id === a.room_id);
      const bStock = rooms.find(r => r.id === b.room_id);
      // console.log(rooms.findIndex);
      // console.log(aStock);
      const aIdx = rooms.indexOf(aStock);
      // console.log(aIdx);
      const bIdx = rooms.indexOf(bStock);

      return aIdx - bIdx;
    });

    resolve(legacyRoomInfoes);
  })
  .catch(e => {
    reject(e);
  });
});
