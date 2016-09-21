import request from 'request';
import { getScheduleFetchDateString } from '../utils';
import cheerio from 'cheerio';

const SCHEDULE_LIST_URL = 'http://www.dev48.com/theater_today.php?date=';

export default () => new Promise((resolve, reject) => {
  const fetchDateString = getScheduleFetchDateString();

  const url = `${SCHEDULE_LIST_URL}${fetchDateString}`;
  request.get({
    url,
  }, (err, res, body) => {
    if (err) {
      return reject(err);
    }

    const performance = {};
    const $ = cheerio.load(body);
    const rowCols = $('.template-header').parent();
    rowCols.each((idx, ele) => {
      const el = $(ele);
      // const groupHeader = el.find('.template-header');
      // const groupHeaderText = groupHeader.text();

      const panels = el.find('.panel');
      panels.each((pidx, pele) => {
        const pel = $(pele);
        const perfTitle = pel.find('.header .live_title');
        const perfLiveDay = pel.find('.header .live_day');
        const perfLiveTime = pel.find('.header .live_time');
        const perfGroup = pel.find('.header .group');
        const perfTeam = pel.find('.header .team');

        const title = perfTitle.text();
        const date = perfLiveDay.text() + ' ' + perfLiveTime.text();
        const group = perfGroup.text();
        const team = perfTeam.text();

        const perfMembers = pel.find('.body .hlist');
        const members = perfMembers.text()
          .split('\n')
          .filter(m => m.trim())
          .map(m => {
            return {
              name: m.trim(),
            };
          });

        const schedule = {
          title,
          team,
          date,
          members,
        };

        const perfKey = group.toLowerCase();
        performance[perfKey] = performance[perfKey] || [];
        performance[group.toLowerCase()].push(schedule);
      });
    });
    return resolve(performance);
  });
});
