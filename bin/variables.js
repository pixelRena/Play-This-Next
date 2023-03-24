const modalElement = document.querySelector(".modal-section");
const openModalButton = document.querySelector(".add-game-button");
const openModalButtonMobile = document.querySelector(".add-game-button-mobile");
const closeModalButton = document.querySelector("#close-modal-button");
const cardHeaderElement = document.querySelector(".card-header");
const cardElement = document.querySelector(".card-body");
const cardFooterElement = document.querySelector(".card-footer");
const cardFlipperButton = document.querySelector(".main-button");
const searchFieldElement = document.querySelector(".search-field");
const searchButton = document.querySelector(".search-btn");
const submitGameButton = document.querySelector("#submit-game-button");
const gameBoxField = document.querySelector('.game-box');
const cardSearchField = document.querySelector("#card-search-input");
const filterButton = document.querySelector("#filter-games-btn");
const selectElementContainer = document.querySelector("#sort-games-container");
const selectElement = document.querySelector("#sort-games-selection");
let currentCardSide = 1;
var gameCount; 
var gamesList;
var ownedGamesJson;
var suggestedGamesJson;
var gamesJson;
var suggestedGames = [];