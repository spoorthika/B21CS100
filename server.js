const express = require('express');
const axios = require('axios');
const app = express();
const port = 9876;

const windowSize = 10;
let numberStore = [];
const fetchNumbers = async (type) => {
  try {
    const response = await axios.get(`https://third-party-api.com/numbers/${type}`, { timeout: 500 });
    return response.data.numbers;
  } catch (error) {
    console.error('Error fetching numbers:', error);
    return [];
  }
};
const calculateAverage = (numbers) => {
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return (sum / numbers.length).toFixed(2);
};
app.get('/numbers/:type', async (req, res) => {
  const { type } = req.params;

  if (!['p', 'f', 'e', 'r'].includes(type)) {
    return res.status(400).json({ error: 'Invalid type parameter' });
  }

  const newNumbers = await fetchNumbers(type);

  newNumbers.forEach((num) => {
    if (!numberStore.includes(num)) {
      numberStore.push(num);
    }
  });


  if (numberStore.length > windowSize) {
    numberStore = numberStore.slice(-windowSize);
  }


  const avg = calculateAverage(numberStore);

  res.json({
    windowPrevState: numberStore.slice(0, -newNumbers.length),
    windowCurrState: numberStore,
    numbers: newNumbers,
    avg: parseFloat(avg),
  });
});

app.listen(port, () => {
  console.log(`Average Calculator microservice listening at http://localhost:${port}`);
});
