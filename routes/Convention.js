import express from 'express';
import axios from 'axios';
import cheerio from 'cheerio';

const conventionURL = `https://animecons.com/events/`;

function getConventionInfo(limit, page) {
    return axios.get(`${conventionURL}`)
    .then(function ({ data }) {
        let $ = cheerio.load(data);

        const cons = [];
        if (!limit) {
            limit = 10;
        } else {
            limit = limit;
        }
        if (!page) {
            page = 1;
        } else {
            page = page;
        }

        let startIndex = (page - 1) * limit;
        let endIndex = page * limit;

        $('#ConListTable > tbody > tr').each((i, el) => {
            let output = {};

            output.title = ($(el).children('td').children('a').text());
            output.details = ($(el).children('td').next().text());
            cons.push(output);
        });
        return cons.slice(startIndex, endIndex);
    }); 
}

const router = express.Router();

router.get('/', async (req, res, next) => {
    console.log(req.query)
    try {
        const conventions = await getConventionInfo(req.query.limit, req.query.page);
        res.status(200).json(conventions);
    } catch(err) {
        next(err);
    }
});

export default router;