// scraper.js
const axios = require('axios');
const cheerio = require('cheerio');

const HIRU_NEWS_URL = 'https://www.hirunews.lk/sinhala/local-news'; // දේශීය පුවත් පිටුව

async function scrapeHiruNews() {
    try {
        const { data } = await axios.get(HIRU_NEWS_URL);
        const $ = cheerio.load(data);
        const articles = [];

        // Hiru News වෙබ් අඩවියේ HTML structure එකට අනුව selectors වෙනස් විය හැක.
        // මෙය 2025 ජූලි 06 දිනට අදාළව සාදන ලද්දකි. වෙබ් අඩවිය වෙනස් වුවහොත් මෙය වෙනස් කිරීමට සිදුවනු ඇත.
        $('div.l-news-item').each((i, element) => {
            if (articles.length >= 3) return false; // පුවත් 3ක් ලැබුණු පසු නවත්වන්න

            const titleElement = $(element).find('h3.l-news-item__title a');
            const title = titleElement.text().trim();
            const relativeUrl = titleElement.attr('href');
            const descriptionElement = $(element).find('p.l-news-item__desc');
            const description = descriptionElement.text().trim();

            if (title && relativeUrl) {
                const fullUrl = `https://www.hirunews.lk${relativeUrl}`; // සම්පූර්ණ URL එක
                articles.push({
                    title: title,
                    url: fullUrl,
                    description: description.length > 200 ? description.substring(0, 200) + '...' : description // කෙටි විස්තරයක්
                });
            }
        });

        return articles;

    } catch (error) {
        console.error(`Error scraping Hiru News from ${HIRU_NEWS_URL}:`, error.message);
        // දෝෂයක් ඇති වුවහොත් හිස් array එකක් return කරන්න
        return [];
    }
}

module.exports = { scrapeHiruNews };
