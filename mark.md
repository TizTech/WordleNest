RevisionNestle Project Documentation
Overview
RevisionNestle is a Wordle-inspired educational game designed to help students revise key concepts in a fun and interactive way. The game will focus on 5 subjects: Maths, English, Geography, History, and ICT. Each word to be guessed will be 5 letters long and related to one of these subjects. The site will be mobile-friendly and computer-friendly, with an on-screen keyboard for mobile devices to mimic the Wordle experience.

Features
Core Gameplay
Word Guessing:

Players guess a 5-letter word related to a selected subject.

Each guess must be a valid 5-letter word.

Feedback is provided after each guess:

Green: Correct letter in the correct position.

Yellow: Correct letter in the wrong position.

Gray: Letter not in the word.

Subject Selection:

Players can choose from 5 subjects: Maths, English, Geography, History, ICT.

Each subject has a predefined list of 5-letter words.

Daily Challenge:

A new word is available every day for each subject.

Players can play once per day per subject.

On-Screen Keyboard (Mobile):

Mobile users will use an on-screen keyboard instead of their device's keyboard.

The on-screen keyboard will update with feedback (green, yellow, gray) after each guess.

Responsive Design:

The site will be fully responsive and optimized for both mobile and desktop devices.

The layout will adjust dynamically to fit different screen sizes.

Design Requirements
Theme:

Playful yet modern design to appeal to school-aged students.

Use a color palette inspired by RevisionNest (e.g., blues, greens, and yellows).

Include subtle animations for feedback (e.g., tile flips, keyboard highlights).

Logo:

The logo should read "RevisionNestle" with a small tagline like "A fun way to revise!"

Fonts:

Use clean, readable fonts like Poppins or Roboto.

Headings should be bold and playful.

Icons:

Use Font Awesome or similar for icons (e.g., subject icons, help icon).

Technical Requirements
Frontend:

HTML5, CSS3, and JavaScript for the core functionality.

Use React.js or Vue.js for a dynamic and modern user interface.

Implement local storage to save progress (e.g., daily challenges completed).

Backend (Optional):

If tracking user progress is required, use a lightweight backend with Node.js and Express.

Store user data in a MongoDB or Firebase database.

Word Lists:

Create a JSON file for each subject with 5-letter words. Example:

json
Copy
{
  "maths": ["angle", "graph", "slope", "prime", "ratio"],
  "english": ["metre", "sonnet", "rhyme", "prose", "verse"],
  "geography": ["globe", "atlas", "delta", "fjord", "island"],
  "history": ["roman", "medal", "epoch", "relic", "treaty"],
  "ict": ["email", "pixel", "cache", "virus", "query"]
}
On-Screen Keyboard:

Create a custom keyboard component for mobile users.

Highlight keys based on feedback (green, yellow, gray).

Responsive Layout:

Use CSS Grid or Flexbox for the game grid and keyboard.

Ensure the game is playable on screens as small as 320px wide.

User Flow
Homepage:

Display the logo and a brief description of the game.

Include buttons to select a subject or view instructions.

Subject Selection:

Show 5 cards, each representing a subject (Maths, English, Geography, History, ICT).

Clicking a card starts the game for that subject.

Game Screen:

Display a 5x6 grid for guesses.

Show the on-screen keyboard (for mobile) or allow physical keyboard input (for desktop).

Provide feedback after each guess.

End of Game:

Display a message if the player wins or loses.

Show the correct word if the player loses.

Include a "Play Again" button or a link to return to the homepage.

Example JSON Structure for Words
json
Copy
{
  "maths": ["angle", "graph", "slope", "prime", "ratio"],
  "english": ["metre", "sonnet", "rhyme", "prose", "verse"],
  "geography": ["globe", "atlas", "delta", "fjord", "island"],
  "history": ["roman", "medal", "epoch", "relic", "treaty"],
  "ict": ["email", "pixel", "cache", "virus", "query"]
}
