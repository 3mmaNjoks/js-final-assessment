# Tech 17 Javascript Final Assessment
This project is a final assessment for Tech 17 Javascript. It is a simple web app that displays and allows users to search for characters from the Star Wars universe. The app uses the SWAPI API to fetch data about characters and displays them in a grid. Users can also search for characters by name.

## Features
- Search for characters by name
- Display characters in a grid
- Display loading and error states
- Display pagination for large result sets

## Technologies Used
- HTML
- CSS
- JavaScript
- Font Awesome
- SWAPI API

## Key Decisions made
- Use the SWAPI.tech API instead of the SWAPI.dev  to fetch data about characters.  SWAPI.tech is more reliable that SWAPI.dev.
- Clone a repositor from github called SWAPI-gallery where I extracted the star wars icharacter images displayed alongside the information from the API.
- The folder does not contain am inage for the 17th charcater so I used a fallback SVG in its place.
- The architecture of the data mandated two calls to the API. On the first call, the UID and the homeworld are fetched. On the second call, the characters information are fetched. Needed fields from both fetches are then merged and returned.
- The API defaults to returning 10 results per page. Although this can be changed, I decided to use this default topaginate the results so that on clicking next page, the next 10 results are fetched and displayed.