import request from 'request';
import { getScheduleFetchDate } from '../../utils';
import cheerio from 'cheerio';

const SCHEDULE_LIST_URL = 'http://www.ske48.co.jp/schedule/calendar.php';
const SCHEDULE_DETAILS_BASE_PATH = 'http://www.ske48.co.jp/schedule/';

const fetchScheduleDetails = (detailsUrl) => new Promise((resolve, reject) => {
  const url = `${SCHEDULE_DETAILS_BASE_PATH}${detailsUrl}`;

  request({
    url,
  }, (err, res, body) => {
    if (err) {
      return reject(err);
    }
    else {
      const $ = cheerio.load(body);

      const title = $('h3.stage')
        .text()
        .trim()
        .split(' ');
      const titleString = title[1];
      const date = title[0].replace(/\./g, '-') + ' ' + (title.toString().match(/\d+:\d+/) || []).toString();
      const members = $('div.memberProfile dd a').map((idx, ele) => {
        const el = $(ele);
        const mname = el.text();
        // console.log(mname);
        return {
          name: mname,
        };
      }).get();

      const result = {
        title: titleString,
        date,
        members,
      };
      return resolve(result);
    }
  });
});


export default () => new Promise((resolve, reject) => {
  const fDate = getScheduleFetchDate();

  // build request url
  const scheduleUrl = SCHEDULE_LIST_URL;
  request({
    url: scheduleUrl,
  }, (err, res, body) => {
    if (err) {
      return reject(err);
    }

    const $ = cheerio.load(body);
    const ths = $('table[title="SCHEDULE"] th');
    const trTextTerm = `${fDate.day}日`;
    let tr;
    ths.each((idx, ele) => {
      const el = $(ele);
      if (el.text().startsWith(trTextTerm)) {
        tr = el;
      }
    });

    if (!tr) {
      return reject({ message: `not find schedule of ${fDate.month}/${fDate.day}` });
    }

    const scheduleUrls = [];
    tr.parent().find('td li.stage a').each((idx, ele) => {
      const el = $(ele);
      scheduleUrls.push(el.attr('href'));
    });


    Promise.all(scheduleUrls.map(su => fetchScheduleDetails(su)))
      .then(result => {
        resolve(result);
      })
      .catch(e => {
        reject(e);
      });
  });
});
