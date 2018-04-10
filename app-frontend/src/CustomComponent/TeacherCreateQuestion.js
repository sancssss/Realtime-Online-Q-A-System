import React, {Component} from 'react';
import { Button, Form, FormGroup, FormControl, ControlLabel, Col, Glyphicon, ToggleButtonGroup, ToggleButton} from 'react-bootstrap';
import fetch from 'isomorphic-fetch';
import { connect } from 'react-redux';
import { teacherCreateRoom, changeCurrentPage } from '../Actions';

const mapStateToProps = (state, ownProps) => {
  return {
    userid: state.loginReducer.userid
  }
};

//RoomData:{roomId, questionText, answerValue ,endTime}
const mapDispatchProps = (dispatch) => {
  return {
    teacherCreateRoom: roomData => dispatch(teacherCreateRoom(roomData)),
    changeCurrentPage: pageName => dispatch(changeCurrentPage(pageName))
  }
}

class TeacherCreateQuestionView extends Component {
  location = 'http://localhost:5000/';
  //location = 'http://os.ply18.space/';
  constructor(props) {
    super(props);
    this.state = {
      questionText: '',
      minuteText: '3',
      answerValue: [],
    }
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleMinuteChange = this.handleMinuteChange.bind(this);
    this.handleAnswerChange = this.handleAnswerChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleTextChange(event) {
    const target = event.target;
    const value = target.value;
    this.setState(
      {
        questionText: value,
      }
    );
  }

  handleMinuteChange(event) {
    const target = event.target;
    const value = target.value;
    this.setState(
      {
        minuteText: value,
      }
    );
  }

  handleAnswerChange(event) {
    this.setState(
      {
        answerValue: event
      }
    );
  }

  createQuestion() {
    console.log("createA start");
    const userid = this.props.userid;
    const questionText = this.state.questionText;
    const answerValue = this.state.answerValue;
    const minuteText = this.state.minuteText;
    const location = this.location + 'QuickQuestion';
    const uri = location;
    const data = {
      "userid": userid,
      "questionText": questionText,
      "answerValue": answerValue,
      "minuteText": minuteText
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
        return response.json();
    }).then(
      function(json) {
        //isOK == 1 mean login data is vaild
        if(json.isOk === '1') {
          return {
            result: true,
            roomId: json.room_id,//server return a new room id
            endTime: json.end_time//server caculate the end time return to the client
          };
        }else {
          console.log("error by inpput data");
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

  handleSubmit(event) {
    this.createQuestion().then(
      //use "=>" do not create a new this and this.setState issue solved
      (data) => {
      if(data.result === true) {
        //console.log("handleSubmitsuccessful:" + data.result);
        let joinObj = {roomid: data.roomId};
        let roomData = {
          teacherCreateRoomId: data.roomId,
          teacherQuestionTime: this.state.minuteText,// TODO: should use endTime return by server
          teacherQuestionText: this.state.questionText,
          teacherQuestionAnswer: this.state.answerValue
        }
        this.props.socketio.emit('joined', joinObj, String(data.roomId));//second argument for socketio message, third argument for socketio 'room'
        this.props.teacherCreateRoom(roomData);
        this.props.changeCurrentPage('teacher_question_room');
      } else {
        console.log("handleSubmitfailed:" + data.result);
        this.props.changeCurrentPage('teacher_create_question');
      }
    }
    );
    event.preventDefault();
    this.props.changeCurrentPage('teacher_create_question');
  }

  render() {
    const questionText = this.state.questionText;
    const minuteText = this.state.minuteText;
    const userid = this.props.userid;
    const answerValue = this.answerValue;
    const handleAnswerChange = this.handleAnswerChange;
    const handleSubmit = this.handleSubmit;
    return (
      <Form horizontal>
          <FormGroup>
            <Col xs={8} xsOffset={1}>
          <h5>{userid} | Quick Assignment</h5>
            </Col>
          </FormGroup>
          <FormGroup>
          <Col xs={5} xsOffset={1}>
              <h5>Input Question</h5>
          </Col>
          </FormGroup>
          <FormGroup controlId="formHorizontalText">
            <Col componentClass={ControlLabel} xs={1} xsOffset={1}>
              <h4><Glyphicon glyph="pencil" /></h4>
            </Col>
            <Col xs={7}>
              <FormControl name="question_text" type="text" placeholder="input your question" value={questionText} onChange={this.handleTextChange} />
            </Col>
          </FormGroup>
          <FormGroup>
          <Col xs={5} xsOffset={1}>
              <h5>Select Answer</h5>
          </Col>
          </FormGroup>
          <FormGroup controlId="formHorizontalText">
            <Col componentClass={ControlLabel} xs={1} xsOffset={1}>
              <h4><Glyphicon glyph="ok" /></h4>
            </Col>
            <Col xs={7}>
              <ToggleButtonGroupControlled onChange={handleAnswerChange} value={answerValue}/>
            </Col>
          </FormGroup>
          <FormGroup>
          <Col xs={5} xsOffset={1}>
              <h5>Period Of Validity</h5>
          </Col>
          </FormGroup>
          <FormGroup controlId="formHorizontalTime">
            <Col componentClass={ControlLabel} xs={1} xsOffset={1}>
              <h4><Glyphicon glyph="time" /></h4>
            </Col>
            <Col xs={5}>
              <FormControl name="period_validity" type="text" placeholder="input the valid time" value={minuteText} onChange={this.handleMinuteChange} />
            </Col>
            <Col xs={5}>
              <h4>minute(s)</h4>
            </Col>
          </FormGroup>
          <FormGroup>
          <Col xsOffset={2} xs={7}>
          <Button type="submit" bsStyle="primary" onClick={handleSubmit}>Create now</Button>
          </Col>
          </FormGroup>
      </Form>
    );
  }
}

class ToggleButtonGroupControlled extends React.Component {
  render() {
    return (
      <ToggleButtonGroup
        type="checkbox"
        value={this.props.value}
        onChange={this.props.onChange}
      >
        <ToggleButton value={'A'}>A</ToggleButton>
        <ToggleButton value={'B'}>B</ToggleButton>
        <ToggleButton value={'C'}>C</ToggleButton>
        <ToggleButton value={'D'}>D</ToggleButton>
      </ToggleButtonGroup>
    );
  }
}

const TeacherCreateQuestion = connect(
  mapStateToProps,
  mapDispatchProps
)(TeacherCreateQuestionView);

export default TeacherCreateQuestion;
