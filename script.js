const apiKey = '1977b733';
const baseUrl = `https://www.omdbapi.com/?apiKey=${apiKey}`;
let timer;
let page;
let currentResult;
let currentTitle;
let clearSearchLine;
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('searchFilm').addEventListener("input", searchMovie);
    clearSearchLine = document.getElementById("clear");
})
// The main function for search films
function searchMovie(event) {
    const searchAny = event.target.value;
    if (timer) {
        clearTimeout(timer);
    }
    if (searchAny.length > 1) {
        showButton();
    }
    if (searchAny.length < 1) {
        hideButton();
    }
    if (searchAny.length) {
        timer = setTimeout(function () {
            if (document.getElementById("viewFilms")) {
                document.getElementById("viewFilms").remove();
            }
            doSomething(searchAny);
        }, 1000);
    }
}

//Function for server request
function doSomething(searchString) {
       /*  this block of code removes spaces replacing them with a plus */
    let filmName = searchString.split(" ");
    filmName = searchString.toLowerCase().trim().replace(/\s+/g, "+");
    console.log(filmName);
    currentTitle = filmName;
    let pageParam = "";
    if (page) {
        pageParam = `&page=${page}`;
    }
    let url = `https://www.omdbapi.com/?apiKey=${apiKey}&s=${filmName}&${pageParam}`;
    if (filmName.length < 3) {
        url = `https://www.omdbapi.com/?apiKey=${apiKey}&t=${filmName}${pageParam}`;
    }
    console.log(url);
    /* Server request and display films  */
    fetch(url)
        .then(request => request.json())
        .then(json => {
            responseBodyProcessing(json);
        })
}
// Function to show Button
function showButton() {
    clearSearchLine.classList.remove("hidden");
}
// Function to hide button
function hideButton() {
    clearSearchLine.classList.add("hidden");
}
// Function to clean input and hide button
function clearSeach() {
    document.getElementById('searchFilm').value = "";
    hideButton();
}
// Function for view films
function view(obj) {
    let block = document.createElement("div");
    block.className = "anyFilm";
    block.id = obj.imdbID;
    let blockDiv = document.createElement("div");
    blockDiv.className = "title";
    let spanTitle = document.createElement("span");
    spanTitle.innerHTML = obj.Title;
    let spanYear = document.createElement("span");
    spanYear.className = "year";
    spanYear.innerHTML = obj.Year;
    let newBlock = document.createElement("div");
    newBlock.className = "readMore";
    let spanText = document.createElement("span");
    spanText.innerHTML = "Feel free to click read more and learn more about this movie";
    let button = document.createElement("button");
    button.className = "read";
    button.innerHTML = "read more";
    button.onclick = requestId;
    block.appendChild(blockDiv);
    block.appendChild(newBlock);
    blockDiv.appendChild(spanTitle);
    blockDiv.appendChild(spanYear);
    newBlock.appendChild(spanText);
    newBlock.appendChild(button);
    document.getElementById("viewFilms").appendChild(block);
}

