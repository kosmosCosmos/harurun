import { authKey } from '../../../config';

export default (req, res, next) => {
  if (req.body && req.body.authCode) {
    if (req.body.authCode === authKey) {
      req.session = req.session || { user: { authenticated: false } };
      req.session.user = {
        authenticated: true,
      };
      return res.send({ result: 'ok' });
    }
    else {
      return res.send({ result: 'fail' });
    }
  }
};
