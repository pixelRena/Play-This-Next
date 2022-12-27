const mapSuggestedGames = () => {
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
};

const mapOwnedGames = () => {
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

const refreshHandler = () => {
    cardElement.contentWindow.location.reload(true);
};

// Event Listeners
cardFlipperButton.addEventListener("click", () => {
    currentCardSide = (currentCardSide === 1 ? 2: 1);
    cardFlipper();
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