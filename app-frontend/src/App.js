import React, {Component} from 'react';
import io from 'socket.io-client';
import Login from './CustomComponent/Login';
import TeacherCreateQuestion from './CustomComponent/TeacherCreateQuestion';
import StudentJoinQuestion from './CustomComponent/StudentJoinQuestion';
import StudentQuestionRoom from './CustomComponent/StudentQuestionRoom';
import TeacherQuestionRoom from './CustomComponent/TeacherQuestionRoom';
import {Panel} from 'react-bootstrap';
import {connect} from 'react-redux';

const mapStateToProps = (state, ownProps) => {
  return {
    currentPage: state.pageChangeReducer.currentPage,//// TODO: use react-router
    userid: state.loginReducer.userid
  }
};

class AppView extends Component {
  location = 'http://localhost:5000/';
  //location = 'http://os.ply18.space/';
  socket = io(this.location + 'class');

  render() {
    console.log("now re-render something");
      let renderDOM;
      const userid = this.props.userid;
      switch (this.props.currentPage) {
        case 'index_login':
          renderDOM = <Login />
          break;
        case 'teacher_create_question':
          renderDOM = <TeacherCreateQuestion socketio={this.socket} />
          break;
        case 'student_join_question':
          renderDOM = <StudentJoinQuestion socketio={this.socket}/>
          break;
        case 'student_question_room':
          renderDOM = <StudentQuestionRoom socketio={this.socket}/>
          break;
        case 'teacher_question_room':
          renderDOM = <TeacherQuestionRoom socketio={this.socket}/>
          break;
        default:
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
