import { trackAPI } from '../../../api';
import { trackTypes } from '../trackTypes';

export const edit = (data, callback) => async dispatch => {
  try {
    const _id = data.id;
    const track = await trackAPI.update(data, _id);
    dispatch({ type: track.EDIT, payload: track.data });
    callback(track.data);
  } catch (e) {
    console.error(e);
    dispatch({
      type: trackTypes.ALERT,
      payload: { type: 'danger', body: e.response.data.errorMessage },
    });
  }
};
