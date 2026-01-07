import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { 
  Leaf, 
  Package, 
  Truck, 
  Camera, 
  MessageCircle, 
  Zap, 
  CheckCircle, 
  X, 
  Menu,
  ChevronRight,
  TrendingUp, 
  Lock,
  LogOut,
  Users,
  Plus,
  Trash2,
  Sparkles,
  Loader
} from 'lucide-react';

// --- TypeScript Interfaces ---
interface User {
  username: string;
  role: 'admin' | 'user';
}

interface InventoryItem {
  id: number;
  name: string;
  type: string;
  thc: string;
  stock: string;
  price: string;
  new: boolean;
  description: string;
}

interface NewProduct {
  name: string;
  type: string;
  thc: string;
  stock: string;
  description: string;
}

interface PackagingBackground {
  id: string;
  name: string;
  class: string;
}

interface PackagingFont {
  id: string;
  name: string;
  class: string;
}

interface ChatWidgetProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: User;
  onLogout: () => void;
}

interface MarketMatcherProps {
  inventory: InventoryItem[];
  onOpenChat: () => void;
}

interface AdminDashboardProps {
  inventory: InventoryItem[];
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
}

interface LoginProps {
  onLogin: (user: User) => void;
}

interface HeroProps {
  setActiveTab: (tab: string) => void;
}

interface InventoryProps {
  inventory: InventoryItem[];
  onOpenChat: () => void;
}

interface PackagingStudioProps {
  onOpenChat: () => void;
}

// --- Configuration ---
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || ""; // API Key provided by environment

// --- Gemini API Helper ---
const generateWithGemini = async (prompt: string) => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Could not generate content.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI Service currently unavailable.";
  }
};

// --- Mock Data ---

const INITIAL_INVENTORY: InventoryItem[] = [
  { id: 1, name: "Purple Haze", type: "Sativa", thc: "22%", stock: "High", price: "Bulk Rates Available", new: false, description: "A classic legendary strain known for its euphoric and energetic high." },
  { id: 2, name: "Gorilla Glue #4", type: "Hybrid", thc: "26%", stock: "Low", price: "Bulk Rates Available", new: true, description: "Potent hybrid strain that delivers heavy-handed euphoria and relaxation." },
  { id: 3, name: "Granddaddy Purple", type: "Indica", thc: "21%", stock: "Medium", price: "Bulk Rates Available", new: false, description: "Famous indica cross delivering a complex grape and berry aroma." },
  { id: 4, name: "Sour Diesel", type: "Sativa", thc: "24%", stock: "Out of Stock", price: "Restocking Soon", new: false, description: "Fast-acting strain that delivers energizing, dreamy cerebral effects." },
  { id: 5, name: "Blue Dream", type: "Hybrid", thc: "19%", stock: "High", price: "Bulk Rates Available", new: false, description: "A sativa-dominant hybrid legendary for its balanced full-body relaxation." },
  { id: 6, name: "Wedding Cake", type: "Indica", thc: "25%", stock: "High", price: "Bulk Rates Available", new: true, description: "Rich and tangy with earthy and peppery flavors." },
];

const PACKAGING_OPTIONS: { backgrounds: PackagingBackground[]; fonts: PackagingFont[] } = {
  backgrounds: [
    { id: 'matte-black', name: 'Matte Black', class: 'bg-neutral-900 border-neutral-800' },
    { id: 'holographic', name: 'Holographic Silver', class: 'bg-gradient-to-r from-gray-200 via-gray-400 to-gray-200 text-black' },
    { id: 'neon-green', name: 'Neon Gradient', class: 'bg-gradient-to-br from-green-400 to-emerald-900 text-white' },
    { id: 'kraft', name: 'Organic Kraft', class: 'bg-amber-100 border-amber-200 text-amber-900' },
    { id: 'gold', name: 'Lux Gold', class: 'bg-gradient-to-br from-yellow-500 via-yellow-200 to-yellow-600 text-black' },
  ],
  fonts: [
    { id: 'modern', name: 'Modern Sans', class: 'font-sans tracking-widest uppercase' },
    { id: 'graffiti', name: 'Street Style', class: 'font-mono italic font-bold' },
    { id: 'elegant', name: 'Elegant Serif', class: 'font-serif tracking-wide' },
    { id: 'bold', name: 'Impact Bold', class: 'font-extrabold uppercase' },
    { id: 'minimal', name: 'Minimalist', class: 'font-light lowercase tracking-widest' },
  ]
};

