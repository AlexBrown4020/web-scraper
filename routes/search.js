import express from 'express';
import axios from 'axios';
import cheerio from 'cheerio';

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
        function getConventionInfo() {
            return axios.get(`${domain}/search?q=${encodedString}&hl=en@gl=us`, AXIOS_OPTIONS)
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
        const output = await getConventionInfo();
        console.log(output)
        res.status(200).json(output)
    } catch(err) {
        next(err);
    }
});

export default router;