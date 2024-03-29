export const DEBUG = false;

// Numerical constants
const MB = 1_000_000;
const NUM_MB = 100 // TODO: must be 100MB (cloudflare limit) on deploy
export const MAX_SIZE = NUM_MB * MB;
export const MIN_DURATION = 1; // TODO: must be 15s on deploy
export const MAX_DURATION = 420; // TODO: must be 420s (7m)  on deploy
export const COMMENT_CHARS_MAX = 1024;
export const LINK_URL_CHARS_MAX = 512;
export const LINK_TEXT_CHARS_MAX = 64;

export const FILE_REQS = [{
    type: 'copyright',
    desc: 'Free of copyrighted material',
}, {
    type: 'type',
    desc: 'Audio',
}, {
    type: 'size',
    desc: `Under ${NUM_MB}MB`,
}, {
    type: 'duration',
    desc: `Between ${MIN_DURATION} seconds and ${MAX_DURATION / 60} minutes`
}];

export const REC_REQS = [{
    type: 'copyright',
    desc: 'Free of copyrighted material',
}, {
    type: 'duration',
    desc: `Between ${MIN_DURATION} seconds and ${MAX_DURATION / 60} minutes`,
}];

export const GENRES = Object.freeze({
    'all': 'All',
    'hip-hop': 'Hip-Hop',
    'rnb': 'R&B',
    'electronic': 'Electronic',
    'pop': 'Pop',
    'rock': 'Rock',
    // 'punk': 'Punk',
    // 'metal': 'Metal',
    'jazz': 'Jazz',
    'classical': 'Classical',
    'reggae': 'Reggae',
    'folk': 'Folk',
    'ambient': 'Ambient',
    // 'noise': 'Noise',
    'experimental': 'Experimental'
});

// Errors
// Status codes:https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
export const ERR_NO_FILE = Object.freeze({
    message: 'No file was uploaded.',
    reason: 'no-file',
    status: 400,
});
export const ERR_TOO_BIG = Object.freeze({
    message: `The file you tried to upload exceeds the file size limit of ${NUM_MB} MB.`,
    reason: 'too-big',
    status: 413,
});
export const ERR_NO_EXT = Object.freeze({
    message: `File has no extension.`,
    reason: 'no-ext',
    status: 400,
});
export const ERR_TOO_SHORT = Object.freeze({
    message: `The file you tried to upload is below the minimum duration of ${MIN_DURATION} seconds.`,
    reason: 'too-short',
    status: 400,
});
export const ERR_TOO_LONG = Object.freeze({
    message: `The file you tried to upload exceeds the maximum duration of ${MAX_DURATION} seconds.`,
    reason: 'too-long',
    status: 400,
});
export const ERR_NOT_AUDIO = Object.freeze({
    message: `Not an audio file.`,
    reason: 'not-audio',
    status: 415,
});
export const ERR_NOT_LOGGED_IN = Object.freeze({
    message: `You are not logged in.`,
    reason: 'not-logged-in',
    status: 401,
});
export const ERR_UPLOAD_COOLDOWN = Object.freeze({
    message: `You must wait 24 hours after the posting of your last track before posting again.`,
    reason: 'upload-cooldown',
    status: 403,
});

export const ERR_ARRAY = [
    ERR_NO_FILE,
    ERR_TOO_BIG,
    ERR_NO_EXT,
    ERR_TOO_SHORT,
    ERR_TOO_LONG,
    ERR_NOT_AUDIO,
    ERR_NOT_LOGGED_IN,
    ERR_UPLOAD_COOLDOWN,
];