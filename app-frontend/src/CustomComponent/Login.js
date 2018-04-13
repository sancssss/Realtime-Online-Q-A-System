import React, {Component} from 'react';
import {
  Button,
  Form,
  FormGroup,
  FormControl,
  ControlLabel,
  Col,
  Glyphicon
} from 'react-bootstrap';
import fetch from 'isomorphic-fetch';
import {connect} from 'react-redux';
import {loginUser, changeAppTitleTo} from '../Actions';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import FontIcon from 'material-ui/FontIcon';
import { FormattedMessage, injectIntl } from 'react-intl';
import { push } from 'react-router-redux';
import { withRouter } from 'react-router-dom';

const mapStateToProps = (state) => {
  return {location: state.pageChangeReducer.location, userid: state.loginReducer.userid, password: state.loginReducer.password}
};

//loginData:{userid, password, role}
const mapDispatchProps = (dispatch) => {
  return {
    loginUser: loginData => dispatch(loginUser(loginData)),
    changeAppTitleTo: title => dispatch(changeAppTitleTo(title)),
    switchRoute: routerName => dispatch(push(routerName))
  }
}

class LoginView extends Component {
  location = this.props.location;//location save to redux store
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
    this.setState({[name]: value});
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
    }).then(function(response) {
      //console.log("response:" + response.json());
      return response.json();
    }).then(function(json) {
      console.log("obj.json:" + json.isOk);
      //isOK == 1 mean login data is vaild
      if (json.isOk === '1') {
        return {result: true, role: json.role};
      } else {
        console.log("login error by login data");
        return {result: false};
      }
    }).catch(function(exception) {
      console.log('login error by exception', exception);
      return {result: false};
    });
  }

  handleLogin() {
    let userid = this.state.userid;
    let password = this.state.password;
    this.checkLogin(userid, password).then(
    //use "=>" do not create a new this and this.setState issue solved
    (isVaild) => {
      if (isVaild.result === true) {
        this.props.loginUser({userid, password});
        let routerName = isVaild.role === 'student'
          ? 'StudentJoinQuestion'
          : 'TeacherCreateQuestion';
        let title = isVaild.role === 'student'
          ? <FormattedMessage id='join_a_room'/>
          : <FormattedMessage id='create_a_question'/>;
        this.props.switchRoute(routerName);
        this.props.changeAppTitleTo(title);
      }
    });
    return false;
  }

  render() {
    const userid = this.state.userid;
    const password = this.state.password;
    const handleChange = this.handleChange;
    const handleClick = this.handleClick;

    return (<Form horizontal={true}>
      <FormGroup controlId="formHorizontalText">
        <Col componentClass={ControlLabel} xs={1} xsOffset={1}>
              <h4><Glyphicon glyph="user" /></h4>
        </Col>
        <Col xs={7} xsOffset={0}>
          <TextField name="userid" hintText={<FormattedMessage id='login_userid_hintText'/>}  value={userid} onChange={handleChange}/>
        </Col>
      </FormGroup>
      <FormGroup controlId="formHorizontalPassword">
        <Col componentClass={ControlLabel} xs={1} xsOffset={1}>
          <h4><Glyphicon glyph="eye-close" /></h4>
        </Col>
        <Col xs={7} xsOffset={0}>
          <TextField name="password" hintText={<FormattedMessage id='login_password_hintText'/>}  type="password" value={password} onChange={handleChange}/>
        </Col>
      </FormGroup>
      <FormGroup>
        <Col xsOffset={2} xs={7}>
          <RaisedButton type="submit" primary={true} onClick={handleClick} label={<FormattedMessage id='login_submit_label'/>}/>
        </Col>
      </FormGroup>
    </Form>);
  }
}

const Login = injectIntl(withRouter(connect(mapStateToProps, mapDispatchProps)(LoginView)));

export default Login;
