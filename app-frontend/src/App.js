import React, {Component} from 'react';
import io from 'socket.io-client';
import fetch from 'isomorphic-fetch';
import ClassRoom from './ClassRoom/ClassRoom';
import Login from './CustomComponent/Login';
import TeacherCreateQuestion from './CustomComponent/TeacherCreateQuestion';

export default class App extends Component {
  socket = io('http://localhost:5000/class');
  constructor(props) {
    super(props);
    this.state = {
      userid: '',
      password: '',
      //roomId: '',
      currentPage: 'index_login',//switch page by this state
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleTCQuestionChange = this.handleTCQuestionChange.bind(this);
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

  checkLogin(userid, password) {
    const uri = 'http://localhost:5000/Login';
    const data = {
      "userid": userid,
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
        //isOK == 1 mean login data is vaild
        if(json.isOk === '1') {
          return {
            result: true,
            role: json.role,
          };
        }else {
          console.log("login error by login data");
          return {
            result: false
          };
        }
      }
    ).catch(
      function(exception) {
        console.log('login error by exception', exception);
        return {
          result: false
        };
      }
    );
  }

  handleLogin() {
    let userid = this.state.userid;
    let password = this.state.password;
    this.checkLogin(userid, password).then(
        //use "=>" do not create a new this and this.setState issue solved
        (isVaild) => {
        if(isVaild.result === true) {
          if(isVaild.role === 'teacher') {
            this.setState({
              currentPage: 'teacher_create_question',
            });
          }
          if(isVaild.role === 'student') {
            this.setState({
              currentPage: 'student_enter_question',
            });
          }
          /*
          let loginObj = {uid: uid, userid: userid};
          this.socket.emit('joined', loginObj, roomId);
          return true;
          */
        }
      }
    );
    return false;
  }

  handleTCQuestionChange(currentPage) {
    this.setState({
      currentPage: currentPage,
    });
  }

  render() {
      let renderDOM;
      const userid = this.state.userid;
      const password = this.state.password;
      //const roomId = this.state.roomId;

      switch (this.state.currentPage) {
        case 'index_login':
          renderDOM = <Login userid={userid} password={password} handleChange={this.handleChange} handleClick={this.handleClick} />
          break;
        case 'teacher_create_question':
          console.log("teacher_create_question");
          renderDOM = <TeacherCreateQuestion userid={userid} onTCQuestionChange={this.handleTCQuestionChange}/>
          break;
        case 'student_enter_question':
          break;
        default:
          renderDOM = <Login userid={userid} password={password} handleChange={this.handleChange} handleClick={this.handleClick} />
      }
      return (<div>{renderDOM}</div>);
  }


}
