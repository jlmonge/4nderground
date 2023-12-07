import { unrestrictUserHelper } from '../../../service/unrestrictUserHelper';

export async function POST(req) {
    const res = await unrestrictUserHelper(req, 'ignore');
    return res;
}