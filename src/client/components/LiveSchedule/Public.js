import React from 'react';
import marked from 'marked';
import { Card, CardActions, CardHeader, CardTitle, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import parseScheduleTime from '../common/parseScheduleTime';

const ScheduleMetadata = [
  {
    key: 'akb48',
    name: 'AKB48 剧场公演',
    icon: '/images/header_groupTab_akb_pc.png',
  },

  {
    key: 'ske48',
    name: 'SKE48 剧场公演',
    icon: '/images/header_groupTab_ske_pc.png',
  },

  {
    key: 'nmb48',
    name: 'NMB48 剧场公演',
    icon: '/images/header_groupTab_nmb_pc.png',
  },

  {
    key: 'hkt48',
    name: 'HKT48 剧场公演',
    icon: '/images/header_groupTab_hkt_pc.png',
  },

  {
    key: 'ngt48',
    name: 'NGT48 剧场公演',
    icon: '/images/takakura_moeka.jpg',
  },

];

const renderPerformancePanels = () => {

  return ScheduleMetadata.map(meta => {
    let schedule = window.store.performance[meta.key];

    if (schedule && schedule.length !== 0) {
      schedule = schedule[0];
    }
    let title;
    let members;
    let date;

    if (!schedule) {
      title = '休馆日';
    }
    else {
      title = schedule.title;
      date = schedule.date;
      members = schedule.members.map(m => m.name).join('・');
    }

    return (
      <div
        key={meta.key}
        className="col-xs-12 col-sm-6 col-md-6 col-lg-3"
        style={{ paddingBottom: 16 }}
      >
        <Card className="box">
          <CardHeader
            style={{ textAlign: 'left' }}
            title={meta.name}
            subtitle={date}
            avatar={meta.icon}
          />
          <CardTitle title="" subtitle={title} />
          <CardText>
            {members}
          </CardText>
          <CardActions />
        </Card>
      </div>
    );
  });
};

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
    const currentTimezoneOffset = new Date().getTimezoneOffset();
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

const renderRoomButtons = () => {
  const { rooms } = window.store;
  if (!rooms) {
    return null;
  }

  return rooms.map(room => {
    const url = `http://www.zhanqi.tv/${room.domain}`;
    return (
      <a key={room.id} target="_blank" href={url}>
        <RaisedButton label={room.title} secondary={room.highlight} />
      </a>
    );
  });
};

const LiveSchedulePublic = (props) => (
  <div className="row center-xs center-sm center-md center-lg">

    <Paper className="page">
      <div className="row center-xs center-sm center-md center-lg">
        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <div className="headerBanner row start-xs start-sm start-md start-lg" >
            <div className="headerImage col-xs-0 col-sm-0 col-md-5 col-lg-6">
              <img alt="discography image" src="images/akb_single46th.jpg" />
            </div>
            <div className="col-xs-12 col-sm-12 col-md-7 col-lg-6">

              <div className="">
                {renderRoomButtons()}
              </div>

              <div className="propTypeDescription">
                {renderScheduleList()}
              </div>

            </div>
          </div>
        </div>
      </div>
    </Paper>

    <div className="page">
      <div className="row" style={{ padding: '0 0 16px 0' }}>
        {renderPerformancePanels()}

        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-3" style={{ paddingBottom: 16 }}>
          <Card className="box">
            <CardTitle title="浏览器插件下载" />
            <CardText>
              <div className="row">
                <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">

                  <a target="__blank" href="/downloads/gyaruppi_1.0.9.crx">
                    <FlatButton
                      style={{ width: 96, height: 96 }}
                      icon={<img src="/images/app-chromium.png" />}
                    />
                  </a>

                  <div>直接下载</div>
                  <div>兼容Chromium系浏览器</div>
                </div>
                <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                  <a target="__blank" href="https://chrome.google.com/webstore/detail/gyaruppi/ghnfiadioahomhmocmhgjhpmhcmcggjg">
                    <FlatButton
                      style={{ width: 96, height: 96 }}
                      icon={<img src="/images/app-webstore.png" />}
                    />
                  </a>
                  <div>市场安装</div>
                </div>
              </div>
            </CardText>
          </Card>
        </div>
      </div>
    </div>

    <Paper className="page">
      <div className="row center-xs center-sm center-md center-lg">
        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
          Powered by <a href="https://github.com/larvata/harurun">harurun</a>
        </div>
      </div>
    </Paper>

  </div>

);

LiveSchedulePublic.propTypes = {
  children: React.PropTypes.string,
};

LiveSchedulePublic.defaultProps = {
  children: null,
};

export default LiveSchedulePublic;
