const express = require('express');
const app = express();
const axios = require('axios');
const PORT = 3000;
const REQUEST_TIMEOUT = 500;

app.get('/numbers', async (req, res) => {
    const urls = req.query.url;

    if (!urls) {
        return res.status(400).json({ error: 'Missing url parameter' });
    }
    const urlArray = Array.isArray(urls) ? urls : [urls];
    const uniqueNumbersSet = new Set();
  
    for (const url of urlArray) {
        try {
            const response = await axios.get(url, {
                timeout: REQUEST_TIMEOUT,
            });
            const numbers = response.data.numbers;
            numbers.forEach(number => uniqueNumbersSet.add(number));
        } catch (error) {
            if (error.code === 'ECONNABORTED') {
                console.error(`Timeout while fetching data from ${url}`);
            } else {
                console.error(`Error fetching data from ${url}: ${error.message}`);
            }
        }
    }
  
    const finalNumbersArray = Array.from(uniqueNumbersSet);
    finalNumbersArray.sort((a, b) => a - b);
    res.json({ numbers: finalNumbersArray });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});