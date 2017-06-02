/* eslint-disable no-alert, no-console */
import StockRoomsStorage from '../storage/StockRoomsStorage';
import SchedulesStorage from '../storage/ScheduleStorage';
import UserStorage from '../storage/UserStorage';
import { currentExtensionVersion } from '../../../config';

export default function (req, res, next) {
  // (params, location, route);
  const { uid } = req.params;
  console.log('in miichan:', uid);

  const {
    extensionVersion,
    schedulesVersion,
    stockRoomsVersion,
    version,
    usage,
  } = req.body;

  const result = {
    status: 'ok',
    extension: {
      status: 'ok',
    },
    room: {
      status: 'ok',
    },
    schedule: {
      status: 'ok',
    },
  };

  const storage = StockRoomsStorage.get();
  const schedules = SchedulesStorage.get();

  if (extensionVersion !== currentExtensionVersion) {
    result.extension.status = 'update';
    result.extension.currentExtensionVersion = currentExtensionVersion;
  }

  if (stockRoomsVersion !== storage.stockRoomsVersion) {
    result.room.status = 'update';
    result.room.stockRoomsVersion = storage.stockRoomsVersion;
    result.room.stockRooms = storage.stockRooms;
  }

  if (schedulesVersion !== schedules.timestamp) {
    result.schedule.status = 'update';
    result.schedule.timestamp = schedules.timestamp;
    result.schedule.data = schedules.data;
  }

  // update user info to storage
  const currentUser = {
    uid,
    version,
    usage,
  };
  UserStorage.set(currentUser);

  res.send(result);
}
