import axios from 'axios';

const API_KEY = 'a6a991f';
const BASE_URL = 'http://www.omdbapi.com/';

export const fetchMovies = async (searchQuery: string, page: number = 1) => {
  const response = await axios.get(BASE_URL, {
    params: {
      s: searchQuery,
      apikey: API_KEY,
      page,
    },
  });

  return response.data;
};
