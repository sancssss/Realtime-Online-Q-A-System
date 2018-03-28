import React, {Component} from 'react';
import ClassRoom from './ClassRoom/ClassRoom';
import io from 'socket.io-client';
import fetch from 'isomorphic-fetch';
import { Button, Form, FormGroup, FormControl, ControlLabel, Col, Glyphicon } from 'react-bootstrap';

export default class App extends Component {
  socket = io('http://localhost:5000/class');
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      roomId: '',
      uid: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  generatUserid() {
     return new Date().getTime()+""+Math.floor(Math.random()*9+1);
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState(
      {
        [name]: value,
      }
    );
  }

  handleClick(event) {
    event.preventDefault();
    this.handleLogin();
  }

  checkLogin(username, password) {
    const uri = 'http://localhost:5000/Login';
    const data = {
      "username": username,
      "password": password
    }
    return fetch(uri, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "same-origin"
    }).then(
      function(response) {
        //console.log("response:" + response.json());
        return response.json();
    }).then(
      function(json) {
        console.log("obj.json:" + json.isOk);
        if(json.isOk === '1') {
          return true;
        }else {
          console.log("login error by login data");
          return false;
        }
      }
    ).catch(
      function(exception) {
        console.log('login error by exception', exception);
        return false;
      }
    );
  }

  handleLogin() {
    let username = this.state.username;
    let password = this.state.password;
    let roomId = this.state.roomId;
    const uid = this.generatUserid();
    if(!username) {
      username = 'guest' +  uid;
    }
    this.checkLogin(username, password).then(
        //use "=>" do not create a new this and this.setState issue solved
        (isVaild) => {
        if(isVaild === true) {
          this.setState({
            uid: uid,
            username: username
          });

          let loginObj = {uid: uid, username: username};
          this.socket.emit('joined', loginObj, roomId);
          return true;
        }
      }
    );
    return false;
  }

  render() {
      let renderDOM;
      if(this.state.uid) {
        renderDOM = <ClassRoom roomId={this.state.roomId} uid={this.state.uid} username={this.state.username} socket={this.socket}/>
      } else {
        const username = this.state.username;
        const password = this.state.password;
        const roomId = this.state.roomId;
        renderDOM = (
              <Form horizontal>
                  <FormGroup>
                    <Col xs={5} xsOffset={1}>
                  <h2>Start</h2>
                    </Col>
                  </FormGroup>
                  <FormGroup controlId="formHorizontalText">
                    <Col componentClass={ControlLabel} xs={1} xsOffset={1}>
                      <h4><Glyphicon glyph="user" /></h4>
                    </Col>
                    <Col xs={7}>
                      <FormControl name="username" type="text" placeholder="input your username" value={username} onChange={this.handleChange} />
                    </Col>
                  </FormGroup>
                  <FormGroup controlId="formHorizontalPassword">
                    <Col componentClass={ControlLabel} xs={1} xsOffset={1}>
                      <h4><Glyphicon glyph="eye-close" /></h4>
                    </Col>
                    <Col xs={7}>
                      <FormControl name="password" type="password" placeholder="input your password" value={password} onChange={this.handleChange} />
                    </Col>
                  </FormGroup>
                  <FormGroup controlId="formHorizontalPassword">
                    <Col componentClass={ControlLabel} xs={1} xsOffset={1}>
                      <h4><Glyphicon glyph="log-in" /></h4>
                    </Col>
                    <Col xs={7}>
                      <FormControl name="roomId" type="text" placeholder="input classroom ID" value={roomId} onChange={this.handleChange} />
                    </Col>
                  </FormGroup>
                  <FormGroup>
                  <Col xsOffset={2} xs={7}>
                  <Button type="submit" bsStyle="primary" onClick={this.handleClick}>Enter Now</Button>
                  </Col>
                  </FormGroup>
              </Form>
        );
      }
      return (<div>{renderDOM}</div>);
  }


}
