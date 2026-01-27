import React, { useState, useEffect } from 'react';
import { 
  Search, Plus, Edit2, Trash2, 
  Image as ImageIcon, ChevronLeft, ChevronRight, 
  X, ExternalLink, ShoppingBag, ArrowLeft,
  ChevronDown, AlertTriangle, Link2Off, Loader2
} from 'lucide-react';
import { MOCK_PRODUCTS } from './mockData';

const ProductList = ({ onProductClick }) => {
  const [inputValue, setInputValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addStep, setAddStep] = useState('options'); // 'options', 'url', 'manual', 'shopify'
  const [isShopifyConnected, setIsShopifyConnected] = useState(false);
  const [isDisconnectModalOpen, setIsDisconnectModalOpen] = useState(false);
  const [shopifyStoreName, setShopifyStoreName] = useState('My Awesome Store');
  const [isSearching, setIsSearching] = useState(false);
  
  const itemsPerPage = 10;

  const filteredProducts = MOCK_PRODUCTS.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  // 模拟搜索过渡态
  const performSearch = (val) => {
    setIsSearching(true);
    setTimeout(() => {
      setSearchTerm(val);
      setCurrentPage(1);
      setIsSearching(false);
    }, 600); // 模拟 600ms 加载延迟
  };

  const handleSearchBlur = () => {
    if (inputValue !== searchTerm) {
      performSearch(inputValue);
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      performSearch(inputValue);
    }
  };

  // 获取末级类目
  const getLastCategory = (categoryPath) => {
    if (!categoryPath) return '';
    const parts = categoryPath.split('>');
    return parts[parts.length - 1].trim();
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const openDeleteModal = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const handleDelete = () => {
    console.log('Deleting product:', productToDelete?.id);
    closeDeleteModal();
  };

  const handleShopifyConnect = () => {
    window.open('https://www.shopify.com/admin/oauth/authorize', '_blank');
    setTimeout(() => {
      setIsShopifyConnected(true);
      setAddStep('shopify');
      setCurrentPage(1);
    }, 1000);
  };

  const handleShopifyDisconnect = () => {
    setIsDisconnectModalOpen(false);
    setIsShopifyConnected(false);
  };

  const addOptions = [
    {
      id: 'url',
      title: 'Import from URL',
      subtitle: 'Paste a product page link and we\'ll pull the details for you',
      icon: ExternalLink
    },
    {
      id: 'manual',
      title: 'Enter Manually',
      subtitle: 'Manually enter all the product details',
      icon: Edit2
    },
    {
      id: 'shopify',
      title: 'Sync from Shopify',
      subtitle: 'Automatically import and update all your products from Shopify',
      logo: 'https://cdn.worldvectorlogo.com/logos/shopify.svg'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] p-8 flex flex-col font-sans">
      <div className="w-full mx-auto space-y-6 flex-1">
        {/* Header Section */}
        <div className="flex items-center justify-end mb-8">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${isSearching ? 'text-indigo-500' : 'text-slate-400'}`} size={18} />
              <input
                type="text"
                placeholder="Search by product name"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onBlur={handleSearchBlur}
                onKeyDown={handleSearchKeyDown}
                className="bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 w-[300px] text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm"
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Loader2 size={14} className="text-indigo-500 animate-spin" />
                </div>
              )}
            </div>
            <button 
              onClick={() => {
                setAddStep('options');
                setIsAddModalOpen(true);
              }}
              className="bg-slate-900 hover:bg-black text-white px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-slate-200"
            >
              <Plus size={18} />
              New product
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden flex flex-col relative min-h-[400px]">
          {/* Loading Overlay */}
          {isSearching && (
            <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[1px] flex flex-col items-center justify-center gap-3 animate-in fade-in duration-200">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center shadow-inner">
                <Loader2 className="text-indigo-500 animate-spin" size={24} />
              </div>
              <p className="text-xs font-bold text-slate-400 tracking-wide">Searching products...</p>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse table-fixed min-w-[1000px]">
              <thead>
                <tr className="border-b border-slate-50 text-slate-400 text-sm font-bold tracking-wider">
                  <th className="px-8 py-5 w-[35%]">Product</th>
                  <th className="px-8 py-5 w-[12%]">Category</th>
                  <th className="px-8 py-5 w-[10%]">Type</th>
                  <th className="px-8 py-5 w-[10%]">Source</th>
                  <th className="px-8 py-5 w-[18%]">Updated on</th>
                  <th className="px-8 py-5 w-[15%] text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y divide-slate-50 transition-opacity duration-200 ${isSearching ? 'opacity-20' : 'opacity-100'}`}>
                {currentItems.map((product) => (
                  <tr 
                    key={product.id} 
                    className="hover:bg-slate-50/50 transition-colors cursor-pointer group"
                    onClick={() => onProductClick(product)}
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4 overflow-hidden">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 overflow-hidden flex items-center justify-center border border-slate-100 shadow-inner group-hover:scale-105 transition-transform shrink-0">
                          {product.image ? (
                            <img src={product.image} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="text-slate-300" size={20} />
                          )}
                        </div>
                        <span className="text-sm font-bold text-slate-700 truncate">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm font-medium text-slate-500">
                      <span className="truncate block">
                        {getLastCategory(product.category)}
                      </span>
                    </td>
                  <td className="px-8 py-5 text-sm font-medium text-slate-500">
                    <span className={`inline-block px-2 py-1 rounded-md text-[10px] font-bold whitespace-nowrap ${
                      product.type === 'Physical Goods' ? 'bg-blue-50 text-blue-600' :
                      product.type === 'Service' ? 'bg-purple-50 text-purple-600' :
                      'bg-slate-100 text-slate-500'
                    }`}>
                      {product.type}
                    </span>
                  </td>
                    <td className="px-8 py-5 text-sm font-medium text-slate-500 whitespace-nowrap">
                      {product.source}
                    </td>
                    <td className="px-8 py-5 text-sm font-medium text-slate-500 whitespace-nowrap">
                      {product.updatedOn}
                    </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex flex-col items-end gap-2" onClick={(e) => e.stopPropagation()}>
                      <button className="bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 px-3 py-1.5 rounded-xl text-[10px] font-bold border border-slate-100 transition-all whitespace-nowrap">
                        Generate Campaigns
                      </button>
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => onProductClick(product)}
                          className="p-1.5 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button 
                          onClick={() => openDeleteModal(product)}
                          className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Section */}
          <div className={`px-8 py-6 border-t border-slate-50 flex items-center justify-between bg-white transition-opacity ${isSearching ? 'opacity-20' : 'opacity-100'}`}>
            <div className="text-xs font-bold text-slate-400">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredProducts.length)} of {filteredProducts.length} products
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 border border-slate-100 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={16} />
              </button>
              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                      currentPage === i + 1 
                        ? 'bg-slate-900 text-white shadow-md' 
                        : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 border border-slate-100 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {filteredProducts.length === 0 && !isSearching && (
            <div className="py-24 text-center">
              <div className="flex flex-col items-center gap-3 opacity-20">
                 <ImageIcon size={48} />
                 <p className="text-sm font-bold">No products found</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="px-8 pt-8 pb-4 flex justify-between items-start">
              <h3 className="text-xl font-bold text-slate-900">Delete product?</h3>
              <button 
                onClick={closeDeleteModal}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="px-8 py-2">
              <p className="text-sm font-medium text-slate-500 leading-relaxed">
                Are you sure you want to delete this product? This action is irreversible.
              </p>
            </div>

            <div className="p-8 flex items-center gap-3">
              <button 
                onClick={closeDeleteModal}
                className="flex-1 px-6 py-3 border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all active:scale-95"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                className="flex-1 px-6 py-3 bg-rose-500 text-white rounded-2xl text-sm font-bold hover:bg-rose-600 shadow-lg shadow-rose-200 transition-all active:scale-95"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Shopify Disconnect Modal */}
      {isDisconnectModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="p-8 pb-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
                <AlertTriangle size={20} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Disconnect Shopify?</h3>
            </div>
            
            <div className="px-8 py-2">
              <p className="text-sm font-medium text-slate-500 leading-relaxed">
                解除连接后，商品信息将不再更新，确认吗？
              </p>
            </div>

            <div className="p-8 flex items-center gap-3">
              <button 
                onClick={() => setIsDisconnectModalOpen(false)}
                className="flex-1 px-6 py-3 border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all active:scale-95"
              >
                Cancel
              </button>
              <button 
                onClick={handleShopifyDisconnect}
                className="flex-1 px-6 py-3 bg-rose-500 text-white rounded-2xl text-sm font-bold hover:bg-rose-600 shadow-lg shadow-rose-200 transition-all active:scale-95"
              >
                Disconnect
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Flow Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] w-full max-w-lg overflow-hidden shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200 min-h-[400px] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-8 pb-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                {addStep !== 'options' && (
                  <button 
                    onClick={() => setAddStep('options')}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all"
                  >
                    <ArrowLeft size={20} />
                  </button>
                )}
                <h3 className="text-xl font-bold text-slate-900">
                  {addStep === 'options' ? 'How do you want to add product?' :
                   addStep === 'url' ? 'Import from URL' :
                   addStep === 'manual' ? 'Enter Manually' : 'Sync from Shopify'}
                </h3>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="px-8 pb-8 flex-1 flex flex-col">
              {/* Step 1: Options */}
              {addStep === 'options' && (
                <div className="space-y-3">
                  {addOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setAddStep(option.id)}
                      className="w-full group flex items-center gap-4 p-5 bg-slate-50 border border-slate-100 rounded-[24px] hover:bg-white hover:shadow-md hover:border-indigo-100 transition-all text-left"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-indigo-50 group-hover:border-indigo-50 group-hover:shadow-inner transition-all overflow-hidden p-2.5 shrink-0">
                        {option.logo ? (
                          <img src={option.logo} alt="" className="w-full h-full object-contain" />
                        ) : (
                          <option.icon size={22} />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-slate-700 mb-0.5">{option.title}</h4>
                        <p className="text-[11px] font-medium text-slate-400">{option.subtitle}</p>
                      </div>
                      <ChevronRight size={18} className="text-slate-300 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>
              )}

              {/* Step 2: URL Import */}
              {addStep === 'url' && (
                <div className="space-y-6 py-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-400 tracking-wider">Product URL</label>
                    <input 
                      type="text" 
                      placeholder="https://example.com/product/..." 
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:bg-white focus:border-indigo-300 transition-all"
                    />
                  </div>
                  <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-sm hover:bg-black shadow-lg shadow-slate-200 transition-all active:scale-95">
                    Import Product
                  </button>
                </div>
              )}

              {/* Step 2: Manual Entry */}
              {addStep === 'manual' && (
                <div className="space-y-6 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-slate-400 tracking-wider">Product Name</label>
                      <input type="text" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-300" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-slate-400 tracking-wider">Category</label>
                      <div className="relative">
                        <select className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm appearance-none focus:outline-none focus:border-indigo-300">
                          <option>Select Category</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-400 tracking-wider">Description</label>
                    <textarea className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm min-h-[100px] resize-none focus:outline-none focus:border-indigo-300" />
                  </div>
                  <button 
                    onClick={() => {
                      setIsAddModalOpen(false);
                      onProductClick(null);
                    }}
                    className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-sm hover:bg-black shadow-lg shadow-slate-200 transition-all active:scale-95"
                  >
                    Create Product
                  </button>
                </div>
              )}

              {/* Step 2: Shopify Sync */}
              {addStep === 'shopify' && (
                <div className="flex-1 flex flex-col justify-center items-center text-center space-y-8 py-6">
                  {!isShopifyConnected ? (
                    <>
                      <div className="w-20 h-20 rounded-[24px] bg-slate-50 border border-slate-100 flex items-center justify-center p-4 shadow-inner">
                        <img src="https://cdn.worldvectorlogo.com/logos/shopify.svg" alt="" className="w-full h-full object-contain" />
                      </div>
                      <div className="max-w-[320px] space-y-2">
                        <h4 className="text-lg font-bold text-slate-900">Connect to Shopify</h4>
                        <p className="text-xs text-slate-400 leading-relaxed font-medium">
                          Link your Shopify store to automatically import products and keep your assets in sync with your ads.
                        </p>
                      </div>
                      <button 
                        onClick={handleShopifyConnect}
                        className="w-full max-w-[280px] bg-slate-900 text-white py-4 rounded-2xl font-bold text-sm hover:bg-black shadow-lg shadow-slate-200 transition-all active:scale-95"
                      >
                        Connect Shopify Store
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="relative">
                        <div className="w-20 h-20 rounded-[24px] bg-green-50 border border-green-100 flex items-center justify-center p-4 shadow-inner">
                          <img src="https://cdn.worldvectorlogo.com/logos/shopify.svg" alt="" className="w-full h-full object-contain" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 border-4 border-white rounded-full flex items-center justify-center">
                          <div className="w-1.5 h-1.5 bg-white rounded-full" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-lg font-bold text-slate-900">{shopifyStoreName}</h4>
                        <div className="flex items-center justify-center gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          <p className="text-xs text-green-600 font-bold tracking-wide">Connected</p>
                        </div>
                      </div>
                      <div className="w-full pt-6">
                        <button 
                          onClick={() => setIsDisconnectModalOpen(true)}
                          className="px-8 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 hover:border-rose-100 font-bold text-[13px] transition-all flex items-center gap-2 mx-auto shadow-sm"
                        >
                          <Link2Off size={18} />
                          Disconnect Store
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
