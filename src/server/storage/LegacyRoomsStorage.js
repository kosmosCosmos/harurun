let _rooms;

export default {
  set: (rooms) => {
    _rooms = rooms;
  },
  get: () => {
    return _rooms;
  },
};
