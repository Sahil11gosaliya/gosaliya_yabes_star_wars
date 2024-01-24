(() => {
    const characterList = document.querySelector('#character-list'); // Update the selector
    const movieDetails = document.querySelector('#character-details'); // Assuming you meant character-details
    const baseUrl = 'https://swapi.dev/api/';

    // Fetch characters and populate the list
    fetch(`${baseUrl}people/`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch character information. Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const characters = data.results.slice(0, 10); // Limit to 10 characters for simplicity

            characters.forEach(character => {
                const characterItem = document.createElement('li');
                const characterLink = document.createElement('a');
                characterLink.textContent = character.name;
                characterLink.href = '#'; // Add a placeholder href for styling
                characterItem.appendChild(characterLink);
                characterList.appendChild(characterItem);

                characterLink.addEventListener('click', function (event) {
                    event.preventDefault();
                    getCharacterDetails(character);
                });
            });
        })
        .catch(error => console.error("Error fetching character list:", error));

    function getCharacterDetails(character) {
        // Fetch movies for the selected character
        Promise.all(character.films.map(url => fetch(url).then(response => response.json())))
            .then(movies => {
                const movieListHTML = movies.map(movie => `
                    <li>${movie.title}</li>
                `).join('');

                const characterDetailsHTML = `
                    <div>
                        <h3>${character.name}</h3>
                        <p>Description: ${character.description || 'No description available.'}</p>
                        <p>Height: ${character.height} cm</p>
                        <p>Hair Color: ${character.hair_color}</p>
                        <p>Eye Color: ${character.eye_color}</p>
                        <p>Skin Color: ${character.skin_color}</p>
                        <p>Birth Year: ${character.birth_year}</p>
                        <p>Gender: ${character.gender}</p>
                        <p>Race: ${character.species}</p>
                        <h4>Movies:</h4>
                        <ul>${movieListHTML}</ul>
                    </div>
                `;

                movieDetails.innerHTML = characterDetailsHTML;
            })
            .catch(error => {
                console.error("Error fetching character details:", error);
                movieDetails.innerHTML = "<p>Error fetching character details. Please try again.</p>";
            });
    }
})();
