import express from 'express';
import axios from 'axios';
import cheerio from 'cheerio';

const characterString = 'most popular cosplay characters';
const encodedCharacter = encodeURI(characterString);
const domain = `https://animecons.com/events/`;
const google = 'https://google.com'

const AXIOS_OPTIONS = {
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36',
    },
};

function getConventionInfo() {
    return axios.get(`${domain}`)
    .then(function ({ data }) {
        let $ = cheerio.load(data);

        const cons = [];

        $('#ConListTable > tbody > tr').each((i, el) => {
            cons[i] = $(el).text();
        });

        const result = [];
        for (let i = 0; i < cons.length; i++) {
            result[i] = {
                convention: cons[i],
            };
        };
        return result;
    }); 
}

function getCharacterInfo() {
    return axios.get(`${google}/search?q=${encodedCharacter}&hl=en@gl=us`, AXIOS_OPTIONS)
    .then(function ({ data }) {
        let $ = cheerio.load(data);

        const links = [];
        const titles = [];

        $('.ZGomKf > img').each((i, el) => {
            links[i] = $(el).attr('src');
            titles[i] = $(el).attr('alt');
        });

        const result = [];
        for (let i = 0; i < links.length; i++) {
            result[i] = {
                link: links[i],
                title: titles[i],
            };
        };
        return result;
    }); 
}

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const output = await getConventionInfo();
        const other = await getCharacterInfo();
        const result = { conventions: output, characters: other}
        res.status(200).json(result)
    } catch(err) {
        next(err);
    }
});

export default router;