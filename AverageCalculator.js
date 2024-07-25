import React, { useState } from 'react';

const AverageCalculator = () => {
  const [type, setType] = useState('e');
  const [result, setResult] = useState(null);

  const fetchNumbers = async () => {
    try {
      let response;
      if (type === 'p') {
        // Fetch prime numbers from the test server
        response = await fetch('http://20.244.56.144/test/primes');
      } else {
        // Fetch other types of numbers from the local server
        response = await fetch(`http://localhost:9876/numbers/${type}`);
      }
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error fetching numbers:', error);
    }
  };

  return (
    <div>
      <h1>Average Calculator</h1>
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="p">Prime</option>
        <option value="f">Fibonacci</option>
        <option value="e">Even</option>
        <option value="r">Random</option>
      </select>
      <button onClick={fetchNumbers}>Fetch Numbers</button>
      {result && (
        <div>
          <p>Previous State: {JSON.stringify(result.windowPrevState)}</p>
          <p>Current State: {JSON.stringify(result.windowCurrState)}</p>
          <p>Fetched Numbers: {JSON.stringify(result.numbers)}</p>
          <p>Average: {result.avg}</p>
        </div>
      )}
    </div>
  );
};

export default AverageCalculator;
