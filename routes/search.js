import express from 'express';
import axios from 'axios';
import cheerio from 'cheerio';

const conventionString = 'upcoming cosplay convention';
const characterString = 'most popular cosplays';
const encodedCharacter = encodeURI(characterString);
const encodedConvention = encodeURI(conventionString);
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
        const snippets = [];

        $('.yuRUbf > a').each((i, el) => {
            links[i] = $(el).attr('href');
        });
        $('.yuRUbf > a > h3').each((i, el) => {
            titles[i] = $(el).text();
        });
        $('.lyLwlc').each((i, el) => {
            snippets[i] = $(el).text().trim();
        });

        const result = [];
        for (let i = 0; i < links.length; i++) {
            result[i] = {
                link: links[i],
                title: titles[i],
                snippet: snippets[i],
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