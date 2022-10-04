import express from 'express';
import axios from 'axios';

const searchString = 'cosplay convention';
const encodedString = encodeURI(searchString);
const domain = `http://google.com`;

const AXIOS_OPTIONS = {
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36',
    },
};


const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const output = await getConventionInfo();
        res.status(200).json(output)
    } catch(err) {
        next(err);
    }
});

export default router;