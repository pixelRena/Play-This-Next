let modalElement = document.querySelector(".modal-section");
let openModalButton = document.querySelector(".add-game-button");
let openModalButtonMobile = document.querySelector(".add-game-button-mobile");
let closeModalButton = document.querySelector(".close-modal-button");
let cardHeaderElement = document.querySelector(".card-header");
let cardElement = document.querySelector(".card-body");
let cardFooterElement = document.querySelector(".card-footer");
let changeSideButton = document.querySelector(".main-button");
let currentSide = 1;
var gameCount; 
var gamesList;
var gamesJson;

const suggestedCard = [
    {
    "gameCover": "https://cdromance.com/wp-content/uploads/2018/07/19468_front.jpg",
    "gameTitle": "Viewtiful Joe",
    "author": "CallMeJay360"
    },
    {
    "gameCover": "https://static-cdn.jtvnw.net/ttv-boxart/195053862_IGDB-285x380.jpg",
    "gameTitle": "Resident Evil 2",
    "author": "Serenuy"
    },
];

const ownedCard = [
    {
        "gameCover": "https://cdromance.com/wp-content/uploads/2018/07/19468_front.jpg",
        "gameTitle": "Joe", 
    },
];

// Only trigger on button click
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
            gamesJson = res.data;
        } catch(error) { console.log(error) }
    };
};

const fetchGamesList = async () => {
    try {
        let res = await axios.get('/steam-games-collection');
        gamesJson = res.data;
    }  catch(error) { console.log(error) }
};

const changeSlide = () => {
    if (currentSide === 1) {
        cardElement.innerHTML = '';
        cardHeaderElement.innerHTML = "Suggested Games:";
        changeSideButton.innerHTML = "View Owned Games";
        cardFooterElement.innerHTML = "Games Completed: 21";
        suggestedCard.map(({gameCover, author, gameTitle}) => {
            cardElement.innerHTML += `
                    <div class="card-item">
                        <!-- Column -->
                        <div class="card-image-holder" height="100" style="margin-right: 15px;">
                            <img src=${gameCover} alt="game-cover" width="100%" height="100%">
                        </div>
                        <!-- Column -->
                        <div>
                            <div class="card-game-title">${gameTitle}</div>
                            <div class="card-extra-information">Posted by: ${author}</div>
                        </div>
                    </div>
            `;
        });
    } else {
        cardHeaderElement.innerHTML = "Owned Games:";
        changeSideButton.innerHTML = "View Suggested Games";
        cardFooterElement.innerHTML = "Games Owned (Steam): "+gamesJson.length;
        cardElement.innerHTML = '';
        gamesJson.map(({name, image}) => {
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

changeSlide();
fetchGamesList();
changeSideButton.addEventListener("click", () => {
    currentSide = (currentSide === 1 ? 2: 1);
    console.log(currentSide);
    changeSlide();
});
openModalButton.addEventListener("click", () => {
    modalElement.style.display = "block";
});   
openModalButtonMobile.addEventListener("click", () => {
    modalElement.style.display = "block";
});   
closeModalButton.addEventListener("click", () => {
    modalElement.style.display = "none";
});