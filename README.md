# Rook's Heptapod Dictionary

This is a web application that helps you translate phrases written in Rook's Heptapod, a 
writing system I created based on the logograms from Ted Chiang's novel "Story of Your Life" and the movie "Arrival". 
This project will also have (WIP) a system for me to add new words, definitions, logograms as well as their components.

I'm putting this repository out there for anyone interested in following along with the project.

## Features

- Search for a word
- View the logogram for that word, its English equivalent, the definition, and an example sentence
- Clicking on a logogram displays the set of component logograms that make up the entire symbol

## Setup and Installation

Follow these instructions to set up the project locally.

### Prerequisites

You will need a modern web browser to run this application.

### Installation

1. Clone the repo:
    ```sh
    git clone https://github.com/TheOriginalBob0705/heptapod-dictionary.git
    ```

2. Install NPM packages for both the frontend and backend:
    ```sh
    cd heptapod-dictionary
    cd frontend
    npm install
    cd ../backend
    npm install
    ```

3. Start the backend server:
   ```sh
   cd backend
   npm run server
   ```
   
4. Start the frontend:
   ```sh
   cd ../frontend
   npm start
   ```
   The frontend development server will start running on http://localhost:3000.

## Folder Structure

frontend/: Contains the React.js webapp code.

backend/: Contains the SQLite3 database server code.

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/someNewFeature`.
3. Make your changes and commit them: `git commit -m 'add some new feature'`.
4. Push to the branch: `git push origin feature/someNewFeature`.
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
