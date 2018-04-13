import React, {Component} from 'react';
import io from 'socket.io-client';
import Login from './CustomComponent/Login';
import TeacherCreateQuestion from './CustomComponent/TeacherCreateQuestion';
import StudentJoinQuestion from './CustomComponent/StudentJoinQuestion';
import StudentQuestionRoom from './CustomComponent/StudentQuestionRoom';
import TeacherQuestionRoom from './CustomComponent/TeacherQuestionRoom';
import {connect} from 'react-redux';
import {IntlProvider, FormattedMessage} from 'react-intl';
import { Route, Switch } from 'react-router-dom'
import zh_CN from './languages/zh_CN';
import en_UK from './languages/en_UK';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton'
import Paper from 'material-ui/Paper';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import { ConnectedRouter } from 'react-router-redux';
import { history } from './Stores';

const mapStateToProps = (state, ownProps) => {
  return {
    location: state.pageChangeReducer.location,
    currentPage: state.pageChangeReducer.currentPage, // TODO: use react-router
    userid: state.loginReducer.userid,
    appBarTitle: state.pageChangeReducer.appBarTitle,
  }
};

class AppView extends Component {
  location = this.props.location;//location save to redux store
  socket = io(this.location + 'class');

  constructor(props) {
    super(props);
    this.switchLanguage = this.switchLanguage.bind(this);
    this.handleLeftButtonClick = this.handleLeftButtonClick.bind(this);
    this.state = {
      languge: en_UK, langugeCode: 'en',
      drawerOpen: false
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

  handleLeftButtonClick() {
    this.setState({drawerOpen: !this.state.drawerOpen});
  }

  render() {
    const appBarTitle = this.props.appBarTitle;
    const handleLeftButtonClick = this.handleLeftButtonClick;
    const languge = this.state.languge;
    //background paper
    const bgStyle = { padding: '5% 2% 2% 2%', height: '100%', margin: '5% 5% 5% 5%', display: 'block'};
    const LangButtonStyle = window.location.pathname !== '/' ? {display: "none"} : {};//only display language switch button on Login
    return (
      <IntlProvider locale={'en'} messages={languge}>
      <MuiThemeProvider>
        <AppBar title={appBarTitle} onLeftIconButtonClick={handleLeftButtonClick} iconElementRight={ <FlatButton style ={LangButtonStyle} label = {<FormattedMessage id='change_language'/>} onClick = { this.switchLanguage } />}/>
        <Drawer docked={false} width={200} open={this.state.drawerOpen} onRequestChange={(drawerOpen) => this.setState({drawerOpen})}>
            <MenuItem>Version</MenuItem>
            <MenuItem>V1.0</MenuItem>
        </Drawer>
        <Paper style={bgStyle} zDepth={2}>
          <ConnectedRouter history={history}>
          <Switch>
            <Route exact path='/' component={Login}/>
            <Route path='/TeacherQuestionRoom' component={(props) => <TeacherQuestionRoom {...props} socketio={this.socket}/>}/>
            <Route path='/TeacherCreateQuestion' component={(props) => <TeacherCreateQuestion {...props} socketio={this.socket}/>}/>
            <Route path='/StudentJoinQuestion' component={(props) => <StudentJoinQuestion {...props} socketio={this.socket}/>}/>
            <Route path='/StudentQuestionRoom' component={(props) => <StudentQuestionRoom {...props} socketio={this.socket}/>}/>
            <Route component={Login}/>
          </Switch>
        </ConnectedRouter>
        </Paper>
      </MuiThemeProvider>
    </IntlProvider>);
  }
}

const App = connect(mapStateToProps, null)(AppView);
export default App;
