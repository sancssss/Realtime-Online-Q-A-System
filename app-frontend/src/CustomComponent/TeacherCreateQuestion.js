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
import {FormattedMessage, injectIntl} from 'react-intl';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Slider from 'material-ui/Slider';
import Chip from 'material-ui/Chip';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

const mapStateToProps = (state, ownProps) => {
  return {location: state.pageChangeReducer.location, userid: state.loginReducer.userid}
};

//RoomData:{roomId, questionText, answerValue ,endTime}
const mapDispatchProps = (dispatch) => {
  return {
    teacherCreateRoom: roomData => dispatch(teacherCreateRoom(roomData)),
    changeCurrentPage: pageName => dispatch(changeCurrentPage(pageName))
  }
}

class TeacherCreateQuestionView extends Component {
  location = this.props.location; //location save to redux store
  constructor(props) {
    super(props);
    this.state = {
      questionText: '',
      minuteText: 3,
      answerValue: '',
      optionalAnswerOpen: false, //control optional answer dialog
      optionalAnswerValue: ''
    }
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleMinuteChange = this.handleMinuteChange.bind(this);
    this.handleAnswerChange = this.handleAnswerChange.bind(this);
    this.handleOptionalAnswerChange = this.handleOptionalAnswerChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAnswerDialog = this.handleAnswerDialog.bind(this);
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
    console.log("babdhbsj:"+this.state.answerValue)
    this.setState({
      optionalAnswerValue: value,
      answerValue: value
    });
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
    const optionalAnswerValue = this.state.optionalAnswerValue;
    const disableAnserGroup = optionalAnswerValue === '' ? false : true;
    const handleAnswerChange = this.handleAnswerChange;
    const handleSubmit = this.handleSubmit;
    const handleAnswerDialog = this.handleAnswerDialog;
    const optionalAnswerActions = [
      <FlatButton
        label={<FormattedMessage id='submit'/>}
        primary={true}
        keyboardFocused={true}
        onClick={handleAnswerDialog}
      />,
    ];
    return (<Form horizontal="horizontal">
      <FormGroup>
        <Col xs={8} xsOffset={0}>
          <Chip><FormattedMessage id='teacher_user'/>: {userid}</Chip>
        </Col>
      </FormGroup>
      <FormGroup>
        <Col xs={8} xsOffset={1}>
          <h5><FormattedMessage id='input_your_question'/></h5>
        </Col>
      </FormGroup>
      <FormGroup controlId="formHorizontalText">
        <Col componentClass={ControlLabel} xs={1} xsOffset={1}>
          <h4><Glyphicon glyph="pencil"/></h4>
        </Col>
        <Col xs={7}>
          <TextField name="question_text" hintText={<FormattedMessage id = 'describle_your_question' />} value={questionText} onChange={this.handleTextChange}/>
        </Col>
      </FormGroup>
      <FormGroup>
        <Col xs={5} xsOffset={1}>
          <h5><FormattedMessage id='set_correct_answer'/></h5>
        </Col>
      </FormGroup>
      <FormGroup controlId="formHorizontalText">
        <Col componentClass={ControlLabel} xs={1} xsOffset={1}>
          <h4><Glyphicon glyph="ok"/></h4>
        </Col>
        <Col xs={9}>
          <ToggleButtonGroupControlled disabled={disableAnserGroup} onChange={handleAnswerChange} value={answerValue}/>
          <Dialog title={<FormattedMessage id = 'create_a_new_answer' />} actions={optionalAnswerActions} modal={false} open={this.state.optionalAnswerOpen} onRequestClose={handleAnswerDialog}>
            <TextField name="answer_text" hintText={<FormattedMessage id = 'answer' />} value={optionalAnswerValue} onChange={this.handleOptionalAnswerChange}/>
          </Dialog>
        </Col>
        <Col xs={5}>
          <RaisedButton label={<FormattedMessage id = 'other' />} onClick={handleAnswerDialog}/>
        </Col>
      </FormGroup>
      <FormGroup>
        <Col xs={5} xsOffset={1}>
          <h5><FormattedMessage id='period_of_validity'/></h5>
        </Col>
      </FormGroup>
      <FormGroup controlId="formHorizontalTime">
        <Col componentClass={ControlLabel} xs={1} xsOffset={1}>
          <h4><Glyphicon glyph="time"/></h4>
        </Col>
        <Col xs={5}>
          <Slider min={0.5} max={8} step={0.5} value={minuteText} onChange={this.handleMinuteChange}/>
        </Col>
        <Col xs={2}>
          <h5>{minuteText}
            <FormattedMessage id='minutes_timescale'/></h5>
        </Col>
      </FormGroup>
      <FormGroup>
        <Col xsOffset={2} xs={7}>
          <RaisedButton type="submit" primary={true} onClick={handleSubmit} label={<FormattedMessage id = 'create' />}/>
        </Col>
      </FormGroup>
    </Form>);
  }
}

class ToggleButtonGroupControlled extends React.Component {
  render() {
    return (<ToggleButtonGroup name="options" type="radio" value={this.props.value} onChange={this.props.onChange}>
      <ToggleButton disabled={this.props.disabled} value={'A'}>A</ToggleButton>
      <ToggleButton disabled={this.props.disabled} value={'B'}>B</ToggleButton>
      <ToggleButton disabled={this.props.disabled} value={'C'}>C</ToggleButton>
      <ToggleButton disabled={this.props.disabled} value={'D'}>D</ToggleButton>
    </ToggleButtonGroup>);
  }
}

const TeacherCreateQuestion = injectIntl(connect(mapStateToProps, mapDispatchProps)(TeacherCreateQuestionView));

export default TeacherCreateQuestion;
