const express = require('express');
const axios = require('axios');
const firebase = require("firebase-admin");

const dotenv = require('dotenv');
dotenv.config();

const path = require('path');
let staticPath = path.join(__dirname, ".");

var serviceAccount = require("./firebaseKey.json");
firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount)
});

const db = firebase.firestore();
const steamDB = db.collection("steam");
const suggestedDB = db.collection("suggested");

const app = express();
app.use(express.static(staticPath));
app.use(express.json());

app.get('/steam-games', async (req,res) => {
    try {
        const {data} = await axios.get("https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key="+process.env.STEAM_WEB_API_KEY+"&steamid="+process.env.STEAM_ID+"&include_appinfo=true&format=json");
        res.send(data.response);
    } catch(error) {
        console.log(error);
        res.send(error);
    }
});

app.get('/steam-games-collection', async (req,res) => {   
    let gamesInDB = [];

    await steamDB.get()
    .then((snapshot) => {
        snapshot.forEach(snap => gamesInDB.push(snap.data()))
    });
    
    res.send(gamesInDB);
});

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

app.get('/search-games', async (req,res) => {
    const { term } = req.query;
    try {
        const {data} = await axios.get(`https://api.rawg.io/api/games?search=${term}&key=${process.env.RAWG_API_KEY}`, { headers: { "Accept-Encoding": "gzip,deflate,compress" } })
        let dataReceived = data.results;
        let dataArr = [];
        dataReceived.map(({name, released, background_image}) => dataArr.push({"name":name, "released":released,"image":background_image}));
        res.send(dataArr);
    } catch(error) { res.send(error) }
});

app.get('/suggested-games-collection', async(req,res) => {
    let gamesInDB = [];

    await suggestedDB.get()
    .then((snapshot) => {
        snapshot.forEach(snap => gamesInDB.push(snap.data()))
    });
    
    res.send(gamesInDB);
});

app.post('/add-suggested-game', async (req,res) => {
    const { suggestedGames } = req.body;
    let gamesInDB = [];

    suggestedGames.map(({name, image}) => {    
        suggestedDB.doc(name).set({
            username: "N/A",
            name,
            image,
        });
    });

    await suggestedDB.get()
    .then((snapshot) => {
        snapshot.forEach(snap => gamesInDB.push(snap.data()))
    });

    res.send(gamesInDB);
});

app.use('/', (req,res) => res.sendFile(path.join(staticPath, "index.html")));

app.listen(3000 || process.env.PORT, () => { console.log("listening on port.. 3000")});
