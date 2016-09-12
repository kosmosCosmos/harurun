// export default {
//   performance: {
//     akb48: null,
//     ske48: null,
//     nmb48: null,
//     hkt48: null,
//     ngt48: null,
//   },
// };

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
