import React, {Component} from 'react';
import io from 'socket.io-client';
import fetch from 'isomorphic-fetch';
import ClassRoom from './ClassRoom/ClassRoom';
import Login from './CustomComponent/Login';
import TeacherCreateQuestion from './CustomComponent/TeacherCreateQuestion';
import StudentJoinQuestion from './CustomComponent/StudentJoinQuestion';
import StudentQuestionRoom from './CustomComponent/StudentQuestionRoom';
import TeacherQuestionRoom from './CustomComponent/TeacherQuestionRoom';
import {Panel} from 'react-bootstrap';

export default class App extends Component {
  socket = io('http://localhost:5000/class');
  studentJoinRoomId = '';
  studentQuestionTime = '';
  studentQuestionText = '';
  teacherJoinRoomId = '';
  teacherQuestionTime = '';
  teacherQuestionText = '';
  teacherQuestionAnswer = '';
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
    this.handleSJQuestionChange = this.handleSJQuestionChange.bind(this);
    this.handleSQuestionRoomChange = this.handleSQuestionRoomChange.bind(this);
    this.handleTQuestionRoomChange = this.handleTQuestionRoomChange.bind(this);
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
              currentPage: 'student_join_question',
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

  handleTCQuestionChange(currentPage, roomId, questionText, answer, questionTime) {
    this.teacherJoinRoomId = roomId;
    this.teacherQuestionText = questionText;
    this.teacherQuestionTime = questionTime;
    this.teacherQuestionAnswer = answer;
    this.setState({
      currentPage: currentPage,
    });
  }

  handleSJQuestionChange(currentPage, roomId, questionText, questionTime) {
    this.studentJoinRoomId = roomId;
    this.studentQuestionText = questionText;
    this.studentQuestionTime = questionTime;
    this.setState({
      currentPage: currentPage,
    });
  }

  handleSQuestionRoomChange(currentPage) {
    this.setState({
      currentPage: currentPage,
    });
  }

  handleTQuestionRoomChange(currentPage) {
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
          renderDOM = <TeacherCreateQuestion userid={userid} onTCQuestionChange={this.handleTCQuestionChange} socketio={this.socket}/>
          break;
        case 'student_join_question':
          renderDOM = <StudentJoinQuestion userid={userid} onSJQuestionChange={this.handleSJQuestionChange} socketio={this.socket}/>
          break;
        case 'student_question_room':
          renderDOM = <StudentQuestionRoom userid={userid} onSQuestionRoomChange={this.handleSQuestionRoomChange} roomId={this.studentJoinRoomId} questionText={this.studentQuestionText} endTime={this.studentQuestionTime} socketio={this.socket}/>
          break;
        case 'teacher_question_room':
          renderDOM = <TeacherQuestionRoom userid={userid} onTQuestionRoomChange={this.handleTQuestionRoomChange} roomId={this.teacherJoinRoomId} questionText={this.teacherQuestionText} questionAnswer={this.teacherQuestionAnswer} endTime={this.studentQuestionTime} socketio={this.socket}/>
          break;
        default:
          renderDOM = <Login userid={userid} password={password} handleChange={this.handleChange} handleClick={this.handleClick} />
      }
      return (
        <Panel bsStyle="primary" >
        <Panel.Heading>
        <Panel.Title componentClass="h3">Online Assignment</Panel.Title>
        </Panel.Heading>
        <Panel.Body>{renderDOM}</Panel.Body>
        </Panel>
      );
  }


}
