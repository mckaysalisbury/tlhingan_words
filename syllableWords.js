const syllableWords = []

//      <consonant><vowel> |
//      <consonant><vowel><consonant> |
//      <consonant><vowel>"w" "'" |
//      <consonant><vowel>"y" "'" |
//      <consonant><vowel>"r" "gh"

// But not "ow" or "uw"

function* twoCharacterWords() {
    for (const consonant of consonants) {
        for (const vowel of vowels) {
            yield consonant + vowel;
        }
    }
}

function* threeCharacterWords() {
    for (const leadingConsonant of consonants) {
        for (const vowel of vowels) {
            for (const closingConsonant of consonants) {
                if (isValidCombination(vowel, closingConsonant)) {
                    yield leadingConsonant + vowel + closingConsonant;
                }
            }
        }
    }
}

function* fourCharacterWords() {
    for (const piece of extraPieces) {
        for (const word of twoCharacterWords()) {
            if (isValidCombination(word, piece)) {
                yield word + piece;
            }
        }
    }
}

function allPossibleSyllableWords() {
    if (syllableWords.length == 0) {
        syllableWords.push(...twoCharacterWords(), ...threeCharacterWords(), ...fourCharacterWords())
    }
    return syllableWords
}
