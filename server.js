const express = require('express');
const truecallerjs = require('truecallerjs');

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const countryCode = 'IN';
const installationId = 'a1i0W--fmBw6i-qFCeE3bBYdNcsJTv7LUI1L1PAwdNOKHLrCRe0JCfu1I6pHLCB4';

app.get('/', (req, res) => {
  res.sendFile('index.html');
});

app.post('/search', async (req, res) => {
  const { number } = req.body;

  try {
    const search_data = {
      number,
      countryCode,
      installationId,
    };

    const response = await truecallerjs.search(search_data);
    res.json(response.json());
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'An error occurred while searching the number.' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
