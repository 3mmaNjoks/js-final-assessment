import { get_character, get_homeworld_name, avatar_url, handle_avatar_error } from "./api.js";

const loading_state = document.querySelector("#loading-state");
const error_state = document.querySelector("#error-state");
const details_card = document.querySelector("#details-card");
const avatar = document.querySelector(".avatar");
const nameplate = document.querySelector(".nameplate");
const columns = document.querySelectorAll(".details-col");
const next_button = document.querySelector(".next-character");

const total_characters = 83;

function get_id_from_url() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

function show_only(section) {
    loading_state.hidden = section !== loading_state;
    error_state.hidden = section !== error_state;
    details_card.hidden = section !== details_card;
}

function row_markup(label, value) {
    return `<div class="detail-row"><dt>${label}</dt><dd>${value}</dd></div>`;
}

function render_character(character, homeworld) {
    handle_avatar_error(avatar);
    avatar.src = avatar_url(character);
    avatar.alt = character.name;
    nameplate.textContent = character.name;
    document.title = `${character.name} | Star Wars`;

    columns[0].innerHTML = [
        row_markup("Height", `${character.height} <span class="unit">cm</span>`),
        row_markup("Mass", `${character.mass} <span class="unit">kg</span>`),
        row_markup("Gender", character.gender),
        row_markup("Birth Year", character.birth_year)
    ].join("");

    columns[1].innerHTML = [
        row_markup("Hair Color", character.hair_color),
        row_markup("Skin Color", character.skin_color),
        row_markup("Eye Color", character.eye_color),
        row_markup("Homeworld", homeworld)
    ].join("");
}

function next_id(uid) {
    const current = Number(uid);
    return current >= total_characters ? 1 : current + 1;
}

async function load_details() {
    const uid = get_id_from_url();

    if (!uid) {
        error_state.querySelector(".error-message").textContent = "No character id in the URL.";
        show_only(error_state);
        return;
    }

    show_only(loading_state);

    try {
        const character = await get_character(uid);
        const homeworld = await get_homeworld_name(character.homeworld);

        render_character(character, homeworld);
        next_button.textContent = "Next character";
        next_button.dataset.next = next_id(character.uid);
        show_only(details_card);
    } catch (error) {
        console.error("Failed to load character:", error);
        error_state.querySelector(".error-message").textContent = error.message;
        show_only(error_state);
    }
}

next_button.addEventListener("click", () => {
    window.location.href = `character-details.html?id=${next_button.dataset.next}`;
});

error_state.addEventListener("click", event => {
    if (event.target.id === "retry") {
        load_details();
    }
});

load_details();
