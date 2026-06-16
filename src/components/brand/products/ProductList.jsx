import React, { useState, useEffect } from 'react';
import { 
  Search, Plus, Edit2, Trash2, 
  Image as ImageIcon, ChevronLeft, ChevronRight, 
  X, ExternalLink, ShoppingBag, ArrowLeft,
  ChevronDown, AlertTriangle, Link2Off, Loader2,
  Play
} from 'lucide-react';
import { MOCK_PRODUCTS } from './mockData';
import SetupProductModal from './SetupProductModal';
import { useLocation } from 'react-router-dom';

const ProductList = ({ onProductClick }) => {
  const location = useLocation();
  const [inputValue, setInputValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addStep, setAddStep] = useState('options'); // 'options', 'url', 'manual', 'shopify', 'setup'

  // Handle auto-opening the "New product" modal via URL action parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('action') === 'new') {
      setAddStep('options');
      setIsAddModalOpen(true);
    }
  }, [location.search]);
  const [isShopifyConnected, setIsShopifyConnected] = useState(false);
  const [isDisconnectModalOpen, setIsDisconnectModalOpen] = useState(false);
  const [shopifyStoreName, setShopifyStoreName] = useState('My Awesome Store');
  const [isSearching, setIsSearching] = useState(false);
  const [highlightedProductId, setHighlightedProductId] = useState(null);
  
  // URL Import logic
  const [productUrl, setProductUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [urlError, setUrlError] = useState('');

  // Sync state for Meta and GMC
  const [syncStates, setSyncStates] = useState({
    gmc: { isConnected: false, isConnecting: false, email: '' },
    meta: { isConnected: false, isConnecting: false, email: '' }
  });

  // Form State
  const [productForm, setProductForm] = useState({
    name: '',
    url: '',
    category: '',
    description: '',
    priceRange: '',
    type: 'Non-type',
    usps: [''],
    positioning: {
      valueProposition: [],
      features: [],
      usageScenarios: [],
      painPoints: [],
      buyingMotivations: []
    },
    audience: [
      { id: Date.now(), name: 'Audience Name', age: '', gender: 'All', traits: [] }
    ],
    assets: {
      main: [], detailed: [], demo: [], testimonial: [], lifestyle: [], 
      painpoints: [], comparison: [], result: [], others: [],
      problem: [], intro: [], action: [], environment: [], team: []
    }
  });

  const itemsPerPage = 10;

  const filteredProducts = products.filter(product =>
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
    }, 600);
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

  const handleAnalyzeUrl = () => {
    if (!productUrl) {
      setUrlError('Please provide a valid product url');
      return;
    }
    setUrlError('');
    setIsAnalyzing(true);
    
    // Simulate setting data from URL
    setProductForm(prev => ({
      ...prev,
      name: 'AdsGo AI – Your 24/7 AI Ad Expert',
      url: productUrl,
      description: 'Start your campaign today to achieve these results with AdsGo AI.'
    }));

    setTimeout(() => {
      setIsAnalyzing(false);
      setAddStep('setup');
    }, 5000);
  };

  const handleCreateProduct = (formData) => {
    const newProduct = {
      id: Date.now(),
      name: formData.name,
      url: formData.url,
      category: formData.category,
      type: formData.type,
      source: addStep === 'url' ? 'URL' : 
              addStep === 'gmc' ? 'Google GMC' :
              addStep === 'meta' ? 'Meta feeds' : 'Manual',
      updatedOn: new Date().toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }),
      image: 'https://picsum.photos/seed/new/150/150',
      description: formData.description,
      usps: formData.usps.filter(u => u.trim()),
      positioning: formData.positioning,
      audience: formData.audience,
      assets: formData.assets
    };

    setProducts([newProduct, ...products]);
    setHighlightedProductId(newProduct.id);
    closeAddModal();

    setTimeout(() => {
      setHighlightedProductId(null);
    }, 3000);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setIsAnalyzing(false);
    setProductUrl('');
    setUrlError('');
    setAddStep('options');
  };

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

  const handleSyncConnect = (platform) => {
    setSyncStates(prev => ({
      ...prev,
      [platform]: { ...prev[platform], isConnecting: true }
    }));

    setTimeout(() => {
      setSyncStates(prev => ({
        ...prev,
        [platform]: { 
          isConnected: true, 
          isConnecting: false, 
          email: 'user@example.com' 
        }
      }));
    }, 3000);
  };

  const handleSyncDisconnect = (platform) => {
    setSyncStates(prev => ({
      ...prev,
      [platform]: { isConnected: false, isConnecting: false, email: '' }
    }));
  };

  const addOptions = [
    {
      id: 'shopify',
      title: 'Sync from Shopify',
      subtitle: 'Automatically import and update all your products from Shopify',
      logo: 'https://cdn.worldvectorlogo.com/logos/shopify.svg'
    },
    {
      id: 'meta',
      title: 'Sync From Meta Feeds',
      subtitle: 'Import products directly from your Meta Commerce Manager',
      logo: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://meta.com&size=256'
    },
    {
      id: 'gmc',
      title: 'Sync From Google GMC',
      subtitle: 'Import products directly from your Google Merchant Center',
      logo: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://google.com&size=256'
    },
    {
      id: 'url',
      title: 'Import from URL',
      subtitle: 'Paste a product page link and we\'ll pull the details for you',
      icon: ExternalLink
    },
    {
      id: 'setup',
      title: 'Enter Manually',
      subtitle: 'Manually enter all the product details',
      icon: Edit2,
      isManual: true
    }
  ];

  const platformIcons = [
    { id: 'amazon', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' },
    { id: 'shopify', logo: 'https://cdn.worldvectorlogo.com/logos/shopify.svg' },
    { id: 'etsy', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Etsy_logo.svg' },
    { id: 'ebay', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/Ebay_logo.svg' },
    { id: 'apple', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' },
    { id: 'playstore', logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/Google_Play_Arrow_logo.svg' },
    { id: 'wordpress', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/09/Wordpress-Logo.svg' },
    { id: 'wix', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/76/Wix.com_website_logo.svg' }
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] p-8 flex flex-col font-sans text-slate-900">
      <div className="w-full mx-auto space-y-6 flex-1">
        <div className="flex items-center justify-end py-4 mb-4">
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
              className="pointer-events-auto bg-slate-900 hover:bg-black text-white px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-slate-200"
            >
              <Plus size={18} />
              New product
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden flex flex-col relative min-h-[400px]">
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
                <tr className="border-b border-slate-50 text-slate-400 text-sm font-bold">
                  <th className="px-8 py-5 w-[35%]">Landingpage</th>
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
                    className={`transition-all cursor-pointer group ${
                      highlightedProductId === product.id 
                        ? 'bg-indigo-50/80 animate-[pulse_1s_ease-in-out_3]' 
                        : 'hover:bg-slate-50/50'
                    }`}
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
                      <div className="flex flex-col min-w-0 overflow-hidden">
                        <span className="text-sm font-bold text-slate-700 truncate mb-0.5">
                          {product.name}
                        </span>
                        <span className="text-[10px] font-medium text-slate-400 truncate opacity-70">
                          {product.url || 'No link provided'}
                        </span>
                      </div>
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
                      product.type === 'Non-type' ? 'bg-slate-100 text-slate-500' :
                      'bg-slate-100 text-slate-500'
                    }`}>
                      {product.type || 'Non-type'}
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

          <div className={`px-8 py-6 border-t border-slate-50 flex items-center justify-between bg-white transition-opacity ${isSearching ? 'opacity-20' : 'opacity-100'}`}>
            <div className="text-xs font-bold text-slate-400">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredProducts.length)} of {filteredProducts.length} products
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 border border-slate-100 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"><ChevronLeft size={16} /></button>
              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button key={i + 1} onClick={() => handlePageChange(i + 1)} className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${currentPage === i + 1 ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}>{i + 1}</button>
                ))}
              </div>
              <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 border border-slate-100 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"><ChevronRight size={16} /></button>
            </div>
          </div>
        </div>
      </div>

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="px-8 pt-8 pb-4 flex justify-between items-start">
              <h3 className="text-xl font-bold text-slate-900 font-sans">Delete product?</h3>
              <button onClick={closeDeleteModal} className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all"><X size={20} /></button>
            </div>
            <div className="px-8 py-2"><p className="text-sm font-medium text-slate-500 leading-relaxed font-sans">确认删除此产品吗？</p></div>
            <div className="p-8 flex items-center gap-3">
              <button onClick={closeDeleteModal} className="flex-1 px-6 py-3 border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all active:scale-95">Cancel</button>
              <button onClick={handleDelete} className="flex-1 px-6 py-3 bg-rose-500 text-white rounded-2xl text-sm font-bold hover:bg-rose-600 shadow-lg shadow-rose-200 transition-all active:scale-95">Delete</button>
            </div>
          </div>
        </div>
      )}

      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className={`bg-white rounded-[40px] w-full shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200 flex flex-col relative transition-all duration-500 ${
            addStep === 'setup' ? 'max-w-4xl h-[90vh]' : 'max-w-2xl min-h-[400px]'
          }`}>
            {isAnalyzing && (
              <div className="absolute inset-0 z-[120] bg-white rounded-[40px] flex flex-col items-center justify-center p-10 text-center animate-in fade-in duration-300">
                <div className="w-20 h-20 rounded-[32px] bg-indigo-50 flex items-center justify-center mb-6 shadow-inner relative">
                  <div className="absolute inset-0 rounded-[32px] border-4 border-indigo-100 border-t-indigo-500 animate-spin" />
                  <Loader2 className="text-indigo-500 animate-spin" size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 font-sans">Analyzing product info...</h3>
                <p className="text-xs text-slate-400 font-medium mb-10 max-w-[320px] font-sans">We're fetching details from the URL. This might take a few moments.</p>
                <button onClick={closeAddModal} className="px-10 py-3.5 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-black transition-all active:scale-95 shadow-lg shadow-slate-200 font-sans">Close and analyze in background</button>
              </div>
            )}

            <div className="p-8 pb-4 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-4">
                {addStep !== 'options' && (
                  <button onClick={() => setAddStep('options')} className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all"><ArrowLeft size={20} /></button>
                )}
                <h3 className="text-xl font-bold text-slate-900 font-sans">
                  {addStep === 'options' ? 'How do you want to add product?' :
                   addStep === 'url' ? 'Import from URL' :
                   addStep === 'setup' ? 'Setup your product' : 
                   addStep === 'shopify' ? 'Sync from Shopify' :
                   addStep === 'gmc' ? 'Sync from Google GMC' : 'Sync from Meta Feeds'}
                </h3>
              </div>
              <button onClick={closeAddModal} className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all"><X size={20} /></button>
            </div>
            
            <div className="px-8 pb-8 flex-1 flex flex-col overflow-hidden">
              {addStep === 'options' && (
                <div className="space-y-4 pt-4">
                  {addOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => {
                        if (option.isManual) {
                          setProductForm({
                            name: '', url: '', category: '', description: '', priceRange: '',
                            type: 'Non-type', usps: [''],
                            positioning: { valueProposition: [], features: [], usageScenarios: [], painPoints: [], buyingMotivations: [] },
                            audience: [{ id: Date.now(), name: 'Audience Name', age: '', gender: 'All', traits: [] }],
                            assets: { main: [], detailed: [], demo: [], testimonial: [], lifestyle: [], painpoints: [], comparison: [], result: [], others: [], problem: [], intro: [], action: [], environment: [], team: [] }
                          });
                        }
                        setAddStep(option.id);
                      }}
                      className="w-full group flex items-center gap-6 p-6 bg-slate-50 border border-slate-100 rounded-[28px] hover:bg-white hover:shadow-xl hover:border-indigo-100 transition-all text-left"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-indigo-50 group-hover:border-indigo-50 group-hover:shadow-inner transition-all overflow-hidden p-3 shrink-0">
                        {option.logo ? <img src={option.logo} alt="" className="w-full h-full object-contain" /> : <option.icon size={26} />}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-base font-bold text-slate-700 mb-1 font-sans">{option.title}</h4>
                        <p className="text-xs font-medium text-slate-400 leading-relaxed font-sans">{option.subtitle}</p>
                      </div>
                      <ChevronRight size={20} className="text-slate-300 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>
              )}

              {addStep === 'url' && (
                <div className="flex-1 flex flex-col pt-6 px-10 text-center">
                  <div className="space-y-8 mb-12">
                    <h2 className="text-3xl font-bold text-slate-900 leading-tight font-sans">Paste your <span className="text-indigo-500">product link</span> to get product info</h2>
                    <div className="space-y-4">
                      <p className="text-[10px] font-bold text-slate-400 font-sans">AdsGo Supports</p>
                      <div className="flex items-center justify-center gap-4">
                        {platformIcons.map(icon => (
                          <div key={icon.id} className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center p-2 shadow-sm hover:shadow-md hover:scale-110 transition-all cursor-default">
                            <img src={icon.logo} alt={icon.id} className="w-full h-full object-contain" />
                          </div>
                        ))}
                        <div className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-300 font-bold text-sm">...</div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-8 max-w-[520px] mx-auto w-full flex-1 flex flex-col">
                    <div className="space-y-3">
                      <div className="relative group">
                        <input type="text" value={productUrl} onChange={(e) => setProductUrl(e.target.value)} placeholder="e.g. amazon product link, shopify product link, etc." className={`w-full bg-slate-50 border-[1.5px] rounded-[24px] px-8 py-6 text-sm font-medium text-slate-700 placeholder:text-slate-300 focus:outline-none transition-all duration-300 ${urlError ? 'border-rose-400 bg-rose-50/20' : 'border-slate-100 focus:bg-white focus:border-indigo-300 focus:ring-[8px] focus:ring-indigo-500/5 shadow-inner'}`} />
                        {urlError && <div className="absolute -bottom-7 left-4 flex items-center gap-1.5 text-rose-500 font-bold text-[10px] animate-in slide-in-from-top-1"><AlertTriangle size={12} />{urlError}</div>}
                      </div>
                    </div>
                    <div className="mt-auto"><button onClick={handleAnalyzeUrl} className="w-full bg-indigo-600 text-white py-5 rounded-[22px] font-bold text-base hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-[0.97] font-sans">Analyze URL</button></div>
                  </div>
                </div>
              )}

              {addStep === 'setup' && (
                <SetupProductModal 
                  isOpen={true} 
                  initialData={productForm} 
                  onClose={() => setAddStep('options')} 
                  onCreate={handleCreateProduct} 
                />
              )}

              {addStep === 'shopify' && (
                <div className="flex-1 flex flex-col justify-center items-center text-center space-y-8 py-6">
                  {!isShopifyConnected ? (
                    <>
                      <div className="w-20 h-20 rounded-[24px] bg-slate-50 border border-slate-100 flex items-center justify-center p-4 shadow-inner"><img src="https://cdn.worldvectorlogo.com/logos/shopify.svg" alt="" className="w-full h-full object-contain" /></div>
                      <div className="max-w-[320px] space-y-2">
                        <h4 className="text-lg font-bold text-slate-900 font-sans">Connect to Shopify</h4>
                        <p className="text-xs text-slate-400 leading-relaxed font-medium font-sans">Link your Shopify store to automatically import products and keep assets in sync.</p>
                      </div>
                      <button onClick={handleShopifyConnect} className="w-full max-w-[280px] bg-slate-900 text-white py-4 rounded-2xl font-bold text-sm hover:bg-black shadow-lg shadow-slate-200 transition-all active:scale-95 font-sans">Connect Shopify Store</button>
                    </>
                  ) : (
                    <>
                      <div className="relative">
                        <div className="w-20 h-20 rounded-[24px] bg-green-50 border border-green-100 flex items-center justify-center p-4 shadow-inner"><img src="https://cdn.worldvectorlogo.com/logos/shopify.svg" alt="" className="w-full h-full object-contain" /></div>
                        <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-green-500 border-4 border-white rounded-full flex items-center justify-center shadow-sm"><div className="w-1.5 h-1.5 bg-white rounded-full" /></div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-lg font-bold text-slate-900 font-sans">{shopifyStoreName}</h4>
                        <div className="flex items-center justify-center gap-2"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /><p className="text-xs text-green-600 font-bold tracking-wide font-sans">Connected</p></div>
                      </div>
                      <div className="w-full pt-6"><button onClick={() => setIsDisconnectModalOpen(true)} className="px-8 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 hover:border-rose-100 font-bold text-[13px] transition-all flex items-center gap-2 mx-auto shadow-sm font-sans"><Link2Off size={18} />Disconnect Store</button></div>
                    </>
                  )}
                </div>
              )}

              {(addStep === 'gmc' || addStep === 'meta') && (
                <div className="flex-1 flex flex-col justify-center items-center text-center space-y-8 py-6">
                  {syncStates[addStep].isConnecting ? (
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-20 h-20 rounded-[24px] bg-indigo-50 flex items-center justify-center shadow-inner">
                        <Loader2 className="text-indigo-500 animate-spin" size={32} />
                      </div>
                      <p className="text-sm font-bold text-slate-900">Fetching Your Assets...</p>
                    </div>
                  ) : !syncStates[addStep].isConnected ? (
                    <>
                      <div className="w-20 h-20 rounded-[24px] bg-slate-50 border border-slate-100 flex items-center justify-center p-4 shadow-inner">
                        <img 
                          src={addStep === 'gmc' ? 
                            'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://google.com&size=256' : 
                            'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://meta.com&size=256'
                          } 
                          alt="" 
                          className="w-full h-full object-contain" 
                        />
                      </div>
                      <div className="max-w-[320px] space-y-2">
                        <h4 className="text-lg font-bold text-slate-900 font-sans">
                          {addStep === 'gmc' ? 'Google GMC' : 'Meta Feeds'}
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed font-medium font-sans">
                          {addStep === 'gmc' ? 
                            'Connect to Google Merchant Center to sync your products.' : 
                            'Connect to Meta Commerce Manager to sync your product feeds.'}
                        </p>
                      </div>
                      <button 
                        onClick={() => handleSyncConnect(addStep)} 
                        className="w-full max-w-[280px] bg-slate-900 text-white py-4 rounded-2xl font-bold text-sm hover:bg-black shadow-lg shadow-slate-200 transition-all active:scale-95 font-sans"
                      >
                        Connect
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="relative">
                        <div className="w-20 h-20 rounded-[24px] bg-green-50 border border-green-100 flex items-center justify-center p-4 shadow-inner">
                          <img 
                            src={addStep === 'gmc' ? 
                              'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://google.com&size=256' : 
                              'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://meta.com&size=256'
                            } 
                            alt="" 
                            className="w-full h-full object-contain" 
                          />
                        </div>
                        <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-green-500 border-4 border-white rounded-full flex items-center justify-center shadow-sm">
                          <div className="w-1.5 h-1.5 bg-white rounded-full" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-lg font-bold text-slate-900 font-sans">{syncStates[addStep].email}</h4>
                        <div className="flex items-center justify-center gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          <p className="text-xs text-green-600 font-bold tracking-wide font-sans">Connected</p>
                        </div>
                      </div>
                      <div className="w-full pt-6">
                        <button 
                          onClick={() => handleSyncDisconnect(addStep)} 
                          className="px-8 py-3 bg-rose-50 text-rose-500 border border-rose-100 rounded-2xl font-bold text-[13px] transition-all flex items-center gap-2 mx-auto shadow-sm font-sans"
                        >
                          <Link2Off size={18} />
                          Disconnect
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
