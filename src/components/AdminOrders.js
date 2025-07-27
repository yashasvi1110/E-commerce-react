import React, { useEffect, useState } from 'react';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        fetch(`${apiUrl}/api/orders`)
      .then(res => res.json())
      .then(data => setOrders(data));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">All Orders</h2>
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="border px-2 py-1">Date</th>
            <th className="border px-2 py-1">Name</th>
            <th className="border px-2 py-1">Email</th>
            <th className="border px-2 py-1">Items</th>
            <th className="border px-2 py-1">Payment</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, idx) => (
            <tr key={idx}>
              <td className="border px-2 py-1">{order.date}</td>
              <td className="border px-2 py-1">{order.firstName} {order.lastName}</td>
              <td className="border px-2 py-1">{order.email}</td>
              <td className="border px-2 py-1">
                <ul>
                  {order.items && order.items.map((item, i) => (
                    <li key={i}>{item.name} x {item.quantity}</li>
                  ))}
                </ul>
              </td>
              <td className="border px-2 py-1">{order.paymentMethod}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrders;

