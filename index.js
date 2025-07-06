// index.js
require('dotenv').config(); // .env file එක load කරගැනීමට
const express = require('express');
const { scrapeHiruNews } = require('./scraper'); // scraper එක import කරන්න

const app = express();
const PORT = process.env.PORT || 3000; // Render එකෙන් PORT එකක් දෙනවා, නැත්නම් 3000

app.use(express.json()); // JSON body parsing සඳහා

// Health check endpoint
app.get('/', (req, res) => {
    res.send('Sinhala News API is running!');
});

// News API endpoint
app.get('/api/news', async (req, res) => {
    try {
        const newsArticles = await scrapeHiruNews(); // scraper function එක call කරන්න

        if (newsArticles.length === 0) {
            return res.status(404).json({ message: "Sorry, no Sinhala news found at the moment." });
        }

        res.status(200).json(newsArticles); // පුවත් JSON format එකෙන් යවන්න

    } catch (error) {
        console.error('Error in /api/news endpoint:', error.message);
        res.status(500).json({ message: "Internal server error occurred while fetching news.", error: error.message });
    }
});

// Server එක පටන් ගන්න
app.listen(PORT, () => {
    console.log(`Sinhala News API server is running on port ${PORT}`);
});