// --- Components ---

const ChatWidget = ({ isOpen, setIsOpen }: ChatWidgetProps) => {
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSend = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setMessage('');
      setIsOpen(false);
    }, 2000);
  };

  if (!isOpen) return (
    <button 
      type="button"
      onClick={() => setIsOpen(true)}
      className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-black font-bold p-4 rounded-full shadow-lg z-50 transition-all transform hover:scale-105 flex items-center gap-2"
    >
      <MessageCircle size={24} />
      <span className="hidden md:inline">Message Support</span>
    </button>
  );

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl z-50 overflow-hidden">
      <div className="bg-neutral-800 p-4 flex justify-between items-center border-b border-neutral-700">
        <h3 className="font-bold text-green-500 flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          BC Flame Support
        </h3>
        <button type="button" onClick={() => setIsOpen(false)} className="text-neutral-400 hover:text-white">
          <X size={20} />
        </button>
      </div>
      <div className="p-4 h-64 overflow-y-auto bg-neutral-900/95 flex flex-col gap-3">
        <div className="bg-neutral-800 p-3 rounded-lg rounded-tl-none self-start max-w-[85%] text-sm text-gray-300">
          Welcome to BC Flame Partner Portal. How can we help you scale your brand today?
        </div>
        {sent && (
          <div className="bg-green-500/20 text-green-400 p-3 rounded-lg self-center text-sm">
            Message sent! An agent will reply shortly.
          </div>
        )}
      </div>
      <form onSubmit={handleSend} className="p-3 bg-neutral-800 border-t border-neutral-700 flex gap-2">
        <input 
          type="text" 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Inquire about bulk orders..."
          className="flex-1 bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500"
        />
        <button type="submit" className="bg-green-500 text-black p-2 rounded hover:bg-green-400">
          <ChevronRight size={20} />
        </button>
      </form>
    </div>
  );
};

