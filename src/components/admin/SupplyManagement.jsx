import React, { useState } from 'react';

const SupplyManagement = ({ products, setProducts }) => {
  const [activeView, setActiveView] = useState('stock');
  const [stockUpdates, setStockUpdates] = useState({});

  // Get low stock products
  const lowStockProducts = products.filter(p => p.stock <= p.minStock && p.stock > 0);
  const outOfStockProducts = products.filter(p => p.stock === 0);

  // Get supplier summary
  const supplierSummary = products.reduce((acc, product) => {
    if (!acc[product.supplier]) {
      acc[product.supplier] = {
        name: product.supplier,
        totalProducts: 0,
        lowStockCount: 0,
        outOfStockCount: 0,
        totalValue: 0
      };
    }
    acc[product.supplier].totalProducts++;
    acc[product.supplier].totalValue += product.stock * product.price;
    
    if (product.stock === 0) acc[product.supplier].outOfStockCount++;
    else if (product.stock <= product.minStock) acc[product.supplier].lowStockCount++;
    
    return acc;
  }, {});

  const handleStockUpdate = (productId, newStock) => {
    setStockUpdates(prev => ({
      ...prev,
      [productId]: newStock
    }));
  };

  const applyStockUpdate = (productId) => {
    const newStock = stockUpdates[productId];
    if (newStock !== undefined && newStock >= 0) {
      setProducts(products.map(p => 
        p.id === productId ? { ...p, stock: parseInt(newStock) } : p
      ));
      setStockUpdates(prev => {
        const updated = { ...prev };
        delete updated[productId];
        return updated;
      });
    }
  };

  const views = [
    { id: 'stock', name: 'Stock Alerts', icon: '⚠️' },
    { id: 'suppliers', name: 'Suppliers', icon: '🏢' },
    { id: 'reorder', name: 'Reorder Points', icon: '📊' }
  ];

  return (
    <div>
      {/* View Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {views.map((view) => (
              <button
                key={view.id}
                onClick={() => setActiveView(view.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeView === view.id
                    ? 'border-[#81c408] text-[#81c408]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{view.icon}</span>
                {view.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Stock Alerts View */}
      {activeView === 'stock' && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-center">
                <div className="text-red-600">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-red-900">Out of Stock</h3>
                  <p className="text-3xl font-bold text-red-600">{outOfStockProducts.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <div className="flex items-center">
                <div className="text-yellow-600">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-yellow-900">Low Stock</h3>
                  <p className="text-3xl font-bold text-yellow-600">{lowStockProducts.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center">
                <div className="text-green-600">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-green-900">Well Stocked</h3>
                  <p className="text-3xl font-bold text-green-600">
                    {products.length - lowStockProducts.length - outOfStockProducts.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stock Alerts */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Stock Alerts</h3>
              <p className="text-sm text-gray-600">Products requiring immediate attention</p>
            </div>
            <div className="divide-y divide-gray-200">
              {[...outOfStockProducts, ...lowStockProducts].map((product) => (
                <div key={product.id} className="p-6 flex items-center justify-between">
                  <div className="flex items-center">
                    <img 
                      className="h-12 w-12 rounded-lg object-cover" 
                      src={product.img} 
                      alt={product.name}
                      onError={(e) => {
                        e.target.src = '../img/fruite-item-1.jpg';
                      }}
                    />
                    <div className="ml-4">
                      <h4 className="text-sm font-medium text-gray-900">{product.name}</h4>
                      <p className="text-sm text-gray-500">Supplier: {product.supplier}</p>
                      <div className="flex items-center mt-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          product.stock === 0 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {product.stock === 0 ? 'Out of Stock' : 'Low Stock'}
                        </span>
                        <span className="ml-2 text-sm text-gray-500">
                          Current: {product.stock} | Min: {product.minStock}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      placeholder="New stock"
                      value={stockUpdates[product.id] || ''}
                      onChange={(e) => handleStockUpdate(product.id, e.target.value)}
                      className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#81c408]"
                    />
                    <button
                      onClick={() => applyStockUpdate(product.id)}
                      disabled={!stockUpdates[product.id]}
                      className="px-4 py-2 bg-[#81c408] text-white rounded-lg hover:bg-[#6ea006] disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Update
                    </button>
                  </div>
                </div>
              ))}
              {[...outOfStockProducts, ...lowStockProducts].length === 0 && (
                <div className="p-12 text-center">
                  <div className="text-green-500">
                    <svg className="mx-auto h-12 w-12" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">All products are well stocked!</h3>
                  <p className="mt-2 text-sm text-gray-500">No immediate restocking required.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Suppliers View */}
      {activeView === 'suppliers' && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Supplier Overview</h3>
            <p className="text-sm text-gray-600">Performance and status of all suppliers</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Supplier
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Products
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Inventory Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Issues
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.values(supplierSummary).map((supplier) => (
                  <tr key={supplier.name} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{supplier.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{supplier.totalProducts} products</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ${supplier.totalValue.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        {supplier.outOfStockCount > 0 && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                            {supplier.outOfStockCount} out of stock
                          </span>
                        )}
                        {supplier.lowStockCount > 0 && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            {supplier.lowStockCount} low stock
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        supplier.outOfStockCount > 0 
                          ? 'bg-red-100 text-red-800'
                          : supplier.lowStockCount > 0
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {supplier.outOfStockCount > 0 
                          ? 'Needs Attention'
                          : supplier.lowStockCount > 0
                          ? 'Monitor'
                          : 'Good'
                        }
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reorder Points View */}
      {activeView === 'reorder' && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Reorder Point Analysis</h3>
            <p className="text-sm text-gray-600">Set optimal reorder points for products</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.slice(0, 9).map((product) => (
                <div key={product.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <img 
                      className="h-10 w-10 rounded-lg object-cover" 
                      src={product.img} 
                      alt={product.name}
                      onError={(e) => {
                        e.target.src = '../img/fruite-item-1.jpg';
                      }}
                    />
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-gray-900">{product.name}</h4>
                      <p className="text-xs text-gray-500">{product.supplier}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Current Stock:</span>
                      <span className="font-medium">{product.stock}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Min Stock:</span>
                      <span className="font-medium">{product.minStock}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Recommended:</span>
                      <span className="font-medium text-[#81c408]">
                        {Math.max(product.minStock * 2, 20)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        product.stock === 0 
                          ? 'bg-red-500' 
                          : product.stock <= product.minStock 
                          ? 'bg-yellow-500' 
                          : 'bg-green-500'
                      }`}
                      style={{ 
                        width: `${Math.min((product.stock / (product.minStock * 3)) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplyManagement; 