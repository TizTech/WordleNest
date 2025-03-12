// Word lists for each subject
console.log('Words.js loaded');

const WORDS = {
    maths: [
        "angle", "graph", "slope", "prime", "ratio",
        "digit", "cubed", "power", "acute", "array",
        "chord", "conic", "curve", "euler", "field",
        "group", "hyper", "index", "limit", "logic",
        "modal", "nodes", "order", "plane", "proof"
    ],
    english: [
        "metre", "sonnet", "rhyme", "prose", "verse",
        "adage", "adlib", "affix", "agent", "alias",
        "alloy", "amble", "amend", "anode", "antic",
        "apron", "ardor", "argot", "arras", "arrow",
        "ashen", "askew", "assay", "atoll", "atone"
    ],
    geography: [
        "globe", "atlas", "delta", "fjord", "isles",
        "basin", "beach", "bluff", "canal", "capes",
        "cliff", "coast", "crust", "dunes", "earth",
        "fault", "flats", "flood", "hills", "inlet",
        "karst", "lakes", "lapse", "loess", "marsh"
    ],
    history: [
        "roman", "medal", "epoch", "relic", "treaty",
        "abbey", "abyss", "adept", "adore", "aegis",
        "aerie", "afore", "agora", "aisle", "alarm",
        "album", "alert", "algae", "alibi", "align",
        "allay", "alley", "allot", "allow", "alloy"
    ],
    ict: [
        "email", "pixel", "cache", "virus", "query",
        "array", "ascii", "bites", "blogs", "bytes",
        "cloud", "codec", "cores", "cyber", "debug",
        "files", "flash", "frame", "hacks", "hosts",
        "https", "icons", "input", "intel", "laser"
    ]
};

// Dictionary of all valid 5-letter words for checking guesses
const DICTIONARY = [
    // This would be a much larger list of all valid 5-letter words
    // For simplicity, we'll just use our subject words as the dictionary
    ...WORDS.maths,
    ...WORDS.english,
    ...WORDS.geography,
    ...WORDS.history,
    ...WORDS.ict
];

// Function to get a word for a specific subject based on the date
function getWordOfTheDay(subject) {
    console.log('Getting word of the day for:', subject);
    
    // Check if subject exists
    if (!WORDS[subject]) {
        console.error('Subject not found:', subject);
        return 'error';
    }
    
    // Get today's date in YYYY-MM-DD format
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];
    console.log('Date string:', dateString);
    
    // Create a seed based on the date and subject
    const seed = dateString + subject;
    
    // Simple hash function to get a consistent index
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = ((hash << 5) - hash) + seed.charCodeAt(i);
        hash = hash & hash; // Convert to 32bit integer
    }
    
    // Get a word from the subject's list using the hash
    const subjectWords = WORDS[subject];
    const index = Math.abs(hash) % subjectWords.length;
    
    console.log('Selected word index:', index);
    return subjectWords[index];
}

// Function to check if a word is valid
function isValidWord(word) {
    // Check if the word is exactly 5 letters long and contains only alphabetic characters
    return word && word.length === 5 && /^[a-z]+$/.test(word.toLowerCase());
    
    // If you want to revert to dictionary checking, use this instead:
    // return DICTIONARY.includes(word.toLowerCase());
}

// Make sure these functions are globally available
window.getWordOfTheDay = getWordOfTheDay;
window.isValidWord = isValidWord;
window.WORDS = WORDS;
window.DICTIONARY = DICTIONARY;

console.log('Words.js fully loaded'); 