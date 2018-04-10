import { CHANGE_CURRENT_PAGE, LOGIN_USER, STUDENT_JOIN_ROOM, TEACHER_CREATE_ROOM} from '../Constants/ActionTypes';

//Object loginData
export function loginUser(loginData) {
  return {type: LOGIN_USER, loginData};
}
//String currentPage
export function changeCurrentPage(pageName) {
  return {type: CHANGE_CURRENT_PAGE, pageName}
}
//Object roomData
export function studentJoinRoom(roomData) {
  return {type: STUDENT_JOIN_ROOM, roomData};
}
//Object roomData
export function teacherCreateRoom(roomData) {
  return {type: TEACHER_CREATE_ROOM, roomData};
}
