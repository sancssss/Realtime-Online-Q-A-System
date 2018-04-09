import React, {Component} from 'react';
import { Button, Form, FormGroup, FormControl, ControlLabel, Col, Glyphicon, ToggleButtonGroup, ToggleButton} from 'react-bootstrap';
import fetch from 'isomorphic-fetch';

export default class TeacherCreateQuestion extends Component {
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
    //console.log("answerValue" + answerValue);
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
        //console.log("response:" + response.json());
        return response.json();
    }).then(
      function(json) {
        console.log("obj.json:" + json.isOk);
        console.log("obj.json:" + json.room_id);
        //isOK == 1 mean login data is vaild
        if(json.isOk === '1') {
          return {
            result: true,
            roomId: json.room_id,
            endTime: json.end_time
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
    console.log("handkA start");
    this.createQuestion().then(
      //use "=>" do not create a new this and this.setState issue solved
      (data) => {
      if(data.result === true) {
        console.log("handleSubmitsuccessful:" + data.result);
        let joinObj = {roomid: data.roomId};
        this.props.socketio.emit('joined', joinObj, String(data.roomId));
        this.props.onTCQuestionChange('teacher_question_room', data.roomId, this.state.questionText,this.state.answerValue ,data.endTime);
      } else {
        console.log("handleSubmitfailed:" + data.result);
        this.props.onTCQuestionChange('teacher_create_question');
      }
    }
    );
    event.preventDefault();
    this.props.onTCQuestionChange('teacher_create_question');
  }

  render() {
    let questionText = this.state.questionText;
    let minuteText = this.state.minuteText;
    return (
      <Form horizontal>
          <FormGroup>
            <Col xs={8} xsOffset={1}>
          <h5>{this.props.userid} | Quick Assignment</h5>
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
              <ToggleButtonGroupControlled onChange={this.handleAnswerChange} value={this.answerValue}/>
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
          <Button type="submit" bsStyle="primary" onClick={this.handleSubmit}>Create now</Button>
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
