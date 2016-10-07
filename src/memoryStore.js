import {
  PerformanceStorage,
  ScheduleStorage,
  StockRoomsStorage,
} from './server/storage';


export default {
  getAll: () => {
    return {
      performance: PerformanceStorage.getAll(),
      schedules: ScheduleStorage.get(),
      rooms: StockRoomsStorage.getAll(),
    };
  },
};
