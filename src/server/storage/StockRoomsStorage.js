import config from '../../../config';

let _roomInfoes;
export default {
  get: () => {
    return {
      stockRoomsVersion: config.stockRoomsVersion,
      stockRooms: config.stockRooms,
    };
  },
  set: (roomInfoes) => {
    _roomInfoes = roomInfoes;
  },
  getAll: () => {
    return _roomInfoes;
  },
};
