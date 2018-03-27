import React, {Component} from 'react';
import ReactDOM from 'react-dom';

export default class ClassRoomMessageField extends Component {
  //change to scroll when current component update
  componentDidUpdate() {
    const messageList = ReactDOM.findDOMNode(this.refs.messages);
    window.scrollTo(0, messageList.clientHeight + 50);
  }

  render() {
    const myId = this.props.myId;

    //check each messages, extract the list to display
    const messages = this.props.messages.map(
      function(message){
        return (
          <Message
            key={message.msgId}
            msgType={message.type}
            msgUser={message.username}
            action={message.action}
            isMe={(myId === message.uid) ? true : false}
            time={message.time}/>
        );
      }
    );

    return (
      <div className="messages" ref="messages">{messages}</div>
    );
  }
}


//each single message component
class Message extends Component {
  render() {
    if(this.props.msgType === 'system') {
        //system message
        return (
          <div className="one-message system-message">
            {this.props.msgUser} {(this.props.action === 'login') ? 'enter the room' : 'leave the room' }
            <span className="time">{this.props.time}</span>
          </div>
        );
      } else {
          //normal message , check whether sent by myself
          return (
            <div className={this.props.isMe ? 'me one-message':'other one-message'}>
              <p className="time"><span>{this.props.msgUser}</span> {this.props.time}</p>
              <div className="message-content">{this.props.action}</div>
            </div>
          );
        }
    }
}
