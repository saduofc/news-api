// index.js
require('dotenv').config();
const express = require('express');
const { scrapeEsanaNews } = require('./scraper'); // <-- මෙතන වෙනස් කරන්න!

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Sinhala News API is running!');
});

// News API endpoint
app.get('/api/news', async (req, res) => {
    try {
        const newsArticles = await scrapeEsanaNews(); // <-- මෙතනත් වෙනස් කරන්න!

        if (newsArticles.length === 0) {
            return res.status(404).json({ message: "Sorry, no Sinhala news found at the moment." });
        }

        res.status(200).json(newsArticles);

    } catch (error) {
        console.error('Error in /api/news endpoint:', error.message);
        res.status(500).json({ message: "Internal server error occurred while fetching news.", error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Sinhala News API server is running on port ${PORT}`);
});
