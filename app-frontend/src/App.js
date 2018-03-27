import React, {Component} from 'react';
import ClassRoom from './ClassRoom/ClassRoom';
import io from 'socket.io-client';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      uid: '',
      socket: io('http://localhost:5000/class')
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  generatUserid() {
     return new Date().getTime()+""+Math.floor(Math.random()*9+1);
  }

  handleChange(event) {
    this.setState(
      {
        username: event.target.value,
      }
    );
  }

  handleClick(event) {
    event.preventDefault();
    this.handleLogin();
  }

  handleLogin() {
    let username = this.state.username;
    const uid = this.generatUserid();
    if(!username) {
      username = 'guest' +  uid;
    }
    this.setState({
      uid: uid,
      username: username
    });
    this.state.socket.emit('login', {uid: uid, username: username})
  }

  render() {
      let renderDOM;
      if(this.state.uid) {
        renderDOM = <ClassRoom uid={this.state.uid} username={this.state.username} socket={this.state.socket}/>
      } else {
        renderDOM = (
          <div className="login-box">
            <h2>Login</h2>
            <div className="input">
              <input type="text" placeholder="input username" onChange={this.handleChange} />
            </div>
            <div className="submit">
              <button type="button" onClick={this.handleClick}>Submit</button>
            </div>
          </div>
        );
      }
      return (<div>{renderDOM}</div>);
  }


}
