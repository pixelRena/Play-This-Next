const modalElement = document.querySelector(".modal-section");
const openModalButton = document.querySelector(".add-game-button");
const openModalButtonMobile = document.querySelector(".add-game-button-mobile");
const closeModalButton = document.querySelector(".close-modal-button");
const cardHeaderElement = document.querySelector(".card-header");
const cardElement = document.querySelector(".card-body");
const cardFooterElement = document.querySelector(".card-footer");
const changeSideButton = document.querySelector(".main-button");
const searchFieldElement = document.querySelector(".search-field");
const searchButton = document.querySelector(".search-btn");
const refreshButton = document.querySelector(".refresh-button");
const submitGameButton = document.querySelector(".submit-game-button");
const gameBoxField = document.querySelector('.game-box');
let currentSide = 1;
var gameCount; 
var gamesList;
var ownedGamesJson;
var suggestedGamesJson;
var gamesJson;
var suggestedGames = [];

// Refreshes games list
const updateGamesList = async () => {
    try {
        // Get steam games owned
        let res  = await axios.get('/steam-games');

        gameCount = res.data.game_count;
        gamesList = res.data.games;
        createDocument();
    } catch(error) { console.log(error) }

    const createDocument = async () => {
        try {
            let res = await axios.post('/seed-steam-games', {
                gamesList
            });
            ownedGamesJson = res.data;
        } catch(error) { console.log(error) }
    };
};

const fetchGamesList = async () => {
    try {
        let res = await axios.get('/steam-games-collection');
        ownedGamesJson = res.data;

        let suggestedRes = await axios.get('/suggested-games-collection');
        suggestedGamesJson = suggestedRes.data;
    }  catch(error) { console.log(error) }
};

const refreshHandler = () => {
    cardElement.contentWindow.location.reload(true);
};

// Flips from owned to suggested games
const changeSlide = () => {
    if (currentSide === 1) {
        cardElement.innerHTML = '';
        cardHeaderElement.innerHTML = "Suggested Games:";
        changeSideButton.innerHTML = "View Owned Games";
        cardFooterElement.innerHTML = "Games Completed: -";
        suggestedGamesJson.map(({image, username, name}) => {
            cardElement.innerHTML += `
                    <div class="card-item">
                        <!-- Column -->
                        <div class="card-image-holder" height="100" style="margin-right: 15px;">
                            <img src=${image} alt="game-cover" width="100%" height="100%">
                        </div>
                        <!-- Column -->
                        <div>
                            <div class="card-game-title">${name}</div>
                            <div class="card-extra-information">Posted by: ${username}</div>
                        </div>
                    </div>
            `;
        });
    } else {
        cardHeaderElement.innerHTML = "Owned Games:";
        changeSideButton.innerHTML = "View Suggested Games";
        cardFooterElement.innerHTML = "Games Owned (Steam): "+ownedGamesJson.length;
        cardElement.innerHTML = '';
        ownedGamesJson.map(({name, image}) => {
            cardElement.innerHTML += `
                    <div class="card-item">
                        <!-- Column -->
                        <div class="card-image-holder">
                            <img src=${image} alt="game-cover" height="100%" width="50">
                        </div>
                        <!-- Column -->
                        <div>
                            <div class="card-game-title">${name}</div>
                        </div>
                    </div>
            `;
        });
    }
}

