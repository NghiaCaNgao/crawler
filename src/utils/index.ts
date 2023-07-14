/**
 * Check if the given string is a valid URL string
 * @param input 
 * @returns 
 */

function isValidURL(input: string): boolean {
    // URL pattern
    let regex = /^((http(s)?):\/\/)?([(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}|localhost|(\d{1,3}\.){3}\d{1,3})\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/ig;

    return input.search(regex) >= 0;
}

export {
    isValidURL
}