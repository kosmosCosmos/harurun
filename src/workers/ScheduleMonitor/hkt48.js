import request from 'request';
import { getScheduleFetchDate } from '../../utils';
import cheerio from 'cheerio';

const SCHEDULE_LIST_URL = 'http://www.hkt48.jp/schedule';
const SCHEDULE_DETAILS_BASE_PATH = 'http://www.hkt48.jp';

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

      // parse title
      const title = $('a[title="公演"]');
      // console.log(title.parent().trim().text());
      let titleString = title.parent()
        .text()
        .trim()
        .split(' ')
        .slice(-1)[0];

      // parse date
      const performanceDate = $('.entry_date').text();
      const date = performanceDate
        .replace('年', '-')
        .replace('月', '-')
        .replace('日', '')
        .trim();
      const content = $('.asset-body').text();
      const timeMatch = content.match(/【開演】(\d+)：(\d+)/);

      let timeString = '';
      let members = [];
      if (!timeMatch) {
        titleString = title.parent().text();
        // return resolve(null);
      }
      else {
        if (timeMatch.length === 3) {
          timeString = `${timeMatch[1]}:${timeMatch[2]}:00`;
        }
        // parse members
        const memberString = content.split('\n').slice(-1)[0];
        members = memberString.split('・').map(mname => {
          return {
            name: mname,
          };
        });
      }

      const dateString = `${date} ${timeString}`;
      const result = {
        title: titleString,
        date: dateString,
        members,
      };
      return resolve(result);
    }
  });
});

export default () => new Promise((resolve, reject) => {
  const fDate = getScheduleFetchDate();

  // fDate.day = 26;
  // fDate.month = 5;


  // build request url
  let monthString = fDate.month.toString();
  if (monthString.length < 2) {
    monthString = `0${monthString}`;
  }
  const scheduleUrl = `${SCHEDULE_LIST_URL}/${fDate.year}/${monthString}`;

  request({
    url: scheduleUrl,
  }, (err, res, body) => {
    if (err) {
      console.log(err);
      return reject(err);
    }
    else {
      const $ = cheerio.load(body, { decodeEntities: true });
      // const trSeletor = `#day${fDate.day}`;
      const tr = $(`#day${fDate.day}`);

      // console.log(tr.html());
      const scheduleContainer = tr.next();
      // console.log(scheduleContainer.length);
      const scheduleElement = scheduleContainer.find('p>a[title="公演"]~');
      // console.log(scheduleElement.length);
      const scheduleUrls = [];
      scheduleElement.each((idx, ele) => {
        const el = $(ele);
        // if (el.text() === 'HKT48劇場　休館日') {
        //   return;
        // }
        scheduleUrls.push(el.attr('href'));
      });

      Promise.all(scheduleUrls.map(su => fetchScheduleDetails(su)))
        .then(result => {
          resolve(result.filter(r => r));
        })
        .catch(e => {
          reject(e);
        });
    }
  });
});
