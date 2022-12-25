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

app.use('/', (req,res) => res.sendFile(path.join(staticPath, "index.html")));

app.listen(3000, () => { console.log("listening on port.. 3000")});
