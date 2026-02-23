import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {fetchMoviesAPI} from './movieAPI';

export const fetchMovies = createAsyncThunk(
    'movies/fetchMovies',
    async (query, thunkAPI) => {
        try{
            return await fetchMoviesAPI(query);

        }
        catch(error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);


const movieSlice = createSlice({
    name: 'movies',
    initialState: { 
        movies: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMovies.pending, (state) => {
                state.loading = true;
                state.error = null;
            }
            )
            .addCase(fetchMovies.fulfilled, (state, action) => {
                state.loading = false;
                state.movies = action.payload;
            })
            .addCase(fetchMovies.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch movies';
            });
    }
});



export default movieSlice.reducer;