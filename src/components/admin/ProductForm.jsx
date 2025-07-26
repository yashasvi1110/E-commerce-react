import React, { useState, useEffect } from 'react';
import { categories } from '../../data/Data';

const ProductForm = ({ product, onSubmit, onCancel, title }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    subcategory: '',
    price: '',
    mrp: '',
    unit: '1 Kg',
    stock: '',
    minStock: '',
    supplier: '',
    img: '../img/fruite-item-1.jpg',
    description: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setFormData(product);
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.subcategory) newErrors.subcategory = 'Subcategory is required';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required';
    if (!formData.mrp || formData.mrp <= 0) newErrors.mrp = 'Valid MRP is required';
    if (parseFloat(formData.price) >= parseFloat(formData.mrp)) {
      newErrors.price = 'Price must be less than MRP';
    }
    if (!formData.stock || formData.stock < 0) newErrors.stock = 'Valid stock quantity is required';
    if (!formData.minStock || formData.minStock < 0) newErrors.minStock = 'Valid minimum stock is required';
    if (!formData.supplier.trim()) newErrors.supplier = 'Supplier is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        ...formData,
        price: parseFloat(formData.price),
        mrp: parseFloat(formData.mrp),
        stock: parseInt(formData.stock),
        minStock: parseInt(formData.minStock)
      });
    }
  };

  const selectedCategory = categories.find(cat => cat.id === formData.category);
  const units = ['1 Kg', '500g', '250g', '3 Pcs', '6 Pcs', '1 Dozen', '1 Bunch'];
  const suppliers = ['Fresh Farm Co.', 'Organic Valley', 'Green Harvest', 'Farm Direct', 'Nature\'s Best'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#81c408] ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter product name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Category and Subcategory */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#81c408] ${
                  errors.category ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subcategory *
              </label>
              <select
                name="subcategory"
                value={formData.subcategory}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#81c408] ${
                  errors.subcategory ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={!selectedCategory}
              >
                <option value="">Select Subcategory</option>
                {selectedCategory?.subcategories.map(sub => (
                  <option key={sub.id} value={sub.id}>{sub.name}</option>
                ))}
              </select>
              {errors.subcategory && <p className="text-red-500 text-sm mt-1">{errors.subcategory}</p>}
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price ($) *
              </label>
              <input
                type="number"
                step="0.01"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#81c408] ${
                  errors.price ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                MRP ($) *
              </label>
              <input
                type="number"
                step="0.01"
                name="mrp"
                value={formData.mrp}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#81c408] ${
                  errors.mrp ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
              {errors.mrp && <p className="text-red-500 text-sm mt-1">{errors.mrp}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit
              </label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#81c408]"
              >
                {units.map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Stock Management */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Stock *
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#81c408] ${
                  errors.stock ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0"
              />
              {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Stock Level *
              </label>
              <input
                type="number"
                name="minStock"
                value={formData.minStock}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#81c408] ${
                  errors.minStock ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0"
              />
              {errors.minStock && <p className="text-red-500 text-sm mt-1">{errors.minStock}</p>}
            </div>
          </div>

          {/* Supplier */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Supplier *
            </label>
            <select
              name="supplier"
              value={formData.supplier}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#81c408] ${
                errors.supplier ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select Supplier</option>
              {suppliers.map(supplier => (
                <option key={supplier} value={supplier}>{supplier}</option>
              ))}
            </select>
            {errors.supplier && <p className="text-red-500 text-sm mt-1">{errors.supplier}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#81c408] ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter product description"
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-[#81c408] text-white rounded-lg hover:bg-[#6ea006] transition-colors"
            >
              {product ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm; 