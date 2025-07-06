// scraper.js
const axios = require('axios');
const cheerio = require('cheerio');

// Esana News වෙබ් අඩවියේ නවතම පුවත් පිටුව
const ESANA_NEWS_URL = 'https://www.esana.lk/category/news'; // ඔබට අවශ්‍ය URL එක වෙනස් කරන්න පුළුවන්

async function scrapeEsanaNews() {
    try {
        const { data } = await axios.get(ESANA_NEWS_URL);
        const $ = cheerio.load(data);
        const articles = [];

        // ### Esana.lk වෙබ් අඩවියේ වත්මන් HTML structure එකට අනුව selectors ###
        // මෙය 2025 ජූලි 07 දිනට අදාළව සාදන ලද්දකි. වෙබ් අඩවිය වෙනස් වුවහොත් මෙය වෙනස් කිරීමට සිදුවනු ඇත.

        // සෑම පුවත් ලිපියක්ම අඩංගු වන ප්‍රධාන container එක සොයා ගනී
        // Esana.lk හි, මෙය සාමාන්‍යයෙන් 'row' class එකක් සහිත div එකක් තුළ ඇති 'col-md-6 col-12 mb-4' වැනි class එකක් සහිත div එකක් විය හැකියි.
        // කරුණාකර ඔබ browser එකේ Inspect කර මෙය තහවුරු කරගන්න.
        $('div.row.category-news-items > div.col-md-6.col-12.mb-4').each((i, element) => {
            if (articles.length >= 3) return false; // පුවත් 3ක් ලැබුණු පසු නවත්වන්න

            // මාතෘකාව සහ සබැඳිය
            const titleElement = $(element).find('h3.news-item-title a');
            const title = titleElement.text().trim();
            const url = titleElement.attr('href'); // Esana URLs සාමාන්‍යයෙන් සම්පූර්ණයි

            // විස්තරය
            const descriptionElement = $(element).find('p.news-item-desc'); // හෝ `div.news-item-content p` වැනි දෙයක්
            let description = descriptionElement.text().trim();

            if (title && url) {
                // විස්තරයක් නොමැතිනම් හෝ හිස් නම්, මාතෘකාවම කෙටි විස්තරයක් ලෙස යොදන්න
                if (!description) {
                    description = title.length > 150 ? title.substring(0, 150) + '...' : title;
                } else {
                    description = description.length > 200 ? description.substring(0, 200) + '...' : description;
                }

                articles.push({
                    title: title,
                    url: url, // Esana URL එක සම්පූර්ණයි
                    description: description
                });
            }
        });

        return articles;

    } catch (error) {
        console.error(`Error scraping Esana News from ${ESANA_NEWS_URL}:`, error.message);
        return [];
    }
}

module.exports = { scrapeEsanaNews };
