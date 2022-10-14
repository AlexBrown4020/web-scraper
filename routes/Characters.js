import express from 'express';
import axios from 'axios';
import cheerio from 'cheerio';

const encodedCharacter = encodeURI('most popular cosplay characters');
const characterURL = 'https://google.com';

const AXIOS_OPTIONS = {
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36',
    },
};


function getCharacterInfo() {
    return axios.get(`${characterURL}/search?q=${encodedCharacter}&hl=en@gl=us`, AXIOS_OPTIONS)
    .then(function ({ data }) {
        let $ = cheerio.load(data);

        const titles = [];
        const href = [];

        $('.ct5Ked').each((i, el) => {
            if (titles.length > 30) {
                return false
            }
            titles[i] = $(el).attr('data-entityname');
            href[i] = $(el).attr('href');
        });

        const result = [];
        for (let i = 0; i < titles.length; i++) {
            result[i] = {
                title: titles[i],
                href: href[i]
            };
        };
        return result;
    }); 
}

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const characters = await getCharacterInfo();
        res.status(200).json(characters)
    } catch(err) {
        next(err);
    }
});

export default router;