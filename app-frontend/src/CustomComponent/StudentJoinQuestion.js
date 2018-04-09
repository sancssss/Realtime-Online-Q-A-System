import React, {Component} from 'react';
import { Button, Form, FormGroup, FormControl, ControlLabel, Col, Glyphicon, ToggleButtonGroup, ToggleButton} from 'react-bootstrap';
import fetch from 'isomorphic-fetch';

export default class StudentJoinQuestion extends Component {
  location = 'http://localhost:5000/';
  //location = 'http://os.ply18.space/';
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
            create_user: json.create_user,
            create_time: json.create_time,
            question_content: json.question_content,
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

  handleSubmit(event) {
    console.log("handkA start");
    this.getQuestion().then(
      //use "=>" do not create a new this and this.setState issue solved
      (data) => {
      if(data.result === true) {
        console.log("handleSubmitsuccessful:" + data.question_content);
        let joinOjb = {userid: this.props.userid};
        this.props.onSJQuestionChange('student_question_room', this.state.roomId, data.question_content, data.end_time);
        this.props.socketio.emit('joined', joinOjb, this.state.roomId);
        //pass props to parent component and refresh page
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


  render() {
    const roomId = this.state.roomId;
    return (
      <Form horizontal>
          <FormGroup>
            <Col xs={8} xsOffset={1}>
          <h4>{this.props.userid} | Quick Assignment</h4>
            </Col>
          </FormGroup>
          <FormGroup>
          <Col xs={7} xsOffset={1}>
              <h5>Input Question Room ID</h5>
          </Col>
          </FormGroup>
          <FormGroup controlId="formHorizontalText">
            <Col componentClass={ControlLabel} xs={1} xsOffset={1}>
              <h4><Glyphicon glyph="pencil" /></h4>
            </Col>
            <Col xs={7}>
              <FormControl name="roomId" type="text" placeholder="Room ID" value={roomId} onChange={this.handleTextChange} />
            </Col>
          </FormGroup>
          <FormGroup>
          <Col xsOffset={2} xs={7}>
          <Button type="submit" bsStyle="primary" onClick={this.handleSubmit}>Join Now</Button>
          </Col>
          </FormGroup>
      </Form>
    );
  }
}
