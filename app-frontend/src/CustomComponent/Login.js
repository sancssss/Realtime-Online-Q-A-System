import React, {Component} from 'react';
import { Button, Form, FormGroup, FormControl, ControlLabel, Col, Glyphicon } from 'react-bootstrap';
import fetch from 'isomorphic-fetch';
import {connect} from 'react-redux';
import {loginStudent, loginTeacher} from '../Actions';

const mapStateToProps = (state, ownProps) => {
  console.log("login_mapStateToProps+"+state.currentPage+" userid+"+state.userid)
  return {
    userid: state.userid,
    password: state.password,
  }
};

const mapDispatchProps = (dispatch) => {
  return {
    submitTeacher: loginData => dispatch(loginTeacher(loginData)),
    submitStudent: loginData => dispatch(loginStudent(loginData)),
  }
}

class LoginView extends Component {
  location = 'http://localhost:5000/';
  //location = 'http://os.ply18.space/';
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      userid: '',
      password: ''
    }
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState(
      {
        [name]: value,
      }
    );
  }

  handleClick(event) {
    event.preventDefault();
    this.handleLogin();
  }

  checkLogin(userid, password) {
    const uri = this.location + 'Login';
    const data = {
      "userid": userid,
      "password": password
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
        //isOK == 1 mean login data is vaild
        if(json.isOk === '1') {
          return {
            result: true,
            role: json.role,
          };
        }else {
          console.log("login error by login data");
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

  handleLogin() {
    let userid = this.state.userid;
    let password = this.state.password;
    this.checkLogin(userid, password).then(
        //use "=>" do not create a new this and this.setState issue solved
        (isVaild) => {
        if(isVaild.result === true) {
          if(isVaild.role === 'teacher') {
            this.props.submitTeacher({userid, password});
          }
          if(isVaild.role === 'student') {
            this.props.submitStudent({userid, password});
          }
        }
      }
    );
    return false;
  }

  render() {
    const userid = this.state.userid;
    const password = this.state.password;
    const handleChange = this.handleChange;
    const handleClick = this.handleClick;

    return (
      <Form horizontal>
          <FormGroup>
            <Col xs={5} xsOffset={1}>
          <h2>Start</h2>
            </Col>
          </FormGroup>
          <FormGroup controlId="formHorizontalText">
            <Col componentClass={ControlLabel} xs={1} xsOffset={1}>
              <h4><Glyphicon glyph="user" /></h4>
            </Col>
            <Col xs={7}>
              <FormControl name="userid" type="text" placeholder="input your userid" value={userid} onChange={handleChange} />
            </Col>
          </FormGroup>
          <FormGroup controlId="formHorizontalPassword">
            <Col componentClass={ControlLabel} xs={1} xsOffset={1}>
              <h4><Glyphicon glyph="eye-close" /></h4>
            </Col>
            <Col xs={7}>
              <FormControl name="password" type="password" placeholder="input your password" value={password} onChange={handleChange} />
            </Col>
          </FormGroup>
          <FormGroup>
          <Col xsOffset={2} xs={7}>
          <Button type="submit" bsStyle="primary" onClick={handleClick}>Enter Now</Button>
          </Col>
          </FormGroup>
      </Form>
    );
  }
}

const Login = connect(
  mapStateToProps,
  mapDispatchProps
)(LoginView);

export default Login;
