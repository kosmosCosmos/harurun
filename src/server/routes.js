/* eslint-disable new-cap */
import config from '../../config';
import express from 'express';
import session from 'express-session';
import SessionFileStore from 'session-file-store';
const FileStore = SessionFileStore(session);

import store from '../memoryStore';
import { miichan, auth, schedule } from './api';
const router = express.Router();

const ClientRoutes = [
  '/',
  '/manage',
];

// handle restful apis
router.get('/api/miichan/:guid/:currentVersion', miichan);

// handle restful apis(legacy)
// router.get('/api/room');
// router.get('/api/schedules');

// prepare session for non-api routes
router.use(session({
  store: new FileStore({}),
  secret: config.sessionSecret,
  resave: true,
  saveUninitialized: false,
  cookie: {
    maxAge: 86400 * 1000 * 10,
  },
}));

// handle stateful api
router.post('/api/auth', auth);
router.use('/api/manage/schedule', schedule);

// handle client routes
router.get('*', (req, res, next) => {
  if (!req.session.user) {
    console.log('reset session.user "!!!!!');
    req.session.user = {
      authenticated: false,
    };
  }

  console.log('sessionId:', req.sessionID);
  // console.log('test');
  const isClientRoute = ClientRoutes.includes(req.originalUrl.toLowerCase());
  // console.log(req.originalUrl);
  if (!isClientRoute) {
    console.log('not client route');
    return next();
  }

  const storeData = store.getAll();
  const storeDataString = JSON.stringify(storeData);
  // const roomsString = JSON.stringify(rooms);
  console.log('try set isAuthenticated---------');
  console.log(req.session);
  const authenticated = req.session.user.authenticated;
  // console.log(storeData);
  return res.render('index', { title: 'Main', store: storeDataString, authenticated });
});


router.use('*', (req, res, next) => {
  console.log('log: ', req.method, req.originalUrl);
  next();
});



module.exports = router;
