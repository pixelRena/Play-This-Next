const modalElement = document.querySelector(".modal-section");
const openModalButton = document.querySelector(".add-game-button");
const openModalButtonMobile = document.querySelector(".add-game-button-mobile");
const closeModalButton = document.querySelector(".close-modal-button");
const cardHeaderElement = document.querySelector(".card-header");
const cardElement = document.querySelector(".card-body");
const cardFooterElement = document.querySelector(".card-footer");
const cardFlipperButton = document.querySelector(".main-button");
const searchFieldElement = document.querySelector(".search-field");
const searchButton = document.querySelector(".search-btn");
const refreshButton = document.querySelector(".refresh-button");
const submitGameButton = document.querySelector(".submit-game-button");
const gameBoxField = document.querySelector('.game-box');
let currentCardSide = 1;
var gameCount; 
var gamesList;
var ownedGamesJson;
var suggestedGamesJson;
var gamesJson;
var suggestedGames = [];