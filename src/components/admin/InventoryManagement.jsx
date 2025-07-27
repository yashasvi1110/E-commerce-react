import React, { useState, useEffect } from 'react';
// Removed unused import
import ProductForm from './ProductForm';
import ProductTable from './ProductTable';
import SupplyManagement from './SupplyManagement';
import AnalyticsDashboard from './AnalyticsDashboard';

const InventoryManagement = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Load products from localStorage or initialize with default
  useEffect(() => {
    const savedProducts = localStorage.getItem('inventoryProducts');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      // Initialize with some sample data
      const sampleProducts = [
        {
          id: Date.now(),
          name: 'Organic Apples',
          category: 'fruits',
          subcategory: 'seasonal',
          price: 5.99,
          mrp: 8.99,
          unit: '1 Kg',
          stock: 50,
          minStock: 10,
          supplier: 'Fresh Farm Co.',
          img: '../img/fruite-item-6.jpg',
          description: 'Fresh organic apples',
          status: 'active'
        }
      ];
      setProducts(sampleProducts);
      localStorage.setItem('inventoryProducts', JSON.stringify(sampleProducts));
    }
  }, []);

  // Save products to localStorage whenever products change
  useEffect(() => {
    localStorage.setItem('inventoryProducts', JSON.stringify(products));
  }, [products]);

  const handleAddProduct = (productData) => {
    const newProduct = {
      ...productData,
      id: Date.now(),
      status: 'active'
    };
    setProducts([...products, newProduct]);
    setShowAddForm(false);
  };

  const handleEditProduct = (productData) => {
    setProducts(products.map(p => 
      p.id === editingProduct.id ? { ...productData, id: editingProduct.id } : p
    ));
    setEditingProduct(null);
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== productId));
    }
  };

  const handleStatusToggle = (productId) => {
    setProducts(products.map(p => 
      p.id === productId 
        ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' }
        : p
    ));
  };

  const tabs = [
    { id: 'products', name: 'Products', icon: '📦' },
    { id: 'supply', name: 'Supply Chain', icon: '🚛' },
    { id: 'analytics', name: 'Analytics & Reports', icon: '📊' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
            <p className="mt-2 text-gray-600">Manage your products, suppliers, and track analytics</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-[#81c408] text-[#81c408]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'products' && (
          <div>
            {/* Products Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Product Catalog</h2>
                <p className="text-gray-600">Manage your product inventory</p>
              </div>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-[#81c408] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#6ea006] transition-colors flex items-center"
              >
                <span className="mr-2">+</span>
                Add New Product
              </button>
            </div>

            {/* Product Table */}
            <ProductTable
              products={products}
              onEdit={setEditingProduct}
              onDelete={handleDeleteProduct}
              onStatusToggle={handleStatusToggle}
            />
          </div>
        )}

        {activeTab === 'supply' && (
          <SupplyManagement products={products} setProducts={setProducts} />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard products={products} />
        )}
      </div>

      {/* Product Form Modals */}
      {showAddForm && (
        <ProductForm
          onSubmit={handleAddProduct}
          onCancel={() => setShowAddForm(false)}
          title="Add New Product"
        />
      )}

      {editingProduct && (
        <ProductForm
          product={editingProduct}
          onSubmit={handleEditProduct}
          onCancel={() => setEditingProduct(null)}
          title="Edit Product"
        />
      )}
    </div>
  );
};

export default InventoryManagement; 