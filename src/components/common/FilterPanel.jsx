import React, { useState } from 'react';
import { 
  Filter, 
  X, 
  Search, 
  ChevronDown, 
  Calendar,
  MapPin,
  Award,
  Leaf,
  RefreshCw,
  Save,
  Bookmark
} from 'lucide-react';

const FilterPanel = ({ 
  isOpen, 
  onClose, 
  filters = {}, 
  onFiltersChange,
  filterType = 'suppliers' // 'suppliers', 'procurement', 'products'
}) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [savedFilterName, setSavedFilterName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const certificationOptions = [
    { value: 'ISO14001', label: 'ISO 14001', description: 'Environmental Management' },
    { value: 'ISO14067', label: 'ISO 14067', description: 'Carbon Footprint' },
    { value: 'FairTrade', label: 'Fair Trade', description: 'Ethical Trading' },
    { value: 'B-Corp', label: 'B-Corp', description: 'Certified B Corporation' },
    { value: 'LEED', label: 'LEED', description: 'Green Building' },
    { value: 'EnergyStar', label: 'Energy Star', description: 'Energy Efficiency' }
  ];

  const locationOptions = [
    'North America', 'Europe', 'Asia Pacific', 'Latin America', 
    'Middle East', 'Africa', 'Global'
  ];

  const industryOptions = [
    'Manufacturing', 'Technology', 'Healthcare', 'Automotive', 
    'Textiles', 'Food & Beverage', 'Construction', 'Energy'
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
  };

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const handleResetFilters = () => {
    const resetFilters = {};
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  const handleSaveFilter = () => {
    if (savedFilterName) {
      // Logic to save filter preset
      console.log('Saving filter:', savedFilterName, localFilters);
      setShowSaveDialog(false);
      setSavedFilterName('');
    }
  };

  const getActiveFilterCount = () => {
    return Object.values(localFilters).filter(value => 
      value && (Array.isArray(value) ? value.length > 0 : true)
    ).length;
  };

  const CheckboxGroup = ({ title, options, value = [], onChange }) => (
    <div className="space-y-3">
      <h4 className="font-medium text-gray-900 text-sm">{title}</h4>
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {options.map((option) => {
          const optionValue = typeof option === 'string' ? option : option.value;
          const optionLabel = typeof option === 'string' ? option : option.label;
          const optionDesc = typeof option === 'object' ? option.description : null;
          
          return (
            <label key={optionValue} className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={value.includes(optionValue)}
                onChange={(e) => {
                  const newValue = e.target.checked
                    ? [...value, optionValue]
                    : value.filter(v => v !== optionValue);
                  onChange(newValue);
                }}
                className="mt-0.5 w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500"
              />
              <div>
                <span className="text-sm text-gray-700">{optionLabel}</span>
                {optionDesc && (
                  <div className="text-xs text-gray-500">{optionDesc}</div>
                )}
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );

  const RangeSlider = ({ title, min, max, value = [min, max], onChange, unit = '' }) => (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h4 className="font-medium text-gray-900 text-sm">{title}</h4>
        <span className="text-sm text-gray-600">
          {value[0]}{unit} - {value[1]}{unit}
        </span>
      </div>
      <div className="px-2">
        <div className="relative">
          <input
            type="range"
            min={min}
            max={max}
            value={value[0]}
            onChange={(e) => onChange([parseInt(e.target.value), value[1]])}
            className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <input
            type="range"
            min={min}
            max={max}
            value={value[1]}
            onChange={(e) => onChange([value[0], parseInt(e.target.value)])}
            className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>{min}{unit}</span>
          <span>{max}{unit}</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={onClose} />
      )}
      
      {/* Filter Panel */}
      <div className={`fixed right-0 top-0 h-full bg-white shadow-lg border-l border-gray-200 transition-transform duration-300 z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } w-80 lg:w-96`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-gray-600" />
              <h2 className="font-semibold text-lg text-gray-900">Filters</h2>
              {getActiveFilterCount() > 0 && (
                <span className="bg-emerald-100 text-emerald-800 text-xs font-medium px-2 py-1 rounded-full">
                  {getActiveFilterCount()} active
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Filter Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Search Filter */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 text-sm">Search</h4>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={localFilters.search || ''}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Sustainability Score Range */}
            <RangeSlider
              title="Sustainability Score"
              min={1}
              max={10}
              value={localFilters.sustainabilityScore || [1, 10]}
              onChange={(value) => handleFilterChange('sustainabilityScore', value)}
            />

            {/* Carbon Footprint Range */}
            <RangeSlider
              title="Carbon Footprint"
              min={0}
              max={50}
              value={localFilters.carbonFootprint || [0, 50]}
              onChange={(value) => handleFilterChange('carbonFootprint', value)}
              unit=" tons CO₂"
            />

            {/* Certifications */}
            <CheckboxGroup
              title="Certifications"
              options={certificationOptions}
              value={localFilters.certifications || []}
              onChange={(value) => handleFilterChange('certifications', value)}
            />

            {/* Location */}
            <CheckboxGroup
              title="Location"
              options={locationOptions}
              value={localFilters.locations || []}
              onChange={(value) => handleFilterChange('locations', value)}
            />

            {/* Industry */}
            <CheckboxGroup
              title="Industry"
              options={industryOptions}
              value={localFilters.industries || []}
              onChange={(value) => handleFilterChange('industries', value)}
            />

            {/* Recycling Capability */}
            <RangeSlider
              title="Recycling Capability"
              min={0}
              max={100}
              value={localFilters.recyclingCapability || [0, 100]}
              onChange={(value) => handleFilterChange('recyclingCapability', value)}
              unit="%"
            />

            {/* Date Range */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 text-sm">Last Activity</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">From</label>
                  <input
                    type="date"
                    value={localFilters.dateFrom || ''}
                    onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">To</label>
                  <input
                    type="date"
                    value={localFilters.dateTo || ''}
                    onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Additional Filters Based on Type */}
            {filterType === 'suppliers' && (
              <>
                {/* Company Size */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 text-sm">Company Size</h4>
                  <select
                    value={localFilters.companySize || ''}
                    onChange={(e) => handleFilterChange('companySize', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="">Any Size</option>
                    <option value="startup">Startup (1-50 employees)</option>
                    <option value="small">Small (51-200 employees)</option>
                    <option value="medium">Medium (201-1000 employees)</option>
                    <option value="large">Large (1000+ employees)</option>
                  </select>
                </div>

                {/* Delivery Capabilities */}
                <CheckboxGroup
                  title="Delivery Capabilities"
                  options={['Express Delivery', 'International Shipping', 'Cold Chain', 'Bulk Orders', 'Just-in-Time']}
                  value={localFilters.deliveryCapabilities || []}
                  onChange={(value) => handleFilterChange('deliveryCapabilities', value)}
                />
              </>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="space-y-3">
              {/* Save Filter */}
              <div className="flex gap-2">
                <button
                  onClick={() => setShowSaveDialog(true)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  <Bookmark className="w-4 h-4" />
                  Save Filter
                </button>
                <button
                  onClick={handleResetFilters}
                  className="flex items-center justify-center gap-2 px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {/* Apply/Cancel */}
              <div className="flex gap-2">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApplyFilters}
                  className="flex-1 px-4 py-2 text-sm text-white bg-emerald-600 rounded-lg hover:bg-emerald-700"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Filter Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
          <div className="bg-white rounded-lg p-6 w-80 mx-4">
            <h3 className="font-semibold text-lg text-gray-900 mb-4">Save Filter Preset</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter Name
                </label>
                <input
                  type="text"
                  value={savedFilterName}
                  onChange={(e) => setSavedFilterName(e.target.value)}
                  placeholder="e.g., High Sustainability Suppliers"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowSaveDialog(false)}
                  className="flex-1 px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveFilter}
                  disabled={!savedFilterName}
                  className="flex-1 px-4 py-2 text-sm text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FilterPanel;
