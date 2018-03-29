import React, {Component} from 'react';
import { Button, Form, FormGroup, FormControl, ControlLabel, Col, Glyphicon } from 'react-bootstrap';

export default class Login extends Component {
  render() {
    const userid = this.props.userid;
    const password = this.props.password;
    const handleChange = this.props.handleChange;
    const handleClick = this.props.handleClick;

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
