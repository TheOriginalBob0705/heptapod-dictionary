// Load the JSON file containing logograms
async function loadLogograms() {
    const response = await fetch('dictionary/dictionary.json');
    const data = await response.json();
    return data.logograms;
}

// Filter logograms based on user input
function filterLogograms(logograms, searchTerm) {
    return logograms.filter(logogram =>
        logogram.english_equivalent.toLowerCase().includes(searchTerm.toLowerCase()));
}

// Display suggestions in the main section
function displaySuggestions(suggestions) {
    const main = document.querySelector('main');
    main.innerHTML = ''; // Clear previous suggestions

    if (suggestions.length > 0) {
        const wordList = document.createElement('div');
        wordList.id = 'wordList';

        suggestions.forEach(suggestion => {
            const wordEntry = document.createElement('div');
            wordEntry.classList.add('wordEntry');
            wordEntry.innerHTML = `<a href="#" data-word="${suggestion.english_equivalent}">${suggestion.english_equivalent}</a>`;
            wordList.appendChild(wordEntry);
        });

        main.appendChild(wordList);

        // Add click event listeners to each suggestion link
        document.querySelectorAll('#wordList a').forEach(link => {
            link.addEventListener('click', event => {
                event.preventDefault();
                const word = event.target.getAttribute('data-word');
                displayWordDetails(word, suggestions);
            });
        });
    }
}

// Display word details
function displayWordDetails(word, logograms) {
    const main = document.querySelector('main');
    main.innerHTML = ''; // Clear previous content

    const selectedLogogram = logograms.find(logogram => logogram.english_equivalent === word);

    if (selectedLogogram) {
        const wordDetails = document.createElement('div');
        wordDetails.classList.add('wordDetails');

        wordDetails.innerHTML = `
            <div class="wordDetailsContainer">
                <div class="logogramContainer">
                    <img src="${selectedLogogram.logogram}" alt="${selectedLogogram.english_equivalent}" class="logogram_picture">
                </div>
                <div class="textInfoContainer">
                    <h2>${selectedLogogram.english_equivalent}</h2>
                    <p><strong>Pronunciation:</strong> ${selectedLogogram.pronunciation}</p>
                    <h3>Definitions</h3>
                    ${Object.keys(selectedLogogram.definitions).map(partOfSpeech => `
                        <h4>${partOfSpeech.charAt(0).toUpperCase() + partOfSpeech.slice(1)}</h4>
                        <ul>
                            ${selectedLogogram.definitions[partOfSpeech].map(definition => `<li>${definition}</li>`).join('')}
                        </ul>
                    `).join('')}
                    ${selectedLogogram.components ? `
                    <h3>Logographic Components</h3>
                    <ul>
                        ${selectedLogogram.components.map(component => `<li>${component}</li>`).join('')}
                    </ul>
                ` : ''}
                    <h3>This logogram also means:</h3>
                    <ul>
                        ${selectedLogogram.other_meanings.map(meaning => `<li>${meaning}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;

        main.appendChild(wordDetails);
    }
}

// Initialize the search functionality
async function init() {
    const logograms = await loadLogograms();

    const searchInput = document.getElementById('search');
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            const suggestions = filterLogograms(logograms, searchTerm);
            displaySuggestions(suggestions);
        } else {
            document.querySelector('main').innerHTML = ''; // Clear suggestions if search is empty
        }
    });
}

document.addEventListener('DOMContentLoaded', init);