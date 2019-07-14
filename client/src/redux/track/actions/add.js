import { alertTypes } from '../../alert';
import { trackAPI } from '../../../api';
import { trackTypes } from '../trackTypes';

export const add = (input, callback) => async dispatch => {
  try {
    const addedTrack = await trackAPI.add(input);
    dispatch({ type: trackTypes.ADD, payload: addedTrack.data });
    callback(addedTrack.data);
  } catch (e) {
    console.error(e);
    dispatch({
      type: alertTypes.ACTIVE,
      payload: {
        type: 'danger',
        header: 'ERROR',
        body: e.response.data.errorMessage,
      },
    });
  }
};
