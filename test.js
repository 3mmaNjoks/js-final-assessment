async function get_character(current_page) {
    try {
        const response = await fetch(`https://www.swapi.tech/api/people?page=${current_page}&limit=10`);

        if(!(response).ok) {
        throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();

        const characters = await Promise.all(
            data.results.map(async character => {
                const character_information = await fetch(character.url);
                if(!character_information.ok) {
                    throw new Error(`HTTP error: ${character_information.status}`)
                }

                const character_data = await character_information.json();
                const details = character_data.result.properties;
                return {
                    uid: character.uid,
                    name: details.name,
                    height: details.height,
                    mass: details.mass,
                    gender: details.gender,
                    birth_year: details.birth_year,
                    hair_color: details.hair_color,
                    skin_color: details.skin_color,
                    eye_color: details.eye_color,
                    homeworld: details.homeworld
                };
            })
        );
            return characters;
    } catch(error) {
        console.error("Failed to fetch users: ", error);
    }
}

async function main() {
    const characters = await get_character(1);
    console.log(characters);
}

main();