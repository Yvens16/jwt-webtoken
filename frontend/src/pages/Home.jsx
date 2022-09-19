import { useState } from "react";

export default function Home() {
  const [movies, setMovies] = useState([]);

  const getMovies = () => {
    const token = sessionStorage.getItem("token");
    fetch("http://localhost:5001/movies", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`, // notice the Bearer before your token
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.warn("data:", data);
        setMovies(data);
      })
      .catch((error) => {
        console.warn("error:", error);
      });
  };

  const login = () => {
    fetch("http://localhost:5001/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Yvens",
        email: "yves@gmail.com",
        password: "test",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.warn(data.token);
        sessionStorage.setItem("token", data.token);
        return data;
      })
      .catch((error) => {
        console.warn(error);
      });
  };

  const logout = () => {
    const token = sessionStorage.getItem("token");
    fetch("http://localhost:5001/logout", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`, // notice the Bearer before your token
      },
    })
      .then((response) => response.json())
      .then((res) => {
        console.warn(res);
        return res;
      })
      .catch((error) => {
        console.warn(error);
      });
  };
  return (
    <div>
      <button type="button" onClick={() => login()}>
        Login
      </button>
      <button type="button" onClick={() => logout()}>
        logout
      </button>
      <button type="button" onClick={() => getMovies()}>
        Get movies
      </button>
      <div>
        <h1>List of Movies</h1>
        {movies.length &&
          movies.map((movie) => <p key={movie.id}>{movie.name}</p>)}
      </div>
    </div>
  );
}
