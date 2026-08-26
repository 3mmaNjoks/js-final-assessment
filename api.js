const base_url = "https://www.swapi.tech/api";
// I used SWAPI.tech because swapi.dev did not give me a response everytime. It breaks sometimes. I discovered SWAPI.tech to be more relaible

async function fetch_json(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }
    return response.json();
}


function to_character(uid, properties) {
    return {
        uid: String(uid),
        name: properties.name,
        height: properties.height,
        mass: properties.mass,
        gender: properties.gender,
        birth_year: properties.birth_year,
        hair_color: properties.hair_color,
        skin_color: properties.skin_color,
        eye_color: properties.eye_color,
        homeworld: properties.homeworld
    };
}

export async function get_characters(page, limit = 10) {
    const data = await fetch_json(`${base_url}/people?page=${page}&limit=${limit}`);

    const characters = await Promise.all(
        data.results.map(async item => {
            const detail = await fetch_json(item.url);
            return to_character(item.uid, detail.result.properties);
        })
    );

    return {
        characters,
        total_pages: data.total_pages,
        total_records: data.total_records
    };
}

export async function search_characters(name) {
    const data = await fetch_json(`${base_url}/people/?name=${encodeURIComponent(name)}`);
    const results = data.result || [];

    return {
        characters: results.map(item => to_character(item.uid, item.properties)),
        total_pages: 1,
        total_records: results.length
    };
}

export async function get_character(uid) {
    const data = await fetch_json(`${base_url}/people/${uid}`);
    return to_character(uid, data.result.properties);
}


// The SWAPI gallery project I cloned and copied the images do not have any image for 17 so I used this SVG as a fallback
const fallback_avatar = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect width='64' height='64' fill='%231e2236'/><circle cx='32' cy='25' r='11' fill='%234d8dff'/><path d='M9 62a23 23 0 0 1 46 0z' fill='%234d8dff'/></svg>";


export function avatar_url(character) {
    return `people/${character.uid}.jpg`;
}

export function handle_avatar_error(image) {
    image.addEventListener("error", () => {
        image.src = fallback_avatar;
    }, { once: true });
}

export async function get_homeworld_name(url) {
    if (!url) {
        return "Unknown";
    }
    const data = await fetch_json(url);
    return data.result.properties.name;
}
