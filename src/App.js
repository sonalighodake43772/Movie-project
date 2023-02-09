import React, { useCallback, useEffect, useState } from 'react';

import MoviesList from './component/MovieList';
import './App.css';
import MoviesForm from './component/MovieForm';

function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retrying, setRetrying] = useState();
  const [check, setCheck] = useState(false);
  
  const fetchMoviesHandler = useCallback(async() => {
    setLoading(true);
    setError(null);
    try{
      const response = await fetch('https://swapi.dev/api/films');
      if(!response.ok){
        throw new Error('Something went wrong...Retrying');
      }
       const data = await response.json();
        const transformedMovies = data.results.map((movieData) => {
          return {
            id: movieData.episode_id,
            title: movieData.title,
            openingText: movieData.opening_crawl,
            releaseDate: movieData.release_date,
          }
        }) 
        setMovies(transformedMovies);
    }catch(error) {
      setError(error.message);
      setCheck(true);
      const retrying = setTimeout(() => {
        fetchMoviesHandler();
      },5000);
      setRetrying(retrying);
    }
      
        setLoading(false);
  },[]);

  useEffect(() => {
    fetchMoviesHandler()
    console.log('useEffect is called');
  },[fetchMoviesHandler])

  function addMovieHandler (title,openText,releasedate) {
    console.log(title);
    console.log(openText);
    console.log(releasedate);
  }

  let content = <p>No movies Found</p>

  if(movies.length > 0) {
    content = <MoviesList movies={movies} />
  };

  const retryingHandler = () => {
      clearTimeout(retrying);
      setCheck(false);
    
  }

  if(error){
    content = <p>{retrying && error}</p>
  }

  if(loading){
    content = <p>Loading...</p>
  }

  return (
    <React.Fragment>
      <MoviesForm onAddMovie={addMovieHandler}/>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
        {content}
        {check && !loading && error &&  <button onClick={retryingHandler}>Cancel</button>}
      </section>
    </React.Fragment>
  );
}

export default App;