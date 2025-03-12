// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded');
    
    // DOM Elements
    const homeScreen = document.getElementById('home-screen');
    const instructionsScreen = document.getElementById('instructions-screen');
    const gameScreen = document.getElementById('game-screen');
    const subjectCards = document.querySelectorAll('.subject-card');
    const instructionsBtn = document.getElementById('instructions-btn');
    const backToHomeBtn = document.getElementById('back-to-home');
    const backBtn = document.getElementById('back-btn');
    const backToSubjectsBtn = document.getElementById('back-to-subjects');
    const currentSubjectEl = document.getElementById('current-subject');
    const gameBoard = document.getElementById('game-board');
    const keyboard = document.getElementById('keyboard');
    const messageContainer = document.getElementById('message-container');
    const gameMessage = document.getElementById('game-message');
    const resultMessage = document.getElementById('result-message');
    const correctWordEl = document.getElementById('correct-word');
    const playAgainBtn = document.getElementById('play-again');
    const returnHomeBtn = document.getElementById('return-home');
    const subjectTitle = document.getElementById('subject-title');
    const currentCategory = document.getElementById('current-category');
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    
    console.log('Elements found:', {
        homeScreen: !!homeScreen,
        instructionsScreen: !!instructionsScreen,
        gameScreen: !!gameScreen,
        subjectCards: subjectCards.length,
        instructionsBtn: !!instructionsBtn,
        backToHomeBtn: !!backToHomeBtn,
        backBtn: !!backBtn,
        backToSubjectsBtn: !!backToSubjectsBtn,
        themeToggle: !!themeToggle
    });
    
    // Game state
    let currentSubject = 'General';
    let targetWord = 'APPLE'; // Default word for testing
    let currentRow = 0;
    let currentTile = 0;
    let isGameOver = false;
    let guesses = [];
    
    // Theme Toggle
    function initTheme() {
        // Check for saved theme
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    }
    
    function updateThemeIcon(theme) {
        if (themeIcon) {
            themeIcon.textContent = theme === 'dark' ? 'light_mode' : 'dark_mode';
        }
    }
    
    // Initialize theme
    initTheme();
    
    // Toggle theme
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            console.log('Theme toggle clicked');
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            updateThemeIcon(newTheme);
        });
    }
    
    // Add event listeners
    if (instructionsBtn) {
        instructionsBtn.addEventListener('click', function() {
            console.log('Instructions button clicked');
            showInstructions();
        });
    }
    
    if (backToHomeBtn) {
        backToHomeBtn.addEventListener('click', function() {
            console.log('Back to home button clicked');
            showHome();
        });
    }
    
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            console.log('Back button clicked');
            showHome();
        });
    }
    
    if (backToSubjectsBtn) {
        backToSubjectsBtn.addEventListener('click', function() {
            console.log('Back to subjects button clicked');
            showHome();
        });
    }
    
    if (playAgainBtn) {
        playAgainBtn.addEventListener('click', function() {
            console.log('Play again button clicked');
            resetGame();
        });
    }
    
    if (returnHomeBtn) {
        returnHomeBtn.addEventListener('click', function() {
            console.log('Return home button clicked');
            showHome();
        });
    }
    
    // Add event listeners to subject cards
    subjectCards.forEach(function(card) {
        console.log('Adding click listener to subject card:', card.getAttribute('data-subject'));
        card.addEventListener('click', function() {
            const subject = this.getAttribute('data-subject');
            console.log('Subject card clicked:', subject);
            currentSubject = subject;
            startGame(subject);
        });
    });
    
    // Add keyboard event listener for desktop
    document.addEventListener('keydown', function(e) {
        handleKeyPress(e);
    });
    
    // Check if user has played today
    checkDailyPlayed();
    
    // Show instructions screen
    function showInstructions() {
        homeScreen.classList.remove('active');
        instructionsScreen.classList.add('active');
        gameScreen.classList.remove('active');
        
        // Show header when viewing instructions
        const header = document.querySelector('header');
        if (header) {
            header.style.display = '';
        }
    }
    
    // Show home screen
    function showHome() {
        homeScreen.classList.add('active');
        instructionsScreen.classList.remove('active');
        gameScreen.classList.remove('active');
        if (gameMessage) gameMessage.classList.remove('active');
        
        // Show header when returning to home
        const header = document.querySelector('header');
        if (header) {
            header.style.display = '';
        }
        
        // Check if user has played today
        checkDailyPlayed();
    }
    
    // Check if user has played today for each subject
    function checkDailyPlayed() {
        const today = new Date().toISOString().split('T')[0];
        
        subjectCards.forEach(function(card) {
            const subject = card.getAttribute('data-subject');
            const lastPlayed = localStorage.getItem(`lastPlayed_${subject}`);
            
            // Remove any existing badges
            const existingBadge = card.querySelector('.completed-badge');
            if (existingBadge) {
                card.removeChild(existingBadge);
            }
            
            if (lastPlayed === today) {
                const completedEl = document.createElement('div');
                completedEl.classList.add('completed-badge');
                completedEl.innerHTML = '<i class="fas fa-check-circle"></i>';
                card.appendChild(completedEl);
            }
        });
    }
    
    // Start the game with selected subject
    function startGame(subject) {
        console.log('Starting game with subject:', subject);
        
        // Reset game state
        currentRow = 0;
        currentTile = 0;
        isGameOver = false;
        guesses = [];
        
        // Clear game board and keyboard
        if (gameBoard) gameBoard.innerHTML = '';
        if (keyboard) keyboard.innerHTML = '';
        if (messageContainer) messageContainer.textContent = '';
        
        // Hide game message
        if (gameMessage) gameMessage.classList.remove('active');
        
        // Set current subject
        currentSubject = subject;
        if (currentSubjectEl) currentSubjectEl.textContent = subject.charAt(0).toUpperCase() + subject.slice(1);
        if (subjectTitle) subjectTitle.textContent = subject.charAt(0).toUpperCase() + subject.slice(1) + " Revision";
        if (currentCategory) currentCategory.textContent = subject.charAt(0).toUpperCase() + subject.slice(1);
        
        // Get word of the day for this subject (using a default for now)
        targetWord = getWordOfTheDay(subject);
        console.log(`Target word: ${targetWord}`); // For debugging
        
        // Show game screen
        homeScreen.classList.remove('active');
        instructionsScreen.classList.remove('active');
        gameScreen.classList.add('active');
        
        // Hide header when game screen is active
        const header = document.querySelector('header');
        if (header) {
            header.style.display = 'none';
        }
        
        // Create game board
        createGameBoard();
        
        // Create keyboard
        createKeyboard();
    }
    
    // Create the game board
    function createGameBoard() {
        if (!gameBoard) return;
        
        gameBoard.innerHTML = '';
        
        for (let i = 0; i < 6; i++) {
            const row = document.createElement('div');
            row.classList.add('board-row');
            if (i === 0) row.classList.add('current');
            
            for (let j = 0; j < 5; j++) {
                const tile = document.createElement('div');
                tile.classList.add('tile');
                tile.dataset.row = i;
                tile.dataset.col = j;
                tile.dataset.letter = '';
                row.appendChild(tile);
            }
            
            gameBoard.appendChild(row);
        }
    }
    
    // Create the on-screen keyboard
    function createKeyboard() {
        if (!keyboard) return;
        
        keyboard.innerHTML = '';
        
        const keyLayout = [
            ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
            ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
            ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Backspace']
        ];
        
        keyLayout.forEach(row => {
            const keyboardRow = document.createElement('div');
            keyboardRow.classList.add('keyboard-row');
            
            row.forEach(key => {
                const keyButton = document.createElement('button');
                keyButton.classList.add('key');
                
                if (key === 'Enter') {
                    keyButton.classList.add('key-wide');
                    keyButton.textContent = 'Enter';
                } else if (key === 'Backspace') {
                    keyButton.classList.add('key-wide');
                    keyButton.innerHTML = '<span class="material-symbols-outlined">backspace</span>';
                } else {
                    keyButton.textContent = key;
                }
                
                keyButton.dataset.key = key.toLowerCase();
                keyButton.addEventListener('click', () => handleKeyClick(key));
                keyboardRow.appendChild(keyButton);
            });
            
            keyboard.appendChild(keyboardRow);
        });
    }
    
    // Handle keyboard clicks
    function handleKeyClick(key) {
        if (isGameOver) return;
        
        if (key === 'Backspace') {
            deleteLetter();
        } else if (key === 'Enter') {
            submitGuess();
        } else if (/^[A-Za-z]$/.test(key)) {
            addLetter(key);
        }
    }
    
    // Handle keyboard presses
    function handleKeyPress(event) {
        if (isGameOver) return;
        
        const key = event.key;
        
        if (key === 'Backspace' || key === 'Delete') {
            deleteLetter();
        } else if (key === 'Enter') {
            submitGuess();
        } else if (/^[A-Za-z]$/.test(key)) {
            addLetter(key);
        }
    }
    
    // Add a letter to the current tile
    function addLetter(letter) {
        if (currentTile < 5) {
            const tile = document.querySelector(`.tile[data-row="${currentRow}"][data-col="${currentTile}"]`);
            if (tile) {
                tile.textContent = letter.toUpperCase();
                tile.dataset.letter = letter.toUpperCase();
                tile.classList.add('active');
                
                currentTile++;
                
                // Highlight next tile if not at the end of the row
                if (currentTile < 5) {
                    const nextTile = document.querySelector(`.tile[data-row="${currentRow}"][data-col="${currentTile}"]`);
                    if (nextTile) {
                        nextTile.classList.add('active');
                    }
                }
                
                // Remove highlight from previous tile
                if (currentTile > 0) {
                    const prevTile = document.querySelector(`.tile[data-row="${currentRow}"][data-col="${currentTile - 1}"]`);
                    if (prevTile) {
                        prevTile.classList.remove('active');
                    }
                }
            }
        }
    }
    
    // Delete the last letter
    function deleteLetter() {
        if (currentTile > 0) {
            currentTile--;
            
            const tile = document.querySelector(`.tile[data-row="${currentRow}"][data-col="${currentTile}"]`);
            if (tile) {
                tile.textContent = '';
                tile.dataset.letter = '';
                
                // Remove highlight from next tile
                const nextTile = document.querySelector(`.tile[data-row="${currentRow}"][data-col="${currentTile + 1}"]`);
                if (nextTile) {
                    nextTile.classList.remove('active');
                }
                
                // Add highlight to current tile
                tile.classList.add('active');
            }
        }
    }
    
    // Show a message
    function showMessage(text) {
        const messageElement = document.getElementById('message');
        if (messageElement) {
            messageElement.textContent = text;
            messageElement.classList.add('show');
            
            setTimeout(() => {
                messageElement.classList.remove('show');
            }, 2000);
        } else if (messageContainer) {
            messageContainer.textContent = text;
            messageContainer.style.opacity = '1';
            
            setTimeout(function() {
                messageContainer.style.opacity = '0';
                setTimeout(function() {
                    messageContainer.textContent = '';
                    messageContainer.style.opacity = '1';
                }, 300);
            }, 2000);
        }
    }
    
    // Word validation function
    async function isValidWord(word) {
        // Basic check - is it 5 letters?
        if (word.length !== 5) return false;
        
        // Get subject-specific words
        const subjectWords = {
            'maths': ['GRAPH', 'PRIME', 'ANGLE', 'DIGIT', 'RATIO'],
            'english': ['NOVEL', 'PROSE', 'VERSE', 'THEME', 'QUOTE'],
            'geography': ['GLOBE', 'DELTA', 'COAST', 'RIVER', 'OCEAN'],
            'history': ['KINGS', 'DATES', 'REIGN', 'CIVIL', 'WORLD'],
            'ict': ['PIXEL', 'CACHE', 'LOGIC', 'ARRAY', 'QUERY']
        };
        
        // Check if the word is a subject-specific word
        const allSubjectWords = Object.values(subjectWords).flat();
        if (allSubjectWords.includes(word.toUpperCase())) {
            return true;
        }
        
        // Check against a dictionary API
        try {
            const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`);
            
            // If the response is ok, the word exists
            return response.ok;
        } catch (error) {
            console.error('Error checking word validity:', error);
            
            // Fallback to a basic check if the API fails
            // This is a very basic list of common 5-letter words
            const commonWords = [
                'apple', 'about', 'above', 'abuse', 'actor', 'adapt', 'admit', 'adopt', 'after', 'again',
                'agent', 'agree', 'ahead', 'alarm', 'album', 'alert', 'alike', 'alive', 'allow', 'alone',
                'along', 'alter', 'among', 'anger', 'angle', 'angry', 'apart', 'apple', 'apply', 'arena',
                'argue', 'arise', 'array', 'aside', 'asset', 'avoid', 'award', 'aware', 'awful', 'basic',
                'basis', 'beach', 'begin', 'being', 'below', 'bench', 'birth', 'black', 'blame', 'blank',
                'blast', 'bleed', 'blend', 'bless', 'blind', 'block', 'blood', 'board', 'boost', 'booth',
                'bound', 'brain', 'brand', 'brave', 'bread', 'break', 'breed', 'brief', 'bring', 'broad',
                'brown', 'build', 'built', 'buyer', 'cable', 'calif', 'carry', 'catch', 'cause', 'chain',
                'chair', 'chart', 'chase', 'cheap', 'check', 'chest', 'chief', 'child', 'china', 'chose',
                'civil', 'claim', 'class', 'clean', 'clear', 'click', 'clock', 'close', 'coach', 'coast',
                'could', 'count', 'court', 'cover', 'craft', 'crash', 'cream', 'crime', 'cross', 'crowd',
                'crown', 'curve', 'cycle', 'daily', 'dance', 'dated', 'dealt', 'death', 'debut', 'delay',
                'depth', 'doing', 'doubt', 'dozen', 'draft', 'drama', 'drawn', 'dream', 'dress', 'drill',
                'drink', 'drive', 'drove', 'dying', 'eager', 'early', 'earth', 'eight', 'elite', 'empty',
                'enemy', 'enjoy', 'enter', 'entry', 'equal', 'error', 'event', 'every', 'exact', 'exist',
                'extra', 'faith', 'false', 'fault', 'fiber', 'field', 'fifth', 'fifty', 'fight', 'final',
                'first', 'fixed', 'flash', 'fleet', 'floor', 'fluid', 'focus', 'force', 'forth', 'forty',
                'forum', 'found', 'frame', 'frank', 'fraud', 'fresh', 'front', 'fruit', 'fully', 'funny',
                'giant', 'given', 'glass', 'globe', 'going', 'grace', 'grade', 'grand', 'grant', 'grass',
                'great', 'green', 'gross', 'group', 'grown', 'guard', 'guess', 'guest', 'guide', 'happy',
                'harry', 'heart', 'heavy', 'hence', 'henry', 'horse', 'hotel', 'house', 'human', 'ideal',
                'image', 'index', 'inner', 'input', 'issue', 'japan', 'jimmy', 'joint', 'jones', 'judge',
                'known', 'label', 'large', 'laser', 'later', 'laugh', 'layer', 'learn', 'lease', 'least',
                'leave', 'legal', 'level', 'lewis', 'light', 'limit', 'links', 'lives', 'local', 'logic',
                'loose', 'lower', 'lucky', 'lunch', 'lying', 'magic', 'major', 'maker', 'march', 'maria',
                'match', 'maybe', 'mayor', 'meant', 'media', 'metal', 'might', 'minor', 'minus', 'mixed',
                'model', 'money', 'month', 'moral', 'motor', 'mount', 'mouse', 'mouth', 'movie', 'music',
                'needs', 'never', 'newly', 'night', 'noise', 'north', 'noted', 'novel', 'nurse', 'occur',
                'ocean', 'offer', 'often', 'order', 'other', 'ought', 'paint', 'panel', 'paper', 'party',
                'peace', 'peter', 'phase', 'phone', 'photo', 'piece', 'pilot', 'pitch', 'place', 'plain',
                'plane', 'plant', 'plate', 'point', 'pound', 'power', 'press', 'price', 'pride', 'prime',
                'print', 'prior', 'prize', 'proof', 'proud', 'prove', 'queen', 'quick', 'quiet', 'quite',
                'radio', 'raise', 'range', 'rapid', 'ratio', 'reach', 'ready', 'refer', 'right', 'rival',
                'river', 'robin', 'roger', 'roman', 'rough', 'round', 'route', 'royal', 'rural', 'scale',
                'scene', 'scope', 'score', 'sense', 'serve', 'seven', 'shall', 'shape', 'share', 'sharp',
                'sheet', 'shelf', 'shell', 'shift', 'shirt', 'shock', 'shoot', 'short', 'shown', 'sight',
                'since', 'sixth', 'sixty', 'sized', 'skill', 'sleep', 'slide', 'small', 'smart', 'smile',
                'smith', 'smoke', 'solid', 'solve', 'sorry', 'sound', 'south', 'space', 'spare', 'speak',
                'speed', 'spend', 'spent', 'split', 'spoke', 'sport', 'staff', 'stage', 'stake', 'stand',
                'start', 'state', 'steam', 'steel', 'stick', 'still', 'stock', 'stone', 'stood', 'store',
                'storm', 'story', 'strip', 'stuck', 'study', 'stuff', 'style', 'sugar', 'suite', 'super',
                'sweet', 'table', 'taken', 'taste', 'taxes', 'teach', 'teeth', 'terry', 'texas', 'thank',
                'theft', 'their', 'theme', 'there', 'these', 'thick', 'thing', 'think', 'third', 'those',
                'three', 'threw', 'throw', 'tight', 'times', 'tired', 'title', 'today', 'topic', 'total',
                'touch', 'tough', 'tower', 'track', 'trade', 'train', 'treat', 'trend', 'trial', 'tried',
                'tries', 'truck', 'truly', 'trust', 'truth', 'twice', 'under', 'undue', 'union', 'unity',
                'until', 'upper', 'upset', 'urban', 'usage', 'usual', 'valid', 'value', 'video', 'virus',
                'visit', 'vital', 'voice', 'waste', 'watch', 'water', 'wheel', 'where', 'which', 'while',
                'white', 'whole', 'whose', 'woman', 'women', 'world', 'worry', 'worse', 'worst', 'worth',
                'would', 'wound', 'write', 'wrong', 'wrote', 'yield', 'young', 'youth'
            ];
            
            // Check if the word is in our fallback list
            return commonWords.includes(word.toLowerCase());
        }
    }
    
    // Modified submitGuess function to check real words
    async function submitGuess() {
        if (!gameBoard) return;
        
        const currentRowElement = document.querySelector('.board-row.current');
        if (!currentRowElement) return;
        
        const tileCells = currentRowElement.querySelectorAll('.tile');
        
        // Get current guess
        let guess = '';
        for (let i = 0; i < tileCells.length; i++) {
            guess += tileCells[i].textContent || '';
        }
        
        // Check if guess has 5 letters
        if (guess.length !== 5) {
            showMessage('Not enough letters');
            shakeTiles(currentRowElement);
            return;
        }
        
        // Validate against dictionary
        const isValid = await isValidWord(guess);
        if (!isValid) {
            showMessage('Not in word list');
            shakeTiles(currentRowElement);
            return;
        }
        
        // Reveal tiles with delay
        const guessArray = guess.split('');
        const letterStates = determineLetterStates(guessArray, targetWord);
        
        // Animate tiles
        for (let i = 0; i < tileCells.length; i++) {
            setTimeout(() => {
                // Set appropriate class before flipping
                tileCells[i].dataset.state = letterStates[i].state;
                tileCells[i].dataset.letter = guessArray[i];
                // Start the flip animation
                tileCells[i].classList.add('flip');
                
                // Update keyboard key colors
                const key = document.querySelector(`.key[data-key="${guessArray[i].toLowerCase()}"]`);
                if (key) updateKeyState(key, letterStates[i].state);
                
                // Check win condition after the last tile is revealed
                if (i === tileCells.length - 1) {
                    setTimeout(() => {
                        if (guess === targetWord) {
                            celebrateWin();
                            endGame(true);
                        } else {
                            // Move to next row or end game
                            currentRowElement.classList.remove('current');
                            const nextRow = currentRowElement.nextElementSibling;
                            
                            if (nextRow) {
                                nextRow.classList.add('current');
                                currentRow++;
                                currentTile = 0;
                            } else {
                                showMessage(`Game over! The word was ${targetWord}`);
                                endGame(false);
                            }
                        }
                    }, 600);
                }
            }, i * 300);
        }
    }
    
    // Function to determine letter states for a guess
    function determineLetterStates(guessArray, targetWord) {
        const targetArray = targetWord.split('');
        const states = Array(5).fill({ letter: '', state: 'absent' });
        
        // Mark correct letters first
        for (let i = 0; i < guessArray.length; i++) {
            const letter = guessArray[i].toUpperCase();
            states[i] = { letter, state: 'absent' };
            
            if (letter === targetArray[i]) {
                states[i].state = 'correct';
                targetArray[i] = '#'; // Mark as used
            }
        }
        
        // Mark present letters
        for (let i = 0; i < guessArray.length; i++) {
            if (states[i].state === 'correct') continue;
            
            const letter = guessArray[i].toUpperCase();
            const remainingIndex = targetArray.indexOf(letter);
            
            if (remainingIndex !== -1) {
                states[i].state = 'present';
                targetArray[remainingIndex] = '#'; // Mark as used
            }
        }
        
        return states;
    }
    
    // Update keyboard key state
    function updateKeyState(keyElement, state) {
        // Only update to a "higher" state
        const stateHierarchy = ['absent', 'present', 'correct'];
        const currentState = keyElement.dataset.state || '';
        const currentStateRank = stateHierarchy.indexOf(currentState);
        const newStateRank = stateHierarchy.indexOf(state);
        
        if (newStateRank > currentStateRank) {
            keyElement.dataset.state = state;
            keyElement.className = `key ${state}`;
        }
    }
    
    // Shake tiles animation
    function shakeTiles(row) {
        row.classList.add('shake');
        setTimeout(() => {
            row.classList.remove('shake');
        }, 500);
    }
    
    // Celebrate a win with animations
    function celebrateWin() {
        // Add celebration animations to the row
        const rowTiles = document.querySelectorAll(`.tile[data-row="${currentRow}"]`);
        
        // Delay the start of the dancing animation to allow the flip to complete
        setTimeout(function() {
            rowTiles.forEach(function(tile, i) {
                // Apply a staggered animation
                setTimeout(function() {
                    tile.classList.add('win-animation');
                    
                    // Remove the animation class after it's done
                    setTimeout(function() {
                        tile.classList.remove('win-animation');
                    }, 1500);
                }, i * 100);
            });
            
            // Show a congratulatory message
            showMessage('Great job!');
        }, 1500);
    }
    
    // End the game
    function endGame(isWin) {
        isGameOver = true;
        
        // Mark this subject as played today
        const today = new Date().toISOString().split('T')[0];
        localStorage.setItem(`lastPlayed_${currentSubject}`, today);
        
        // Show game message
        if (gameMessage && resultMessage && correctWordEl) {
            if (isWin) {
                resultMessage.textContent = 'You won!';
                resultMessage.style.color = 'var(--correct-color)';
            } else {
                resultMessage.textContent = 'Better luck next time!';
                resultMessage.style.color = 'var(--primary-color)';
            }
            
            correctWordEl.textContent = `The word was: ${targetWord}`;
            
            // Delay showing the message to allow for animations
            setTimeout(function() {
                gameMessage.classList.add('active');
            }, isWin ? 3000 : 1500); // Longer delay for wins to allow for celebration animations
        }
    }
    
    // Reset the game
    function resetGame() {
        if (currentSubject) {
            startGame(currentSubject);
        }
    }
    
    // Get word of the day (placeholder function)
    function getWordOfTheDay(subject) {
        // This would normally fetch from a database or API
        const words = {
            'maths': 'GRAPH',
            'english': 'NOVEL',
            'geography': 'GLOBE',
            'history': 'KINGS',
            'ict': 'PIXEL'
        };
        
        return words[subject] || 'APPLE';
    }
});