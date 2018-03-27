import React, {Component} from 'react';
import ClassRoomState from './roomComponent/ClassRoomState';
import ClassRoomMessage from './roomComponent/ClassRoomMessage';
import ClassRoomInput from './roomComponent/ClassRoomInput';

export default class ClassRoom extends Component {
  constructor(props) {
    super(props);
    const socket = this.props.socket;
    this.state = {
      myId: this.props.uid,//current use id
      myName: this.props.username,
      uid: this.props.uid,//use this to distinguish all user
      username: this.props.username,
      socket: socket,
      messages: [],//message list
      onlineUsers: {},
      onlineCount: 0,
      userHtml: '',//todo: display online user list
    };
    //listen to socket.io
    this.ready();
  }
  //count online users and state
  handleUsers() {
    const users = this.state.onlineUsers;
    let userHtml = '';
    let separator = '';
    for (let key in users) {
      userHtml += separator + users[key];
      separator = ',';
    }
    this.setState({userHtml: userHtml});
  }

  generateMsgId() {
    return new Date().getTime() + "" + Math.floor(Math.random()*899+100);
  }

  //hh-mm
  generateTime() {
    let hour = new Date().getHours(),
        minute = new Date().getMinutes();
    hour = (hour===0) ? '00' : hour;
    minute = (minute < 10) ? '0' + minute : minute;
    return hour + ':' + minute;
  }

  //update system message
  updateSystemMsg(obj, action) {
    //get the current message list
      let messages = this.state.messages;
      const newMsg = {
        type: 'system',//msg type
        username: obj.user.username,
        uid: obj.uid,//user id
        action: action,//login or logout
        msgId: this.generateMsgId(),//message id(randomly generate)
        time: this.generateTime(),
      };
      messages = messages.concat(newMsg);
      this.setState(
        {
          onlineCount: obj.onlineCount,
          onlineUsers: obj.onlineUsers,//username string collection
          messages: messages
        }
      );
      this.handleUsers();
  }

  //update normal message
  updateMsg(obj, action) {
    //get the current message list
      let messages = this.state.messages;
      const newMsg = {
        type: 'system',//msg type
        username: obj.user.username,
        uid: obj.uid,//user id
        action: action,//login or logout
        msgId: this.generateMsgId(),//message id(randomly generate)
        time: this.generateTime(),
      };
      messages = messages.concat(newMsg);
      this.setState(
        {
          messages: messages
        }
      );
  }

  handleLogout() {
    window.location.reload();
  }

  ready() {
    const socket = this.state.socket;

    //client monitor login
    socket.on('joined', (obj) => {
      this.updateSystemMsg(obj, 'login');
    });

    //client monitor logout
    socket.on('left', (obj) => {
      this.updateSystemMsg(obj, 'logout');
    });

    //client monitor send msg
    socket.on('text', (obj) => {
      this.updateMsg(obj);
    })
  }

  render() {
    return (
      <div className="class-room">
        <div classRoom="title">
          <div className="title-name">
            prof. Chen classroom | student:{this.state.myName}
          </div>
          <div className="logout-button">
            <button onClick={this.handleLogout}>logout</button>
          </div>
        </div>
          <ClassRoomState onlineCount={this.state.onlineCount} userhtml={this.state.userHtml}/>
          <div ref="message-area">
            <ClassRoomMessage messages={this.state.messages} myId={this.state.myId} />
            <ClassRoomInput myId={this.state.myId} myName={this.state.myName} socket={this.state.socket} />
          </div>
      </div>
    );
  }


}
