import { createStore } from 'redux';
import rootReducer from '../Reducers/index';

const store = createStore(rootReducer);// TODO: can be added server data when client network error

export default store;
