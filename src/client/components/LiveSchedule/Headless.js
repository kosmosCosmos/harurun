import React from 'react';
import marked from 'marked';
import parseScheduleTime from '../common/parseScheduleTime';

const renderScheduleList = () => {
  // build mdText
  const { schedules: { data: schedules } } = window.store;
  if (!schedules) {
    return null;
  }

  const mdTextHeader = '|日期 |时间 |节目 |\n|:---|:---|:---|';
  const mdText = schedules.reduce((a, b) => {
    const dateStr = b.date.replace(/^\d+-/, '').replace('-', '/');

    // build time string by local timezone
    const scheduleTime = parseScheduleTime(b.time);
    // for output schedule png use china timezone
    const currentTimezoneOffset = -480;
    const hourOffset = (-540 - currentTimezoneOffset) / 60;
    let { startHour, endHour, startMinute, endMinute } = scheduleTime.data;
    startHour = +startHour + hourOffset;
    endHour = +endHour + hourOffset;

    if (startHour < 0) {
      startHour = 24 + startHour;
    }
    if (endHour < 0) {
      endHour = 24 + endHour;
    }
    const timeString = `${startHour}:${startMinute}~${endHour}:${endMinute}`;

    const bStr = `| ${dateStr} ${b.roomAlias} | ${timeString} | ${b.description} |`;
    const next = a + '\n' + bStr;
    return next;
  }, mdTextHeader);

  return (
    <div className="markdown-body" dangerouslySetInnerHTML={{ __html: marked(mdText) }} />
  );
};

const renderFootnote = () => {
  const { schedules: { timestamp } } = window.store;
  const ts = new Date(timestamp);
  const timeString = ts.toLocaleString('zh');
  return (<div className="footnote">更新于：{timeString}</div>);
};

const HeadlessScheduleList = (props) => (
  <div>
    <div className="propTypeDescription" style={{ paddingTop: '0px' }}>
      {renderScheduleList()}
      {renderFootnote()}
    </div>
  </div>
);

export default HeadlessScheduleList;
