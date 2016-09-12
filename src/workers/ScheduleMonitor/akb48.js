import request from 'request';
import { getScheduleFetchDate, getMembersByIds } from '../../utils';

const SCHEDULE_LIST_URL = 'http://www.akb48.co.jp/public/api/schedule/calendar/';
const PERFORMANCE_CATEGORY_ID = '1';

export default () => new Promise((resolve, reject) => {
  // console.log(getScheduleFetchDate());
  // return resolve();
  const fDate = getScheduleFetchDate();

  // build post form
  const postForm = {
    year: fDate.year,
    month: fDate.month,
    category: PERFORMANCE_CATEGORY_ID,
  };

  request.post({
    url: SCHEDULE_LIST_URL,
    form: postForm,
  }, (err, res, body) => {
    if (err) {
      reject(err);
    } else {
      let result;
      try {
        result = JSON.parse(body);
      } catch (e) {
        console.log(e);
        return reject(e);
      }

      if (!result.result || result.result !== 'ok') {
        reject({ message: 'akb48 schedule data corrupted.' });
      }

      const dateString = `${fDate.year}_${fDate.month}_${fDate.day}`;
      // dateString = '2016_7_23';
      result = result.data.thismonth[dateString].filter(schedule => {
        return schedule.parent_category === PERFORMANCE_CATEGORY_ID;
      });


      // build performance structure object
      const performances = result.map(r => {
        // get performance name
        let title;
        let memberIds = [];
        let members = [];
        let date = r.date;
        if (r.body) {
          title = r.body.split('<br>')[1];
          // get member list
          memberIds = r.member.split(',');
          members = getMembersByIds(memberIds, 'akb48');
        }
        else {
          title = r.title;
          date = r.date.split(' ')[0];
        }

        const performance = {
          group: 'akb48',
          date,
          title,
          memberIds,
          members,
        };

        return performance;
      });

      resolve(performances);
    }
  });
});
