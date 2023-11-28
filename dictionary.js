const counts = {};

function update_counter(counter) {
    // This is not thread safe, but it's good enough for what I need.
    counts[counter]++;
    console.log("Status", counts)
}

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
function parsePiece(xhr) {
    // Even still, It should be this easy
    // const document = xhr.responseXML;
    // But they're not valid XML documents, so we need to make it work
    const parser = new DOMParser();
    const xml = parser.parseFromString(`<document>${xhr.responseText}</document>`, "text/xml"); // So I have to wrap it
    return xml;
}

function processFiles() {
    counts.started = 0;
    counts.downloaded = 0;
    counts.processed = 0;
    const promises = [];
    for (const letter in files) {
        const xhr = new XMLHttpRequest();
        promises.push(new Promise((resolve) => {
            xhr.onload = () => {
                update_counter("downloaded");
                const xml = parsePiece(xhr);
                extractWords(xml);
                counts.words = Object.entries(words).length;
                update_counter("processed");
                resolve();
            };

            xhr.onerror = () => {
                alert("Error while getting XML.");
            };

            const number = files[letter];
            xhr.open("GET", `https://raw.githubusercontent.com/De7vID/klingon-assistant-data/master/mem-${number}-${letter}.xml`, true);
            update_counter("started");
            // xhr.responseType = "document"; These aren't valid XML documents :(
            xhr.send();
        }));
    }
    return Promise.all(promises).then(() => words)
}


function extractWords(xml) {
    const tables = xml.getElementsByTagName("table");
    for (const table of tables) {
        const columns = table.getElementsByTagName("column");
        let entry_name = null;
        let definition = null;
        for (column of columns) {
            const name = column.getAttribute("name");
            switch (name) {
                case "entry_name":
                    entry_name = column.getInnerHTML();
                    break;
                case "definition":
                    definition = column.getInnerHTML();
                    break;
                default:
                    // do nothing, we don't care about this
            }
            // if (entry_name && definition) { // optimization
            //     break;
            // }
        }
        words[entry_name] = definition;
    }
}
