import React, { useState } from 'react';

const AnalyticsDashboard = ({ products }) => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Calculate local analytics from products data
  const calculateLocalAnalytics = () => {
    const totalProducts = products.length;
    const activeProducts = products.filter(p => p.status === 'active').length;
    const totalInventoryValue = products.reduce((sum, p) => sum + (p.stock * p.price), 0);
    const lowStockCount = products.filter(p => p.stock <= p.minStock).length;
    
    // Category breakdown
    const categoryBreakdown = products.reduce((acc, product) => {
      if (!acc[product.category]) {
        acc[product.category] = { count: 0, value: 0 };
      }
      acc[product.category].count++;
      acc[product.category].value += product.stock * product.price;
      return acc;
    }, {});

    // Top products by value
    const topProductsByValue = products
      .map(p => ({ ...p, totalValue: p.stock * p.price }))
      .sort((a, b) => b.totalValue - a.totalValue)
      .slice(0, 5);

    // Supplier analysis
    const supplierAnalysis = products.reduce((acc, product) => {
      if (!acc[product.supplier]) {
        acc[product.supplier] = { products: 0, value: 0, lowStock: 0 };
      }
      acc[product.supplier].products++;
      acc[product.supplier].value += product.stock * product.price;
      if (product.stock <= product.minStock) {
        acc[product.supplier].lowStock++;
      }
      return acc;
    }, {});

    return {
      summary: {
        totalProducts,
        activeProducts,
        totalInventoryValue,
        lowStockCount
      },
      categoryBreakdown,
      topProductsByValue,
      supplierAnalysis
    };
  };

  const localAnalytics = calculateLocalAnalytics();

  // Function to fetch analytics from external API
  const fetchExternalAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      // Connect to your Analytics API
      const endpoints = [
        'http://localhost:8000/api/analytics/total-sales',
        'http://localhost:8000/api/analytics/top-products',
        'http://localhost:8000/api/analytics/sales-trend',
        'http://localhost:8000/api/analytics/category-sales'
      ];

      // Fetch all analytics data in parallel
      const [totalSalesRes, topProductsRes, salesTrendRes, categorySalesRes] = await Promise.all(
        endpoints.map(url => fetch(url).then(res => {
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          return res.json();
        }))
      );

      // Calculate additional metrics
      const totalOrders = salesTrendRes.length || 0;
      const avgOrderValue = totalOrders > 0 ? totalSalesRes.total_sales / totalOrders : 0;

      setAnalyticsData({
        totalSales: totalSalesRes.total_sales || 0,
        ordersThisMonth: totalOrders,
        avgOrderValue: avgOrderValue,
        topSellingProducts: topProductsRes.slice(0, 3) || [],
        salesTrend: salesTrendRes || [],
        categorySales: categorySalesRes || []
      });
      setLoading(false);
    } catch (err) {
      console.error('Analytics API Error:', err);
      setError(`Failed to load analytics: ${err.message}. Make sure your Analytics API is running on http://localhost:8000`);
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, subtitle, icon, color = 'blue' }) => {
    const colorClasses = {
      blue: 'bg-blue-50 text-blue-600',
      green: 'bg-green-50 text-green-600',
      yellow: 'bg-yellow-50 text-yellow-600',
      red: 'bg-red-50 text-red-600',
      purple: 'bg-purple-50 text-purple-600'
    };

    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className={`p-3 rounded-full ${colorClasses[color]}`}>
            {icon}
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header with Analytics Connection */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics & Reports</h2>
          <p className="text-gray-600">Inventory insights and sales analytics</p>
        </div>
        <button
          onClick={fetchExternalAnalytics}
          disabled={loading}
          className="bg-[#81c408] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#6ea006] transition-colors flex items-center disabled:bg-gray-400"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading...
            </>
          ) : (
            <>
              <span className="mr-2">📊</span>
              Load Sales Analytics
            </>
          )}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Products"
          value={localAnalytics.summary.totalProducts}
          subtitle={`${localAnalytics.summary.activeProducts} active`}
          icon={<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" /></svg>}
          color="blue"
        />
        <StatCard
          title="Inventory Value"
          value={`$${localAnalytics.summary.totalInventoryValue.toFixed(2)}`}
          subtitle="Current stock value"
          icon={<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" /><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.51-1.31c-.562-.649-1.413-1.076-2.353-1.253V5z" clipRule="evenodd" /></svg>}
          color="green"
        />
        <StatCard
          title="Low Stock Alerts"
          value={localAnalytics.summary.lowStockCount}
          subtitle="Need attention"
          icon={<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>}
          color="yellow"
        />
        <StatCard
          title="Suppliers"
          value={Object.keys(localAnalytics.supplierAnalysis).length}
          subtitle="Active suppliers"
          icon={<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          color="purple"
        />
      </div>

      {/* External Analytics Section */}
      {analyticsData && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Sales Performance</h3>
            <p className="text-sm text-gray-600">Data from sales analytics system</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                title="Total Sales"
                value={`$${analyticsData.totalSales.toFixed(2)}`}
                subtitle="This month"
                icon={<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>}
                color="green"
              />
              <StatCard
                title="Orders"
                value={analyticsData.ordersThisMonth}
                subtitle="This month"
                icon={<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5zM8 15v-3a1 1 0 011-1h2a1 1 0 011 1v3H8z" clipRule="evenodd" /></svg>}
                color="blue"
              />
              <StatCard
                title="Avg Order Value"
                value={`$${analyticsData.avgOrderValue.toFixed(2)}`}
                subtitle="Per order"
                icon={<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>}
                color="purple"
              />
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Charts and Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Breakdown */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Category Breakdown</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {Object.entries(localAnalytics.categoryBreakdown).map(([category, data]) => (
                <div key={category} className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 capitalize">{category}</h4>
                    <p className="text-sm text-gray-500">{data.count} products</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">${data.value.toFixed(2)}</p>
                    <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-[#81c408] h-2 rounded-full" 
                        style={{ 
                          width: `${(data.value / localAnalytics.summary.totalInventoryValue) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Products by Value */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Top Products by Value</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {localAnalytics.topProductsByValue.map((product, index) => (
                <div key={product.id} className="flex items-center">
                  <div className="flex-shrink-0 w-8">
                    <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                  </div>
                  <img 
                    className="h-10 w-10 rounded-lg object-cover ml-2" 
                    src={product.img} 
                    alt={product.name}
                    onError={(e) => {
                      e.target.src = '../img/fruite-item-1.jpg';
                    }}
                  />
                  <div className="ml-4 flex-1">
                    <h4 className="text-sm font-medium text-gray-900">{product.name}</h4>
                    <p className="text-sm text-gray-500">{product.stock} units × ${product.price}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      ${product.totalValue.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Supplier Performance Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Supplier Performance</h3>
          <p className="text-sm text-gray-600">Inventory value and issues by supplier</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Supplier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Products
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Inventory Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Low Stock Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(localAnalytics.supplierAnalysis).map(([supplier, data]) => (
                <tr key={supplier} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{supplier}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{data.products}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">${data.value.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{data.lowStock}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      data.lowStock === 0 
                        ? 'bg-green-100 text-green-800'
                        : data.lowStock <= 2
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {data.lowStock === 0 ? 'Excellent' : data.lowStock <= 2 ? 'Good' : 'Needs Attention'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#81c408] hover:bg-gray-50 transition-colors">
              <div className="text-center">
                <svg className="mx-auto h-8 w-8 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-sm font-medium text-gray-900">Export Inventory Report</p>
                <p className="text-xs text-gray-500">Download CSV/Excel</p>
              </div>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#81c408] hover:bg-gray-50 transition-colors">
              <div className="text-center">
                <svg className="mx-auto h-8 w-8 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="text-sm font-medium text-gray-900">View Full Analytics</p>
                <p className="text-xs text-gray-500">Open dashboard</p>
              </div>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#81c408] hover:bg-gray-50 transition-colors">
              <div className="text-center">
                <svg className="mx-auto h-8 w-8 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.828 7l6.586 6.586a2 2 0 002.828 0l6.586-6.586A2 2 0 0019.414 5H4.586A2 2 0 003.172 7z" />
                </svg>
                <p className="text-sm font-medium text-gray-900">Send Low Stock Alert</p>
                <p className="text-xs text-gray-500">Email suppliers</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard; 