// Function for display search results
function totalResults(length, results) {
    let div = document.createElement("div");
    div.className = "total_results";
    div.id = "total_results";
    let span = document.createElement("span");
    span.innerHTML = length + " of " + results + " are shown";
    div.appendChild(span);
    document.body.appendChild(div);
}
//Function for view all information about film after click on button "read more"
function viewInfoAboutFilm(obj) {
    while (document.body.firstChild) {
        document.body.firstChild.remove();
    }
    let header = document.createElement("div");
    header.className = "header";
    document.body.appendChild(header);
    let home = document.createElement("a");
    home.innerHTML = "Home";
    home.onclick = backToMovieList;
    header.appendChild(home);
    let category = document.createElement("span");
    category.innerHTML = ` / ${obj.Type}`;
    header.appendChild(category);
    let film = document.createElement("div");
    film.className = "film";
    let poster = document.createElement("div");
    poster.className = "poster";
    let image = document.createElement("img");
    image.className = "image";
    image.setAttribute('src', obj.Poster);
    let aboutFilm = document.createElement("div");
    aboutFilm.className = "about_film";
    let rate = document.createElement("span");
    rate.className = "rate";
    rate.innerHTML = obj.imdbRating;
    let name = document.createElement("span");
    name.className = "name";
    name.innerHTML = obj.Title;
    let yearFilm = document.createElement("span");
    yearFilm.className = "year_film";
    yearFilm.innerHTML = obj.Year;
    let genre = document.createElement("span");
    genre.className = "genre";
    genre.innerHTML = obj.Genre;
    let actors = document.createElement("div");
    actors.className = "actors";
    let mainActors = obj.Actors.split(",");
    for (i = 0; i < mainActors.length; i++) {
        let actor = document.createElement("span");
        actor.className = "actor";
        actor.innerHTML = mainActors[i].trim();
        actors.appendChild(actor);
    }
    let shortDescription = document.createElement("span");
    shortDescription.className = "short_description";
    shortDescription.innerHTML = obj.Plot;
    aboutFilm.appendChild(rate);
    aboutFilm.appendChild(name);
    aboutFilm.appendChild(yearFilm);
    aboutFilm.appendChild(genre);
    aboutFilm.appendChild(actors);
    aboutFilm.appendChild(shortDescription);
    poster.appendChild(image);
    film.appendChild(poster);
    film.appendChild(aboutFilm);
    document.body.appendChild(film);
}
//Function for request to server by ID
function requestId() {
    let id = this.parentNode.parentNode.id;
    let url = `https://www.omdbapi.com/?apiKey=${apiKey}&i=${id}`;
    fetch(url)
        .then(request => request.json())
        .then(viewInfoAboutFilm)
}
function createPagination(page, block, pages) {
    let otherpages = 4; //количество доступных страниц, за исключением первой и последней страницы
    // let end, begin;		
    if ((page) != 1) {
        let a = document.createElement("a");
        a.innerHTML = "1";
        a.onclick = newPageMovie;
        let li = document.createElement("li");
        li.appendChild(a);
        block.appendChild(li);
        // echo "<a href=\"".$begin."\">1</a>";
    } else {
        let b = document.createElement("b");
        b.innerHTML = "1";
        let li = document.createElement("li");
        li.appendChild(b);
        block.appendChild(li);
        // echo "<b>1</b>";
    }
    let pagebeg = page - 2;

    if (pagebeg > Math.floor(otherpages / 2))
        pagebeg = Math.floor(otherpages / 2);

    let pageend = pages - page - 1;
    if (pageend > Math.floor(otherpages / 2))
        pageend = Math.floor(otherpages / 2);

    if (pagebeg > pageend) {
        pagebeg += otherpages - pagebeg - pageend;
    } else {
        pageend += otherpages - pagebeg - pageend;
    }

    pagebeg = page - pagebeg;
    if (pagebeg < 2)
        pagebeg = 2;

    pageend = page + pageend;
    if (pageend >= pages)
        pageend = pages - 1;

    if (pagebeg > 2) {
        let span = document.createElement("span");
        span.innerHTML = "...";
        let li = document.createElement("li");
        li.appendChild(span);
        block.appendChild(li);
    }
    // echo "<span class='dots'>...</span>";

    for (let i = pagebeg; i < page; i++) {
        // console.log(i);
        let a = document.createElement("a");
        // console.log(a);
        a.innerHTML = i;
        a.onclick = newPageMovie;
        let li = document.createElement("li");
        li.appendChild(a);
        block.appendChild(li);
        // echo "<a href=\"".$begin."".htmlspecialchars($str)."page=".$i."\">".$i."</a>";
    }
    if (page && page != 1) {
        let b = document.createElement("b");
        b.innerHTML = page;
        let li = document.createElement("li");
        li.appendChild(b);
        block.appendChild(li);
    }
    // echo "<b>".$page."</b>";

    for (let i = page + 1; i <= pageend; i++) {
        let a = document.createElement("a");
        a.innerHTML = i;
        a.onclick = newPageMovie;
        let li = document.createElement("li");
        li.appendChild(a);
        block.appendChild(li);
        // echo "<a href=\"".$begin."".htmlspecialchars($str)."page=".$i."\">".$i."</a>";
    }

    if (pageend < pages - 1) {
        let span = document.createElement("span");
        span.innerHTML = "...";
        let li = document.createElement("li");
        li.appendChild(span);
        block.appendChild(li);
    }
    // echo "<span class='dots'>...</span>";
    if (page != pages) {
        let a = document.createElement("a");
        a.innerHTML = pages;
        a.onclick = newPageMovie;
        let li = document.createElement("li");
        li.appendChild(a);
        block.appendChild(li);
    }
    // echo "<a href=\"".$end."\">".$pages."</a>";
}
//function for switch pages
function newPageMovie() {
    page = parseInt(this.innerHTML);
    if (page == 1 || !page)
        page = "";
    searchMovie();
}
function backToMovieList() {
    backPage();
    showButton();
    responseBodyProcessing(currentResult);
}
//Function for create input
function backPage() {
    while (document.body.firstChild) document.body.firstChild.remove();
    let div = document.createElement("div");
    div.className = "search";
    let input = document.createElement("input");
    input.value = currentTitle;
    input.className = "searchFilm";
    input.type = "text";
    input.id = "searchFilm";
    input.placeholder = "Enter movie title";
    let button = document.createElement("button");
    button.className = "clear";
    button.onclick = clearSeach;
    document.body.appendChild(div);
    div.appendChild(input);
    div.appendChild(button);
}

function responseBodyProcessing(json){
    console.log(json);
    if (document.getElementById("total_results")) {
        document.getElementById("total_results").remove();
    }
    if (json.Response != "False") {
        let vrem = document.getElementById("pages");
        if (vrem) {
            vrem.remove();
        }
        currentResult = json;
        if ("Search" in json) {
            totalResults(json.Search.length, json.totalResults);
            let viewFilms = document.createElement("div");
            viewFilms.className = "viewFilms";
            viewFilms.id = "viewFilms";
            document.body.appendChild(viewFilms);
            let vrem = document.createElement("div");
            vrem.className = "pagination";
            vrem.id = "pages";
            document.body.appendChild(vrem);
            let ul = document.createElement("ul");
            vrem.appendChild(ul);
            createPagination(page || 1, ul, Math.ceil(json.totalResults / 10));
            for (let i = 0; i < json.Search.length; i++) {
                console.log(json.Search[i]);
                view(json.Search[i]);
            }
        } else {
            totalResults(1, 1);
            let viewFilms = document.createElement("div");
            viewFilms.className = "viewFilms";
            viewFilms.id = "viewFilms";
            document.body.appendChild(viewFilms);
            let vrem = document.createElement("div");
            vrem.className = "pagination";
            vrem.id = "pages";
            document.body.appendChild(vrem);
            let ul = document.createElement("ul");
            vrem.appendChild(ul);
            createPagination(page || 1, ul, 1);
            view(json);
        }
    }
    page = "";
}