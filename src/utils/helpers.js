// Helper Functions
export const DAY_MS = 24 * 60 * 60 * 1000; // HR/DAY * MIN/HR * SEC/MIN * MS/S
export const MIN_MS = 60 * 1000;

export const getMinAgo = () => {
    let minAgo = Date.now() - MIN_MS; // no buffer; perhaps random?
    minAgo = new Date(minAgo).toISOString();
    return minAgo;
};

export const getDayAgo = () => {
    let dayAgo = Date.now() - DAY_MS + (5 * 60 * 1000); // 5 MIN BUFFER
    dayAgo = new Date(dayAgo).toISOString();
    return dayAgo;
    //when testing empty player
    // return new Date(Date.now()).toISOString();
};

export const varLog = (vObj) => {
    let name = Object.keys(vObj)[0];
    let value = vObj[name];
    console.log(`${name} (type ${typeof vObj}): ${JSON.stringify(value, null, 2)}`);
}

export const capitalizeFirstLetter = (s) => {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

export const getDate = (d) => {
    let date = new Date(d);
    return date.toISOString().split('T')[0];
}