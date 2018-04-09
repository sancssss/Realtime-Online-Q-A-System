import { LOGIN_TEACHER, LOGIN_STUDENT, STUDENT_SUBMIT_ROOM, TEACHER_CREATE_ROOM, CHANGE_LOGIN_FORM } from '../Constants/ActionTypes';

//Object loginData
export function loginTeacher(loginData) {
  return {type: LOGIN_TEACHER, loginData: loginData};
}
//Object loginData
export function loginStudent(loginData) {
  return {type: LOGIN_STUDENT, loginData: loginData};
}
//Object roomData
export function studentSubmitRoom(roomData) {
  return {type: STUDENT_SUBMIT_ROOM, roomData};
}
//Object roomData
export function teacherCreateRoom(roomData) {
  return {type: TEACHER_CREATE_ROOM, roomData};
}

//Object loginData
export function handleLoginFormChange(loginData) {
  return {type: CHANGE_LOGIN_FORM, loginData};
}
