import React, {Component} from 'react';
import io from 'socket.io-client';
//import ClassRoom from './ClassRoom/ClassRoom';
import Login from './CustomComponent/Login';
import TeacherCreateQuestion from './CustomComponent/TeacherCreateQuestion';
import StudentJoinQuestion from './CustomComponent/StudentJoinQuestion';
import StudentQuestionRoom from './CustomComponent/StudentQuestionRoom';
import TeacherQuestionRoom from './CustomComponent/TeacherQuestionRoom';
import {Panel} from 'react-bootstrap';
import {connect} from 'react-redux';

const mapStateToProps = (state, ownProps) => {
  return {
    currentPage: state.currentPage,//// TODO: use react-router
    userid: state.userid
  }
};

class AppView extends Component {
  location = 'http://localhost:5000/';
  //location = 'http://os.ply18.space/';
  socket = io(this.location + 'class');
  studentJoinRoomId = '';
  studentQuestionTime = '';
  studentQuestionText = '';
  teacherJoinRoomId = '';
  teacherQuestionTime = '';
  teacherQuestionText = '';
  teacherQuestionAnswer = '';
  constructor(props) {
    super(props);
    this.handleTCQuestionChange = this.handleTCQuestionChange.bind(this);
    this.handleSJQuestionChange = this.handleSJQuestionChange.bind(this);
    this.handleSQuestionRoomChange = this.handleSQuestionRoomChange.bind(this);
    this.handleTQuestionRoomChange = this.handleTQuestionRoomChange.bind(this);
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
    console.log("now render somethingsssssss");
      let renderDOM;
      const userid = this.props.userid;
      switch (this.props.currentPage) {
        case 'index_login':
          renderDOM = <Login />
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
          console.log("now enter teacher")
          renderDOM = <TeacherQuestionRoom userid={userid} onTQuestionRoomChange={this.handleTQuestionRoomChange} roomId={this.teacherJoinRoomId} questionText={this.teacherQuestionText} questionAnswer={this.teacherQuestionAnswer} endTime={this.studentQuestionTime} socketio={this.socket}/>
          break;
        default:
        console.log("just test current state")
          renderDOM = <Login />
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

const App = connect(
  mapStateToProps,
  null
)(AppView);

export default App;
