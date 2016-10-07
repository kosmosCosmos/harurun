import React from 'react';
import marked from 'marked';

const renderScheduleList = () => {
  // build mdText
  const { schedules: { data: schedules } } = window.store;
  if (!schedules) {
    return null;
  }

  const mdTextHeader = '|日期 |时间 |节目 |\n|:---|:---|:---|';
  const mdText = schedules.reduce((a, b) => {
    const dateStr = b.date.replace(/^\d+-/, '').replace('-', '/');
    const bStr = `| ${dateStr} ${b.roomAlias} | ${b.time} | ${b.description} |`;
    const next = a + '\n' + bStr;
    return next;
  }, mdTextHeader);

  return (
    <div className="markdown-body" dangerouslySetInnerHTML={{ __html: marked(mdText) }} />
  );
};

const HeadlessScheduleList = (props) => (
  <div>
    <div className="propTypeDescription" style={{ paddingTop: '0px' }}>
      {renderScheduleList()}
    </div>
  </div>
);

export default HeadlessScheduleList;
