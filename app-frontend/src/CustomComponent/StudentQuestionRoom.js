import React, {Component} from 'react';
import { Button, Form, FormGroup, ControlLabel, Col, Glyphicon, ToggleButtonGroup, ToggleButton, Well} from 'react-bootstrap';
import fetch from 'isomorphic-fetch';
import { connect } from 'react-redux';
import { changeCurrentPage } from '../Actions';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Chip from 'material-ui/Chip';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';

const mapStateToProps = (state, ownProps) => {
  return {
    userid: state.loginReducer.userid,
    questionText: state.studentRoomReducer.studentQuestionText,
    minuteText: state.studentRoomReducer.studentQuestionTime,
    roomId: state.studentRoomReducer.studentJoinRoomId,
  }
};

class StudentQuestionRoomView extends Component {
  location = 'http://localhost:5000/';
  //location = 'http://os.ply18.space/';
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAnswerChange = this.handleAnswerChange.bind(this);
    this.state = {
      timeRemain: 3,
      questionText: '',
      minuteText: '3',
      answerValue: '',//student's answer
    }
  }

  getQuestion() {
    const userid = this.state.roomId;
    const uri = this.location + 'QuickQuestion/' + String(userid);
    return fetch(uri, {
      method: "GET",
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
            create_user: json.create_user,
            create_time: json.create_time,
            end_time: json.end_time
          };
        }else {
          console.log("error by input data");
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

  handleAnswerChange(event) {
    this.setState(
      {
        answerValue: event
      }
    );
  }

  handleSubmit(event) {
    console.log("handkA start");
    const answer = this.state.answerValue;
    if(answer) {
      console.log("handleSubmitsuccessful:" + answer);
      let textOjb = {userid: this.props.userid, answer: answer};
      this.props.socketio.emit('text', textOjb, String(this.props.roomId));
      //this.props.onTCQuestionChange('quick_question_room');
      event.preventDefault();
    } else {
      console.log("handleSubmitfailed:" + answer);
      event.preventDefault();
      //this.props.onTCQuestionChange('teacher_create_question');
    }
    event.preventDefault();
  }

  render() {
    const questionText = this.props.questionText;
    const minuteText = this.props.minuteText;
    const userid = this.props.userid;
    const roomId = this.props.roomId;
    const answerValue = this.state.answerValue
    const handleAnswerChange = this.handleAnswerChange;
    const handleSubmit = this.handleSubmit;

    return (
      <Form horizontal>
          <FormGroup>
            <Col xs={8} xsOffset={0}>
              <Chip>Room ID: {roomId}</Chip>
            </Col>
          </FormGroup>
          <Card>
          <FormGroup>
          <Col xs={1} xsOffset={1}>
            <h4><Glyphicon glyph="question-sign" /></h4>
          </Col>
          <Col xs={5}>
              <h5>Question:</h5>
          </Col>
          </FormGroup>
          <FormGroup>
          <Col xs={8} xsOffset={1}>
            <CardText>
              <Well>
                {questionText}
              </Well>
            </CardText>
          </Col>
          <Col xs={8} xsOffset={1}>
              <h5>Time Remain: {minuteText} S</h5>
          </Col>
          </FormGroup>
          </Card>
          <FormGroup>
          <Col componentClass={ControlLabel} xs={1} xsOffset={1}>
            <h4><Glyphicon glyph="ok" /></h4>
          </Col>
          <Col xs={5}>
              <h5>Select Your Answer</h5>
          </Col>
          </FormGroup>
          <FormGroup controlId="formHorizontalText">
            <Col xs={8} xsOffset={1}>
              <ToggleButtonGroupControlled onChange={handleAnswerChange} value={answerValue}/>
            </Col>
          </FormGroup>
          <FormGroup>
          <Col xsOffset={1} xs={8}>
              <RaisedButton type="submit" primary={true} onClick={handleSubmit} label="Submit"/>
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
        type="radio"
        name="options"
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
const StudentQuestionRoom = connect(
  mapStateToProps,
  null
)(StudentQuestionRoomView);

export default StudentQuestionRoom;
