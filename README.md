# Music App

A simple music player app built with Node.js, Express, and a frontend audio player.

## Features
- List of available songs.
- Play songs directly in the browser.
- Stream audio files with range requests for efficient playback.

## How to Run
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd music-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Place your MP3 files in the `public/songs` directory.

4. Start the server:
   ```bash
   npm start
   ```

5. Open the app in your browser:
   ```
   http://localhost:3000
   ```

## Dependencies
- Express
- express-range

## File Structure
```
music-app/
├── public/
│   ├── index.html
│   ├── songs/
│   │   ├── song1.mp3
│   │   ├── song2.mp3
│   │   └── song3.mp3
├── app.js
├── package.json
├── README.md
```
