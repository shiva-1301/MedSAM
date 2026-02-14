import React, { useEffect, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import api from '../utils/api';

const DrugSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [city, setCity] = useState('');
  const [category, setCategory] = useState('');
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const categories = ['Tablet', 'Capsule', 'Syrup', 'Injection', 'Cream', 'Drops', 'Inhaler', 'Other'];

  const handleSearch = async (overrideQuery) => {
    setLoading(true);
    setError('');

    try {
      const params = {};
      const queryValue = overrideQuery ?? searchQuery;
      if (queryValue) params.q = queryValue;
      if (city) params.city = city;
      if (category) params.category = category;

      const { data } = await api.get('/medicines/search', { params });
      setMedicines(data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial load - show all medicines
    handleSearch();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchSuggestions = useMemo(
    () =>
      debounce(async (value) => {
        if (!value) {
          setSuggestions([]);
          return;
        }

        try {
          const { data } = await api.get('/medicines/suggestions', {
            params: { query: value }
          });
          setSuggestions(data);
        } catch (err) {
          console.error(err);
        }
      }, 300),
    []
  );

  useEffect(() => {
    return () => fetchSuggestions.cancel();
  }, [fetchSuggestions]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    fetchSuggestions(value);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Search Medicines</h1>
          
          <div className="grid md:grid-cols-4 gap-4 mb-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Medicine Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search by name or generic name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />

                {suggestions.length > 0 && (
                  <ul className="absolute bg-white border w-full mt-1 rounded-md shadow-lg z-10 max-h-60 overflow-auto">
                    {suggestions.map((item) => (
                      <li
                        key={item}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setSearchQuery(item);
                          setSuggestions([]);
                          handleSearch(item);
                        }}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 disabled:opacity-50 font-medium"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">
            Results ({medicines.length} medicines found)
          </h2>

          {medicines.length === 0 && !loading ? (
            <div className="text-center py-8 text-gray-500">
              No medicines found. Try adjusting your search criteria.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {medicines.map(medicine => (
                <div key={medicine._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition">
                  {medicine.image && (
                    <img
                      src={`${process.env.REACT_APP_API_URL?.replace('/api', '')}/${medicine.image}`}
                      alt={medicine.name}
                      className="w-full h-40 object-cover rounded-md mb-3"
                    />
                  )}
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {medicine.name}
                  </h3>
                  
                  {medicine.genericName && (
                    <p className="text-sm text-gray-600 mb-2">
                      Generic: {medicine.genericName}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm bg-primary-100 text-primary-800 px-2 py-1 rounded">
                      {medicine.category}
                    </span>
                    {medicine.prescriptionRequired && (
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                        Rx Required
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Manufacturer:</strong> {medicine.manufacturer}
                  </p>
                  
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-bold text-primary-600">
                      ₹{medicine.price}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      MRP: ₹{medicine.mrp}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm mb-3">
                    <span className={`font-medium ${
                      medicine.stockQuantity > 10 ? 'text-green-600' : 
                      medicine.stockQuantity > 0 ? 'text-yellow-600' : 
                      'text-red-600'
                    }`}>
                      {medicine.stockStatus}
                    </span>
                    <span className={`text-xs ${
                      medicine.expiryStatus === 'Valid' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {medicine.expiryStatus}
                    </span>
                  </div>
                  
                  {medicine.pharmacy && (
                    <div className="border-t pt-3 mt-3">
                      <p className="text-sm font-medium text-gray-900">
                        {medicine.pharmacy.pharmacyName}
                      </p>
                      <p className="text-xs text-gray-600">
                        {medicine.pharmacy.city}, {medicine.pharmacy.state}
                      </p>
                      <p className="text-xs text-gray-600">
                        📞 {medicine.pharmacy.phoneNumber}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DrugSearch;
