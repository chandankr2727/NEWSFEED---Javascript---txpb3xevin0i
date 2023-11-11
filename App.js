let savedNews = JSON.parse(localStorage.getItem("favoriteNews")) || [];;
let fetchedNews = [];
let loadSaved = true;
let newsCategory = "all";

// Function to fetch API 
async function fetchNewsData() {
    const apiUrl = 'https://content.newtonschool.co/v1/pr/64e3d1b73321338e9f18e1a1/inshortsnews';

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
        throw new Error('Network response was not ok');
        }
        const data = await response.json();
        fetchedNews = data;
        updateFavoriteNews(fetchedNews);
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}
fetchNewsData();

// add news from localstorage
function addNewsToLocalStorage(news){
    savedNews.push(news)
    localStorage.setItem("favoriteNews",JSON.stringify(savedNews))
}

// remove news from localstorage
function  removeNewsFromLocalStorage(news){
    const updatedlist = savedNews.filter((newsName)=>newsName.content!=news);
    savedNews = updatedlist;
    localStorage.setItem("favoriteNews",JSON.stringify(savedNews));
    if(loadSaved){
        displayNews(savedNews);
    }
}

// Function to update news intially
function updateFavoriteNews(fetchedNews) {
    fetchedNews = fetchedNews.map((news) => {
        const favoriteNewsItem = savedNews.find((favNews) => favNews.content === news.content);
        if (favoriteNewsItem) {
            news.isFavorite = "fa-solid";
        }else{
            news.isFavorite = "fa-regular";
        }
    });
}

// Function to display news cards
function displayNews(newsData) {
    const newsContainer = document.getElementById('newsContainer');
    newsContainer.style.display = "flex";
    document.getElementById('template').style.display = "none";
    newsContainer.innerHTML = '';

    newsData.map((news) => {
        const newsCard = document.createElement('div');
        newsCard.classList.add('news-card');
        newsCard.innerHTML = `<h3 class="author">By: ${news.author}</h3>
        <p class="content">${news.content}<span><a href="${news.url}">READ MORE</a></p>
        <div class="category">Category: ${news.category}</div>
        <i class="favorite-icon ${news.isFavorite} fa-heart" id="${news.content}" ></i>`

        const favoriteIconBtn = newsCard.querySelector('.favorite-icon');
           favoriteIconBtn.addEventListener('click',(event)=>{
            const {id} = event.target;
            if(news.isFavorite === "fa-solid"){
                news.isFavorite = "fa-regular";
                favoriteIconBtn.classList.remove("fa-solid")
                favoriteIconBtn.classList.add("fa-regular")
                removeNewsFromLocalStorage(id);
            }
            else {
                news.isFavorite = "fa-solid";
                favoriteIconBtn.classList.add("fa-solid")
                addNewsToLocalStorage(news);
            }
           });  

        newsContainer.appendChild(newsCard);
    });
}

// Function to filter news by category
function filterNewsByCategory(category) {
    function filterNews(category){
        if (category === 'all') {
            displayNews(fetchedNews);
        } else {
            const filteredNews = fetchedNews.filter(news => news.category === category);
            displayNews(filteredNews);
        }
    }
    
    const categoryButtons = document.querySelectorAll('.categorySelect');

    categoryButtons.forEach((categoryOption) => {
        categoryOption.addEventListener('click', () => {
            categoryButtons.forEach((btn) => btn.classList.remove("active-category"));
            categoryOption.classList.add("active-category");
            const selectedCategory = categoryOption.getAttribute('value');
            newsCategory = selectedCategory;
            filterNews(selectedCategory)
        });
    });
    filterNews(category);
}

// Event listeners for buttons
function eventListener (){
    document.getElementById('loadSavedNews').addEventListener('click', () => {
        document.getElementById('categoryFilter').style.display = "none";
        loadSaved = true;
        displayNews(savedNews);
    });
    
    document.getElementById('loadNewNews').addEventListener('click', () => {
        document.getElementById('categoryFilter').style.display = "block";
        loadSaved = false;
        filterNewsByCategory(newsCategory);
    });
}
eventListener();
