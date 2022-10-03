const cheerio = require('cheerio');
const axios = require('axios');
const express =  require('express');
const dotenv = require('dotenv');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8000
dotenv.config();

app.use(express.json());

app.use(express.json());
app.use(cors());

app.use('search', searchRoute);

app.use((err,req,res,next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || 'Something went wrong, no error message found';
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack,
    });
})

app.listen(PORT, () => {
    console.log(`Connected to backend on port ${PORT}`);
});

const searchString = 'cosplay convention';
const encodedString = encodeURI(searchString);
const domain = `http://google.com`;

const AXIOS_OPTIONS = {
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36',
    },
};

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
            }
        }
        console.log(result)
    }); 
}

getConventionInfo();