export const makeTable = (table: { [key: string]: any; }) => {
    let longestKeyLength = Math.max(...Object.keys(table).map(s => s.length as number));
    let tableString = '';
    for (let key in table) {
        let value = table[key];
        let padding = "  ";
        for (let i=0;i<longestKeyLength-key.length;i++) {
            padding += " ";
        }
        tableString += `${key}:${padding}${value}\n`;
    } 
    return tableString;
}

export const formatString = (string: string, obj: { [key: string]: any; }): string => {
    for (let key in obj) {
        let value = obj[key];
        string = string.replace(new RegExp(`{${key}}`, "g"), value);
    }
    return string;
}