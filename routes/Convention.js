import express from 'express';
import axios from 'axios';
import cheerio from 'cheerio';

const conventionURL = `https://animecons.com/events/`;

function getConventionInfo() {
    return axios.get(`${conventionURL}`)
    .then(function ({ data }) {
        let $ = cheerio.load(data);

        const cons = [];

        $('#ConListTable > tbody > tr').each((i, el) => {
            if (cons.length > 50) {
                return false
            }
            let tag = $(el);
            const info = [];
            while (tag = tag.next()) {
                if (tag.length === 0) break;
                info.push(tag.text())
            }
            cons.push(info)
        });

        const result = [];
        for (let i = 0; i < cons.length; i++) {
            result.push(cons[i])
        };
        return result;
    }); 
}

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const conventions = await getConventionInfo();
        res.status(200).json(conventions)
    } catch(err) {
        next(err);
    }
});

export default router;