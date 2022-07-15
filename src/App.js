import React, { useCallback, useEffect, useState } from 'react';

import MoviesList from './components/MoviesList';
import './App.css';
import AddMovie from './components/AddMovie';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_URL}/movies.json`);

      if (!res.ok) {
        throw new Error('something went wrong');
      }

      const data = await res.json();

      const loadedMovies = [];

      for (const key in data) {
        loadedMovies.push({
          id: key,
          ...data[key]
        });
      }
      setMovies(loadedMovies);
    } catch (e) {
      setError(e.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMoviesHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function addMovieHandler(movie) {
    console.log(movie);
    const res = await fetch(`${process.env.REACT_APP_URL}/movies.json`, {
      method: 'POST',
      body: JSON.stringify(movie),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await res.json();
    console.log(data);
  }

  let content = <p>not found movies</p>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }

  if (error) {
    content = <p>{error}</p>;
  }

  if (isLoading) {
    content = <p>Loading..</p>;
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
