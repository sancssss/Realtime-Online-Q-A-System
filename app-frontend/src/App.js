import React, {Component} from 'react';
import io from 'socket.io-client';
import Login from './CustomComponent/Login';
import TeacherCreateQuestion from './CustomComponent/TeacherCreateQuestion';
import StudentJoinQuestion from './CustomComponent/StudentJoinQuestion';
import StudentQuestionRoom from './CustomComponent/StudentQuestionRoom';
import TeacherQuestionRoom from './CustomComponent/TeacherQuestionRoom';
import {connect} from 'react-redux';
import {IntlProvider, FormattedMessage, injectIntl} from 'react-intl';
import zh_CN from './languages/zh_CN';
import en_UK from './languages/en_UK';
import {Panel} from 'react-bootstrap';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton'
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import Paper from 'material-ui/Paper';

const mapStateToProps = (state, ownProps) => {
  return {
    currentPage: state.pageChangeReducer.currentPage, // TODO: use react-router
    userid: state.loginReducer.userid,
    appBarTitle: state.pageChangeReducer.appBarTitle
  }
};

class AppView extends Component {
  location = 'http://localhost:5000/';
  //location = 'http://os.ply18.space/';
  socket = io(this.location + 'class');

  constructor(props) {
    super(props);
    this.switchLanguage = this.switchLanguage.bind(this);
    this.state = {
      languge: en_UK, langugeCode: 'en'
    }
  }

  switchLanguage(event) {
    let nextLanguageCode = '';
    if (this.state.langugeCode === 'cn') {
      nextLanguageCode = 'en';
      this.setState({languge: en_UK, langugeCode: nextLanguageCode});
    } else {
      nextLanguageCode = 'cn';
      this.setState({languge: zh_CN, langugeCode: nextLanguageCode});
    }
  }

  render() {
    //console.log("now re-render something");
    let renderDOM;
    const userid = this.props.userid;
    const appBarTitle = this.props.appBarTitle;
    switch (this.props.currentPage) {
      case 'index_login':
        renderDOM = <Login/>
        break;
      case 'teacher_create_question':
        renderDOM = <TeacherCreateQuestion socketio={this.socket}/>
        break;
      case 'student_join_question':
        renderDOM = <StudentJoinQuestion socketio={this.socket}/>
        break;
      case 'student_question_room':
        renderDOM = <StudentQuestionRoom socketio={this.socket}/>
        break;
      case 'teacher_question_room':
        renderDOM = <TeacherQuestionRoom socketio={this.socket}/>
        break;
      default:
        renderDOM = <Login/>
    }
    //background paper
    const style = {
      padding: '5% 2% 2% 2%',
      height: '100%',
      margin: '5% 5% 5% 5%',
      display: 'block'
    };

    //languge
    const languge = this.state.languge;
    return (<IntlProvider locale={'en'} messages={languge}>
      <MuiThemeProvider>
        <AppBar title={appBarTitle} iconElementRight={<FlatButton label = {
            <FormattedMessage id='change_language'/>
          }
          onClick = {
            this.switchLanguage
          } />}/>
        <Paper style={style} zDepth={2}>
          {renderDOM}
        </Paper>
      </MuiThemeProvider>
    </IntlProvider>);
  }
}

const App = connect(mapStateToProps, null)(AppView);

export default App;
