import React, {Component} from 'react';
import {Form, FormGroup, ControlLabel, Col, Glyphicon, Well, ProgressBar} from 'react-bootstrap';
import fetch from 'isomorphic-fetch';
import { connect } from 'react-redux';
import { changeCurrentPage } from '../Actions';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Chip from 'material-ui/Chip';
import LinearProgress from 'material-ui/LinearProgress';
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
    this.timerId = 0;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateAnswerCount = this.updateAnswerCount.bind(this);
    this.questionTimeCountDown = this.questionTimeCountDown.bind(this);
    this.questionStartTimer = this.questionStartTimer.bind(this);
    this.state = {
      timeRemain: Number(this.props.minuteText) * 60,// TODO: change to endTime
      submitAnswerCount: '0',//count all student submits
      correctAnswerCount: '0',
      isStoped: false,
    }
    this.readySocket();
  }


  handleSubmit(event) {
    //send stop command
    let textOjb = {type: 'command', command: 'stop'}
    this.setState({isStoped: true});
    this.props.socketio.emit('text', textOjb, String(this.props.roomId));
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

  componentDidMount() {
    console.log("start timer");
    this.questionStartTimer();
  }

  //refresh the question remain time
  questionTimeCountDown() {
    let second = Number(this.state.timeRemain) - 1;
    console.log("second: "+ second);
    this.setState({ timeRemain: second });
    if (second === 0) {
      // TODO:stop student answer question
      this.setState({isStoped: true});
      clearInterval(this.timerId);
    }
  }

  questionStartTimer() {
    if(this.timerId ===  0) {
      this.timerId = setInterval(this.questionTimeCountDown, 1000)
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
      if(obj.type === 'answer') {
        this.updateAnswerCount(obj);
      }
    })
  }

  render() {
    const questionText = this.props.questionText;
    const questionAnswer = this.props.questionAnswer;
    const totalSecond = Number(this.props.minuteText) * 60;
    const remainSecond = Number(this.state.timeRemain);
    const roomId = this.props.roomId;
    const correctSubmit = this.state.correctAnswerCount;
    const totalSubmit = this.state.submitAnswerCount;
    const rate = (totalSubmit === 0 ? 0 : (correctSubmit / totalSubmit).toFixed(2) * 100);
    const isStoped = this.state.isStoped;

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
                <h5><FormattedMessage id='time_remain'/>: {remainSecond} <FormattedMessage id='second_timescale'/></h5>
                <LinearProgress mode="determinate" value={(100 - remainSecond/totalSecond*100).toFixed(2)} />
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
                <ProgressBar active now={rate} label={`${rate}% (${correctSubmit}/${totalSubmit})`} />
            </Col>
          </FormGroup>
          <FormGroup>
          <Col xsOffset={1} xs={8}>
            <RaisedButton disabled={isStoped} type="submit" secondary={true} onClick={this.handleSubmit} label={<FormattedMessage id='stop'/>}/>
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
