import React, {Component} from 'react';
import { Button, Form, FormGroup, FormControl, ControlLabel, Col, Glyphicon, ToggleButtonGroup, ToggleButton} from 'react-bootstrap';
import fetch from 'isomorphic-fetch';
import { connect } from 'react-redux';
import { changeAppTitleTo, studentJoinRoom } from '../Actions';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Chip from 'material-ui/Chip';
import { FormattedMessage, injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { push } from 'react-router-redux';

const mapStateToProps = (state, ownProps) => {
  return {
    location: state.pageChangeReducer.location,
    userid: state.loginReducer.userid,
    roomId: state.studentRoomReducer.studentJoinRoomId,
    questionText: state.studentRoomReducer.studentQuestionText,
    questionTime: state.studentRoomReducer.studentQuestionTime
  }
};

const mapDispatchProps = (dispatch) => {
  return {
    studentJoinRoom: roomData => dispatch(studentJoinRoom(roomData)),
    changeAppTitleTo: title => dispatch(changeAppTitleTo(title)),
    switchRoute: routerName => dispatch(push(routerName))
  }
}

class StudentJoinQuestionView extends Component {
  location = this.props.location;//location save to redux store
  constructor(props) {
    super(props);
    this.state = {
      roomId: ''
    }
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleTextChange(event) {
    const target = event.target;
    const value = target.value;
    this.setState(
      {
        roomId: value,
      }
    );
  }

  getQuestion() {
    const roomId= this.state.roomId;
    //console.log("answerValue" + answerValue);
    const location = this.location + 'QuickQuestion/';
    const uri = location + String(roomId);
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
            createUser: json.create_user,
            createTime: json.create_time,
            questionText: json.question_content,
            endTime: json.end_time
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

  handleSubmit(event) {
    this.getQuestion().then(
      //use "=>" do not create a new this and this.setState issue solved
      (data) => {
      //data is validate and the remain time is enough
      if(data.result === true && data.endTime > Math.round(new Date().getTime()/1000)) {
        console.log("handleSubmitsuccessful");
        let joinOjb = {userid: this.props.userid};
        let roomData = {
          studentJoinRoomId: this.state.roomId,
          studentQuestionTime: data.endTime,
          studentQuestionText: data.questionText,
        };
        this.props.studentJoinRoom(roomData);
        this.props.socketio.emit('joined', joinOjb, this.state.roomId);
        this.props.switchRoute('StudentQuestionRoom');
        this.props.changeAppTitleTo(<FormattedMessage id = 'answer_a_question' />);
        event.preventDefault();
      } else {
        console.log("handleSubmitfailed:" + data.result);
        event.preventDefault();
        this.props.switchRoute('StudentJoinQuestion');
      }
    }
    );
    event.preventDefault();
  }


  render() {
    const roomId = this.state.roomId;
    const userid = this.props.userid;
    const handleSubmit = this.handleSubmit;
    const handleTextChange = this.handleTextChange;
    return (
      <Form horizontal>
          <FormGroup>
            <Col xs={8} xsOffset={0}>
              <Chip><FormattedMessage id='student_user'/>: {userid}</Chip>
            </Col>
          </FormGroup>
          <FormGroup>
          <Col xs={7} xsOffset={1}>
              <h5><FormattedMessage id='input_question_room_id'/></h5>
          </Col>
          </FormGroup>
          <FormGroup controlId="formHorizontalText">
            <Col componentClass={ControlLabel} xs={1} xsOffset={1}>
              <h4><Glyphicon glyph="pencil" /></h4>
            </Col>
            <Col xs={7}>
              <TextField name="roomId" hintText="Room ID" value={roomId} onChange={handleTextChange}/>
            </Col>
          </FormGroup>
          <FormGroup>
          <Col xsOffset={2} xs={7}>
          <RaisedButton type="submit" primary={true} onClick={handleSubmit} label={<FormattedMessage id='join_room'/>}/>
          </Col>
          </FormGroup>
      </Form>
    );
  }
}

const StudentJoinQuestion = injectIntl(withRouter(connect(
  mapStateToProps,
  mapDispatchProps
)(StudentJoinQuestionView)));

export default StudentJoinQuestion;
