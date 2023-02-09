import React, {useState, useRef, useEffect, useCallback} from 'react';

import MoviesList from './component/MovieList';
import MovieForm from './component/MovieForm';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retrying, setRetrying] = useState();
  const [check, setCheck] = useState(false);
  // console.log(ref)

  const fetchMoviesHandler = useCallback( async () => {  
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('https://react-http-b66db-default-rtdb.firebaseio.com/movies.json');
    if(!response.ok){
      throw new Error('Something went wrong!  ')
    }

      const data = await response.json();

      const loadedMovies = [];

      for( const key in data) {
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate,
        })
      }

        setMovies(loadedMovies);
        setIsLoading(false);
    } catch(error) {
      setError(error.message);
      setCheck(true);
      const retrying = setTimeout(() => {
        fetchMoviesHandler();
      },5000);
      setRetrying(retrying);
    }
      
        setIsLoading(false);
  },[]);

  useEffect(() => {          
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);
  
  async function AddMovieHandler(movie) {
    const response = await fetch('https://react-http-b66db-default-rtdb.firebaseio.com/movies.json', {
      method: 'POST',
      body: JSON.stringify(movie),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data =await response.json();
    console.log(data);
    fetchMoviesHandler()
  }

  
  // let content = <p>No movies Found</p>

  // if(movies.length > 0) {
  //   content = <MoviesList movies={movies} />
  // };

  const retryingHandler = () => {
      clearTimeout(retrying);
      setCheck(false);
    
  }

  if(error){
   <p>{retrying && error}</p>
  }

  if(isLoading){
   <p>Loading...</p>
  }
   
  return (
    <React.Fragment>
      <section>
      <MovieForm onAddMovie={AddMovieHandler}/>
      </section>
        <section>
          <button onClick={fetchMoviesHandler}>Fetch Movies</button>      
        </section>
      <section> 
        {/* {content} */}
       {!isLoading && movies.length > 0 && <MoviesList fetchMoviesHandler={fetchMoviesHandler} movies={movies} />}
       {!isLoading && movies.length === 0 && !error &&<p>Found no movies.</p>}
       {isLoading && <p>Data is Loading...</p>}
       {!isLoading && error && <p>{error}</p>}
      
       <section>

        {check && !isLoading && error &&  <button onClick={retryingHandler}>Cancel</button>}
      </section>
      </section>
    </React.Fragment>
  );
}

export default App;