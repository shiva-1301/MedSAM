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
    <div className="min-h-screen bg-gray-50 py-4 md:py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white border border-gray-100 rounded-lg shadow-sm md:shadow-md p-3 md:p-4 mb-4 md:mb-6">
          <h1 className="text-lg md:text-3xl font-bold text-gray-900 mb-3 md:mb-6">Search Medicines</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4 mb-2 md:mb-3">
            <div className="md:col-span-2">
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                Medicine Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search by name or generic name"
                  className="w-full h-9 md:h-auto px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />

                {suggestions.length > 0 && (
                  <ul className="absolute bg-white border w-full mt-1 rounded-md shadow-lg z-10 max-h-60 overflow-auto">
                    {suggestions.map((item) => (
                      <li
                        key={item}
                        className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
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
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city"
                className="w-full h-9 md:h-auto px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-9 md:h-auto px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
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
            className="w-full md:w-auto h-9 md:h-auto bg-primary-600 text-white px-6 py-2 text-sm rounded-lg hover:bg-primary-700 disabled:opacity-50 font-medium active:scale-[0.98] transition-all duration-150"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-3 md:px-4 py-2 md:py-3 rounded text-sm md:text-base mb-4 md:mb-6">
            {error}
          </div>
        )}

        <div className="bg-white border border-gray-100 rounded-lg shadow-sm md:shadow-md p-4 md:p-6">
          <h2 className="text-base md:text-xl font-semibold mb-3 md:mb-4">
            Results ({medicines.length} medicines found)
          </h2>

          {medicines.length === 0 && !loading ? (
            <div className="text-center py-6 md:py-8 text-gray-500 text-sm md:text-base">
              No medicines found. Try adjusting your search criteria.
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 md:gap-6">
              {medicines.map(medicine => (
                <div key={medicine._id} className="border border-gray-200 rounded-lg p-2 md:p-4 hover:shadow-lg transition active:scale-[0.98] md:active:scale-100">
                  {medicine.image && (
                    <img
                      src={`${process.env.REACT_APP_API_URL?.replace('/api', '')}/${medicine.image}`}
                      alt={medicine.name}
                      className="w-full h-24 md:h-40 object-cover rounded-md mb-2 md:mb-3"
                    />
                  )}
                  
                  <h3 className="text-sm md:text-lg font-semibold text-gray-900 mb-1 md:mb-2 line-clamp-2">
                    {medicine.name}
                  </h3>
                  
                  {medicine.genericName && (
                    <p className="text-xs md:text-sm text-gray-600 mb-1 md:mb-2 line-clamp-1">
                      Generic: {medicine.genericName}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap items-center gap-1 mb-1 md:mb-2">
                    <span className="text-xs md:text-sm bg-primary-100 text-primary-800 px-1.5 md:px-2 py-0.5 md:py-1 rounded">
                      {medicine.category}
                    </span>
                    {medicine.prescriptionRequired && (
                      <span className="text-xs bg-red-100 text-red-800 px-1.5 md:px-2 py-0.5 md:py-1 rounded">
                        Rx
                      </span>
                    )}
                  </div>
                  
                  <div className="mb-1 md:mb-2">
                    <span className="text-xs md:text-sm text-gray-600 line-clamp-1">
                      <strong>Mfr:</strong> {medicine.manufacturer}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-1 md:mb-2">
                    <span className="text-base md:text-xl font-bold text-primary-600">
                      ₹{medicine.price}
                    </span>
                    <span className="text-xs md:text-sm text-gray-500 line-through">
                      ₹{medicine.mrp}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs md:text-sm mb-2 md:mb-3">
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
                    <div className="border-t pt-2 md:pt-3 mt-2 md:mt-3">
                      <p className="text-xs md:text-sm font-medium text-gray-900 line-clamp-1">
                        {medicine.pharmacy.pharmacyName}
                      </p>
                      <p className="text-xs text-gray-600 line-clamp-1">
                        {medicine.pharmacy.city}, {medicine.pharmacy.state}
                      </p>
                      <p className="text-xs text-gray-600 line-clamp-1">
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
