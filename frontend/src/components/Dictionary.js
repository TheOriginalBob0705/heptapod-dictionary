import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dictionary = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [wordData, setWordData] = useState([]);

    // State to hold components data for each definition
    const [componentsData, setComponentsData] = useState({});
    // State to manage whether to show components for each definition
    const [showComponents, setShowComponents] = useState({});

    // Function to handle search and fetch word data
    const handleSearch = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/logograms/${searchTerm}`);
            setWordData(response.data);
        } catch (error) {
            console.error('Error fetching data', error);
        }
    };

    // Function to fetch components for a specific definition
    const fetchComponents = async (definitionId) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/components/${definitionId}`);
            // Update componentsData with fetched components for the specific definitionId
            setComponentsData(prevState => ({ ...prevState, [definitionId]: response.data }));
            // Toggle showComponents flag for the specific definitionId
            setShowComponents(prevState => ({ ...prevState, [definitionId]: !prevState[definitionId] }));
        } catch (error) {
            console.error('Error fetching components', error);
        }
    };

    return (
        <div>
            <header>
                <h1>Rook's Heptapod</h1>
                <nav>
                    <ul>
                        <li><a href="#">Home</a></li>
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
                        placeholder="Search for a word"
                    />
                    <button onClick={handleSearch}>Search</button>
                </div>
                <div id="logogram_details">
                    {wordData.map((item) => (
                        <div key={item.definition_id} className="word_details_container">
                            <div className="logogram_container">
                                <img
                                    src={`data:image/png;base64,${item.logogram_base64}`}
                                    className="logogram_picture"
                                    onClick={() => fetchComponents(item.definition_id)}
                                />
                            </div>
                            <div className="text_info_container">
                                <h2>{item.definition}</h2>
                                <p>"{item.example_sentence}"</p>
                                {showComponents[item.definition_id] && (
                                    <div className="components_container">
                                        {componentsData[item.definition_id]?.map((component) => (
                                            <div key={component.definition_id} className="component_item">
                                                <img
                                                    src={`data:image/png;base64,${component.logogram_base64}`}
                                                    className="logogram_picture"
                                                />
                                                <h3>{component.word}</h3>
                                                <p>{component.definition}</p>
                                                <p>"{component.example_sentence}"</p>
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
