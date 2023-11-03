// Add this JavaScript code to your script.js


// Use your actual OMDB API key
const apiKey = "ed07e9d2";
const searchInput = document.querySelector("#search-input");
const searchButton = document.querySelector("#search-button");
const resultsContainer = document.querySelector("#results-container");

const myProduct=document.getElementById('total-counter');
// Retrieve favorite movies from local storage (if any)
  const myProductStores=JSON.parse(localStorage.getItem("favoriteMovies")) || [];
  console.log(myProductStores);

 if(myProductStores.length>0){
  myProduct.innerHTML=myProductStores.length;
 }

searchButton.addEventListener("click", () => {
  const searchTerm = searchInput.value;
  // Construct the API URL with your API key and the search term.
  const apiUrl = `https://www.omdbapi.com/?s=${searchTerm}&apikey=${apiKey}`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      if (data.Response === "True") {
        const movies = data.Search;
        // Handle the list of movies returned by the API.
        renderMovies(movies);
      } else {
        // Handle the case where no movies were found.
        resultsContainer.innerHTML = "No results found.";
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});
// ...

function renderMovies(movies) {
  // Clear the previous results.
  resultsContainer.innerHTML = "";

  movies.forEach((movie) => {
    const movieElement = document.createElement("div");
    movieElement.classList.add("movie");
    movieElement.classList.add('div1');

    // Fetch IMDb rating for each movie
    fetch(`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=${apiKey}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.imdbRating) {
          // If IMDb rating is available, display it
          movieElement.innerHTML = `
            <div>
              <img src="${movie.Poster}" alt="${movie.Title} Poster">
            </div>
            <h2>${movie.Title}</h2>
            <p>Year: ${movie.Year}</p>
            <p>Type: ${movie.Type}</p>
            <p>IMDb Rating: ${data.imdbRating}</p>
            <button class="favorite-button" data-imdbid="${movie.imdbID}">Add to Favorites</button>
          `;
        } else {
          // If IMDb rating is not available, display a message
          movieElement.innerHTML = `
            <div>
              <img src="${movie.Poster}" alt="${movie.Title} Poster">
            </div>
            <h2>${movie.Title}</h2>
            <p>Year: ${movie.Year}</p>
            <p>Type: ${movie.Type}</p>
            <p>IMDb Rating: Not Available</p>
            <button class="favorite-button" data-imdbid="${movie.imdbID}">Add to Favorites</button>
          `;
        }

        resultsContainer.appendChild(movieElement);
      })
      .catch((error) => {
        console.error("Error fetching IMDb rating:", error);
      });
  });
}

// ...

resultsContainer.addEventListener("click", (event) => {
  if (event.target.classList.contains("favorite-button")) {
    const imdbID = event.target.getAttribute("data-imdbid");
    addToFavorite(imdbID);
  }
});


function addToFavorite(movieId) {
  // Fetch the movie details by ID
  fetch(`https://www.omdbapi.com/?i=${movieId}&apikey=${apiKey}`)
    .then((response) => response.json())
    .then((result) => {
      // Check if the movie with the same imdbID already exists in favorites
      if (isMovieInFavorites(result.imdbID)) {
        alert("Movie is already in favorites!");
      } else {
        // If it doesn't exist, add it to favorites
        addToFavorites(result);
        alert("Added to favorites!");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function isMovieInFavorites(imdbID) {
  // Retrieve favorite movies from local storage (if any)
  const favoriteMovies =
    JSON.parse(localStorage.getItem("favoriteMovies")) || [];

    const favCounter = document.getElementById("total-counter");
  if (favCounter.innerText != null) {
    console.log(favoriteMovies);
    favCounter.innerText = favoriteMovies.length;
  }

  // Check if a movie with the same imdbID already exists
  return favoriteMovies.some((movie) => movie && movie.imdbID === imdbID);


}

function addToFavorites(movie) {
  // Retrieve favorite movies from local storage (if any)
  const favoriteMovies =
    JSON.parse(localStorage.getItem("favoriteMovies")) || [];

  // Add the selected movie to favorites
  favoriteMovies.push(movie);

  
    // Remove my favorite movie in my add card
    const favCounter = document.getElementById("total-counter");
    if (favCounter.innerText != null) {
      favCounter.innerText = favoriteMovies.length;
    }
  

  // Update local storage with the modified favorite movies
  localStorage.setItem("favoriteMovies", JSON.stringify(favoriteMovies));

}
// Function to display favorite movies on the "favorites.html" page
function displayFavoriteMovies() {
  const favoriteMoviesContainer = document.querySelector("#results-container"); // This should match your HTML structure.

  // Retrieve favorite movies from local storage (if any)
  const favoriteMovies =
    JSON.parse(localStorage.getItem("favoriteMovies")) || [];

  // Clear the previous results.
  favoriteMoviesContainer.innerHTML = "";

  favoriteMovies.forEach((movie) => {
    if (movie && movie.Title) {
      const movieElement = document.createElement("div");
      movieElement.classList.add("my-Favorite-Movies");

      movieElement.innerHTML = `
        <h2>${movie.Title}</h2>
        <p>Year: ${movie.Year || "N/A"}</p>
        <p>Type: ${movie.Type || "N/A"}</p>
        <p>imdbRating :${movie.imdbRating}</p>
        <img src="${movie.Poster || ""}" alt="${movie.Title || "Unknown"} Poster">
        <button class="remove-button" data-imdbid="${movie.imdbID}">Remove from Favorites</button>
      `;
      favoriteMoviesContainer.appendChild(movieElement);
    }
  });

  // Event listener for the "Remove from Favorites" button
  favoriteMoviesContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("remove-button")) {
      const imdbID = event.target.getAttribute("data-imdbid");
      removeFromFavorites(imdbID);
      // Re-display the updated list of favorite movies
      displayFavoriteMovies();
    }
  });
}


// Initial call to display favorite movies
document.querySelector(".my-Favorite-Movies").addEventListener("click", () => {
  // Call the function to display favorite movies
  displayFavoriteMovies();
});



function removeFromFavorites(imdbID) {
  // Retrieve favorite movies from local storage
  const favoriteMovies =
    JSON.parse(localStorage.getItem("favoriteMovies")) || [];

  // Use the Array.findIndex method to find the index of the movie with the given imdbID
  const movieIndex = favoriteMovies.findIndex(
    (movie) => movie && movie.imdbID === imdbID
  );

  // Check if the movie with the given imdbID was found
  if (movieIndex !== -1) {
    // Remove the movie from the array
    favoriteMovies.splice(movieIndex, 1);

    // Remove my favorite movie in my add card
     const favCounter = document.getElementById("total-counter");
  if (favCounter.innerText != null) {
    favCounter.innerText = favoriteMovies.length;
  }

    // Update local storage with the modified favorite movies
    localStorage.setItem("favoriteMovies", JSON.stringify(favoriteMovies));
  }
}

