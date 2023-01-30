/**
 * Check if input string matches exactly with pattern
 * @param regex regex pattern 
 * @param input input test
 * @returns boolean
 */
function isExactMatch(regex: RegExp, input: string): boolean {
    const matchText = input.match(regex);
    return ((matchText) ? matchText[0] : "").length === input.length;
}

function isValidURL(input: string): boolean {
    var regex = /^https?:\/\/\w+(\.\w+)*(:[0-9]+)?\/?(\/[.\-\w]*)*$/ig; // URL checker
    return isExactMatch(regex, input);
}

export {
    isExactMatch,
    isValidURL
}