// const dat = [
//   {
//     "name": "mario",
//     "released": "2018-07-17",
//     "image": "https://media.rawg.io/media/screenshots/1d7/1d75b9d60cb5884a0b19d21df8557c0c.jpg"
//   },
//   {
//     "name": "Mario Bros.",
//     "released": "2006-11-19",
//     "image": "https://media.rawg.io/media/screenshots/f22/f22857f426275f7a09d865a2ad2376b9.jpg"
//   },
//   {
//     "name": "Mario Bros. (1983)",
//     "released": "1983-01-01",
//     "image": "https://media.rawg.io/media/games/8ef/8efa90f72b466c632d7f95dd02be5e50.jpg"
//   },
//   {
//     "name": "Mario Tennis (2000)",
//     "released": "2000-07-21",
//     "image": "https://media.rawg.io/media/screenshots/8b0/8b0d7dc61e9516e5678d18f9095f5b4e.jpg"
//   },
//   {
//     "name": "Mario Golf (1999)",
//     "released": "1999-06-11",
//     "image": "https://media.rawg.io/media/screenshots/aba/aba305582ea5fdd51451788ee43077f0.jpg"
//   },
//   {
//     "name": "Mario Strikers Charged",
//     "released": "2007-05-25",
//     "image": "https://media.rawg.io/media/screenshots/bb9/bb9a34f9b3e192e89b5bf8dffd7f2367.jpg"
//   },
//   {
//     "name": "Mario Power Tennis",
//     "released": "2004-10-28",
//     "image": "https://media.rawg.io/media/screenshots/5a2/5a2a41c745ae3120ce01399094b5b5d4.jpg"
//   },
//   {
//     "name": "Mario Kart 64 (1996)",
//     "released": "1996-12-14",
//     "image": "https://media.rawg.io/media/screenshots/b19/b196fdca25e4df755f6fafd02df158d9.jpg"
//   },
//   {
//     "name": "Mario vs. Donkey Kong",
//     "released": "2004-05-24",
//     "image": "https://media.rawg.io/media/screenshots/e2f/e2fea0a0b7d38d85133980dc2a1b0202.jpg"
//   },
//   {
//     "name": "Mario Kart: Double Dash",
//     "released": "2003-11-07",
//     "image": "https://media.rawg.io/media/games/379/379d8862e9dfccb12bfba3a131d99dd8.png"
//   },
//   {
//     "name": "Mario Strikers: Battle League",
//     "released": "2022-06-10",
//     "image": "https://media.rawg.io/media/games/7bc/7bc6f95486e6ec39b959dc37a9e8093b.jpg"
//   },
//   {
//     "name": "Mario Kart: Super Circuit (2001)",
//     "released": "2001-07-21",
//     "image": "https://media.rawg.io/media/screenshots/4c7/4c7346d0d4a07dcad8eb14f683f72cbc.jpg"
//   },
//   {
//     "name": "Mario + Rabbids Sparks of Hope",
//     "released": "2022-10-20",
//     "image": "https://media.rawg.io/media/games/1fa/1faa976b3f7a43195fa708d9a80e7468.jpg"
//   },
//   {
//     "name": "Mario Golf: Super Rush",
//     "released": "2021-06-25",
//     "image": "https://media.rawg.io/media/screenshots/78e/78e89d605b0f4edd14bb53463f476d09.jpg"
//   },
//   {
//     "name": "Mario & Luigi: Dream Team",
//     "released": "2013-07-12",
//     "image": "https://media.rawg.io/media/screenshots/aab/aab0f8e6eacd762fbd7dc18c9de65765.jpg"
//   },
//   {
//     "name": "Mario + Rabbids Kingdom Battle",
//     "released": "2017-08-29",
//     "image": "https://media.rawg.io/media/games/5be/5befaab8379bd48b8e9b97cc60b0f5e6.jpg"
//   },
//   {
//     "name": "Mario & Luigi: Superstar Saga",
//     "released": "2003-11-17",
//     "image": "https://media.rawg.io/media/screenshots/fcb/fcbd1de32544459a548474a3017750ad.jpg"
//   },
//   {
//     "name": "Mario & Luigi: Paper Jam",
//     "released": "2016-01-22",
//     "image": "https://media.rawg.io/media/screenshots/888/88864011d2b6703dff10901dd01b67b7.jpg"
//   },
//   {
//     "name": "Mario & Luigi: Superstar Saga (2003)",
//     "released": "2003-11-17",
//     "image": "https://media.rawg.io/media/screenshots/256/256f442cc6b66ce68b63941f66ba6b8f.jpg"
//   },
//   {
//     "name": "Mario & Luigi: Partners in Time",
//     "released": "2005-11-28",
//     "image": "https://media.rawg.io/media/screenshots/572/572483eed674fcda46e3d0cb2fe07719.jpg"
//   }
// ]

const changeHandler = (name, image, i) => {
    let quantityButton = document.querySelectorAll(".card-add-btn")[i];
    if (quantityButton.style.backgroundColor !== "white") {
        suggestedGames.push({"name": name, "image": image});
        quantityButton.style.backgroundColor = "white";
        quantityButton.style.color = "black";
        quantityButton.innerHTML = "Remove";
    } else {
        quantityButton.style.backgroundColor = "";
        quantityButton.style.color = "";
        quantityButton.innerHTML = "Add";
        suggestedGames = suggestedGames.filter(obj => obj["name"] !== name);
    }

    submitGameButton.disabled = suggestedGames.length ? false : true;
}

const submitHandler = async () => {
    try {
        let res = await axios.post("/add-suggested-game", {suggestedGames});
        suggestedGamesJson = res.data;
        closeModalButton.click();
        changeSlide();
        
    } catch(error) { console.log(error) }
    
    searchFieldElement.value = "";
    gameBoxField.innerHTML = "";
    submitGameButton.disabled = true;
    setTimeout(() => {suggestedGames = []}, 1000);
}

changeSideButton.addEventListener("click", () => {
    currentSide = (currentSide === 1 ? 2: 1);
    changeSlide();
});

openModalButton.addEventListener("click", () => modalElement.style.display = "block");   
openModalButtonMobile.addEventListener("click", () => modalElement.style.display = "block")
closeModalButton.addEventListener("click", () => modalElement.style.display = "none");
refreshButton.addEventListener("click", () => window.location.reload());

searchButton.addEventListener("click", async () => {
    gameBoxField.innerHTML = '';
    try {
        let res = await axios.get(`/search-games?term=${searchFieldElement.value}`);
        res.data.map(({name, released, image}, i) => {
            gameBoxField.innerHTML += `
            <div class="card-item">
                <!-- Column -->
                <div class="card-image-holder">
                    <img src=${image} alt="game-cover" height="100%" width="100%">
                </div>
                <!-- Column -->
                <div>
                    <div class="card-game-title">${name}</div>
                    <div class="card-add-btn" style="margin-top: 5px; color:white; font-weight: bolder; cursor:pointer; width: 7vw; font-size: 15px; text-align:center; border: 1px solid white;"
                    onclick="changeHandler('${name}','${image}', ${i})">Add</div>
                </div>
            </div>
            `
        })
    } catch(error) {   
        console.log(error);
    }
});

fetchGamesList();
setTimeout(() => {
    changeSlide() 
}, 1000);