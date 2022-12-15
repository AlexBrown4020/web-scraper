import express from 'express';
import axios from 'axios';
import cheerio from 'cheerio';

const conventionURL = `https://animecons.com/events/`;

function getConventionInfo(page) {
    return axios.get(`${conventionURL}`)
    .then(function ({ data }) {
        let $ = cheerio.load(data);
        const limit = 10;
        const cons = [];
        if (!page) {
            page = 1;
        } else {
            page = page;
        }

        $('#ConListTable > tbody > tr').each((i, el) => {
            let output = {};

            output.title = ($(el).children('td').children('a').text());
            output.details = ($(el).children('td').next().text());
            cons.push(output);
        });
        const skip = (page -1) * limit
        const count = cons.length;
        const pageCount = Math.floor(count / limit);
        const finalPage = count % limit;
        cons = cons.skip(skip)
        return {
            pagination: {
                count,
                pageCount,
                finalPage
            },
            cons
        };
    }); 
}

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const conventions = await getConventionInfo(req.query.page);
        res.status(200).json(conventions);
    } catch(err) {
        next(err);
    }
});

export default router;