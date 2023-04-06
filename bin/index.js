const sortGames = (prop) => {
    suggestedGamesJson.sort((a,b) => {
        if(a[prop] && !b[prop]){
            return -1;
        } else if(!a[prop] && b[prop]) {
            return 1;
        } else {
            return 1;
        } 
    })
    mapSuggestedGames(true);
};

const mapSuggestedGames = (searchValue) => {
    cardSearchField.placeholder = "Search suggested games..";
    loaderElementContainer.style.display = "none";

    if(!searchValue) {
        suggestedGamesJson.map(({image, username, name, next, completed, declined}) => {
            if(completed) gamesCompleted++;
            cardElement.innerHTML += `
                    <div class="card-item">
                        <!-- Column -->
                        <div class="card-image-holder" height="100" style="margin-right: 15px; background-image: url(${image}); background-size: cover; background-position: center;">     
                        </div>
                        <!-- Column -->
                        <div>
                            <div class="card-game-title">${name}</div>
                            <div class="card-extra-information">Posted by: <strong><a href="https://www.twitch.tv/${username}" target="_blank">${username}</a></strong> ${next ? '<br/><strong class="game-status-next">Playing Next</strong>': completed ? '<br/><strong class="game-status-completed">Completed</strong>' : 
                            declined ? '<br/><strong class="game-status-declined">Declined</strong>' :
                            ''}</div>
                        </div>
                    </div>
            `;
        });
    } else {
        cardElement.innerHTML = '';
        let searchGamesJson = suggestedGamesJson.filter(item => (item.name.toLowerCase()).includes(cardSearchField.value.toLowerCase()));
        searchGamesJson.map(({image, username, name, next, completed, declined}) => {
                if(completed) gamesCompleted++;
                cardElement.innerHTML += `
                <div class="card-item">
                <!-- Column -->
                <div class="card-image-holder" height="100" style="margin-right: 15px; background-image: url(${image}); background-size: cover; background-position: center;">     
                </div>
                <!-- Column -->
                <div>
                    <div class="card-game-title">${name}</div>
                    <div class="card-extra-information">Posted by: <strong><a href="https://www.twitch.tv/${username}" target="_blank">${username}</a></strong> 
                    ${next ? '<br/><strong class="game-status-next">Playing Next</strong>': 
                    completed ? '<br/><strong class="game-status-completed">Completed</strong>' : 
                    declined ? '<br/><strong class="game-status-declined">Declined</strong>' :
                    ''}</div>
                </div>
                </div>
            `;
        });
    } 
};

const mapOwnedGames = (searchValue) => {
    cardSearchField.placeholder = "Search owned games..";
    loaderElementContainer.style.display = "none";

    if(!searchValue) {
        ownedGamesJson.map(({name, image}) => {
            cardElement.innerHTML += `
                    <div class="card-item" style="margin-bottom: 0;">
                        <!-- Column -->
                        <div class="card-image-holder">
                            <img class="owned-game-cover" src=${image} alt="game-cover" height="100%" width="50">
                        </div>
                        <!-- Column -->
                        <div>
                            <div class="card-game-title">${name}</div>
                        </div>
                    </div>
            `;
        });
    } else {
        cardElement.innerHTML = '';
        let searchGamesJson = ownedGamesJson.filter(item => (item.name.toLowerCase()).includes(cardSearchField.value.toLowerCase()));
        searchGamesJson.map(({name, image}) => {
            cardElement.innerHTML += `
                    <div class="card-item">
                        <!-- Column -->
                        <div class="card-image-holder">
                            <img class="owned-game-cover" src=${image} alt="game-cover" height="100%" width="50">
                        </div>
                        <!-- Column -->
                        <div>
                            <div class="card-game-title">${name}</div>
                        </div>
                    </div>
            `;
        });
    }

};

// Flips from owned to suggested games & triggers mapping
const cardFlipper = () => {
    loaderElementContainer.style.display = "unset";
    gamesCompleted = 0;
    if (currentCardSide === 1) {
        cardElement.innerHTML = '';
        cardHeaderElement.innerHTML = "Suggested Games:";
        cardFlipperButton.innerHTML = "View Owned Games";
        selectElementContainer.style.display = "unset";
        mapSuggestedGames();
        cardFooterElement.innerHTML = "Games Completed: "+gamesCompleted;
    } else {
        loaderElementContainer.style.display = "unset";
        cardHeaderElement.innerHTML = "Owned Games:";
        cardFlipperButton.innerHTML = "View Suggested Games";
        cardFooterElement.innerHTML = "Games Owned (Steam): "+ownedGamesJson.length;
        cardElement.innerHTML = '';
        selectElementContainer.style.display = "none";
        setTimeout(() => {mapOwnedGames()},800);
    }
    cardSearchField.value = '';
};

