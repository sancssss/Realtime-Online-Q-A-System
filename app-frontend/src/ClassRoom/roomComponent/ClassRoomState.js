import React, {Component} from 'react';

export default class ClassRoomState extends Component {
  render() {
    return (<div className="room-state">online users: {this.props.onlineCount}, online User List:{this.props.userList} </div>)
  }
}
