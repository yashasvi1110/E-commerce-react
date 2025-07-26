import React, { useState, useEffect } from 'react';

const defaultProduct = {
  name: 'Milk',
  id: 'milk123',
  price: 50
};

const Subscribe = ({ product = defaultProduct }) => {
  const [email, setEmail] = useState('');
  const [frequency, setFrequency] = useState('1');
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0,10));
  const [msg, setMsg] = useState('');
  const [subs, setSubs] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [placedAt, setPlacedAt] = useState(null);
  const [canCancel, setCanCancel] = useState(false);

  const handleSubscribe = async () => {
    if (!email) {
      setMsg('Please enter your email.');
      return;
    }
    const res = await fetch('http://localhost:5000/api/subscriptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        product,
        frequency,
        startDate
      })
    });
    const data = await res.json();
    if (res.ok) {
      setMsg('Subscription created!');
      setPlacedAt(Date.now());
      setCanCancel(true);
    }
    else setMsg(data.error || 'Error');
    fetchSubs();
  };

  const fetchSubs = async () => {
    if (!email) return;
    setFetching(true);
    const res = await fetch(`http://localhost:5000/api/subscriptions?email=${encodeURIComponent(email)}`);
    const data = await res.json();
    setSubs(Array.isArray(data) ? data : []);
    setFetching(false);
  };

  useEffect(() => {
    if (email) fetchSubs();
    // eslint-disable-next-line
  }, [email]);

  useEffect(() => {
    if (!placedAt) return;
    const timer = setTimeout(() => setCanCancel(false), 60000 - (Date.now() - placedAt));
    return () => clearTimeout(timer);
  }, [placedAt]);

  const handleCancel = async (id) => {
    await fetch(`http://localhost:5000/api/subscriptions/${id}/cancel`, { method: 'PATCH' });
    fetchSubs();
  };

  return (
    <div className="p-4 border rounded max-w-md mx-auto mt-8">
      <h3 className="font-bold mb-2">Subscribe to {product.name}</h3>
      <input
        value={email}
        onChange={e=>setEmail(e.target.value)}
        placeholder="Your Email"
        className="border p-1 mb-2 block w-full"
      />
      <label>Frequency:</label>
      <select
        value={frequency}
        onChange={e=>setFrequency(e.target.value)}
        className="border p-1 mb-2 block w-full"
      >
        <option value="1">Every day</option>
        <option value="2">Every 2 days</option>
        <option value="3">Every 3 days</option>
      </select>
      <label>Start Date:</label>
      <input
        type="date"
        value={startDate}
        onChange={e=>setStartDate(e.target.value)}
        className="border p-1 mb-2 block w-full"
      />
      <button
        onClick={handleSubscribe}
        className="bg-green-500 text-white px-4 py-2 rounded w-full"
      >
        Subscribe
      </button>
      {msg && <div className="mt-2 text-center">{msg}</div>}
      <hr className="my-4" />
      <h4 className="font-semibold mb-2">Your Subscriptions</h4>
      {fetching ? <div>Loading...</div> : (
        <ul>
          {subs.length === 0 && <li>No subscriptions found.</li>}
          {subs.map(sub => (
            <li key={sub.id} className="mb-2 p-2 border rounded flex flex-col md:flex-row md:items-center md:justify-between">
              <span>
                <b>{sub.product.name}</b> - Every {sub.frequency} day(s), Next: {sub.nextDeliveryDate} [{sub.status}]
              </span>
              {sub.status === 'active' && canCancel && (
                <button
                  onClick={() => handleCancel(sub.id)}
                  className="ml-2 bg-red-500 text-white px-2 py-1 rounded"
                >
                  Cancel
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Subscribe;
