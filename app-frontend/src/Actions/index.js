import { CHANGE_APP_TITLE, LOGIN_USER, STUDENT_JOIN_ROOM, TEACHER_CREATE_ROOM} from '../Constants/ActionTypes';

//Object loginData
export function loginUser(loginData) {
  return {type: LOGIN_USER, loginData};
}
//String title
export function changeAppTitleTo(title) {
  return {type: CHANGE_APP_TITLE, title}
}
//Object roomData
export function studentJoinRoom(roomData) {
  return {type: STUDENT_JOIN_ROOM, roomData};
}
//Object roomData
export function teacherCreateRoom(roomData) {
  return {type: TEACHER_CREATE_ROOM, roomData};
}
