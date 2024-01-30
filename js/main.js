(() => {
    const baseUrl = 'https://swapi.dev/api/';
    const characterList = document.querySelector('.clist');
    const characterDetails = document.querySelector('#character-details');

    // Create and setup the loading spinner element
    const loadingSpinner = document.createElement('div');
    loadingSpinner.classList.add('spinner', 'glass-container');
    loadingSpinner.id = 'loading-spinner';
    document.body.appendChild(loadingSpinner);
    loadingSpinner.style.display = 'none';

    // Add GSAP TweenMax for animation (Make sure to include the GSAP library in your HTML)
    const { TweenMax, Power2 } = window;

    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    const getCharacterDetails = (character, characterItem) => {
        if (!character.detailsFetched) {
            character.detailsFetched = true;
            loadingSpinner.style.display = 'block';
            document.getElementById('character-details').innerHTML = '';

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
                            <p>Opening Crawl: ${movie.opening_crawl || 'No opening crawl available.'}</p>
                        `;
                        characterDetails.appendChild(movieContainer);
                    });

                    loadingSpinner.style.display = 'none';
                })
                .catch(error => {
                    console.error("Error fetching character details:", error);
                    characterDetails.innerHTML = "<p>Error fetching character details. Please try again.</p>";
                    loadingSpinner.style.display = 'none';
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
            const shuffledCharacters = shuffleArray(characters); // Shuffle the character list

            shuffledCharacters.forEach((character, index) => {
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
                    }
                });
            });

            // Animate all character links to fade in together on page load
            TweenMax.staggerTo(
                shuffleArray([...characterList.querySelectorAll('li')]),
                0.5,
                {
                    opacity: 1, // Animate opacity to 1 (fully visible)
                    ease: Power2.easeInOut, // Easing function for smooth animation
                    delay: 1.0, // Delay before animation starts
                },
                0.3 // Stagger delay between elements
            );
        })
        .catch(error => {
            console.error("Error fetching character list:", error);
            characterDetails.innerHTML = "<p>Error fetching character list. Please try again.</p>";
        });
})();







(function () {
    const audio = document.querySelector('#background-audio');
    let audioPlayed = false; // Flag to ensure audio plays only once

    // Function to set the volume
    function setVolume(volumeLevel) {
        if (audio) {
            audio.volume = volumeLevel;
        }
    }

    // Function to play the audio once
    function playAudioOnce() {
        if (audio && !audioPlayed) {
            audio.play();
            audioPlayed = true; // Set the flag so it doesn't play again
            // Remove event listeners to prevent further playback
            document.removeEventListener('mouseenter', playAudioOnce);
            document.removeEventListener('click', playAudioOnce);
        }
    }

    // Initialize volume
    setVolume(0.3); // Set volume to 30%, adjust as needed

    // Event listeners for mouse enter and click
    document.addEventListener('mouseenter', playAudioOnce);
    document.addEventListener('click', playAudioOnce);

    // Play the audio on page load if autoplay is allowed
    window.addEventListener('load', playAudioOnce);

    // Expose the setVolume function to global scope
    window.setVolume = setVolume;
})();
