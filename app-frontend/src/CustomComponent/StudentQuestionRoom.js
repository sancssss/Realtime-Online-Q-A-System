import React, {Component} from 'react';
import { Button, Form, FormGroup, ControlLabel, Col, Glyphicon, ToggleButtonGroup, ToggleButton, Well} from 'react-bootstrap';
import fetch from 'isomorphic-fetch';
import { connect } from 'react-redux';
import { changeCurrentPage } from '../Actions';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import Chip from 'material-ui/Chip';
import Snackbar from 'material-ui/Snackbar';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import LinearProgress from 'material-ui/LinearProgress';
import { FormattedMessage, injectIntl } from 'react-intl';

const mapStateToProps = (state, ownProps) => {
  return {
    location: state.pageChangeReducer.location,
    userid: state.loginReducer.userid,
    questionText: state.studentRoomReducer.studentQuestionText,
    endTime: state.studentRoomReducer.studentQuestionTime,
    roomId: state.studentRoomReducer.studentJoinRoomId,
  }
};

class StudentQuestionRoomView extends Component {
  location = this.props.location;//location save to redux store
  constructor(props) {
    super(props);
    this.totalSecond =  Number(this.props.endTime) - Math.round(new Date().getTime()/1000);
    this.timerId = 0;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAnswerChange = this.handleAnswerChange.bind(this);
    this.handleOptionalAnswerChange = this.handleOptionalAnswerChange.bind(this);
    this.handleAnswerDialog = this.handleAnswerDialog.bind(this);
    this.handleOpenNotification = this.handleOpenNotification.bind(this);
    this.handleCloseNotification = this.handleCloseNotification.bind(this);
    this.handleTeacherCommand = this.handleTeacherCommand.bind(this);
    this.questionTimeCountDown = this.questionTimeCountDown.bind(this);
    this.questionStartTimer = this.questionStartTimer.bind(this);
    this.state = {
      timeRemain: 3,
      questionText: '',
      timeRemain: this.totalSecond,
      answerValue: '',//student's answer
      optionalAnswerOpen: false, //control optional answer dialog
      optionalAnswerValue: '',
      isSubmitted: false,
      snackbarOpen: false,
    }
    this.readySocket();
  }
  //Snackbar notify user submit successful
  handleOpenNotification() {
    this.setState({snackbarOpen: true});
  }

  handleCloseNotification() {
    console.log("handleCloseNotification");
    this.setState({snackbarOpen: false});
  }

  handleSubmit(event) {
    console.log("handkA start");
    const answer = this.state.answerValue;
    if(answer) {
      console.log("handleSubmitsuccessful:" + answer);
      let textOjb = {type: 'answer', userid: this.props.userid, answer: answer};
      this.props.socketio.emit('text', textOjb, String(this.props.roomId))
      this.setState({isSubmitted: true});;
      this.handleOpenNotification();//notify user submitted successful
      event.preventDefault();
    } else {
      console.log("handleSubmitfailed:" + answer);
      event.preventDefault();
    }
    event.preventDefault();
  }

  handleAnswerDialog(event) {
    this.setState({
      optionalAnswerOpen: this.state.optionalAnswerOpen === false
        ? true
        : false
    });
  }

  handleOptionalAnswerChange(event) {
    const target = event.target;
    const value = target.value;
    this.setState({
      optionalAnswerValue: value,
      answerValue: value
    });
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
      this.setState({isSubmitted: true});
      clearInterval(this.timerId);
    }
  }

  questionStartTimer() {
    if(this.timerId === 0) {
      this.timerId = setInterval(this.questionTimeCountDown, 1000)
    }
  }

  handleAnswerChange(event) {
    this.setState(
      {
        answerValue: event
      }
    );
  }

  //recive teachers commands such as 'stop'
  handleTeacherCommand(obj) {
    switch(obj.command) {
      case 'stop':
        this.setState({isSubmitted: true, timeRemain: 0});
        //set timer to zero
        clearInterval(this.timerId);
        break;
      default:
    }
  }

  readySocket() {
    let socket = this.props.socketio;
    //client monitor send msg
    socket.on('text', (obj) => {
      console.log('recived object in teacher room'+  JSON.stringify(obj));
      if(obj.type === 'command') {
        //recive teachers commands such as 'stop'
        this.handleTeacherCommand(obj);
      }
    })
  }

  render() {
    const questionText = this.props.questionText;
    const minuteText = this.props.minuteText;
    const userid = this.props.userid;
    const roomId = this.props.roomId;
    const answerValue = this.state.answerValue
    const handleAnswerChange = this.handleAnswerChange;
    const handleSubmit = this.handleSubmit;
    const optionalAnswerValue = this.state.optionalAnswerValue;
    const disableAnswerGroup = optionalAnswerValue === '' ? false : true;
    const handleAnswerDialog = this.handleAnswerDialog;
    const optionalAnswerActions = [ <FlatButton label={<FormattedMessage id='submit'/>} primary={true} keyboardFocused={true} onClick={handleAnswerDialog} />,];
    const isSubmitted = this.state.isSubmitted;
    const snackbarOpen = this.state.snackbarOpen;
    const handleOpenNotification = this.handleOpenNotification;
    const handleCloseNotification = this.handleCloseNotification;
    const totalSecond = this.totalSecond;
    const remainSecond = Number(this.state.timeRemain);
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
              <h5><FormattedMessage id='question'/></h5>
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
              <h5><FormattedMessage id='time_remain'/>: {remainSecond}<FormattedMessage id='second_timescale'/></h5>
              <LinearProgress mode="determinate" value={Number((100 - remainSecond/totalSecond*100).toFixed(2))} />
          </Col>
          </FormGroup>
          </Card>
          <FormGroup>
          <Col componentClass={ControlLabel} xs={1} xsOffset={1}>
            <h4><Glyphicon glyph="ok" /></h4>
          </Col>
          <Col xs={9}>
              <h5><FormattedMessage id='selectanswer'/></h5>
          </Col>
          </FormGroup>
          <FormGroup controlId="formHorizontalText">
            <Col xs={9} xsOffset={1}>
              <ToggleButtonGroupControlled disabled={disableAnswerGroup} onChange={handleAnswerChange} value={answerValue}/>
              <RaisedButton label={<FormattedMessage id = 'other' />} onClick={handleAnswerDialog}/>
              <Dialog title={<FormattedMessage id = 'create_a_new_answer' />} actions={optionalAnswerActions} modal={false} open={this.state.optionalAnswerOpen} onRequestClose={handleAnswerDialog}>
                <TextField name="answer_text" hintText={<FormattedMessage id = 'answer' />} value={optionalAnswerValue} onChange={this.handleOptionalAnswerChange}/>
              </Dialog>
            </Col>
          </FormGroup>
          <FormGroup>
          <Col xsOffset={1} xs={8}>
              <RaisedButton type="submit" primary={true} disabled={isSubmitted} onClick={handleSubmit} label={<FormattedMessage id='submit'/>}/>
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
        <ToggleButton disabled={this.props.disabled} value={'A'}>A</ToggleButton>
        <ToggleButton disabled={this.props.disabled} value={'B'}>B</ToggleButton>
        <ToggleButton disabled={this.props.disabled} value={'C'}>C</ToggleButton>
        <ToggleButton disabled={this.props.disabled} value={'D'}>D</ToggleButton>
      </ToggleButtonGroup>
    );
  }
}
const StudentQuestionRoom = injectIntl(connect(
  mapStateToProps,
  null
)(StudentQuestionRoomView));

export default StudentQuestionRoom;
