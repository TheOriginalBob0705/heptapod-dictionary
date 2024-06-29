const words = [
    { word: 'example', pronunciation: 'ig-zam-puhl', definitions: ['a representative form or pattern', 'something to be imitated'] },
    { word: 'arrival', pronunciation: 'uh-rahy-vuhl', definitions: ['the act of coming to a place', 'the attainment of an end or goal'] }
    // Add more words as needed
];

document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const searchQuery = document.getElementById('search').value.toLowerCase();
    const filteredWords = words.filter(word => word.word.toLowerCase().includes(searchQuery));

    displayWords(filteredWords);
});

function displayWords(wordList) {
    const wordListContainer = document.getElementById('wordList');
    wordListContainer.innerHTML = '';

    wordList.forEach(word => {
        const wordEntry = document.createElement('article');
        wordEntry.classList.add('wordEntry');

        const wordTitle = document.createElement('h2');
        wordTitle.textContent = word.word;
        wordEntry.appendChild(wordTitle);

        const wordPronunciation = document.createElement('p');
        wordPronunciation.textContent = `Pronunciation: ${word.pronunciation}`;
        wordEntry.appendChild(wordPronunciation);

        const wordDefinitions = document.createElement('ul');
        word.definitions.forEach(def => {
            const li = document.createElement('li');
            li.textContent = def;
            wordDefinitions.appendChild(li);
        });
        wordEntry.appendChild(wordDefinitions);

        wordListContainer.appendChild(wordEntry);
    });
}

// Initially display all words
displayWords(words);