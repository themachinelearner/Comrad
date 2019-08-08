import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import { alertReducer } from './alert';
import { authReducer } from './auth';
import { configReducer } from './config';
import { libraryReducer } from './library';
import { modalReducer } from './modal';
import { permissionReducer } from './permission';
import { playlistReducer } from './playlist';
import { resourceReducer } from './resource';
import { showReducer } from './show';
import { trafficReducer } from './traffic';
import { userReducer } from './user';

export * from './alert';
export * from './auth';
export * from './config';
export * from './library';
export * from './permission';
export * from './playlist';
export * from './traffic';
export * from './user';

export default combineReducers({
  alert: alertReducer,
  auth: authReducer,
  config: configReducer,
  form: formReducer,
  library: libraryReducer,
  modal: modalReducer,
  permission: permissionReducer,
  playlist: playlistReducer,
  resource: resourceReducer,
  show: showReducer,
  traffic: trafficReducer,
  user: userReducer,
});
