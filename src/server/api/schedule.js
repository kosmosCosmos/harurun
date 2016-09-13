import ScheduleStorage from '../storage/ScheduleStorage';

const getSchedules = (req, res, next) => {
  // console.log('in get schedule api');
  res.send(ScheduleStorage.get());
};

const setSchedules = (req, res, next) => {
  // console.log('in set schedule api');
  // console.log(req.session);

  const { user } = req.session;
  if (!user || !user.authenticated) {
    return res.send({
      result: 'not authenticated',
    });
  }

  const schedules = req.body;
  ScheduleStorage.set(schedules);

  res.send({
    result: 'ok',
  });
};


export default (req, res, next) => {
  if (req.method === 'GET') {
    return getSchedules(req, res, next);
  }
  else if(req.method === 'POST') {
    return setSchedules(req, res, next);
  }
}