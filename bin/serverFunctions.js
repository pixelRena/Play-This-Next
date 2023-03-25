const displayAlert = (message) => {
    notificationElement.style.display = "unset";
    notificationElement.innerHTML = message;
    setTimeout(() => {notificationElement.style.display = "none";},2500);
};

const moveItemInArray = (arr, oldIndex, newIndex) => {
    if (newIndex >= arr.length) {
      let i = newIndex - arr.length + 1;
      while (i--) {
        arr.push(undefined);
      }
    }
    arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
    suggestedGamesJson = arr;
};

// Fetches steam games & suggested games from firebase
const getGames = async () => {
    try {
        let res = await axios.get('/steam-games-collection');
        ownedGamesJson = res.data;

        let suggestedRes = await axios.get('/suggested-games-collection');
        suggestedGamesJson = suggestedRes.data;

        // Check which game will be played next
        // Rearrange suggested games based on nextIndexes
        suggestedGamesJson.map((item, i) => {
            item.next ? 
                moveItemInArray(suggestedGamesJson, i, 0) :
                    item.declined ?
                        moveItemInArray(suggestedGamesJson, i, 0) :
                            item.completed ? 
                                moveItemInArray(suggestedGamesJson, i, 0) : 
                                    null;
        });
        cardFlipper();

    }  catch(error) { console.log(error) }
};

// Fetches steam games from steam api & updates firebase collection/documents
const setGames = async () => {
    // Function creates documents inside of firebase collection
    const createDocument = async () => {
        try {
            let res = await axios.post('/seed-steam-games', {
                gamesList
            });
            ownedGamesJson = res.data;
        } catch(error) { console.log(error) }
    };

    try {
        let res  = await axios.get('/steam-games');

        gameCount = res.data.game_count;
        gamesList = res.data.games;
        createDocument();
    } catch(error) { console.error(error) }
};

const setSuggestedGames = async (username) => {
    try {
        let res = await axios.post("/add-suggested-game", {suggestedGames, username});
        suggestedGamesJson = res.data;
        closeModalButton.click();
        currentCardSide = 1;
        searchFieldElement.value = "";
        gameBoxField.innerHTML = "";
        submitGameButton.disabled = true;
        let tempMessage = `
            Game(s) successfully added:
            <ul>
                ${suggestedGames.map((game) => `<li>${game.name}</li>`)}
            </ul>`;
        displayAlert(tempMessage);
        // Re-render list
        mapSuggestedGames(false);
        cardFlipper();
        
    } catch(error) { displayAlert("Unable to add game to list. Try again later.") }

    setTimeout(() => {suggestedGames = []}, 500);
};