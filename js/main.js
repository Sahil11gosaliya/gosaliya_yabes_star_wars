(() => {
    const baseUrl = 'https://swapi.dev/api/';
    const characterList = document.querySelector('.clist');
    const characterDetails = document.querySelector('#character-details');
    const characterAudio = document.querySelector('audio');

    const spinner = document.createElement('div');
    spinner.classList.add('spinner', 'glass-container');
    spinner.id = 'spinner';
    document.body.appendChild(spinner);
    spinner.style.display = 'block';

    const spinner2 = document.createElement('div');
    spinner2.classList.add('spinner', 'glass-container');
    spinner2.id = 'spinner2';
    document.body.appendChild(spinner2);
    spinner2.style.display = 'none';

    const { TweenMax, Power2 } = window;

    const shuffleAnimations = () => {
        // const characterItems = [...characterList.querySelectorAll('li')];
        const characterItems = Array.from(characterList.querySelectorAll('li'));

        characterItems.sort(() => Math.random() - 0.5).forEach((characterItem, index) => {
            TweenMax.to(characterItem, 0.5, {
                opacity: 1,
                ease: Power2.easeInOut,
                delay: 0.3 * index,
            });
        });
    };

    const getCharacterDetails = (character) => {
        if (!character.detailsFetched) {
            spinner2.style.display = 'block';
            characterDetails.innerHTML = '';


            Promise.all(character.films.map(url => fetch(url).then(response => response.json())))
                .then(movies => {
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
                    characterImage.src = `images/${character.url.match(/\d+/)}.png`;
                    characterInfoDiv.prepend(characterImage);
                    characterDetails.appendChild(characterInfoDiv);

                    movies.slice(0, 4).forEach((movie, index) => {
                        const movieContainer = document.createElement('div');
                        movieContainer.classList.add('cbiodata', 'glass-container', 'movie-container');
                        movieContainer.style.opacity = '0';
                        movieContainer.style.transform = 'scale(0)';
                        const posterURL = `images/${index + 1}.jpeg`;
                        movieContainer.innerHTML = `
                            <img src="${posterURL}" alt="Poster for ${movie.title}">
                            <h4>${movie.title}</h4>
                            <p>Plot: ${movie.opening_crawl}</p>
                        `;
                        characterDetails.appendChild(movieContainer);

                        TweenMax.to(movieContainer, 0.5, {
                            opacity: 1,
                            scale: 1,
                            ease: Power2.easeInOut,
                        });
                    });

                    spinner2.style.display = 'none';
                    characterDetails.scrollIntoView({ behavior: 'smooth' });
                    character.detailsFetched = true;
                })
                .catch(error => {
                    console.error("Error fetching character details:", error);
                    characterDetails.innerHTML = "<p>Error fetching character details. Please try again.</p>";
                    spinner2.style.display = 'none';
                });
        } else {
            characterDetails.innerHTML = '';
            character.detailsFetched = false;
        }
    };

    gsap.from("#character-list", {
        duration: 1.5,
        opacity: 0,
        x: -50,
        ease: "power2.out"
    });

    gsap.from("#data", {
        duration: 1.5,
        opacity: 0,
        x: 50,
        ease: "power2.out",
        delay: 0.5
    });

    fetch(`${baseUrl}people/`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch character information. Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const characters = data.results.slice(0, 10);

            characters.forEach(character => {
                const characterItem = document.createElement('li');
                const characterLink = document.createElement('a');
                characterLink.textContent = character.name;
                characterLink.href = '#';
                characterItem.appendChild(characterLink);
                characterList.appendChild(characterItem);
                characterItem.style.opacity = '0';

                characterLink.addEventListener('click', (event) => {
                    event.preventDefault();
                    document.querySelectorAll('.clist a').forEach(link => link.classList.remove('active-link'));
                    characterLink.classList.add('active-link');
                    if (characterAudio) {
                        characterAudio.play();
                    }
                    getCharacterDetails(character);
                });
            });

            spinner.style.display = 'none';
            shuffleAnimations();
        })
        .catch(error => {
            console.error("Error fetching character list:", error);
            characterDetails.innerHTML = "<p>Error fetching character list. Please try again.</p>";
            spinner.style.display = 'none';
        });
})();



// (() => {
//     const bgmusic = document.querySelector('.bgm');
//     bgmusic.play().catch(() => {
//         console.error('Autoplay was prevented.');
//     });
// })();




// Promise.all is used to concurrently fetch and process movie data for a character after their details are displayed, optimizing performance instead of if...then...else