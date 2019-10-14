import { http as httpUtils } from '../../utils';

const getSearch = async (query) => {
  const host = 'http://localhost:4000',
        path = '/api/search',
        queryString = httpUtils.encodeQuery(query);

  const response = await fetch(`${host}${path}?${queryString}`);

  if (!response.ok) {
    throw response.statusText;
  }

  return response.json();
};

const http = {
  getSearch
};

export default http;