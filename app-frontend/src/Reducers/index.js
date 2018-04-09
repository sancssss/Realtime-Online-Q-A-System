import { LOGIN_TEACHER, LOGIN_STUDENT, STUDENT_SUBMIT_ROOM, TEACHER_CREATE_ROOM, CHANGE_LOGIN_FORM } from '../Constants/ActionTypes';
import { combineReducers } from 'redux';

const initialLoginState = {
  userid: '',
  password: '',
  currentPage: 'index_login',
};

const initialOtherState ={
  studentJoinRoomId: '',
  studentQuestionTime: '',
  studentQuestionText: '',
  teacherCreateRoomId: '',
  teacherQuestionTime: '',
  teacherQuestionText: '',
  teacherQuestionAnswer: ''
}

const rootReducer = (state=initialLoginState, action) => {
  switch(action.type) {
    case LOGIN_STUDENT:
      return Object.assign({}, state, {
        userid: action.loginData.userid,
        password: action.loginData.password,
        currentPage: 'student_join_question'
      });
    case LOGIN_TEACHER:
      console.log("LOGIN_TEACHER+"+ state.currentPage)
      return Object.assign({}, state, {
        userid: action.loginData.userid,
        password: action.loginData.password,
        currentPage: 'teacher_create_question'
      });
    default:
      return {
        ...state
      }
  }
}

const otherReducer = (state=initialOtherState, action) => {
  switch (action.type) {
    case STUDENT_SUBMIT_ROOM:
      return Object.assign({}, state, {
        studentJoinRoomId: action.roomData.studentJoinRoomId,
        studentQuestionTime: action.roomData.studentQuestionTime,
        studentQuestionText: action.roomData.studentQuestionText,
        currentPage: 'student_question_room'//// TODO: use react-router to change page
      });
    case TEACHER_CREATE_ROOM:
      return Object.assign({}, state, {
        teacherCreateRoomId: action.roomData.studentJoinRoomId,
        teacherQuestionTime: action.roomData.studentQuestionTime,
        teacherQuestionText: action.roomData.studentQuestionText,
        teacherQuestionAnswer: action.roomData.stduentQuestionAnswer,
        currentPage: 'teacher_question_room'//// TODO: use react-router to change page
      });
    default:
      return state;
  }
};
/*
const rootReducer = combineReducers({
  loginReducer,
  otherReducer
});
*/
export default rootReducer;
