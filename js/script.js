

const DEFAULT_MAX_POKEMONS = 1010;
const DEFAULT_FIRST_POKEMON_ID = 1;

const pokeAPIEndoint = "https://pokeapi.co/api/v2/pokemon/";
const nationalPokedexAPIEndoint = "https://pokeapi.co/api/v2/pokedex/1/";

const pokeLoading = "./images/spinning-loading.gif";
const pokeMissingNo = "./images/missingno.gif";

const pokemonNameDOM = document.querySelector(".pokemon-name");
const pokemonIdDOM = document.querySelector(".pokemon-id");
const pokemonImageGifDOM = document.querySelector(".pokemon-gif");

const pokemonFormDOM = document.querySelector(".pokemon-form");
const pokemonInputDOM = document.querySelector(".pokemon-input-search");

const pokeButtonPrev = document.querySelector(".button-prev");
const pokeButtonNext = document.querySelector(".button-next");

let searchPokemonId = DEFAULT_FIRST_POKEMON_ID;
let maxSearchPokemonId = DEFAULT_FIRST_POKEMON_ID;

const setMaxSearchPokemonId = async () => {

    const pokedexAPIResponse = await fetch(nationalPokedexAPIEndoint);

    console.log("nationalPokedexAPIEndoint", nationalPokedexAPIEndoint);
    console.log("pokedexAPIResponse", pokedexAPIResponse);

    if (pokedexAPIResponse.status == 200) {
        const pokedexData = await pokedexAPIResponse.json();
        let maxPokemonCount = pokedexData.pokemon_entries.length;
        console.log("pokedexData", pokedexData);
        console.log("maxPokemonCount", maxPokemonCount);

        maxSearchPokemonId = maxPokemonCount;
    } else {
        maxSearchPokemonId = DEFAULT_MAX_POKEMONS;
    };
}

setMaxSearchPokemonId();

function pokeNameRender(pokeDataFetched) {
    let pokeName = pokeDataFetched.name;
    pokemonNameDOM.innerHTML = pokeName;

    console.log("pokeName", pokeName);
}

function formatPokeId(pokeId) {
    let pokeLocale = "pt-BR";
    let pokeMinimumDigits = 4;
    let pokeFormatOptions = {
        minimumIntegerDigits: pokeMinimumDigits,
        useGrouping: false,
    };
    let pokeFormattedPokeId = pokeId.toLocaleString(pokeLocale, pokeFormatOptions);

    return pokeFormattedPokeId;
}

function pokeIdRender(pokeDataFetched) {
    let pokeId = pokeDataFetched.id;
    let pokeFormattedId = formatPokeId(pokeId);

    
    pokemonIdDOM.innerHTML = pokeFormattedId;

    console.log("pokeId", pokeId);
    console.log("pokeFormattedId", pokeFormattedId);
}

function pokeImgGifRender(pokeDataFetched) {
    let pokeGif = pokeDataFetched["sprites"]["versions"]["generation-v"]["black-white"]["animated"]["front_default"];
   
    if (pokeGif == null) {
        pokeGif = pokeDataFetched.sprites.front_default;
    }
    pokemonImageGifDOM.src = pokeGif;

    console.log("pokeGif", pokeGif);
}

function resetPokeInput() {
    pokemonNameDOM.innerHTML = "Loading...";
    pokemonInputDOM.value = "";
}

function hidePokeSeparator() {
    let pokeSeparatorDOM = document.querySelector(".poke-separator");
    pokeSeparatorDOM.innerHTML = "";
}

function showPokeSeparator() {
    let pokeSeparatorDOM = document.querySelector(".poke-separator");
    pokeSeparatorDOM.innerHTML = "-";
}

function loadingPokeDataFetch() {
    hidePokeSeparator();
    pokemonImageGifDOM.src = pokeLoading;
    pokemonNameDOM.innerHTML = "Loading...";
    pokemonIdDOM.innerHTML = "";
}

function getMissingNo() {
   
    let fakePokeSprites = { "versions": { "generation-v": { "black-white": { "animated": { "front_default": pokeMissingNo } } } } };
    let fakePokeData = {
        "id": "???",
        "name": "Not found :(",
        "sprites": fakePokeSprites,
    }
    return fakePokeData;
}

function handleSucceededPokeFetch(pokeData) {
    searchPokemonId = pokeData.id;
}

function handleUnsucceededPokeFetch() {
    searchPokemonId = 0;
    hidePokeSeparator();
}

const fetchPokemon = async (pokemon) => {

    let pokeString = pokemon.toString();
    let pokemonURL = pokeAPIEndoint + pokeString.toLowerCase();
    const pokeAPIResponse = await fetch(pokemonURL);

    console.log("pokemonURL", pokemonURL);
    console.log("pokeAPIResponse", pokeAPIResponse);

    if (pokeAPIResponse.status == 200) {
        const pokeData = await pokeAPIResponse.json();
        console.log("pokeData", pokeData);
        handleSucceededPokeFetch(pokeData);

        return pokeData;

    } else {
        let fakePokeData = getMissingNo();
        console.log("fakePokeData", fakePokeData);
        handleUnsucceededPokeFetch();

        return fakePokeData;
    };
}



const renderPokemon = async (pokemon) => {
    loadingPokeDataFetch();

    let pokeDataFetched = await fetchPokemon(pokemon);

    pokeNameRender(pokeDataFetched);
    pokeIdRender(pokeDataFetched);
    pokeImgGifRender(pokeDataFetched);
    showPokeSeparator();
}


renderPokemon("Bulbasaur");

const pokeForm = (event) => {
    event.preventDefault();
    let pokeInputValue = pokemonInputDOM.value;

    renderPokemon(pokeInputValue);
    resetPokeInput();

    console.log("Poké Form!!!");
    // console.log("pokeInputValue", pokemonInputDOM.value);
    console.log("pokeInputValue", pokeInputValue);
}

function clampSearchPokemonId() {
    if (searchPokemonId <= 0) {
        searchPokemonId = maxSearchPokemonId;
    }

    if (searchPokemonId > maxSearchPokemonId) {
        searchPokemonId = DEFAULT_FIRST_POKEMON_ID;
    }
}

function pokeButton() {
    clampSearchPokemonId();
    renderPokemon(searchPokemonId);
}

const pokePrev = () => {
    searchPokemonId -= 1;
    pokeButton();
}

const pokeNext = () => {
    searchPokemonId += 1;
    pokeButton();
}

pokemonFormDOM.addEventListener("submit", pokeForm);

pokeButtonPrev.addEventListener("click", pokePrev);
pokeButtonNext.addEventListener("click", pokeNext);