import { get_characters, search_characters, avatar_url, handle_avatar_error } from "./api.js";

const grid = document.querySelector("#character-grid");
const loading_state = document.querySelector("#loading-state");
const error_state = document.querySelector("#error-state");
const empty_state = document.querySelector("#empty-state");
const pagination = document.querySelector("#pagination");
const search_input = document.querySelector("#search");

const state = {
    page: 1,
    query: "",
    total_pages: 1
};

let search_timer = null;

function show_only(section) {
    loading_state.hidden = section !== loading_state;
    error_state.hidden = section !== error_state;
    empty_state.hidden = section !== empty_state;
    grid.hidden = section !== grid;
    pagination.hidden = section !== grid || state.query !== "";
}

function card_markup(character) {
    return `
        <article class="character-card" data-id="${character.uid}" tabindex="0">
            <img class="character-avatar" src="${avatar_url(character)}" alt="${character.name}">
            <h3 class="character-name">${character.name}</h3>
            <dl class="character-meta">
                <div><dt>Height</dt><dd class="character-height">${character.height} <span class="unit">cm</span></dd></div>
                <div><dt>Gender</dt><dd class="character-gender">${character.gender}</dd></div>
                <div><dt>Born</dt><dd class="character-birth-year">${character.birth_year}</dd></div>
            </dl>
        </article>
    `;
}

function render_cards(characters) {
    grid.innerHTML = characters.map(card_markup).join("");
    grid.querySelectorAll(".character-avatar").forEach(handle_avatar_error);
}

function render_pagination() {
    pagination.innerHTML = `
        <button id="prev-page" ${state.page === 1 ? "disabled" : ""}>Previous</button>
        <span class="page-count">Page ${state.page} of ${state.total_pages}</span>
        <button id="next-page" ${state.page >= state.total_pages ? "disabled" : ""}>Next</button>
    `;
}

function open_details(uid) {
    window.location.href = `character-details.html?id=${uid}`;
}

async function load_characters() {
    show_only(loading_state);

    try {
        const result = state.query
            ? await search_characters(state.query)
            : await get_characters(state.page);

        state.total_pages = result.total_pages;

        if (result.characters.length === 0) {
            show_only(empty_state);
            return;
        }

        render_cards(result.characters);
        render_pagination();
        show_only(grid);
    } catch (error) {
        console.error("Failed to load characters:", error);
        error_state.querySelector(".error-message").textContent = error.message;
        show_only(error_state);
    }
}

grid.addEventListener("click", event => {
    const card = event.target.closest(".character-card");
    if (card) {
        open_details(card.dataset.id);
    }
});

grid.addEventListener("keydown", event => {
    const card = event.target.closest(".character-card");
    if (card && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        open_details(card.dataset.id);
    }
});

pagination.addEventListener("click", event => {
    if (event.target.id === "prev-page" && state.page > 1) {
        state.page -= 1;
        load_characters();
    }
    if (event.target.id === "next-page" && state.page < state.total_pages) {
        state.page += 1;
        load_characters();
    }
});

search_input.addEventListener("input", event => {
    clearTimeout(search_timer);
    const value = event.target.value.trim();

    search_timer = setTimeout(() => {
        state.query = value;
        state.page = 1;
        load_characters();
    }, 400);
});

error_state.addEventListener("click", event => {
    if (event.target.id === "retry") {
        load_characters();
    }
});

load_characters();