/* Handlers */
const onChangeHandler = (name, image, index) => {
    let quantityButton = document.querySelectorAll(".card-add-btn")[index];

    if (quantityButton.style.backgroundColor !== "white") {
        // Check if the game has already been added to the list
        if(suggestedGames.some(game => game.name === name)) {
            displayAlert(`You've already added the game: ${name} to the list. You can confirm by filtering the games selected.`);
            return;
        }
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
};

// Listens for search button to be clicked or return button in the modal/popup to allow searching for games
const onModalSubmitHandler = async (event) => {
    event.preventDefault();
    // Gives the selected game button a inverted color
    if(filterButton.classList.contains("selected")) filterButton.classList.toggle("selected");

    // Resets search results
    gameBoxField.innerHTML = '';

    // Fetches games from database based off of search value
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
                    onclick="onChangeHandler('${name}','${image}', ${i})">Add</div>
                </div>
            </div>
            `
        })
    } catch(error) {   
        console.log(error);
    }
};


// * Event Listeners

// Handles search input depedending on if the card is on the owned or suggested games section
// True indicates there is a search value to be found
cardSearchField.addEventListener("keydown", function() {
    if(currentCardSide !== 1) {
        mapOwnedGames(true);
    } else {
        mapSuggestedGames(true);
    }
});


submitGameButton.addEventListener("click", function() {
    var username;

    // Checking for username in storage
    if(localStorage.getItem("username-serenuy-games-ttv")) {
        username = localStorage.getItem("username-serenuy-games-ttv");
        setSuggestedGames(username);
    } else {
        username = prompt("Enter your twitch username for credit: ");
        localStorage.setItem("username-serenuy-games-ttv", username);
        setSuggestedGames(username);
    }
});

// Listens for option to be selected to sort games by
selectElement.addEventListener("change", function() {
    switch(selectElement.value) {
        case "next":
            sortGames("next");
            break;
        case "completed":
            sortGames("completed");
            break;
        case "declined":
            sortGames("declined");
            break;
        default:
            return;
    }
});

// Listens for if button "owned games" or "suggested games" is clicked to switch card
cardFlipperButton.addEventListener("click", function() {
    currentCardSide = (currentCardSide === 1 ? 2: 1);
    cardFlipper();
});

// Opens game search modal/popup
// * Desktop
openModalButton.addEventListener("click", function() {modalElement.style.display = "block"});   
// * Mobile
openModalButtonMobile.addEventListener("click", function() {modalElement.style.display = "block"});

// Closes modal/popup
closeModalButton.addEventListener("click", function() {modalElement.style.display = "none"});

// Listen for modal/popup filter button
filterButton.addEventListener("click", function() {
    // Gives the selected game button a inverted color
    filterButton.classList.toggle("selected");
    
    if(filterButton.classList.contains("selected")){
        // display pending added games
        gameBoxField.innerHTML = "";
        if(suggestedGames.length !== 0) {
            suggestedGames.map(({name,image}, i) => {
                gameBoxField.innerHTML += `            
                <div class="card-item">
                    <!-- Column -->
                    <div class="card-image-holder">
                        <img src=${image} alt="game-cover" height="100%" width="100%">
                    </div>
                    <!-- Column -->
                    <div>
                        <div class="card-game-title">${name}</div>
                        <div class="card-add-btn" style="margin-top: 5px; color:black; background-color: white; font-weight: bolder; cursor:pointer; width: 7vw; font-size: 15px; text-align:center; border: 1px solid white;"
                        onclick="onChangeHandler('${name}','${image}', ${i})">Remove</div>
                    </div>
                </div>
                `
            });
        } else {
            gameBoxField.innerHTML = `
                <div class="card-item">
                    <div>
                        <div class="card-game-title">When you add a game you want to suggest, they get saved here until you submit the suggestion.</div>
                    </div>
                </div>
            `;
        }
    } else {
        // resume search
        searchButton.click();
    }
})

getGames();