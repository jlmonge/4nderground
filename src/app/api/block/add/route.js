import { restrictUserHelper } from '../../../service/restrictUserHelper';

export async function POST(req) {
    const res = await restrictUserHelper(req, 'block');
    return res;
}