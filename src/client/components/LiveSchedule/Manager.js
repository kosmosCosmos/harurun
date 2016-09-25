/* eslint-disable no-underscore-dangle */
import React from 'react';
import request from 'superagent';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import CancelIcon from 'material-ui/svg-icons/navigation/cancel';
import Snackbar from 'material-ui/Snackbar';


export default class LiveScheduleManager extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      authCode: '',
      authenticated: !!window.authenticated,
      rooms: window.store.rooms,
      schedules: [],
      showMessage: false,
      messageText: '',
    };

    this.authCodeChangeHander = this.authCodeChangeHander.bind(this);
    this.authCheckHandler = this.authCheckHandler.bind(this);

    this.clearSchedulesHandler = this.clearSchedulesHandler.bind(this);
    this.submitScheduleHanlder = this.submitScheduleHanlder.bind(this);

    this.messageCloseHandler = this.messageCloseHandler.bind(this);
  }

  componentDidMount() {
    if (this.state.authenticated) {
      this._fetchSchedules();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // this._fetchSchedules();
  }

  authCodeChangeHander(comp, value) {
    this.setState({
      authCode: value,
    });
  }

  createGetDateValueHandler(schedule) {
    return (event, dateVal) => {
      const { schedules } = this.state;
      const dateString = this._convertDateToDateString(dateVal);
      schedule.date = dateString;
      schedule.isEmpty = false;

      const newSchedules = this.addEmptyRow(schedules);
      this.setState({
        schedules: newSchedules,
      });
    };
  }

  createChangeRoomHandler(schedule) {
    return (event, selectionIndex, roomKey) => {
      const { schedules, rooms } = this.state;

      const room = rooms.find(r => roomKey === this._getRoomKey(r));
      if (!room) {
        console.error(`Can not find matched room for ${roomKey} in`, rooms);
        const messageText = '找不到对应的直播间信息';
        this.setState({
          messageText,
          showMessage: true,
        });
        return;
      }

      schedule.roomKey = roomKey;
      schedule.roomId = room.id;
      schedule.roomProvider = room.provider;
      schedule.roomAlias = room.alias;
      schedule.isEmpty = false;

      const newSchedules = this.addEmptyRow(schedules);
      this.setState({
        schedules: newSchedules,
      });
    };
  }

  createDeleteScheduleHandler(schedule) {
    return (event) => {
      let { schedules } = this.state;
      schedules = schedules.filter(sch => sch !== schedule);
      this.setState({
        schedules,
      });
    };
  }

  createTimeChangeHandler(schedule) {
    return (event, timeString) => {
      const { schedules } = this.state;
      const scheduleTime = this._parseScheduleTime(timeString);

      schedule.time = timeString;
      schedule.timeValidate = scheduleTime.validated;
      schedule.isEmpty = false;
      const newSchedules = this.addEmptyRow(schedules);
      this.setState({
        schedules: newSchedules,
      });
    };
  }

  createDescriptionChangeHandler(schedule) {
    return (event, description) => {
      const { schedules } = this.state;
      schedule.description = description;
      schedule.isEmpty = false;

      const newSchedules = this.addEmptyRow(schedules);
      this.setState({
        schedules: newSchedules,
      });
    };
  }

  addEmptyRow(schedules) {
    const { rooms } = this.state;

    // if the last schedule is already an empty schedule do not init it, just retrun.
    if (schedules
      && schedules.length > 0
      && schedules[schedules.length - 1].isEmpty) {
      return schedules;
    }

    const newSchedules = (schedules || []);

    // get last date
    let lastDate;
    if (newSchedules.length > 0) {
      const lastSchedule = newSchedules[newSchedules.length - 1];
      lastDate = lastSchedule.date;
    }

    // get default roomKey
    if (!rooms || rooms.length === 0) {
      return this.setState({
        messageText: '获取直播间信息失败',
        showMessage: true,
      });
    }
    const defaultRoom = rooms[0];
    const roomKey = this._getRoomKey(defaultRoom);

    newSchedules.push({
      date: lastDate,
      time: '',
      timeValidate: false,
      description: '',
      roomKey,
      roomId: defaultRoom.id,
      roomProvider: defaultRoom.provider,
      roomAlias: defaultRoom.alias,
      isEmpty: true,
    });

    return newSchedules;
  }

  _fetchSchedules() {
    request
      .get('/api/manage/schedule')
      .end((err, res) => {
        const schedules = res.body;
        schedules.forEach(schedule => {
          // validate time string
          const validateResult = this._parseScheduleTime(schedule.time);
          schedule.validated = validateResult.validated;
        });

        this.setState({ schedules: this.addEmptyRow(schedules) });
      });
  }

  authCheckHandler() {
    const { authCode } = this.state;
    request
      .post('/api/auth')
      .send({ authCode })
      .end((err, res) => {
        if (res.body && res.body.result) {
          if (res.body.result === 'ok') {
            this.setState({ authenticated: true });
            this._fetchSchedules();
          }
        }
      });
  }

  messageCloseHandler() {
    console.log('messageCloseHandler');
    this.setState({
      showMessage: false,
    });
  }

  clearSchedulesHandler() {
    const newSchedules = this.addEmptyRow();
    this.setState({
      schedules: newSchedules,
    });
  }

  submitScheduleHanlder() {
    const { schedules } = this.state;
    const newSchedules = this._purifySchedules(schedules);

    request
      .post('/api/manage/schedule')
      .send(newSchedules)
      .end((err, res) => {
        let messageText = '';
        if (res.body.result === 'ok') {
          messageText = '更新成功';
        }
        else {
          messageText = '更新失败';
        }
        this.setState({
          messageText,
          showMessage: true,
        });
      });
  }

  _getRoomKey(room) {
    return `${room.provider}#${room.id}`;
  }

  _purifySchedules(schedules) {
    if (!schedules) {
      return null;
    }

    const newSchedules = schedules.filter(sch => {
      if (sch.isEmpty) {
        return false;
      }

      if (!sch.date) {
        return false;
      }

      if (!sch.time) {
        return false;
      }

      if (!sch.description) {
        return false;
      }

      return true;
    });

    return newSchedules;
  }

  _convertDateToDateString(dateObject) {
    const year = dateObject.getFullYear();
    const month = dateObject.getMonth() + 1;
    const date = dateObject.getDate();
    return `${year}-${month}-${date}`;
  }

  _parseDateStringToDate(dateString){
    if (!dateString) {
      return null;
    }
    const matched = dateString.match(/(\d+)-(\d+)-(\d+)/);
    if (!matched || matched.length != 4) {
      return null;
    }

    const [_all, year, month, day] = matched;

    const result = new Date(year, (+month - 1), day);
    return result;
  }

  _parseScheduleTime(timeString){
    const validateRegex =  /^([0-9]?[0-9]):([0-5][0-9])~([0-9]?[0-9]):([0-5][0-9])$/;
    const matched = timeString.match(validateRegex);
    const result = {
      validated: false,
      data: {
        startHour: null,
        startMinute: null,
        endHour: null,
        endMinute: null,
        timezone: 9,
      },
    };

    if (!timeString) {
      // ignore the validate for the empty time
      result.validated = true;
      return result;
    }

    if (matched && matched.length === 5) {
      result.validated = true;
      result.data.startHour = matched[1];
      result.data.startMinute = matched[2];
      result.data.endHour = matched[3];
      result.data.endMinute = matched[4];
    }

    return result;
  }

  renderRoomDropdownList() {
    const { rooms } = this.state;
    const result = rooms.map(room => {
      const roomKey = this._getRoomKey(room);
      return (
        <MenuItem key={roomKey} value={roomKey} primaryText={room.alias} />
      );
    });
    return result;
  }

  renderMainParts() {
    const { schedules } = this.state;
    const submitButtonDisabled = schedules.some(sch => !sch.timeValidate && !sch.isEmpty);
    return (
      <div>
        <div>
          <RaisedButton label="清空" onClick={this.clearSchedulesHandler} />
          <RaisedButton label="提交" secondary={true} disabled={submitButtonDisabled} onClick={this.submitScheduleHanlder} />
        </div>

        <div>
          {
            schedules &&
            schedules.map((sch, idx) => {
              const date = this._parseDateStringToDate(sch.date);
              const { timeValidate, isEmpty } = sch;
              // if current schedule is empty do not raise error of schedule time
              const isTimeValidated = timeValidate || isEmpty;

              return (
                <div key={idx}>
                  <DatePicker
                    hintText="日期"
                    style={{ width: '120px', display: 'inline-block', verticalAlign: 'middle' }}
                    autoOk={true}
                    onChange={this.createGetDateValueHandler(sch)}
                    value={date}
                  />

                  <TextField
                    hintText="时间"
                    style={{ width: '120px', verticalAlign: 'middle' }}
                    value={sch.time}
                    onChange={this.createTimeChangeHandler(sch)}
                    errorText={isTimeValidated ? '' : '时间格式不正确'}
                  />

                  <TextField
                    hintText="番组描述"
                    style={{ width: '420px', verticalAlign: 'middle' }}
                    value={sch.description}
                    onChange={this.createDescriptionChangeHandler(sch)}
                  />

                  <SelectField
                    value={sch.roomKey}
                    style={{ width: '150px', display: 'inline-block', verticalAlign: 'middle', height: '52px' }}
                    onChange={this.createChangeRoomHandler(sch)}
                  >
                    {this.renderRoomDropdownList()}
                  </SelectField>

                  {
                    !isEmpty && <IconButton tooltip="删除该条" style={{top: '7px'}} onClick={this.createDeleteScheduleHandler(sch)}>
                      <CancelIcon />
                    </IconButton>
                  }
                </div>
              );
            })
          }
        </div>


      </div>

    )
  }

  render() {
    const {
      authenticated,
      showMessage,
      messageText,
     } = this.state;
    return (
      <div>
        <Dialog
          modal={true}
          open={!authenticated}
        >
          <TextField
            hintText="Hint Text"
            onChange={this.authCodeChangeHander}
          />
          <RaisedButton label="验证" onTouchTap={this.authCheckHandler} />
        </Dialog>

        <Snackbar
          open={showMessage}
          message={messageText}
          autoHideDuration={4000}
          onRequestClose={this.messageCloseHandler}
        />

        {authenticated && this.renderMainParts()}
      </div>
    );
  }
}
