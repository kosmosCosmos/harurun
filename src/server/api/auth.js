
export default (req, res, next) => {
  console.log('in auth');
  console.log(req.body);

  if (req.body && req.body.authCode) {
    if (req.body.authCode === '1111') {
      req.session = req.session || { user: { authenticated: false } };
      req.session.user = {
        authenticated: true,
      };
      console.log('updated session ', req.session);
      return res.send({ result: 'ok' });
    }
    else {
      // req.session.user = {
      //   authenticated: false,
      // };
      return res.send({ result: 'fail' });
    }
  }
};
