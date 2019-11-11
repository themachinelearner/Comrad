import { alertTypes } from '../../alert';
import { trafficAPI } from '../../../api';

export const deleteSeries = (trafficSeriesId, callback) => async dispatch => {
  try {
    const response = await trafficAPI.deleteSeries(trafficSeriesId);
    callback(response);
  } catch (e) {
    console.error(e);
    dispatch({
      type: alertTypes.ACTIVE,
      payload: {
        type: 'danger',
        header: 'Error',
        body: e.response.data.errorMessage,
      },
    });
  }
};
