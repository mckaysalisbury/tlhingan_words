const files = {
    "b": "01",
    "ch": "02",
    "D": "03",
    "gh": "04",
    "H": "05",
    "j": "06",
    "l": "07",
    "m": "08",
    "n": "09",
    "ng": "10",
    "p": "11",
    "q": "12",
    "Q": "13",
    "r": "14",
    "S": "15",
    "t": "16",
    "tlh": "17",
    "v": "18",
    "w": "19",
    "y": "20",
    "a": "21",
    "e": "22",
    "I": "23",
    "o": "24",
    "u": "25",
    "suffixes": "26",
    "extra": "27",
    "examples": "28",
    "footer": "29",
}

const words = {};
function parsePiece(documentContents) {
    // Even still, It should be this easy
    // const document = xhr.responseXML;
    // But they're not valid XML documents, so we need to make it work
    const parser = new DOMParser();
    const xml = parser.parseFromString(`<document>${documentContents}</document>`, "text/xml"); // So I have to wrap it
    return xml;
}

var filePromises = []

function allFilesAsync() {
    if (filePromises.length == 0) {
        filePromises = Object.entries(files).map(([letter, number]) => {
            const xhr = new XMLHttpRequest();
            return new Promise((resolve) => {
                xhr.onload = () => {
                    resolve(xhr.responseText)
                }

                xhr.onerror = () => {
                    alert("Error while getting XML.");
                };

                const number = files[letter];
                xhr.open("GET", `https://raw.githubusercontent.com/De7vID/klingon-assistant-data/master/mem-${number}-${letter}.xml`, true);
                // xhr.responseType = "document"; These aren't valid XML documents :(
                xhr.send();
            });
        })
    }
    return filePromises;
}

function allParsedFilesAsync() {
    return allFilesAsync().map(async (promise) => parsePiece(await promise))
}

function extractEntries(xml) {
    const tables = xml.getElementsByTagName("table");
    const columnsWeCareAbout = ['entry_name', 'definition', 'part_of_speech']
    // return Array.from(tables).map((table) => {
    return Array.prototype.map.call(tables, (table) => {
        const columns = table.getElementsByTagName("column");
        const object = {};
        for (const column of columns) {
            const name = column.getAttribute("name");
            if (columnsWeCareAbout.includes(name)) {
                object[name] = column.innerHTML;
            }
            // if (columnsWeCareAbout.every((column) => column in object)) { // optimization?
            //     break;
            // }
        }
        return object;
    });
}

async function allEntriesAsync() {
    return (await Promise.all(allParsedFilesAsync())).map(extractEntries).flat();
}

let _dictionary = null;

async function dictionaryAsync() {
    if (_dictionary === null) {
        const entries = await allEntriesAsync();
        console.log(entries.length, "entries")
        _dictionary = Object.fromEntries(entries.map((entry) => [entry.entry_name, entry]));
    }
    return _dictionary;
}
