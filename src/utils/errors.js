import { ERR_ARRAY } from './constants';
import { NextResponse } from 'next/server';
// Uses a reason field instead of error. REASON MUST MATCH ANY ERRORS IN ERR_ARRAY!
export class UploadError extends Error {
    constructor(reason) {
        const eObj = ERR_ARRAY.find((e) => e.reason === reason)

        super("ERROR: " + eObj.message);
        this.name = "UploadError"; // overwrite default Error name to UploadError type
        this.status = eObj.status
        this.response = NextResponse.json({
            success: false,
            reason: reason,
            message: eObj.message
        }, {
            status: this.status
        })
    }
}