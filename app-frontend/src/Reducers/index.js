import {
  LOGIN_USER,
  STUDENT_JOIN_ROOM,
  TEACHER_CREATE_ROOM,
  CHANGE_CURRENT_PAGE
} from '../Constants/ActionTypes';
import {
  combineReducers
} from 'redux';

const inintalPageChangeState = {
  pageName: 'index_login',
  appBarTitle: 'Online Assignment'
}

const initialLoginState = {
  userid: '',
  password: '',
};

const initialTeacherState = {
  teacherCreateRoomId: '',
  teacherQuestionTime: '',
  teacherQuestionText: '',
  teacherQuestionAnswer: ''
};

const initialStudentState = {
  studentJoinRoomId: '',
  studentQuestionTime: '',
  studentQuestionText: '',
};

const loginReducer = (state = initialLoginState, action) => {
  switch (action.type) {
    case LOGIN_USER:
      return Object.assign({}, state, {
        userid: action.loginData.userid,
        password: action.loginData.password,
      });
    default:
      return state;
  }
}

const pageChangeReducer = (state = inintalPageChangeState, action) => {
  switch (action.type) {
    case CHANGE_CURRENT_PAGE:
      return Object.assign({}, state, {
        currentPage: action.pageName,
        appBarTitle: action.pageName
      });
    default:
      return state;
  }
}

const teacherRoomReducer = (state = initialTeacherState, action) => {
  switch (action.type) {
    case TEACHER_CREATE_ROOM:
      return Object.assign({}, state, {
        teacherCreateRoomId: action.roomData.teacherCreateRoomId,
        teacherQuestionTime: action.roomData.teacherQuestionTime,
        teacherQuestionText: action.roomData.teacherQuestionText,
        teacherQuestionAnswer: action.roomData.teacherQuestionAnswer,
      });
    default:
      return state;
  }
};

const studentRoomReducer = (state = initialStudentState, action) => {
  switch (action.type) {
    case STUDENT_JOIN_ROOM:
      return Object.assign({}, state, {
        studentJoinRoomId: action.roomData.studentJoinRoomId,
        studentQuestionTime: action.roomData.studentQuestionTime,
        studentQuestionText: action.roomData.studentQuestionText,
      });
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  loginReducer,
  pageChangeReducer,
  teacherRoomReducer,
  studentRoomReducer
});

export default rootReducer;
