// scraper.js
const axios = require('axios');
const cheerio = require('cheerio');

const HIRU_NEWS_LOCAL_URL = 'https://www.hirunews.lk/sinhala/local-news'; // දේශීය පුවත් පිටුව

async function scrapeHiruNews() {
    try {
        const { data } = await axios.get(HIRU_NEWS_LOCAL_URL);
        const $ = cheerio.load(data);
        const articles = [];

        // ### මෙතන තමයි CSS selectors අලුත් කරලා තියෙන්නේ ###
        // ඔබගේ screenshots වලට අනුව සහ Hiru News වෙබ් අඩවියේ වත්මන් HTML structure එකට අනුව (2025 ජූලි 6)
        // සෑම පුවත් ලිපියක්ම අඩංගු වන ප්‍රධාන div එක සොයයි.
        // මෙය වෙනස් විය හැක.
        $('div.l-news-item').each((i, element) => {
            if (articles.length >= 3) return false; // පුවත් 3ක් ලැබුණු පසු නවත්වන්න

            const titleElement = $(element).find('h3.l-news-item__title a');
            const title = titleElement.text().trim();
            const relativeUrl = titleElement.attr('href'); // e.g., /sinhala/local-news/12345/article-title
            
            // Description එක තියෙන්නේ p tag එකක් ඇතුලේ
            const descriptionElement = $(element).find('p.l-news-item__desc');
            const description = descriptionElement.text().trim();

            if (title && relativeUrl) {
                // Relativel URL එකට Hiru News base URL එක එකතු කර සම්පූර්ණ URL එක හදයි.
                const fullUrl = `https://www.hirunews.lk${relativeUrl}`; 
                
                articles.push({
                    title: title,
                    url: fullUrl,
                    description: description.length > 200 ? description.substring(0, 200) + '...' : description // විස්තරය කෙටි කරයි
                });
            }
        });

        return articles;

    } catch (error) {
        console.error(`Error scraping Hiru News from ${HIRU_NEWS_LOCAL_URL}:`, error.message);
        // දෝෂයක් ඇති වුවහොත් හිස් array එකක් return කරන්න
        return [];
    }
}

module.exports = { scrapeHiruNews };
