/* eslint-disable no-alert, no-console */

import StockRoomsStorage from '../storage/StockRoomsStorage';
import SchedulesStorage from '../storage/ScheduleStorage';


export default function (req, res, next) {
  // (params, location, route);
  console.log('in miichan');

  const { currentVersion } = req.params;

  const result = {
    status: 'ok',
    room: {
      status: 'ok',
    },
    schedule: {
      status: 'ok',
    },
  };

  const storage = StockRoomsStorage.get();
  const schedules = SchedulesStorage.get();

  if (+currentVersion !== storage.stockRoomsVersion) {
    result.room.status = 'update';
    result.room.stockRoomsVersion = storage.stockRoomsVersion;
    result.room.stockRooms = storage.stockRooms;
  }

  result.schedule.status = 'update';
  result.schedule.list = schedules;
  res.send(result);
}
