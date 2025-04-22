const MAX_POKEMONS_PADRAO = 1010;
const PRIMEIRO_POKEMON_ID_PADRAO = 1;

const endpointPokeAPI = "https://pokeapi.co/api/v2/pokemon/";
const endpointPokedexNacional = "https://pokeapi.co/api/v2/pokedex/1/";

const carregandoGif = "./images/spinning-loading.gif";
const pokemonDesconhecidoGif = "./images/missingno.gif";

const nomePokemonDOM = document.querySelector(".pokemon-name");
const idPokemonDOM = document.querySelector(".pokemon-id");
const imagemPokemonGifDOM = document.querySelector(".pokemon-gif");

const formularioPokemonDOM = document.querySelector(".pokemon-form");
const inputPesquisaPokemonDOM = document.querySelector(".pokemon-input-search");

const botaoAnterior = document.querySelector(".button-prev");
const botaoProximo = document.querySelector(".button-next");

let idPokemonBusca = PRIMEIRO_POKEMON_ID_PADRAO;
let idMaximoPokemonBusca = PRIMEIRO_POKEMON_ID_PADRAO;

// Define a quantidade máxima de pokémons buscáveis
const definirIdMaximoPokemon = async () => {
    const respostaAPI = await fetch(endpointPokedexNacional);

    if (respostaAPI.status === 200) {
        const dadosPokedex = await respostaAPI.json();
        idMaximoPokemonBusca = dadosPokedex.pokemon_entries.length;
    } else {
        idMaximoPokemonBusca = MAX_POKEMONS_PADRAO;
    }
}

definirIdMaximoPokemon();

// Renderiza o nome do Pokémon
function exibirNomePokemon(dadosPokemon) {
    nomePokemonDOM.innerHTML = dadosPokemon.name;
}

// Formata o ID do Pokémon para 4 dígitos (ex: 0001)
function formatarIdPokemon(id) {
    return id.toLocaleString("pt-BR", {
        minimumIntegerDigits: 4,
        useGrouping: false,
    });
}

// Renderiza o ID do Pokémon
function exibirIdPokemon(dadosPokemon) {
    idPokemonDOM.innerHTML = formatarIdPokemon(dadosPokemon.id);
}

// Renderiza a imagem animada do Pokémon
function exibirGifPokemon(dadosPokemon) {
    let gif = dadosPokemon?.sprites?.versions?.["generation-v"]?.["black-white"]?.animated?.front_default;

    if (!gif) {
        gif = dadosPokemon.sprites.front_default;
    }

    imagemPokemonGifDOM.src = gif;
}

// Reseta o campo de pesquisa
function limparPesquisa() {
    nomePokemonDOM.innerHTML = "Carregando...";
    inputPesquisaPokemonDOM.value = "";
}

// Esconde o separador visual entre nome e ID
function esconderSeparador() {
    document.querySelector(".poke-separator").innerHTML = "";
}

// Mostra o separador visual
function mostrarSeparador() {
    document.querySelector(".poke-separator").innerHTML = "-";
}

// Exibe animação de carregando
function mostrarCarregamento() {
    esconderSeparador();
    imagemPokemonGifDOM.src = carregandoGif;
    nomePokemonDOM.innerHTML = "Carregando...";
    idPokemonDOM.innerHTML = "";
}

// Retorna um Pokémon genérico quando não encontra
function obterPokemonDesconhecido() {
    const spritesFalsos = {
        versions: {
            "generation-v": {
                "black-white": {
                    animated: {
                        front_default: pokemonDesconhecidoGif
                    }
                }
            }
        }
    };

    return {
        id: "???",
        name: "Não encontrado :(",
        sprites: spritesFalsos,
    };
}

// Salva o ID se a busca foi bem sucedida
function aoBuscarPokemonComSucesso(pokemon) {
    idPokemonBusca = pokemon.id;
}

// Reseta o ID se a busca falhar
function aoBuscarPokemonSemSucesso() {
    idPokemonBusca = 0;
    esconderSeparador();
}

// Busca o Pokémon pela API
const buscarPokemon = async (pokemon) => {
    const url = endpointPokeAPI + pokemon.toString().toLowerCase();
    const resposta = await fetch(url);

    if (resposta.status === 200) {
        const dados = await resposta.json();
        aoBuscarPokemonComSucesso(dados);
        return dados;
    } else {
        const dadosFalsos = obterPokemonDesconhecido();
        aoBuscarPokemonSemSucesso();
        return dadosFalsos;
    }
}

// Renderiza o Pokémon na tela
const renderizarPokemon = async (pokemon) => {
    mostrarCarregamento();

    const dadosPokemon = await buscarPokemon(pokemon);

    exibirNomePokemon(dadosPokemon);
    exibirIdPokemon(dadosPokemon);
    exibirGifPokemon(dadosPokemon);
    mostrarSeparador();
}

// Inicializa o Pokemon
renderizarPokemon("Zapdos");

// Submete o formulário de busca
const enviarFormulario = (event) => {
    event.preventDefault();
    const valorBusca = inputPesquisaPokemonDOM.value;

    renderizarPokemon(valorBusca);
    limparPesquisa();
}

// Impede que ID fique fora do intervalo
function limitarIdBusca() {
    if (idPokemonBusca <= 0) {
        idPokemonBusca = idMaximoPokemonBusca;
    }
    if (idPokemonBusca > idMaximoPokemonBusca) {
        idPokemonBusca = PRIMEIRO_POKEMON_ID_PADRAO;
    }
}

// Renderiza o Pokémon atual
function carregarPokemonAtual() {
    limitarIdBusca();
    renderizarPokemon(idPokemonBusca);
}

// Botão anterior
const buscarAnterior = () => {
    idPokemonBusca -= 1;
    carregarPokemonAtual();
}

// Botão próximo
const buscarProximo = () => {
    idPokemonBusca += 1;
    carregarPokemonAtual();
}


formularioPokemonDOM.addEventListener("submit", enviarFormulario);
botaoAnterior.addEventListener("click", buscarAnterior);
botaoProximo.addEventListener("click", buscarProximo);
