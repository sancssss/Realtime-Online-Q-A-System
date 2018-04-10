import React, {Component} from 'react';
import {
  Button,
  Form,
  FormGroup,
  FormControl,
  ControlLabel,
  Col,
  Glyphicon,
  ToggleButtonGroup,
  ToggleButton
} from 'react-bootstrap';
import fetch from 'isomorphic-fetch';
import {connect} from 'react-redux';
import {teacherCreateRoom, changeCurrentPage} from '../Actions';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Slider from 'material-ui/Slider';
import Chip from 'material-ui/Chip';

const mapStateToProps = (state, ownProps) => {
  return {userid: state.loginReducer.userid}
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
      minuteText: 3,
      answerValue: ''
    }
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleMinuteChange = this.handleMinuteChange.bind(this);
    this.handleAnswerChange = this.handleAnswerChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleTextChange(event) {
    const target = event.target;
    const value = target.value;
    this.setState({questionText: value});
  }

  handleMinuteChange(event, value) {
    this.setState({minuteText: value});
  }

  handleAnswerChange(event) {
    this.setState({answerValue: event});
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
    }).then(function(response) {
      return response.json();
    }).then(function(json) {
      //isOK == 1 mean login data is vaild
      if (json.isOk === '1') {
        return {
          result: true, roomId: json.room_id, //server return a new room id
          endTime: json.end_time //server caculate the end time return to the client
        };
      } else {
        console.log("error by inpput data");
        return {result: false};
      }
    }).catch(function(exception) {
      console.log('login error by exception', exception);
      return {result: false};
    });
  }

  handleSubmit(event) {
    this.createQuestion().then(
    //use "=>" do not create a new this and this.setState issue solved
    (data) => {
      if (data.result === true) {
        //console.log("handleSubmitsuccessful:" + data.result);
        let joinObj = {
          roomid: data.roomId
        };
        let roomData = {
          teacherCreateRoomId: data.roomId,
          teacherQuestionTime: this.state.minuteText, // TODO: should use endTime return by server
          teacherQuestionText: this.state.questionText,
          teacherQuestionAnswer: this.state.answerValue
        }
        this.props.socketio.emit('joined', joinObj, String(data.roomId)); //second argument for socketio message, third argument for socketio 'room'
        this.props.teacherCreateRoom(roomData);
        this.props.changeCurrentPage('teacher_question_room');
      } else {
        console.log("handleSubmitfailed:" + data.result);
        this.props.changeCurrentPage('teacher_create_question');
      }
    });
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
    return (<Form horizontal="horizontal">
      <FormGroup>
        <Col xs={8} xsOffset={0}>
          <Chip>Teacher User: {userid}</Chip>
        </Col>
      </FormGroup>
      <FormGroup>
        <Col xs={5} xsOffset={1}>
          <h5>Input Question</h5>
        </Col>
      </FormGroup>
      <FormGroup controlId="formHorizontalText">
        <Col componentClass={ControlLabel} xs={1} xsOffset={1}>
          <h4><Glyphicon glyph="pencil"/></h4>
        </Col>
        <Col xs={7}>
          <TextField name="question_text" hintText="Describle your question briefly" value={questionText} onChange={this.handleTextChange}/>
        </Col>
      </FormGroup>
      <FormGroup>
        <Col xs={5} xsOffset={1}>
          <h5>Give right answer</h5>
        </Col>
      </FormGroup>
      <FormGroup controlId="formHorizontalText">
        <Col componentClass={ControlLabel} xs={1} xsOffset={1}>
          <h4><Glyphicon glyph="ok"/></h4>
        </Col>
        <Col xs={7}>
          <ToggleButtonGroupControlled onChange={handleAnswerChange} value={answerValue}/>
        </Col>
      </FormGroup>
      <FormGroup>
        <Col xs={5} xsOffset={1}>
          <h5>Period of Validity</h5>
        </Col>
      </FormGroup>
      <FormGroup controlId="formHorizontalTime">
        <Col componentClass={ControlLabel} xs={1} xsOffset={1}>
          <h4><Glyphicon glyph="time"/></h4>
        </Col>
        <Col xs={5}>
          <Slider min={0.5} max={8} step={0.5} value={minuteText} onChange={this.handleMinuteChange} />
        </Col>
        <Col xs={2}>
          <h5>{minuteText} minutes</h5>
        </Col>
      </FormGroup>
      <FormGroup>
        <Col xsOffset={2} xs={7}>
          <RaisedButton type="submit" primary={true} onClick={handleSubmit} label="Create"/>
        </Col>
      </FormGroup>
    </Form>);
  }
}

class ToggleButtonGroupControlled extends React.Component {
  render() {
    return (<ToggleButtonGroup name="options" type="radio" value={this.props.value} onChange={this.props.onChange}>
      <ToggleButton value={'A'}>A</ToggleButton>
      <ToggleButton value={'B'}>B</ToggleButton>
      <ToggleButton value={'C'}>C</ToggleButton>
      <ToggleButton value={'D'}>D</ToggleButton>
    </ToggleButtonGroup>);
  }
}

const TeacherCreateQuestion = connect(mapStateToProps, mapDispatchProps)(TeacherCreateQuestionView);

export default TeacherCreateQuestion;
