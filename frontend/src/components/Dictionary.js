import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dictionary = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [wordData, setWordData] = useState([]);
    const [componentsData, setComponentsData] = useState({});
    const [showComponents, setShowComponents] = useState({});
    const [suggestions, setSuggestions] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const handleSearch = async (term) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/logograms/${term}`);
            if (response.data.length === 0) {
                setErrorMessage(`"${term}" doesn't exist. Try again.`);
                setWordData([]);
            } else {
                setWordData(response.data);
                setErrorMessage('');
            }
        } catch (error) {
            console.error('Error fetching data', error);
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch(searchTerm);
        }
    };

    const fetchComponents = async (definitionId) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/components/${definitionId}`);
            setComponentsData(prevState => ({ ...prevState, [definitionId]: response.data }));
            setShowComponents(prevState => ({ ...prevState, [definitionId]: !prevState[definitionId] }));
        } catch (error) {
            console.error('Error fetching components', error);
        }
    };

    const fetchSuggestions = async (term) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/suggestions/${term}`);
            setSuggestions(response.data);
        } catch (error) {
            console.error('Error fetching suggestions', error);
        }
    };

    const fetchRandomWord = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/random');
            setSearchTerm(response.data.word);
            handleSearch(response.data.word);
        } catch (error) {
            console.error('Error fetching random word', error);
        }
    };

    useEffect(() => {
        if (searchTerm) {
            fetchSuggestions(searchTerm);
        } else {
            setSuggestions([]);
        }
    }, [searchTerm]);

    return (
        <div>
            <header>
                <h1>Rook's Heptapod</h1>
                <nav>
                    <ul>
                        <li><a href="#">Home</a></li>
                        <li><a onClick={fetchRandomWord}>Random Word</a></li>
                    </ul>
                </nav>
            </header>
            <main>
                <div id="searchForm">
                    <input
                        type="text"
                        id="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Search for a word"
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setTimeout(() => setIsFocused(false), 100)}
                    />
                    <button onClick={() => handleSearch(searchTerm)}>Search</button>
                </div>
                {errorMessage && <p>{errorMessage}</p>}
                {isFocused && suggestions.length > 0 && (
                    <div id="suggestions">
                        {suggestions.map((suggestion) => (
                            <div key={suggestion.word} onClick={() => {
                                setSearchTerm(suggestion.word);
                                handleSearch(suggestion.word);
                            }}>
                                {suggestion.word}
                            </div>
                        ))}
                    </div>
                )}
                <div id="logogram_details">
                    {wordData.map((item) => (
                        <div key={item.definition_id} className="word_details_container">
                            <div className="logogram_container">
                                <img
                                    src={`data:image/png;base64,${item.logogram_base64}`}
                                    alt={item.word}
                                    className="logogram_picture"
                                    onClick={() => fetchComponents(item.definition_id)}
                                />
                            </div>
                            <div className="text_info_container">
                                <h2>{item.word} ({item.word_type})</h2>
                                <p>{item.definition}</p>
                                <p>"{item.example_sentence}"</p>
                                {showComponents[item.definition_id] && (
                                    <div className="components_container">
                                        {componentsData[item.definition_id]?.map((component) => (
                                            <div key={component.definition_id} className="component_item">
                                                <img
                                                    src={`data:image/png;base64,${component.logogram_base64}`}
                                                    alt={component.word}
                                                    className="logogram_picture"
                                                />
                                                <div class="component_text">
                                                    <h3>{component.word} ({component.word_type})</h3>
                                                    <p>{component.definition}</p>
                                                    <p>"{component.example_sentence}"</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            <footer>
                <p>&copy; 2024 Scia Rook Atamyanov. All rights reserved</p>
            </footer>
        </div>
    );
};

export default Dictionary;
