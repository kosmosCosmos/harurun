let _performance = {};

export default {
  getAll: () => {
    return _performance;
  },
  set: (group, data) => {
    _performance[group] = data;
  },
  setAll: (performance) => {
    _performance = performance;
  },
};
