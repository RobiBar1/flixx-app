//all the information of the api is from https://www.themoviedb.org/documentation/api
const global = 
{
    //currentPage: window.location.pathname.split('flixx-app/')[1]
    currentPage: window.location.pathname,
    search:
    {
        term: '',
        type: '',
        page: 1,
        totalPages: 1,
        totalresults: 0
    },
    api:
    {
        /*
        in real life that was on diffrent file on 
        my server that users wont be able to see. 
        */
        key: '3fd2be6f0c70a2a598f084ddfb75487c',
        url: 'https://api.themoviedb.org/3/'
    }
};

//------------------------display main pages functions------------------------
async function displayPopularMovies()
{
    const result = await fetchAPIData('movie/popular');
    //const {results} = await fetchAPIData('movie/popular');// this will give me immdedly result.results in results varible

    result.results.forEach((movie) =>
    {
        const movieDiv = document.createElement('div');
        movieDiv.classList.add('card');
        movieDiv.innerHTML = `<a href="movie-details.html?id=${movie.id}">
        ${movie.poster_path ? `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}"class="card-img-top"alt="${movie.title}"/>`
        : `<img src="../images/no-image.jpg" class="card-img-top"alt="${movie.title}"/>`}</a>
          <div class="card-body"><h5 class="card-title">${movie.title}</h5>
          <p class="card-text"><small class="text-muted">Release: ${movie.release_date}
          </small></p></div>`;

        document.querySelector('#popular-movies').appendChild(movieDiv);
    });
}
async function displayPopularShows()
{
    const result = await fetchAPIData('tv/popular');
    //const {results} = await fetchAPIData('tv/popular');// this will give me immdedly result.results in results varible
    result.results.forEach((show) =>
    {
        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML = `<a href="tv-details.html?id=${show.id}">
        ${show.poster_path ? `<img src="https://image.tmdb.org/t/p/w500${show.poster_path}"class="card-img-top"alt="${show.name}"/>`
        : `<img src="../images/no-image.jpg" class="card-img-top"alt="${show.name}"/>`}</a>
        <p class="card-text"><small class="text-muted">Air date: ${show.first_air_date}
        <div class="card-body"><h5 class="card-title">${show.name}</h5>
          </small></p></div>`;

        document.querySelector('#popular-shows').appendChild(div);
    });
}
function displaySerchResults(results)
{
    document.querySelector('#search-results').innerHTML = '';
    document.querySelector('#search-results-heading').innerHTML = '';
    document.querySelector('#pagination').innerHTML = '';
    results.forEach((result) =>
        {
            const movieDiv = document.createElement('div');
            movieDiv.classList.add('card');
            movieDiv.innerHTML = `<a href="${global.search.type}-details.html?id=${result.id}">
            ${result.poster_path ? `<img src="https://image.tmdb.org/t/p/w500${result.poster_path}"class="card-img-top"
            alt="${global.search.type === 'movie' ? result.title : result.name}"/>`
            : `<img src="../images/no-image.jpg" class="card-img-top"
            alt="${global.search.type === 'movie' ? result.title : result.name}"/>`}</a>
              <div class="card-body">
              <h5 class="card-title">${global.search.type === 'movie' ? result.title : result.name}</h5>
              <p class="card-text"><small class="text-muted">Release: ${global.search.type === 'movie' ? result.release_date : result.first_air_date}
              </small></p></div>`;

            document.querySelector('#search-results-heading').innerHTML = 
            `<h2>${results.length + (global.search.page - 1) * results.length} of ${global.search.totalresults} Results for ${global.search.term}</h2>`;
            document.querySelector('#search-results').appendChild(movieDiv);
        });

        displayPagination();
}
//------------------------display details pages functions------------------------:
async function displayMovieDetails()
{
    // const urlParams = new URLSearchParams(window.location.search);
    // const movieID = urlParams.get('id');
    // const movie = await fetchAPIData(`movie/${movieID}`);
    //^^^**************************this is do the same as the code below**************************

    const movieID = window.location.search.split('=')[1];
    // console.log(window.location.search);//give what after the ? in the url
    // console.log(window.location.search.split('='));//split the string by = and give me array
    // console.log(window.location.search.split('=')[1]);//give me the id
    const movie = await fetchAPIData(`movie/${movieID}`);

    displayBackGroundImage('movie', movie.backdrop_path);

    const movieDiv = document.createElement('div');
    //movieDiv.classList.add('card');
    movieDiv.innerHTML = `
    <div class="details-top">
          <div>
            ${movie.poster_path ? `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}"class="card-img-top"alt="${movie.title}"/>`
            : `<img src="../images/no-image.jpg" class="card-img-top"alt="${movie.title}"/>`}
          </div>
          <div>
            <h2>${movie.title}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
                ${movie.vote_average.toFixed(1)}/ 10
            </p>
            <p class="text-muted">Release Date: ${movie.release_date}</p>
            <p>${movie.overview}</p>
            <h5>Genres</h5>
            <ul class="list-group">
            ${movie.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
            </ul>
            <a href="${movie.homepage}" target="_blank" class="btn">Visit Movie Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Movie Info</h2>
          <ul>
            <li><span class="text-secondary">Budget:</span> $${addCommasToNumber(movie.budget)}</li>
            <li><span class="text-secondary">Revenue:</span> $${addCommasToNumber(movie.revenue)}</li>
            <li><span class="text-secondary">Runtime:</span> ${movie.runtime} minutes</li>
            <li><span class="text-secondary">Status:</span> ${movie.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">
          ${movie.production_companies.map((company) => `<span>${company.name}</span>`).join(', ')}.
          </div>
        </div>
    `;
    document.querySelector('#movie-details').appendChild(movieDiv);
}
async function displayShowDetails()
{
    // const urlParams = new URLSearchParams(window.location.search);
    // const movieID = urlParams.get('id');
    // const movie = await fetchAPIData(`movie/${movieID}`);
    //^^^**************************this is do the same as the code below**************************

    const showId = window.location.search.split('=')[1];
    // console.log(window.location.search);//give what after the ? in the url
    // console.log(window.location.search.split('='));//split the string by = and give me array
    // console.log(window.location.search.split('=')[1]);//give me the id
    const show = await fetchAPIData(`tv/${showId}`);

    displayBackGroundImage('tv', show.backdrop_path);

    const showDiv = document.createElement('div');
    showDiv.innerHTML = `
    <div class="details-top">
    <div>
    ${show.poster_path ? `<img src="https://image.tmdb.org/t/p/w500${show.poster_path}"class="card-img-top"alt="${show.name}"/>`
    : `<img src="../images/no-image.jpg" class="card-img-top"alt="${show.name}"/>`}
    </div>
    <div>
    <h2>${show.name}</h2>
    <p>
        <i class="fas fa-star text-primary"></i>
        ${show.vote_average.toFixed(1)}/ 10
    </p>
    <p class="text-muted">Last Air Date: ${show.last_air_date}</p>
    <p>${show.overview}</p>
    <h5>Genres</h5>
    <ul class="list-group">
    ${show.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
    </ul>
    <a href="${show.homepage}" target="_blank" class="btn">Visit Movie Homepage</a>
    </div>
    </div>
    <div class="details-bottom">
    <h2>Seriuos Info</h2>
    <ul>
    <li><span class="text-secondary">Number of Episodes:</span> ${show.number_of_episodes}</li>
    <li><span class="text-secondary">Last Episode To Air:</span> ${show.last_episode_to_air.name}</li>
    <li><span class="text-secondary">Status:</span> ${show.status}</li>
    </ul>
    <h4>Production Companies</h4>
    <div class="list-group">
    ${show.production_companies.map((company) => `<span>${company.name}</span>`).join(', ')}.
    </div>
    </div>
    `;
    document.querySelector('#show-details').appendChild(showDiv);
}
function displayPagination()
{
    const paginationDiv = document.createElement('div');
    paginationDiv.classList.add('pagination');
    paginationDiv.innerHTML = `<button class="btn btn-primary" id="prev"${global.search.page === 1 ? 'disabled' : ''}> Prev</button>
    <button class="btn btn-primary" id="next"${global.search.page === global.search.totalPages ? 'disabled' : ''}>Next</button>
    <div class='page-counter'>Page ${global.search.page} of ${global.search.totalPages}</div>`;

    document.querySelector('#pagination').appendChild(paginationDiv);

    //next and prev buttons:
    document.querySelector("#next").addEventListener('click', async () =>
    {
        global.search.page++;
        const {results, total_pages} = await fetchSerchAPIData();
        displaySerchResults(results);
    });
    document.querySelector("#prev").addEventListener('click', async () =>
        {
            global.search.page--;
            const {results, total_pages} = await fetchSerchAPIData();
            displaySerchResults(results);
        });
}
//------------------------display genral things functions----------------------
function displayError(message, className = 'error')
{
    const alertEl = document.createElement('div');
    alertEl.classList.add('alert', className);
    alertEl.appendChild(document.createTextNode(message));
    document.querySelector('#alert').appendChild(alertEl);

    setTimeout(() => alertEl.remove(), 3000);
}
function displayBackGroundImage(type, path)
{
    const overlayDiv = document.createElement('div');
    overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${path})`;
    overlayDiv.style.backgroundSize = 'cover';
    overlayDiv.style.backgroundPosition = 'center';
    overlayDiv.style.backgroundRepeat = 'no-repeat';
    overlayDiv.style.height = '100vh';
    overlayDiv.style.width = '100vw';
    overlayDiv.style.position = 'fixed';
    overlayDiv.style.top = '0';
    overlayDiv.style.left = '0';
    overlayDiv.style.zIndex = '-1';
    overlayDiv.style.opacity = '0.2';

    if(type === 'movie')
    {
        document.querySelector('#movie-details').appendChild(overlayDiv);
    }
    else
    {
        document.querySelector('#show-details').appendChild(overlayDiv);
    }

}
async function displaySlider()
{
    const {results} = await fetchAPIData('movie/now_playing');

    results.forEach((movie) =>
    {
        const div = document.createElement('div');
        div.classList.add('swiper-slide');
        div.innerHTML = `
        <a href="movie-details.html?id=${movie.id}">
        <img src="https://image.tmdb.org/t/p/w300${movie.poster_path}"
         alt="${movie.title}"/>
        </a>
        <h4 class="swiper-rating">
        <i class="fas fa-star text-secondary"></i>
        ${movie.vote_average} / 10
        </h4>
        `

        document.querySelector('.swiper-wrapper').appendChild(div);
        initSwiper();
    });
}
//spinner functions:
function showSpinner()
{
    document.querySelector('.spinner').classList.add('show');
}
function hideSpinner()
{
    document.querySelector('.spinner').classList.remove('show');
}
//Highlight active link
function highlightActiveLink()
{
    const links = document.querySelectorAll('.nav-link');
    links.forEach((link) => 
    {
        //if(link.getAttribute('href').split('flixx-app/')[1] === global.currentPage)
        if(link.getAttribute('href') === global.currentPage)
        {
            link.classList.add('active');
        }
    })
}
//------------------------general functions------------------------
function addCommasToNumber(number)
{
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
async function search()
{
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    global.search.type = urlParams.get('type');
    global.search.term = urlParams.get('search-term');
    if(global.search.term !== '' && global.search.term !== null)
    {
        const {results, total_pages, page, total_results} = await fetchSerchAPIData();
        global.search.totalPages = total_pages;
        global.search.page = page;
        global.search.totalresults = total_results;
        if(results.length === 0)
        {
            displayError('No results found');
            return;
        }

        displaySerchResults(results);
        document.querySelector('#search-term').value = '';
    }
    else
    {
        const timeToShowError = 550;
        const timeToHideSpinner = timeToShowError - 50;

        showSpinner();
        setTimeout(() => hideSpinner(), timeToHideSpinner);
        setTimeout(() => displayError('Please enter a search term', 'error'), timeToShowError);
    }

}
//------------------------fetch data functions----------------------------
async function fetchAPIData(endpoint)
{
    const APIKey = global.api.key;//its free and not main
    //so im ok with showing this, in real life that was on diffrent file on my server
    //that users wont be able to see. 
    const API_URL = global.api.url;

    showSpinner();
    const response = await fetch(`${API_URL}${endpoint}?api_key=${APIKey}&language=en-US`);
    const data = await response.json();
    hideSpinner();
    return data;
}
async function fetchSerchAPIData()
{
    showSpinner();
    const url = `${global.api.url}search/${global.search.type}?query=${global.search.term}&page=${global.search.page}`;   
    const headers = new Headers(
    {
    'Authorization': `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1NmM2MjA3NTUwNjBkZDI2ZTcwZDJmNzdlYmJmNGE4ZCIsIm5iZiI6MTczNDAwOTY1OC45NTYsInN1YiI6IjY3NWFlMzNhMmQ1YjAyODFiYmNiMDFlMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.53iDQ9maG05YG--MYN_c37x5Qmsli58Qo71ikDgf6pE`
    });
    // const response = await fetch(
    // `${global.api.url}search/${global.search.type}?api_key=${global.api.key}&language=en-US`);
    const response = await fetch(url, { headers });
    const data = await response.json();
    // const response = await fetch(url, { headers });
    // const data = await response.json();
    hideSpinner();
    return data;
}
//init App
async function init()
{
    switch(global.currentPage)
    {
        case('/index.html'):
        case('/'):
            displaySlider();
            displayPopularMovies();
            break;
        case('/shows.html'):
            displayPopularShows();
            break;
        case('/movie-details.html'):
            displayMovieDetails();
            break;
        case('/tv-details.html'):
            displayShowDetails();
            break;
        case('/search.html'):
            search();
            break;
    }   

    highlightActiveLink();
}
function initSwiper()
{
    const swiper = new Swiper('.swiper', 
    {
        slidesPerView: 1,
        spaceBetween: 30,
        freemode: true,
        loop: true,
        autoplay: 
        {
            delay: 3000,
            disableOnInteraction: false,
        },
        breakpoints:
        {
            500:
            {
                slidesPerView: 2,
            },
            700:
            {
                slidesPerView: 3,
            },
            1200:
            {
                slidesPerView: 4,
            },
        }
    });
}

//main:
document.addEventListener("DOMContentLoaded", init);