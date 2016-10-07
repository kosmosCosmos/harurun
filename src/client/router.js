import React from 'react';
import { IndexRoute, Route, browserHistory, Router } from 'react-router';
import {
  LiveSchedulePublic,
  LiveScheduleManager,
  LiveScheduleHeadless,
} from './components/LiveSchedule';
import App from './components/App';

export default (
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={LiveSchedulePublic} />
      <Route path="/Manage" component={LiveScheduleManager} />
    </Route>
    <Route path="/Headless" component={LiveScheduleHeadless} />
  </Router>
);
