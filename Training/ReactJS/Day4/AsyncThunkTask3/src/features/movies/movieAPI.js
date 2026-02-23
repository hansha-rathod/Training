export const fetchMoviesAPI = async (query) => {
    const response = await fetch(`https://api.tvmaze.com/search/shows?q=${query}`);
    if (!response.ok) {
        throw new Error('Failed to fetch movies');
    }
    return response.json();
};