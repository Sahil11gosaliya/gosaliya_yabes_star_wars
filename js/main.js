(() => {
    const baseUrl = 'https://swapi.dev/api/';
    const characterList = document.querySelector('.clist');
    const characterDetails = document.querySelector('#character-details');
    const charactersData = {}; // Store character details to prevent redundant requests

    // Create and setup the loading spinner element for character list
    const spinner = document.createElement('div');
    spinner.classList.add('spinner', 'glass-container');
    spinner.id = 'spinner';
    document.body.appendChild(spinner);
    spinner.style.display = 'block'; // Initially set to visible

    // Create and setup the loading spinner element for character details
    const spinner2 = document.createElement('div');
    spinner2.classList.add('spinner', 'glass-container');
    spinner2.id = 'spinner2';
    document.body.appendChild(spinner2);
    spinner2.style.display = 'none'; // Initially set to hidden

    // Add GSAP TweenMax for animation (Make sure to include the GSAP library in your HTML)
    const { TweenMax, Power2 } = window;

    // Shuffle the animations randomly
    const shuffleAnimations = () => {
        const characterItems = [...characterList.querySelectorAll('li')];
        const shuffledCharacterItems = characterItems.sort(() => Math.random() - 0.5);

        shuffledCharacterItems.forEach((characterItem, index) => {
            TweenMax.to(characterItem, 0.5, {
                opacity: 1, // Animate opacity to 1 (fully visible)
                ease: Power2.easeInOut, // Easing function for smooth animation
                delay: 0.3 * index, // Apply delay to create staggered animation
            });
        });
    };

    const getCharacterDetails = (character, characterItem) => {
        if (!charactersData[character.url] || !character.detailsFetched) {
            charactersData[character.url] = true; // Mark character as fetched to prevent redundant requests
            character.detailsFetched = true; // Mark character as details fetched
            spinner2.style.display = 'block'; // Show the loading spinner
            characterDetails.innerHTML = '';

            Promise.all(character.films.map(url => fetch(url).then(response => response.json())))
                .then(movies => {
                    // Character Information
                    const characterInfoDiv = document.createElement('div');
                    characterInfoDiv.classList.add('cbiodata', 'glass-container');
                    characterInfoDiv.innerHTML = `
                        <h3>${character.name}</h3>
                        <p>Height: ${character.height} cm</p>
                        <p>Hair Color: ${character.hair_color}</p>
                        <p>Eye Color: ${character.eye_color}</p>
                        <p>Skin Color: ${character.skin_color}</p>
                        <p>Birth Year: ${character.birth_year}</p>
                        <p>Gender: ${character.gender}</p>
                    `;

                    const characterImage = document.createElement('img');
                    characterImage.src = `images/${character.url.match(/\d+/)}.png`; // Link to character image

                    // Append the image element to the character info div
                    characterInfoDiv.prepend(characterImage); // Place the character image at the top
                    characterDetails.appendChild(characterInfoDiv);

                    // Movie Containers
                    movies.forEach((movie, index) => {
                        const movieContainer = document.createElement('div');
                        movieContainer.classList.add('cbiodata', 'glass-container', 'movie-container');
                        movieContainer.style.opacity = '0'; // Initially set the opacity to 0

                        const posterURL = `images/${index + 1}.jpeg`; // Modify as per your image naming convention

                        movieContainer.innerHTML = `
                            <img src="${posterURL}" alt="Poster for ${movie.title}">
                            <h4>${movie.title}</h4>
                            <p>Plot: ${movie.opening_crawl}</p>
                        `;
                        characterDetails.appendChild(movieContainer);

                        // Animate the movie container to fade in
                        TweenMax.to(movieContainer, 0.5, {
                            opacity: 1, // Animate opacity to 1 (fully visible)
                            ease: Power2.easeInOut, // Easing function for smooth animation
                        });
                    });

                    spinner2.style.display = 'none'; // Hide the loading spinner

                    // Scroll to the character details section with smooth scrolling
                    characterDetails.scrollIntoView({ behavior: 'smooth' });
                })
                .catch(error => {
                    console.error("Error fetching character details:", error);
                    characterDetails.innerHTML = "<p>Error fetching character details. Please try again.</p>";
                    spinner2.style.display = 'none'; // Hide the loading spinner on error
                });
        }
    };

    fetch(`${baseUrl}people/`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch character information. Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const characters = data.results.slice(0, 10); // Limit to 10 characters for simplicity

            characters.forEach((character, index) => {
                const characterItem = document.createElement('li');
                const characterLink = document.createElement('a');
                characterLink.textContent = character.name;
                characterLink.href = '#';
                characterItem.appendChild(characterLink);
                characterList.appendChild(characterItem);

                // Initially set the opacity to 0 for character links
                characterItem.style.opacity = '0';

                characterLink.addEventListener('click', (event) => {
                    event.preventDefault();
                    if (!characterLink.classList.contains('clicked')) {
                        characterLink.classList.add('clicked');
                        getCharacterDetails(character, characterItem);
                    } else {
                        // Reset the detailsFetched flag for this character
                        character.detailsFetched = false;
                    }
                });
            });

            // Hide the loading spinner for character list once characters are loaded
            spinner.style.display = 'none';

            // Shuffle the animations of character list items
            shuffleAnimations();
        })
        .catch(error => {
            console.error("Error fetching character list:", error);
            characterDetails.innerHTML = "<p>Error fetching character list. Please try again.</p>";
            spinner.style.display = 'none'; // Hide the loading spinner on error
        });
})();


