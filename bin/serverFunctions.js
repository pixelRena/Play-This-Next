// Fetches steam games & suggested games from firebase
const getGames = async () => {
    try {
        let res = await axios.get('/steam-games-collection');
        ownedGamesJson = res.data;

        let suggestedRes = await axios.get('/suggested-games-collection');
        suggestedGamesJson = suggestedRes.data;

        cardFlipper();
    }  catch(error) { console.log(error) }
};

// Fetches my steam games from steam api & updates firebase collection/documents
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
    } catch(error) { console.log(error) }
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
        alert("Games added successfully.");
        cardFlipper();
        
    } catch(error) { console.log(error) }

    setTimeout(() => {suggestedGames = []}, 500);
};