/* eslint-disable new-cap */
import config from '../../config';
import express from 'express';
import session from 'express-session';
import SessionFileStore from 'session-file-store';
const FileStore = SessionFileStore(session);

import store from '../memoryStore';
import { miichan, auth, schedule } from './api';
const router = express.Router();

const definedRoutes = [
  {
    path: '/',
    title: '48系番组直播间',
  },
  {
    path: '/manage',
    title: '番组表编辑',
  },
];


// handle restful apis
router.get('/api/miichan/:guid/:currentVersion', miichan);

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
    req.session.user = {
      authenticated: false,
    };
  }

  // console.log('sessionId:', req.sessionID);
  // console.log('test');
  const matchedRoute = definedRoutes.find(r => r.path === req.originalUrl.toLowerCase());
  // const isClientRoute = ClientRoutes.includes(req.originalUrl.toLowerCase());
  if (!matchedRoute) {
    return next();
  }

  const storeData = store.getAll();
  const storeDataString = JSON.stringify(storeData);
  const authenticated = req.session.user.authenticated;
  return res.render('index', { title: matchedRoute.title, store: storeDataString, authenticated });
});


router.use('*', (req, res, next) => {
  console.log('log: ', req.method, req.originalUrl);
  next();
});



module.exports = router;