const Navbar = ({ activeTab, setActiveTab, user, onLogout }: NavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-black/90 backdrop-blur-md border-b border-neutral-800 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-tr from-green-600 to-emerald-400 p-2 rounded-lg">
              <Zap className="text-black" size={24} fill="currentColor" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tighter text-white">BC FLAME</h1>
              <p className="text-[10px] text-green-500 tracking-widest uppercase font-semibold">
                {user.role === 'admin' ? 'Admin Dashboard' : 'Wholesale Partners'}
              </p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-baseline space-x-4">
              {user.role === 'user' ? (
                ['Home', 'Inventory', 'Packaging Studio', 'Market Matcher'].map((item) => (
                  <button
                    type="button"
                    key={item}
                    onClick={() => setActiveTab(item)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === item 
                        ? 'text-green-500 bg-neutral-900' 
                        : 'text-gray-300 hover:text-white hover:bg-neutral-800'
                    }`}
                  >
                    {item}
                  </button>
                ))
              ) : (
                <span className="text-gray-400 text-sm italic">Admin Mode Active</span>
              )}
            </div>
            
            <button 
              type="button"
              onClick={onLogout}
              className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors border border-red-900/30 bg-red-900/10 px-3 py-1.5 rounded-full"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>

          <div className="md:hidden">
            <button type="button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-300 hover:text-white">
              <Menu size={28} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-neutral-900 border-b border-neutral-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
             {user.role === 'user' && ['Home', 'Inventory', 'Packaging Studio', 'Market Matcher'].map((item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => { setActiveTab(item); setMobileMenuOpen(false); }}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-neutral-800 w-full text-left"
                >
                  {item}
                </button>
              ))}
              <button 
                type="button"
                onClick={onLogout}
                className="block w-full text-left px-3 py-2 text-red-400 hover:bg-neutral-800"
              >
                Logout
              </button>
          </div>
        </div>
      )}
    </nav>
  );
};

const MarketMatcher = ({ inventory, onOpenChat }: MarketMatcherProps) => {
  const [customerDesc, setCustomerDesc] = useState('');
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleMatch = async () => {
    if (!customerDesc) return;
    setLoading(true);
    
    // Construct prompt
    const inventoryList = inventory.map(i => `${i.name} (${i.type}, ${i.thc} THC)`).join(', ');
    const prompt = `Act as a cannabis sommelier. Our inventory is: [${inventoryList}]. The reseller's customer base is: "${customerDesc}". 
    Recommend the top 2 strains from the inventory that fit best. 
    Format: A short paragraph explaining why these 2 picks are perfect for that demographic. Keep it professional but persuasive.`;

    const result = await generateWithGemini(prompt);
    setRecommendation(result);
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold mb-4">
            <Sparkles size={12} /> Powered by Gemini AI
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Smart Market Matcher</h2>
          <p className="text-gray-400">
            Not sure what to stock? Tell our AI about your customers (e.g., "College students looking for cheap party weed" or "Seniors seeking pain relief"), and we'll recommend the perfect inventory.
          </p>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-8">
          <label htmlFor="customerDesc" className="block text-sm font-medium text-gray-300 mb-2">Describe your target customers</label>
          <div className="flex gap-4 mb-6">
            <input 
              id="customerDesc"
              type="text" 
              value={customerDesc}
              onChange={(e) => setCustomerDesc(e.target.value)}
              placeholder="e.g. Young professionals who want to relax after work..."
              className="flex-1 bg-black border border-neutral-700 rounded-lg px-4 py-3 text-white focus:border-indigo-500 focus:outline-none transition-colors"
            />
            <button 
              type="button"
              onClick={handleMatch}
              disabled={loading || !customerDesc}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold px-6 rounded-lg transition-all flex items-center gap-2"
            >
              {loading ? <Loader className="animate-spin" size={20} /> : <Sparkles size={20} />}
              <span className="hidden md:inline">Find Strains</span>
            </button>
          </div>

          {recommendation && (
            <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-xl p-6 animate-fadeIn">
              <h3 className="text-indigo-400 font-bold mb-3 flex items-center gap-2">
                <Sparkles size={16} /> AI Recommendation
              </h3>
              <p className="text-gray-200 leading-relaxed whitespace-pre-line">
                {recommendation}
              </p>
              <div className="mt-6 pt-6 border-t border-white/10 flex justify-end">
                <button 
                  type="button"
                  onClick={onOpenChat}
                  className="text-white bg-green-600 hover:bg-green-500 px-6 py-2 rounded-lg text-sm font-bold transition-colors"
                >
                  Order These Strains
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = ({ inventory, setInventory }: AdminDashboardProps) => {
  const [newProduct, setNewProduct] = useState<NewProduct>({ name: '', type: 'Hybrid', thc: '', stock: 'High', description: '' });
  const [aiLoading, setAiLoading] = useState(false);

  const handleDelete = (id: number) => {
    setInventory(inventory.filter(i => i.id !== id));
  };

  const handleAdd = () => {
    if (!newProduct.name || !newProduct.thc) return;
    const newItem: InventoryItem = {
      ...newProduct,
      id: Date.now(),
      new: true,
      price: "Bulk Rates Available"
    };
    setInventory([...inventory, newItem]);
    setNewProduct({ name: '', type: 'Hybrid', thc: '', stock: 'High', description: '' });
  };

  const generateDescription = async () => {
    if (!newProduct.name || !newProduct.type) return;
    setAiLoading(true);
    const prompt = `Write a one sentence, premium marketing description for a cannabis strain named "${newProduct.name}" which is a ${newProduct.type}. Focus on flavor and effect.`;
    const desc = await generateWithGemini(prompt);
    setNewProduct({ ...newProduct, description: desc });
    setAiLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-white">Inventory Management</h2>
        <div className="text-sm text-gray-500 bg-neutral-900 px-4 py-2 rounded-lg border border-neutral-800">
          Admin Access Granted
        </div>
      </div>

      {/* Add Product Form */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 mb-8">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Plus size={20} className="text-green-500" /> Add New Strain
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <input 
            placeholder="Strain Name" 
            value={newProduct.name}
            onChange={e => setNewProduct({...newProduct, name: e.target.value})}
            className="bg-black border border-neutral-700 rounded px-3 py-2 text-white"
          />
          <select 
            value={newProduct.type}
            onChange={e => setNewProduct({...newProduct, type: e.target.value})}
            className="bg-black border border-neutral-700 rounded px-3 py-2 text-white"
          >
            <option>Sativa</option>
            <option>Indica</option>
            <option>Hybrid</option>
          </select>
          <input 
            placeholder="THC %" 
            value={newProduct.thc}
            onChange={e => setNewProduct({...newProduct, thc: e.target.value})}
            className="bg-black border border-neutral-700 rounded px-3 py-2 text-white"
          />
          <select 
            value={newProduct.stock}
            onChange={e => setNewProduct({...newProduct, stock: e.target.value})}
            className="bg-black border border-neutral-700 rounded px-3 py-2 text-white"
          >
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
            <option>Out of Stock</option>
          </select>
        </div>
        
        {/* AI Description Field */}
        <div className="flex gap-4 mb-4">
          <input 
            placeholder="Product Description (Auto-generate available)" 
            value={newProduct.description || ''}
            onChange={e => setNewProduct({...newProduct, description: e.target.value})}
            className="flex-1 bg-black border border-neutral-700 rounded px-3 py-2 text-white"
          />
          <button 
            type="button"
            onClick={generateDescription}
            disabled={aiLoading || !newProduct.name}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-4 py-2 rounded flex items-center gap-2 text-sm font-bold whitespace-nowrap"
          >
            {aiLoading ? <Loader className="animate-spin" size={16} /> : <Sparkles size={16} />}
            AI Gen
          </button>
        </div>

        <div className="flex justify-end">
          <button type="button" onClick={handleAdd} className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded font-bold">
            Add to Inventory
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm text-gray-400">
          <thead className="bg-neutral-800 text-gray-200 font-bold uppercase text-xs">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">THC</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {inventory.map((item) => (
              <tr key={item.id} className="hover:bg-neutral-800/50">
                <td className="px-6 py-4 font-medium text-white">{item.name}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                    item.type === 'Sativa' ? 'bg-orange-900/30 text-orange-400' : 
                    item.type === 'Indica' ? 'bg-purple-900/30 text-purple-400' : 
                    'bg-blue-900/30 text-blue-400'
                  }`}>{item.type}</span>
                </td>
                <td className="px-6 py-4">{item.thc}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-bold ${
                    item.stock === 'High' ? 'text-green-500' : 
                    item.stock === 'Out of Stock' ? 'text-red-500' : 'text-yellow-500'
                  }`}>{item.stock}</span>
                </td>
                <td className="px-6 py-4">
                  <button 
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="text-red-500 hover:text-red-400 p-1 hover:bg-red-900/20 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Login = ({ onLogin }: LoginProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (username === 'admin' && password === 'password') {
      onLogin({ username: 'admin', role: 'admin' });
    } else if (username === 'reseller' && password === 'password') {
      onLogin({ username: 'reseller', role: 'user' });
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-green-900/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-900/20 rounded-full blur-[100px]" />
      </div>

      <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-2xl w-full max-w-md z-10 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-gradient-to-tr from-green-600 to-emerald-400 p-3 rounded-xl mb-4 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
            <Zap className="text-black" size={32} fill="currentColor" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">BC FLAME</h1>
          <p className="text-gray-500 text-sm mt-1">Wholesale Partner Portal</p>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-900/50 text-red-400 p-3 rounded-lg mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-400 mb-1">Username</label>
            <div className="relative">
              <Users size={18} className="absolute left-3 top-3 text-gray-600" />
              <input 
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-black border border-neutral-800 rounded-lg pl-10 pr-4 py-2.5 text-white focus:border-green-500 focus:outline-none transition-colors"
                placeholder="Enter username"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1">Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-3 text-gray-600" />
              <input 
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black border border-neutral-800 rounded-lg pl-10 pr-4 py-2.5 text-white focus:border-green-500 focus:outline-none transition-colors"
                placeholder="Enter password"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-green-900/20 mt-2"
          >
            Access Portal
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-neutral-800">
          <p className="text-center text-xs text-gray-600">
            Unauthorized access is prohibited.<br/>
            Demo: admin/password or reseller/password
          </p>
        </div>
      </div>
    </div>
  );
};

// --- Hero, Services, Footer Components ---

const Hero = ({ setActiveTab }: HeroProps) => (
  <div className="relative pt-32 pb-12 lg:pt-48 lg:pb-24 overflow-hidden">
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 text-center">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-semibold mb-8">
        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        Live Inventory Available Now
      </div>
      <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6">
        Your Brand. <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
          Our Supply Chain.
        </span>
      </h1>
      <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-400">
        We handle the growing, bagging, photography, and logistics. You handle the sales. 
        Fully customizable white-label solutions.
      </p>
      <div className="mt-10 flex justify-center gap-4">
        <button 
          type="button"
          onClick={() => setActiveTab('Inventory')}
          className="px-8 py-4 bg-green-500 hover:bg-green-400 text-black font-bold rounded-lg transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)]"
        >
          View Live Stock
        </button>
        <button 
          type="button"
          onClick={() => setActiveTab('Packaging Studio')}
          className="px-8 py-4 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold rounded-lg border border-neutral-700 transition-all"
        >
          Design Packaging
        </button>
      </div>
    </div>
    
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-900/20 rounded-full blur-3xl" />
    </div>
  </div>
);

const Inventory = ({ inventory, onOpenChat }: InventoryProps) => (
  <div className="max-w-7xl mx-auto px-4 py-12">
    <div className="flex justify-between items-end mb-8">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Live Inventory</h2>
        <p className="text-gray-400">Real-time stock levels. Message to reserve.</p>
      </div>
      <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
        <div className="w-3 h-3 bg-green-500 rounded-full" /> High Stock
        <div className="w-3 h-3 bg-yellow-500 rounded-full ml-2" /> Low Stock
        <div className="w-3 h-3 bg-red-500 rounded-full ml-2" /> Out of Stock
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {inventory.map((item) => (
        <div key={item.id} className="group bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden hover:border-green-500/50 transition-all">
          <div className="h-48 bg-neutral-800 relative flex items-center justify-center">
            <Leaf size={48} className="text-neutral-700 group-hover:text-green-500 transition-colors" />
            {item.new && (
              <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                NEW ARRIVAL
              </span>
            )}
            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur px-2 py-1 rounded text-xs font-mono text-white">
              THC: {item.thc}
            </div>
          </div>
          <div className="p-6">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold text-white">{item.name}</h3>
              <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                item.type === 'Sativa' ? 'bg-orange-900/30 text-orange-400' : 
                item.type === 'Indica' ? 'bg-purple-900/30 text-purple-400' : 
                'bg-blue-900/30 text-blue-400'
              }`}>
                {item.type}
              </span>
            </div>
            
            <p className="text-gray-500 text-sm mb-4 min-h-10">{item.description || "Premium quality strain."}</p>

            <div className="flex items-center gap-2 mb-6">
              <div className={`w-2 h-2 rounded-full ${
                item.stock === 'High' ? 'bg-green-500' : 
                item.stock === 'Low' ? 'bg-yellow-500' : 'bg-red-500'
              }`} />
              <span className="text-sm text-gray-400">{item.stock} Availability</span>
            </div>

            <button 
              type="button"
              onClick={onOpenChat}
              disabled={item.stock === 'Out of Stock'}
              className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
                item.stock === 'Out of Stock' 
                  ? 'bg-neutral-800 text-neutral-600 cursor-not-allowed' 
                  : 'bg-white hover:bg-gray-200 text-black'
              }`}
            >
              {item.stock === 'Out of Stock' ? 'Unavailable' : 'Inquire for Pricing'}
              {item.stock !== 'Out of Stock' && <ChevronRight size={16} />}
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const PackagingStudio = ({ onOpenChat }: PackagingStudioProps) => {
  const [selectedBg, setSelectedBg] = useState<PackagingBackground>(PACKAGING_OPTIONS.backgrounds[0]);
  const [selectedFont, setSelectedFont] = useState<PackagingFont>(PACKAGING_OPTIONS.fonts[0]);
  const [partnerName, setPartnerName] = useState('YOUR BRAND');

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Controls */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-6">Packaging Studio</h2>
          <p className="text-gray-400 mb-8">
            Visualize your brand on our premium packaging. We handle the printing, bagging, and labeling before delivery.
          </p>

          <div className="space-y-8">
            {/* Name Input */}
            <div>
              <label htmlFor="brandName" className="block text-sm font-medium text-gray-400 mb-2">Brand Name</label>
              <input 
                id="brandName"
                type="text" 
                value={partnerName}
                onChange={(e) => setPartnerName(e.target.value)}
                maxLength={15}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:outline-none"
                placeholder="Enter your brand name"
              />
            </div>

            {/* Background Selection */}
            <fieldset>
              <legend className="block text-sm font-medium text-gray-400 mb-2">Bag Material & Finish</legend>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {PACKAGING_OPTIONS.backgrounds.map((bg) => (
                  <button
                    type="button"
                    key={bg.id}
                    onClick={() => setSelectedBg(bg)}
                    className={`h-12 rounded-lg border-2 transition-all ${bg.class} ${
                      selectedBg.id === bg.id ? 'border-green-500 scale-110 shadow-lg' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                    title={bg.name}
                  />
                ))}
              </div>
              <p className="mt-2 text-xs text-gray-500">Selected: {selectedBg.name}</p>
            </fieldset>

            {/* Font Selection */}
            <fieldset>
              <legend className="block text-sm font-medium text-gray-400 mb-2">Typography Style</legend>
              <div className="space-y-2">
                {PACKAGING_OPTIONS.fonts.map((font) => (
                  <button
                    type="button"
                    key={font.id}
                    onClick={() => setSelectedFont(font)}
                    className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
                      selectedFont.id === font.id 
                        ? 'bg-neutral-800 border-green-500 text-green-500' 
                        : 'bg-neutral-900 border-neutral-800 text-gray-400 hover:border-neutral-600'
                    }`}
                  >
                    <span className={font.class}>Abc</span> - {font.name}
                  </button>
                ))}
              </div>
            </fieldset>

            <button 
              type="button"
              onClick={onOpenChat}
              className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-4 rounded-lg mt-8 shadow-[0_0_20px_rgba(34,197,94,0.2)] transition-all"
            >
              Request This Design
            </button>
          </div>
        </div>

        {/* Preview Area */}
        <div className="bg-neutral-900 rounded-2xl p-8 flex items-center justify-center border border-neutral-800 relative">
          <div className="absolute top-4 right-4 flex gap-2">
            <div className="bg-black/50 p-2 rounded-lg text-white text-xs backdrop-blur flex items-center gap-1">
              <CheckCircle size={12} className="text-green-500" />
              Pre-Bagged
            </div>
          </div>

          {/* The Bag Visualization */}
          <div 
            className={`relative w-72 h-96 rounded-lg shadow-2xl flex flex-col items-center justify-center p-6 transition-all duration-500 ${selectedBg.class}`}
            style={{ 
              clipPath: "polygon(5% 0, 95% 0, 100% 5%, 100% 95%, 95% 100%, 5% 100%, 0 95%, 0 5%)" // My attempt at a mylar bag shape
            }}
          >
            {/* Bag Seal Line */}
            <div className="absolute top-4 left-0 w-full h-1 bg-black/10" />

            {/* Content */}
            <div className="text-center z-10 w-full">
              <Leaf className={`mx-auto mb-4 opacity-80 ${selectedBg.id === 'matte-black' ? 'text-green-500' : ''}`} size={40} />
              
              <h3 className={`text-3xl mb-2 break-words ${selectedFont.class}`}>
                {partnerName || 'YOUR BRAND'}
              </h3>
              
              <div className="w-full h-0.5 bg-current opacity-30 my-4 mx-auto max-w-[50%]" />
              
              <div className="space-y-1 opacity-70 text-xs font-mono">
                <p>PREMIUM CANNABIS</p>
                <p>NET WT. 3.5G (0.12 OZ)</p>
              </div>

              {/* Strain Window Placeholder */}
              <div className="mt-8 mx-auto w-24 h-24 rounded-full bg-black/20 backdrop-blur-sm border-2 border-white/10 flex items-center justify-center">
                <span className="text-[10px] opacity-50">Clear Window</span>
              </div>
            </div>

            {/* Warning Label Simulation */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="border border-current opacity-40 p-1 rounded text-[8px] text-center leading-tight">
                GOVERNMENT WARNING: THIS PACKAGE CONTAINS CANNABIS. KEEP OUT OF REACH OF CHILDREN.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Services = () => (
  <div className="max-w-7xl mx-auto px-4 py-12">
    <div className="text-center mb-16">
      <h2 className="text-3xl font-bold text-white mb-4">Partner Benefits</h2>
      <p className="text-gray-400 max-w-2xl mx-auto">
        BC Flame isn't just a supplier; we are your backend operations team.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {[
        { 
          icon: <Camera size={32} />, 
          title: "Pro Photography", 
          desc: "Select up to 5 professional studio photos per strain for your marketing channels." 
        },
        { 
          icon: <Package size={32} />, 
          title: "Pre-Bagging Service", 
          desc: "We pack and label everything. Save hours of labor and eliminate packaging equipment costs." 
        },
        { 
          icon: <Truck size={32} />, 
          title: "Direct Logistics", 
          desc: "Discreet, reliable delivery directly to your doorstep or warehouse facility." 
        },
        { 
          icon: <TrendingUp size={32} />, 
          title: "First Access", 
          desc: "Partners get 48-hour early access to new strain drops before the general public." 
        },
      ].map((service) => (
        <div key={service.title} className="bg-neutral-900 p-8 rounded-xl border border-neutral-800 hover:border-green-500/30 transition-colors">
          <div className="bg-neutral-800 w-16 h-16 rounded-lg flex items-center justify-center text-green-500 mb-6">
            {service.icon}
          </div>
          <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
          <p className="text-gray-400 leading-relaxed text-sm">{service.desc}</p>
        </div>
      ))}
    </div>
  </div>
);

const Footer = () => (
  <footer className="bg-black border-t border-neutral-800 pt-16 pb-8">
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Zap className="text-green-500" size={24} />
            <span className="text-xl font-bold text-white">BC FLAME</span>
          </div>
          <p className="text-gray-500 text-sm">
            Empowering resellers with premium cannabis products and white-label solutions.
          </p>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li>Inventory</li>
            <li>Custom Packaging</li>
            <li>Partner Application</li>
            <li>Terms of Service</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">Contact</h4>
          <p className="text-gray-500 text-sm mb-2">Verified Partners Only</p>
          <button type="button" className="text-green-500 text-sm hover:underline">Support Portal Login</button>
        </div>
      </div>
      <div className="border-t border-neutral-900 pt-8 text-center">
        <p className="text-neutral-600 text-xs">
          &copy; 2024 BC Flame. All rights reserved. 
          <span className="block mt-2 text-neutral-700">
             For use by authorized retailers only. Must be 21+ to view.
          </span>
        </p>
      </div>
    </div>
  </footer>
);

// --- Main App Component ---

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('Home');
  const [chatOpen, setChatOpen] = useState(false);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);

  // Scroll to top when tab changes
  useEffect(() => {
    window.scrollTo(0, 0);
     
  }, [activeTab]);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setActiveTab(userData.role === 'admin' ? 'Dashboard' : 'Home');
  };

  const handleLogout = () => {
    setUser(null);
    setActiveTab('Home');
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    // Admin View
    if (user.role === 'admin') {
      return <AdminDashboard inventory={inventory} setInventory={setInventory} />;
    }

    // Reseller View
    switch (activeTab) {
      case 'Inventory':
        return <Inventory inventory={inventory} onOpenChat={() => setChatOpen(true)} />;
      case 'Packaging Studio':
        return <PackagingStudio onOpenChat={() => setChatOpen(true)} />;
      case 'Market Matcher':
        return <MarketMatcher inventory={inventory} onOpenChat={() => setChatOpen(true)} />;
      case 'Services':
        return <Services />;
      default:
        return (
          <>
            <Hero setActiveTab={setActiveTab} />
            <Services />
            <div className="bg-neutral-900/50 py-12 border-y border-neutral-800">
              <div className="max-w-7xl mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold text-white mb-6">Ready to see the product?</h2>
                <button 
                  type="button"
                  onClick={() => setActiveTab('Inventory')}
                  className="px-8 py-3 border border-green-500 text-green-500 font-bold rounded hover:bg-green-500 hover:text-black transition-all"
                >
                  Browse Catalog
                </button>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-green-500 selection:text-black">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} user={user} onLogout={handleLogout} />
      
      <main className="pt-20">
        {renderContent()}
      </main>

      {user.role !== 'admin' && (
        <>
          <Footer />
          <ChatWidget isOpen={chatOpen} setIsOpen={setChatOpen} />
        </>
      )}
    </div>
  );
};

export default App;
