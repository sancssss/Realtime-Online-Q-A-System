import React, {Component} from 'react';
import { Button, Form, FormGroup, ControlLabel, Col, Glyphicon, ToggleButtonGroup, ToggleButton, Well} from 'react-bootstrap';
import fetch from 'isomorphic-fetch';

export default class StudentQuestionRoom extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAnswerChange = this.handleAnswerChange.bind(this);
    this.state = {
      timeRemain: 3,
      questionText: '',
      minuteText: '3',
      answerValue: [],//student's answer
    }
  }

  getQuestion() {
    const userid = this.state.roomId;
    //console.log("answerValue" + answerValue);
    const uri = 'http://localhost:5000/QuickQuestion/' + userid;
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
    const minuteText = this.props.endTime;
    const userid = this.props.userid;
    const roomid = this.props.roomId;

    return (
      <Form horizontal>
          <FormGroup>
            <Col xs={8} xsOffset={1}>
          <h4>{userid} | Room ID: {roomid}</h4>
            </Col>
          </FormGroup>
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
            <Well>
              {questionText}
            </Well>
          </Col>
          </FormGroup>
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
              <ToggleButtonGroupControlled onChange={this.handleAnswerChange} value={this.answerValue}/>
            </Col>
          </FormGroup>
          <FormGroup>
          <Col componentClass={ControlLabel} xs={1} xsOffset={1}>
            <h4><Glyphicon glyph="time" /></h4>
          </Col>
          <Col xs={5}>
              <h5>Period Of Validity</h5>
          </Col>
          </FormGroup>
          <FormGroup>
            <Col xs={8} xsOffset={1}>
              <Well bsSize="small">
                <h4>{this.state.timeRemain} minute(s)</h4>
              </Well>
            </Col>
          </FormGroup>
          <FormGroup>
          <Col xsOffset={2} xs={8}>
          <Button type="submit" bsStyle="success" onClick={this.handleSubmit}>Submit Answer</Button>
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
