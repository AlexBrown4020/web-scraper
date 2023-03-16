import express from 'express';
import axios from 'axios';
import cheerio from 'cheerio';

const conventionURL = `https://animecons.com/events/`;

function getConventionInfo(page) {
    return axios.get(`${conventionURL}`)
    .then(function ({ data }) {
        let $ = cheerio.load(data);
        const limit = 12;
        let cons = [];
        page = page ? page : 1;

        $('#ConListTable > tbody > tr').each((i, el) => {
            let output = {};

            output.title = ($(el).children('td').children('a').text());
            const string = $(el).children('td').next().text()
            for (let i = string.length; i > 0; i--) {
                if (!isNaN(parseInt(string[i]))) {
                  output.date = string.slice(0, i+1);
                  output.location = string.slice(i+1, string.length);
                  cons.push(output);
                  return
                }
              } 
        });

        const skip = page * limit;
        const count = cons.length;
        const pageCount = Math.ceil(count / limit);

        cons = cons.slice(skip - 9, skip)
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