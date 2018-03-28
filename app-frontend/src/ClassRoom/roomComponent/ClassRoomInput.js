import React, {Component} from 'react';

export default class ClassRoomInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      socket: this.props.socket,
      message: '',
      myId: this.props.myId,
      myName: this.props.myName,
      roomId: this.props.roomId
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  handleChange(e) {
    this.setState({
      message: e.target.value,
    });
  }

  handleClick(e) {
    e.preventDefault();
    this.sendMessage();
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.sendMessage();
    }
    return false;
  }

  sendMessage(e) {
    const message = this.state.message;
    const socket = this.state.socket;
    if (message) {
      const object = {
        uid: this.state.myId,
        username: this.state.myName,
        message: message
      }
      console.log('sent object'+  JSON.stringify(object));
      socket.emit('text',  object, this.state.roomId);
      this.setState({message: ''});
    }
    return false;
  }

  render() {
    return (
      <div className="input-box">
        <div className="input">
          <input type="text" maxLength="140" placeholder="text something..." value={this.state.message} onChange={this.handleChange} onKeyPress={this.handleKeyPress}/>
        </div>
        <div className="button">
          <button type="button" onClick={this.handleClick}>submit</button>
        </div>
      </div>
    );
  }

}
