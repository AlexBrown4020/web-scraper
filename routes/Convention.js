import express from 'express';
import axios from 'axios';
import cheerio from 'cheerio';

const conventionURL = `https://animecons.com/events/`;

function getConventionInfo(page) {
    return axios.get(`${conventionURL}`)
    .then(function ({ data }) {
        let $ = cheerio.load(data);
        const limit = 10;
        let cons = [];
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

        const skip = page * limit
        const count = cons.length;
        const pageCount = Math.ceil(count / limit)

        cons = cons.slice(skip - 10, skip)
        return {
            pagination: {
                count,
                pageCount,
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