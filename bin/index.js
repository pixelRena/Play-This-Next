const mapSuggestedGames = () => {
    cardSearchField.style.display = "none";
    suggestedGamesJson.map(({image, username, name, next}, index) => {
        cardElement.innerHTML += `
                <div class="card-item">
                    <!-- Column -->
                    <div class="card-image-holder" height="100" style="margin-right: 15px; background-image: url(${image}); background-size: cover; background-position: center;">
                        
                    </div>
                    <!-- Column -->
                    <div>
                        <div class="card-game-title">${name}</div>
                        <div class="card-extra-information">Posted by: <strong><a href="https://www.twitch.tv/${username}" target="_blank">${username}</a></strong> ${next ? '<br/><strong class="playing-next">Playing Next</strong>':''}</div>
                    </div>
                </div>
        `;
    });
};

const mapOwnedGames = (filter) => {
    cardSearchField.style.display = "block";
    if(!filter) {
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
    } else {
        cardElement.innerHTML = '';
        let searchGamesJson = ownedGamesJson.filter(item => (item.name.toLowerCase()).includes(cardSearchField.value.toLowerCase()));
        searchGamesJson.map(({name, image}) => {
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

};

// Flips from owned to suggested games & triggers mapping
const cardFlipper = () => {
    if (currentCardSide === 1) {
        cardElement.innerHTML = '';
        cardHeaderElement.innerHTML = "Suggested Games:";
        cardFlipperButton.innerHTML = "View Owned Games";
        cardFooterElement.innerHTML = "Games Completed: -";
        mapSuggestedGames();
    } else {
        cardHeaderElement.innerHTML = "Owned Games:";
        cardFlipperButton.innerHTML = "View Suggested Games";
        cardFooterElement.innerHTML = "Games Owned (Steam): "+ownedGamesJson.length;
        cardElement.innerHTML = '';
        mapOwnedGames();
    }
};

// View Selected Games
const viewPendingGamesToAdd = () => {
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
};

/* Handlers */
const onChangeHandler = (name, image, index) => {
    let quantityButton = document.querySelectorAll(".card-add-btn")[index];

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
};

const onSubmitHandler = () => {
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
};

// Event Listeners
cardFlipperButton.addEventListener("click", () => {
    currentCardSide = (currentCardSide === 1 ? 2: 1);
    cardFlipper();
});
openModalButton.addEventListener("click", () => modalElement.style.display = "block");   
openModalButtonMobile.addEventListener("click", () => modalElement.style.display = "block")
closeModalButton.addEventListener("click", () => modalElement.style.display = "none");
searchButton.addEventListener("click", async () => {
    if(filterButton.classList.contains("selected")) filterButton.classList.toggle("selected");
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
                    onclick="onChangeHandler('${name}','${image}', ${i})">Add</div>
                </div>
            </div>
            `
        })
    } catch(error) {   
        console.log(error);
    }
});

getGames();