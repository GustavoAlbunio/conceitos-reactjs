import React, { useState, useEffect } from "react";

import api from "./services/api";

import "./styles.css";

function App() {
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    api.get("repositories").then((response) => {
      setRepositories(response.data);
    });
  }, []);

  async function handleAddRepository() {
    const response = await api.post("repositories", {
      title: "Conceitos de ReactJS",
      url: "https://github.com/GustavoAlbunio/conceitos-reactjs",
      techs: ["ReactJS", "Axios", "Jest"],
    });

    setRepositories([...repositories, response.data]);
  }

  async function handleRemoveRepository(id) {
    await api.delete(`repositories/${id}`);

    setRepositories(repositories.filter((repository) => repository.id !== id));
  }

  async function handleLikeRepository(id) {
    const { data } = await api.post(`repositories/${id}/like`);

    setRepositories(
      repositories.map((repository) => {
        if (repository.id === data.id) {
          return { ...repository, likes: data.likes };
        }
        return repository;
      })
    );
  }

  return (
    <div>
      <ul data-testid="repository-list">
        {repositories.length > 0 &&
          repositories.map((repository) => (
            <li key={repository.id}>
              {repository.title}
              <button
                className="delete"
                onClick={() => handleRemoveRepository(repository.id)}
              >
                Remover
              </button>
              <button
                className="like"
                onClick={() => handleLikeRepository(repository.id)}
              >
                <span>{repository.likes}</span>
                Like
              </button>
            </li>
          ))}
      </ul>

      <button onClick={handleAddRepository}>Adicionar</button>
    </div>
  );
}

export default App;
