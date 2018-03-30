import React, {Component} from 'react';
import { Button, Form, FormGroup, FormControl, ControlLabel, Col, Glyphicon, ToggleButtonGroup, ToggleButton, Well, ProgressBar} from 'react-bootstrap';
import fetch from 'isomorphic-fetch';

export default class TeacherQuestionRoom extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateAnswerCount = this.updateAnswerCount.bind(this);
    this.state = {
      timeRemain: '3*60',
      submitAnswerCount: '0',//count all student submits
      correctAnswerCount: '0',
    }
    this.readySocket();
  }


  handleSubmit(event) {
    console.log("handkA start");
    this.getQuestion().then(
      //use "=>" do not create a new this and this.setState issue solved
    (data) => {
      if(data.result === true) {
        console.log("handleSubmitsuccessful:" + data.result);
        let joinOjb = {userid: this.props.userid};
        this.props.socketio.emit('joined', joinOjb, this.state.roomId);
        //this.props.onTCQuestionChange('quick_question_room');
        event.preventDefault();
      } else {
        console.log("handleSubmitfailed:" + data.result);
        event.preventDefault();
        //this.props.onTCQuestionChange('teacher_create_question');
      }
    }
    );
    event.preventDefault();
  }

  updateAnswerCount(obj) {
    const correctAnswer = this.props.questionAnswer;
    console.log("someones answer is" + obj.answer[0]);
    console.log("correctAnswer is" + correctAnswer);
    const submitAnswerCount = Number(this.state.submitAnswerCount) + 1;
    const correctAnswerCount = Number(this.state.correctAnswerCount) + 1;
    if(String(correctAnswer) === String(obj.answer[0])) {
      this.setState({
        'correctAnswerCount': correctAnswerCount,
        'submitAnswerCount': submitAnswerCount
      });
    } else {
      console.log("someone answer is wrong")
      this.setState({
        'submitAnswerCount': submitAnswerCount
      });
    }

  }

  readySocket() {
    let socket = this.props.socketio;
    //let roomId = this.state.roomId;
    //client monitor login
    socket.on('joined', (obj) => {
      console.log("===joined===,socketid=" + socket.id);
      //this.updateSystemMsg(obj, 'login');
    });

    //client monitor logout
    socket.on('left', (obj) => {
      //this.updateSystemMsg(obj, 'logout');
    });

    //client monitor send msg
    socket.on('text', (obj) => {
      console.log("===text===");
      console.log('recived object'+  JSON.stringify(obj));
      this.updateAnswerCount(obj);
    })
  }

  render() {
    const questionText = this.props.questionText;
    const questionAnswer = this.props.questionAnswer;
    const minuteText = this.props.endTime;
    const userid = this.props.userid;
    const roomid = this.props.roomId;
    const correctSubmit = this.state.correctAnswerCount;
    console.log("correctSubmit: "+correctSubmit);
    const totalSubmit = this.state.submitAnswerCount;
    const rate = (totalSubmit === 0 ? 0 : (correctSubmit / totalSubmit).toFixed(1) * 100);
    const progressInstance =  <ProgressBar active now={rate} label={`${rate}% (${correctSubmit}/${totalSubmit})`} />;

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
              <h5>Correct Answer:</h5>
          </Col>
          </FormGroup>
          <FormGroup>
          <Col xs={8} xsOffset={1}>
            <Well>
              {questionAnswer}
            </Well>
          </Col>
          </FormGroup>
          <FormGroup>
          <Col componentClass={ControlLabel} xs={1} xsOffset={1}>
            <h4><Glyphicon glyph="time" /></h4>
          </Col>
          <Col xs={5}>
              <h5>Time Remain:</h5>
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
          <Col componentClass={ControlLabel} xs={1} xsOffset={1}>
            <h4><Glyphicon glyph="time" /></h4>
          </Col>
          <Col xs={8}>
              <h5>Student Correct Rate</h5>
          </Col>
          </FormGroup>
          <FormGroup>
            <Col xs={8} xsOffset={1}>
                {progressInstance}
            </Col>
          </FormGroup>
          <FormGroup>
          <Col xsOffset={2} xs={8}>
          <Button type="submit" bsStyle="warning" onClick={this.handleSubmit}>Close Question Now</Button>
          </Col>
          </FormGroup>
      </Form>
    );
  }
}
