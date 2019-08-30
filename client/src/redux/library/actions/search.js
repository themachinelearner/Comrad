import { libraryTypes } from '../libraryTypes';
import { libraryAPI } from '../../../api';

/* type is optional, or can be one of "album", "artist", "track" */
/* searchString is optional */
/* sort is optional, and is an object with:
  id: the field to sort by
  desc: true or false, whether to sort as descending or not 
Cannot be used with search results (those are sorted by how well they match the search term)*/
/* page is an optional Number, and is the page number of results to return (default 0). Cannot currently be used with search results */
export const search = (type, searchString, sort, page) => async dispatch => {
  try {
    dispatch({ type: libraryTypes.LOAD });

    let apiResponse;
    if (searchString != null && searchString.length > 0) {
      apiResponse = await libraryAPI.search(type, searchString);
    } else {
      apiResponse = await libraryAPI.findAll(type, sort, page);
    }

    let { docs, totalPages } = apiResponse.data;

    dispatch({ type: libraryTypes.SEARCH, payload: { docs, totalPages } });
  } catch (err) {
    console.log(err);
    dispatch({ type: libraryTypes.LOADING_ERROR });
  }
};