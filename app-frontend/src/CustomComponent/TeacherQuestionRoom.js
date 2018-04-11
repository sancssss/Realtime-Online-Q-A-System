import React, {Component} from 'react';
import {Form, FormGroup, ControlLabel, Col, Glyphicon, Well, ProgressBar} from 'react-bootstrap';
import fetch from 'isomorphic-fetch';
import { connect } from 'react-redux';
import { changeCurrentPage } from '../Actions';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Chip from 'material-ui/Chip';
import {Card, CardText} from 'material-ui/Card';
import { FormattedMessage, injectIntl } from 'react-intl';

const mapStateToProps = (state, ownProps) => {
  return {
    userid: state.loginReducer.userid,
    questionText: state.teacherRoomReducer.teacherQuestionText,
    questionAnswer: state.teacherRoomReducer.teacherQuestionAnswer,
    minuteText: state.teacherRoomReducer.teacherQuestionTime,
    roomId: state.teacherRoomReducer.teacherCreateRoomId,
  }
};

class TeacherQuestionRoomView extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateAnswerCount = this.updateAnswerCount.bind(this);
    this.state = {
      timeRemain: this.props.minuteText,// TODO: change to endTime
      submitAnswerCount: '0',//count all student submits
      correctAnswerCount: '0',
    }
    this.readySocket();
  }


  handleSubmit(event) {
    //console.log("handkA start");
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
    console.log("someones answer is" + obj.answer);
    console.log("correctAnswer is" + correctAnswer);
    const submitAnswerCount = Number(this.state.submitAnswerCount) + 1;
    const correctAnswerCount = Number(this.state.correctAnswerCount) + 1;
    if(String(correctAnswer).valueOf() === String(obj.answer).valueOf()) {
      console.log("someone answer is right")
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
      console.log('recived object in teacher room'+  JSON.stringify(obj));
      this.updateAnswerCount(obj);
    })
  }

  render() {
    const questionText = this.props.questionText;
    const questionAnswer = this.props.questionAnswer;
    const minuteText = this.props.endTime;
    const roomId = this.props.roomId;

    const correctSubmit = this.state.correctAnswerCount;
    const totalSubmit = this.state.submitAnswerCount;
    const rate = (totalSubmit === 0 ? 0 : (correctSubmit / totalSubmit).toFixed(2) * 100);
    const progressInstance =  <ProgressBar active now={rate} label={`${rate}% (${correctSubmit}/${totalSubmit})`} />;

    return (
      <Form horizontal>
          <FormGroup>
            <Col xs={8} xsOffset={0}>
              <Chip><FormattedMessage id='roomid'/>: {roomId}</Chip>
            </Col>
          </FormGroup>
          <Card>
            <CardText>
            <FormGroup>
            <Col xs={1} xsOffset={1}>
              <h4><Glyphicon glyph="question-sign" /></h4>
            </Col>
            <Col xs={5}>
                <h5><FormattedMessage id='question'/>:</h5>
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
            <Col xs={8}>
                <h5><FormattedMessage id='correct_answer'/>: {questionAnswer}</h5>
            </Col>
            </FormGroup>
            <FormGroup>
            <Col componentClass={ControlLabel} xs={1} xsOffset={1}>
              <h4><Glyphicon glyph="time" /></h4>
            </Col>
            <Col xs={8}>
                <h5><FormattedMessage id='time_remain'/>: {minuteText} S</h5>
            </Col>
            </FormGroup>
          </CardText>
          </Card>
          <FormGroup>
          <Col componentClass={ControlLabel} xs={1} xsOffset={1}>
            <h4><Glyphicon glyph="time" /></h4>
          </Col>
          <Col xs={8}>
              <h5><FormattedMessage id='student_correct_rate'/></h5>
          </Col>
          </FormGroup>
          <FormGroup>
            <Col xs={8} xsOffset={1}>
                {progressInstance}
            </Col>
          </FormGroup>
          <FormGroup>
          <Col xsOffset={1} xs={8}>
            <RaisedButton type="submit" secondary={true} onClick={this.handleSubmit} label={<FormattedMessage id='stop'/>}/>
          </Col>
          </FormGroup>
      </Form>
    );
  }
}

const TeacherQuestionRoom = injectIntl(connect(
  mapStateToProps,
  null
)(TeacherQuestionRoomView));

export default TeacherQuestionRoom;
