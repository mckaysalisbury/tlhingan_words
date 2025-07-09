const vowels = ['a', 'e', 'I', 'o', 'u'];
const consonants = ['b', 'ch', 'D', 'gh', 'H', 'j', 'l', 'm', 'n', 'ng', 'p', 'q', 'Q', 'r', 'S', 't', 'tlh', 'v', 'w', 'y', "'"];
const extraPieces = ["w'", "y'", 'rgh'];
const invalidLetterCombinations = ['ow', 'uw']
const syllableTerminatingConsonantClusters = [""].concat(consonants, extraPieces);

function isValidCombination(word, piece) {
    for (const invalidLetterCombination of invalidLetterCombinations) {
        if (word.slice(-1) == invalidLetterCombination[0] && piece[0] == invalidLetterCombination[1]) {
            return false;
        }
    }
    return true;
}
