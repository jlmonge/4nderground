import { unrestrictUserHelper } from '../../../service/unrestrictUserHelper';

export async function POST(req) {
    console.log("calling helper!!")
    const res = await unrestrictUserHelper(req, 'block');
    return res;
}