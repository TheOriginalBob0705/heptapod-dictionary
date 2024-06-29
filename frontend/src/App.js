import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [logograms, setLogograms] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [selectedLogogram, setSelectedLogogram] = useState(null);
    const [definitions, setDefinitions] = useState([]);
    const [exampleSentences, setExampleSentences] = useState({});

    useEffect(() => {
        const fetchLogograms = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/logograms');
                setLogograms(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchLogograms();
    }, []);

    useEffect(() => {
        if (searchTerm) {
            const filtered = logograms.filter(logogram =>
                logogram.english_equivalent.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setSuggestions(filtered);
        } else {
            setSuggestions([]);
        }
    }, [searchTerm, logograms]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleWordClick = async (id) => {
        try {
            const logogramResponse = await axios.get(`http://localhost:5000/api/logogram/${id}`);
            setSelectedLogogram(logogramResponse.data);

            const definitionsResponse = await axios.get(`http://localhost:5000/api/definitions/${id}`);
            setDefinitions(definitionsResponse.data);

            const sentences = {};
            for (const definition of definitionsResponse.data) {
                const exampleSentencesResponse = await axios.get(`http://localhost:5000/api/example_sentences/${definition.id}`);
                sentences[definition.id] = exampleSentencesResponse.data;
            }
            setExampleSentences(sentences);
        } catch (error) {
            console.error('Error fetching logogram details:', error);
        }
    };

    const handleOtherMeaningClick = (word) => {
        setSearchTerm(word);
        const filtered = logograms.filter(logogram =>
            logogram.english_equivalent.toLowerCase().includes(word.toLowerCase())
        );
        if (filtered.length > 0) {
            handleWordClick(filtered[0].id);
        }
    };

    return (
        <div className="App">
            <header>
                <h1>Heptapod Dictionary</h1>
                <nav>
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/random">Random Word</a></li>
                    </ul>
                </nav>
                <form id="searchForm">
                    <input
                        type="text"
                        id="search"
                        name="search"
                        placeholder="Search for a word..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </form>
            </header>
            <main id="content">
                {suggestions.length > 0 && (
                    <div id="suggestions">
                        {suggestions.map(suggestion => (
                            <div
                                className="suggestion"
                                key={suggestion.id}
                                onClick={() => handleWordClick(suggestion.id)}
                            >
                                {suggestion.english_equivalent}
                            </div>
                        ))}
                    </div>
                )}
                {selectedLogogram && (
                    <div id="logogram_details">
                        <h2>{selectedLogogram.english_equivalent}</h2>
                        <p><strong>Pronunciation:</strong> {selectedLogogram.pronunciation}</p>
                        <img src={`data:image/png;base64,${selectedLogogram.logogram}`}
                             alt={selectedLogogram.english_equivalent} class="logogram_picture"/>
                        {selectedLogogram.other_meanings && (
                            <div className="other_meanings_container">
                                <strong>This logogram also means:</strong>
                                <ul>
                                    {selectedLogogram.other_meanings.split(',').map((other_meaning, index) => (
                                        <li key={index}
                                            onClick={() => handleOtherMeaningClick(other_meaning.trim())}
                                            class="component_item">{other_meaning.trim()}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        <h2>Definitions</h2>
                        {definitions.map(definition => (
                            <div key={definition.id}>
                                <p><strong>{definition.type}</strong></p>
                                <p>{definition.definition}</p>
                                <em>{exampleSentences[definition.id] && exampleSentences[definition.id].map(sentence => (
                                    <p key={sentence.id}>{sentence.sentence}</p>
                                ))}</em>
                            </div>

                        ))}
                        {selectedLogogram.components && (
                            <div className="components_container">
                                <strong>Logographic components:</strong>
                                <ul>
                                    {selectedLogogram.components.split(',').map((component, index) => (
                                        <li key={index}>{component.trim()}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </main>
            <footer>
                <p>&copy; 2024 Scia Rook Atamyanov. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default App;
