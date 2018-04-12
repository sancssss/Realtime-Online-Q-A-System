import { createStore, applyMiddleware } from 'redux';
import rootReducer from '../Reducers/index';
import createHistory from 'history/createBrowserHistory'
import { routerMiddleware } from 'react-router-redux'

export const history = createHistory();
const middleware = routerMiddleware(history);
const store = createStore(rootReducer, applyMiddleware(middleware));// TODO: can be added server data when client network error
export default store;
