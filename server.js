const express = require('express');
const axios = require('axios');
const firebase = require("firebase-admin");

const dotenv = require('dotenv');
dotenv.config();

const path = require('path');
let staticPath = path.join(__dirname, ".");

// var serviceAccount = require("./config/firebaseKey.json");
firebase.initializeApp({
  credential: firebase.credential.cert(
    {
    "projectId": process.env.FIREBASE_PROJECT_ID,
    "clientEmail": process.env.FIREBASE_CLIENT_EMAIL,
    "privateKey": JSON.parse(process.env.FIREBASE_PRIVATE_KEY),
    "privateKeyId": process.env.FIREBASE_PRIVATE_KEY_ID,
    "token_uri":"https://oauth2.googleapis.com/token"
    }
    )
});

const db = firebase.firestore();
// Firebase collections:
const steamDB = db.collection("steam");
const suggestedDB = db.collection("suggested").orderBy("next");

const app = express();
app.use(express.static(staticPath));
app.use(express.json());

// Fetches steam games
app.get('/steam-games', async (req,res) => {
    try {
        const {data} = await axios.get("https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key="+process.env.STEAM_WEB_API_KEY+"&steamid="+process.env.STEAM_ID+"&include_appinfo=true&format=json");
        res.send(data.response);
    } catch(error) {
        console.log(error);
        res.send(error);
    }
});

// Fetches steam games stored in firebase DB
app.get('/steam-games-collection', async (req,res) => {   
    let gamesInDB = [];

    await steamDB.get()
    .then((snapshot) => {
        snapshot.forEach(snap => gamesInDB.push(snap.data()))
    });
    
    res.send(gamesInDB);
});

// Updates steam games in firebase DB
app.post('/seed-steam-games', async (req,res) => {
    const { gamesList } = req.body;
    let gamesInDB = [];

    gamesList.map(({appid, img_icon_url, name}) => {    
        steamDB.doc(String(appid)).set({
            appid,
            name,
            image: "http://media.steampowered.com/steamcommunity/public/images/apps/"+appid+"/"+img_icon_url+".jpg",
        });
    })
    
    await steamDB.get()
    .then((snapshot) => {
        snapshot.forEach(snap => gamesInDB.push(snap.data()))
    });

    res.send(gamesInDB);
});

// Gets results from search input of adding a game
app.get('/search-games', async (req,res) => {
    const { term } = req.query;
    try {
        const {data} = await axios.get(`https://api.rawg.io/api/games?search=${term}&key=${process.env.RAWG_API_KEY}`, { headers: { "Accept-Encoding": "gzip,deflate,compress" } })
        let dataReceived = data.results;
        let dataArr = [];
        dataReceived.map(({name, released, background_image}) => dataArr.push({
            "name": name, 
            "released": released,
            "image": background_image
        }));
        res.send(dataArr);
    } catch(error) { res.send(error) }
});

// Gets the suggested games from firebase DB
app.get('/suggested-games-collection', async(req,res) => {
    let gamesInDB = [];

    await suggestedDB.get()
    .then((snapshot) => {
        snapshot.forEach(snap => gamesInDB.push(snap.data()))
    });
    
    res.send(gamesInDB);
});

// Adds new suggested game to firebase DB
app.post('/add-suggested-game', async (req,res) => {
    const { suggestedGames, username } = req.body;
    let updatedSuggestedGames = db.collection("suggested");
    let gamesInDB = [];

    suggestedGames.map(({name, image}) => {    
        updatedSuggestedGames.doc(name).set({
            username: username || "N/A",
            name,
            image,
            next: false,
        });
    });

    await updatedSuggestedGames.get()
    .then((snapshot) => {
        snapshot.forEach(snap => gamesInDB.push(snap.data()))
    });

    res.send(gamesInDB);
});

// Gets static html page
app.use('/', (req,res) => res.sendFile(path.join(staticPath, "index.html")));

app.listen(process.env.PORT || 3000, () => { console.log("listening on port.."+process.env.PORT)});