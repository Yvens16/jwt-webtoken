import { useState } from "react";
/**
 * 1 - Se connecter
 *  -- Login + Conservation du token dans le front,
 *  Pour chaque appel sur les routes protégées, on envoie le token
 * 2 - De déconnecter
 *  --
 * 3- De récuperer des données protégées (Get movies)
 * 4- Vérifier que les données soient protégées
 */

export default function Home() {
  const [movies, setMovies] = useState([]);

  const getMovies = () => {
    const token = sessionStorage.getItem("token");
    fetch("http://localhost:5001/movies", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((movies) => {
        console.log(movies);
        setMovies(movies);
      })
      .catch((err) => console.error(err));
  };
  const login = () => {
    fetch("http://localhost:5001/login", {
      method: "POST",
      // credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "yves@gmail.com",
        password: "test",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("LOG LOGIN", data);
        const { token } = data;
        sessionStorage.setItem("token", token);
      })
      .catch((err) => console.log("LOG IN login", err));
  };

  const logout = () => {
    const token = sessionStorage.getItem("token");
    fetch("http://localhost:5001/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("DATA IN LOGOUT", data);
        sessionStorage.removeItem("token");
      })
      .catch((err) => console.error("ERR IN LOGOUT", err));
  };

  return (
    <div>
      <button onClick={() => login()}>Login</button>
      <button onClick={() => logout()}>Logout</button>
      <button onClick={() => getMovies()}>Get Movies</button>
      <h1>Movies</h1>
      {movies.length > 0 &&
        movies.map((movie, idx) => <div key={movie.id}>{movie.name}</div>)}
    </div>
  );
}
