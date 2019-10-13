const apiKey = '1977b733';
const baseUrl = `https://www.omdbapi.com/?apiKey=${apiKey}`;
let timer;
let currentResult;
let currentTitle;
let clearSearchLine;
let pagesInMemory = {};

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
            document.querySelectorAll(".viewFilms").forEach(e => {
                e.remove();
            })
            document.getElementById("pages").innerHTML = "";
            pagesInMemory = {};
            requestFilms(searchAny);
        }, 1000);
    }
}

//Function for server request
function requestFilms(searchString, currentPage) {
  
    /*  this block of code removes spaces replacing them with a plus */
    let filmName = searchString.split(" ");
    filmName = searchString.toLowerCase().trim().replace(/\s+/g, "+");
    currentTitle = filmName;
    let pageParam = "";
    if (currentPage) {
        pageParam = `&page=${currentPage}`;
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
            processBodyResponse(json, currentPage);
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
function view(filmInfo, viewFilms) {
    let block = document.createElement("div");
    block.className = "anyFilm";
    block.id = filmInfo.imdbID;
    let blockDiv = document.createElement("div");
    blockDiv.className = "title";
    let spanTitle = document.createElement("span");
    spanTitle.innerHTML = filmInfo.Title;
    let spanYear = document.createElement("span");
    spanYear.className = "year";
    spanYear.innerHTML = filmInfo.Year;
    let newBlock = document.createElement("div");
    newBlock.className = "readMore";
    let spanText = document.createElement("span");
    spanText.innerHTML = "Feel free to click read more and learn more about this movie";
    let button = document.createElement("button");
    button.className = "read";
    button.innerHTML = "read more";
    button.dataset.filmId = filmInfo.imdbID;
    button.onclick = requestId;
    block.appendChild(blockDiv);
    block.appendChild(newBlock);
    blockDiv.appendChild(spanTitle);
    blockDiv.appendChild(spanYear);
    newBlock.appendChild(spanText);
    newBlock.appendChild(button);
    viewFilms.appendChild(block);
}

// Function for display search results
function displayTotalResults(length, results) {
    let stringResults = length + " of " + results + " are shown";
    document.getElementById("total_results").innerHTML = stringResults;
    return stringResults;
}
//Function for view all information about film after click on button "read more"
function viewInfoAboutFilm(filmInfo) {
    document.getElementById("main").classList.add("hidden");


    document.getElementById("film").classList.remove("hidden");
    document.getElementById("type").innerHTML = "/ " + filmInfo.Type;
    document.querySelector(".image").setAttribute('src', filmInfo.Poster);
    document.querySelector(".rate").innerHTML = filmInfo.imdbRating;
    document.querySelector(".name").innerHTML = filmInfo.Title;
    document.querySelector(".year_film").innerHTML = filmInfo.Year;
    document.querySelector(".genre").innerHTML = filmInfo.Genre;
    let actors = document.querySelector(".actors");
    actors.querySelectorAll(".actor").forEach(e => {
        e.remove();
    })
    let mainActors = filmInfo.Actors.split(",");
    mainActors.forEach(actor => {
        const spanElement = document.createElement("span");
        spanElement.className = "actor";
        spanElement.innerHTML = actor.trim();
        actors.appendChild(spanElement);
    });
    document.querySelector(".short_description").innerHTML = filmInfo.Plot;
}
//Function for request to server by ID  
function requestId() {
    let id = this.dataset.filmId;
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
        a.dataset.page = 1;
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

    if (pagebeg > Math.floor(otherpages / 2)) {
        pagebeg = Math.floor(otherpages / 2);
    }

    let pageend = pages - page - 1;
    if (pageend > Math.floor(otherpages / 2)) {
        pageend = Math.floor(otherpages / 2);
    }

    if (pagebeg > pageend) {
        pagebeg += otherpages - pagebeg - pageend;
    } else {
        pageend += otherpages - pagebeg - pageend;
    }

    pagebeg = page - pagebeg;
    if (pagebeg < 2) {
        pagebeg = 2;
    }

    pageend = page + pageend;
    if (pageend >= pages) {
        pageend = pages - 1;
    }

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
        a.dataset.page = i;
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
        a.dataset.page = i;
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
        a.dataset.page = pages;
        let li = document.createElement("li");
        li.appendChild(a);
        block.appendChild(li);
    }
    // echo "<a href=\"".$end."\">".$pages."</a>";
}
//function for switch pages
function newPageMovie() {
    let page = parseInt(this.dataset.page);
    if (page == 1 || !page){
        page = "";
    }
    document.querySelectorAll(".viewFilms").forEach(e => {
        e.classList.add("hidden");
    })
    document.getElementById("pages").querySelectorAll("ul").forEach(e => {
        e.classList.add("hidden");
    })
    if(!pagesInMemory[page || 1]){
        requestFilms(currentTitle, page);
        return;
    }
    document.getElementById("total_results").innerHTML = pagesInMemory[page || 1];
    document.getElementById(`viewFilms${page || 1}`).classList.remove("hidden");
    document.getElementById(`pagination${page || 1}`).classList.remove("hidden");
}

function goToPreviousPage() {
    backPage();
}

function backPage() {
    document.getElementById("film").classList.add("hidden");
    document.getElementById("main").classList.remove("hidden");
}

function processBodyResponse(json, page) {
    console.log(json);
    if (json.Response == "False") {
        return;
    }
    currentResult = json;
    if ("Search" in json) {
        pagesInMemory[page || 1] = displayTotalResults(json.Search.length, json.totalResults);
        let viewFilms = document.createElement("div");
        viewFilms.className = "viewFilms";
        viewFilms.id = `viewFilms${page || 1}`;
        document.getElementById("forFilms").appendChild(viewFilms);
        let tempPages = document.getElementById("pages");
        let ul = document.createElement("ul");
        ul.id = `pagination${page || 1}`;
        tempPages.appendChild(ul);
        createPagination(page || 1, ul, Math.ceil(json.totalResults / 10));
        for (let i = 0; i < json.Search.length; i++) {
            console.log(json.Search[i]);
            view(json.Search[i], viewFilms);
        }
    } else {
        pagesInMemory[page || 1] = displayTotalResults(1, 1);
        let viewFilms = document.createElement("div");
        viewFilms.className = "viewFilms";
        viewFilms.id = "viewFilms";
        document.body.appendChild(viewFilms);
        let tempPages = document.createElement("div");
        tempPages.className = "pagination";
        tempPages.id = "pages";
        document.body.appendChild(tempPages);
        let ul = document.createElement("ul");
        tempPages.appendChild(ul);
        createPagination(page || 1, ul, 1);
        view(json, viewFilms);
    }
    page = "";
}