(() => {
    const movieBox = document.querySelector("#movie-box");
    const reviewTemplate = document.querySelector("#review-template");
    const reviewCon = document.querySelector("#review-con");
    const baseUrl = `https://search.imdbot.workers.dev/`;

    function getMovies() {
        fetch(`${baseUrl}?q=speed`)
            .then(response => response.json())
            .then(function (response) {
                console.log(response.description);
                const movies = response.description;
                const ul = document.createElement("ul");

                movies.forEach(movie => {
                    const li = document.createElement("li");
                    const a = document.createElement("a");
                    a.textContent = movie['#TITLE'];
                    a.dataset.review = movie['#IMDB_ID'];
                    li.appendChild(a);
                    ul.appendChild(li);
                });

                movieBox.appendChild(ul);

                const links = document.querySelectorAll("#movie-box li a");
                links.forEach(link => {
                    link.addEventListener("click", function (e) {
                        getReview(e);
                    });
                });
            })
            .catch(err => {
                console.log(err);
                // Send a message to the user in the DOM if there was an issue
            });
    }
    getMovies();

    function getReview(event) {
        event.preventDefault();
        const reviewID = event.target.dataset.review;

        fetch(`${baseUrl}?tt=${reviewID}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(function (response) {
                const template = document.importNode(reviewTemplate.content, true);
                const reviewBody = template.querySelector(".review-description");
                reviewBody.innerHTML = response.short.review.reviewBody;
                reviewCon.appendChild(template);
            })
            .catch(error => {
                console.error("Error fetching movie reviews:", error);
                // Add a message to the user that is written in the DOM
            });
    }
})();
