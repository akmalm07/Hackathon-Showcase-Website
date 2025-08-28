const natural = require('natural')

function getClosestWord(dictionary, word, maxDistance = 3) {
    let closest = null;
    let minDistance = Infinity;

    for (const curr of dictionary) {
        const distance = natural.LevenshteinDistance(String(curr || ""), String(word || ""));
        if (distance < minDistance) {
            minDistance = distance;
            closest = curr;
        }
    }

    if (minDistance > maxDistance) {
        return null;
    }

    return closest;
}

function getClosestWordIndex(dictionary, word, maxDistance = 3) {

    if (!dictionary || dictionary.length === 0) 
        return null;

    let closestIndex = -1;
    let minDistance = Infinity;

    dictionary.forEach((curr, i) => {
        const distance = natural.LevenshteinDistance(String(curr || ""), String(word || ""));
        if (distance < minDistance) {
            minDistance = distance;
            closestIndex = i;
        }
    });

    // If the closest word is too far, return null
    if (minDistance > maxDistance) {
        return null;
    }

    return closestIndex;
}

//Tests:
    // const dictionary = ["Hello"];
    // console.log(getClosestWordIndex(dictionary, "Hello")); // 0


module.exports = { getClosestWord, getClosestWordIndex };
