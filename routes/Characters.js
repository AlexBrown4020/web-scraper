import express from 'express';
import axios from 'axios';
import cheerio from 'cheerio';

const characterURL = 'https://www.zavvi.com/blog/features/the-worlds-most-popular-characters-to-cosplay/';

function getCharacterInfo() {
    return axios.get(characterURL)
    .then(function ({ data }) {
        let $ = cheerio.load(data);

        let titles = [];
        // const href = [];

        $('h3').each((i, el) => {
            if (titles.length > 10) {
                return false
            }
            titles[i] = $(el).text();
            // href[i] = $(el).attr('href');
        });
        titles = titles.splice(1,10);

        const result = [];
        for (let i = 0; i < titles.length; i++) {
            result[i] = {
                title: titles[i],
                // href: href[i]
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