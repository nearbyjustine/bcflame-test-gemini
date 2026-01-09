import React, { useState } from 'react';
import { 
  Flame, 
  ShoppingBag, 
  User, 
  Settings, 
  CheckCircle2, 
  Image as ImageIcon, 
  Package, 
  ChevronRight, 
  ChevronLeft, 
  Plus, 
  Trash2, 
  MessageSquare, 
  LogOut, 
  LayoutDashboard,
  Box,
  Palette,
  Type,
  Upload,
  Clock,
  Check
} from 'lucide-react';

// --- Types ---

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  stock: string;
}

interface Config {
  budStyle: string;
  bgStyle: string;
  fontStyle: string;
  bagType: string;
  quantity: number;
  resellerLogo: string | null;
}

interface OrderItem extends Product {
  customization: Config & { photos: number[] };
}

interface PastOrder {
  id: string;
  date: string;
  status: string;
  total: number;
  items: number;
}

interface User {
  name: string;
  email: string;
}

interface SidebarItemProps {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  active: boolean;
  onClick: () => void;
}

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

// --- Mock Data ---

const PRODUCTS: Product[] = [
  { id: 1, name: 'Red Apple Kush', price: 420, category: 'Hybrid', description: 'A crisp, sweet flavor profile with a powerful relaxing finish.', stock: 'In Stock' },
  { id: 2, name: 'Blue Dream Premium', price: 380, category: 'Sativa', description: 'Berry aroma with a gentle cerebral invigoration.', stock: 'Limited' },
  { id: 3, name: 'Purple Haze v2', price: 450, category: 'Sativa', description: 'Classic earthy tones with high-energy creative effects.', stock: 'In Stock' },
  { id: 4, name: 'OG Fire Breath', price: 500, category: 'Indica', description: 'Our signature heavy hitter. Fiery orange hairs and deep relaxation.', stock: 'New Arrival' },
];

const BUD_STYLES = ['Large Colas', 'Dense Nugs', 'Small Buds', 'Popcorn', 'Hand-Trimmed'];
const BG_STYLES = ['Minimalist White', 'Dark Obsidian', 'Golden Hour', 'Neon Ember', 'Natural Wood'];
const FONT_STYLES = ['Modern Sans', 'Elegant Serif', 'Street Script', 'Bold Industrial', 'Luxury Thin'];
const BAG_TYPES = ['Mylar Bag (Holographic)', 'Mylar Bag (Matte Black)', 'Glass Jar (Bamboo Lid)', 'Pop-Top Tin', 'Vacuum Sealed Stealth'];

// --- Components ---

const SidebarItem = ({ icon: Icon, label, active, onClick }: SidebarItemProps) => (
  <button 
    type='button'
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
      active 
        ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg shadow-orange-900/20' 
        : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </button>
);

const StepIndicator = ({ currentStep, totalSteps }: StepIndicatorProps) => (
  <div className="flex justify-between items-center mb-8 px-2">
    {[...Array(totalSteps)].map((_, i) => (
      <React.Fragment key={i}>
        <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors duration-500 ${
          i <= currentStep ? 'bg-orange-600 border-orange-600 text-white' : 'border-neutral-700 text-neutral-600'
        }`}>
          {i < currentStep ? <Check size={16} /> : i + 1}
        </div>
        {i < totalSteps - 1 && (
          <div className={`flex-1 h-0.5 mx-4 transition-colors duration-500 ${
            i < currentStep ? 'bg-orange-600' : 'bg-neutral-800'
          }`} />
        )}
      </React.Fragment>
    ))}
  </div>
);

export default function App() {
  const [view, setView] = useState('catalog'); // catalog, orders, chat, settings
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [customizingProduct, setCustomizingProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [step, setStep] = useState(0);
  
  // Customization State
  const [selectedPhotos, setSelectedPhotos] = useState<number[]>([]);
  const [config, setConfig] = useState<Config>({
    budStyle: '',
    bgStyle: '',
    fontStyle: '',
    bagType: '',
    quantity: 1,
    resellerLogo: null
  });

  const [pastOrders, setPastOrders] = useState<PastOrder[]>([
    { id: 'BCF-9021', date: '2026-01-05', status: 'Delivered', total: 1250, items: 3 },
    { id: 'BCF-9055', date: '2026-01-08', status: 'In Bagging', total: 420, items: 1 },
  ]);

  // Auth Handling
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
    setUser({ name: 'Premium Partner', email: 'reseller@business.com' });
  };

  const addToCart = () => {
    if (!customizingProduct) return;
    const orderItem: OrderItem = {
      ...customizingProduct,
      customization: { ...config, photos: selectedPhotos },
      id: Date.now()
    };
    setCart([...cart, orderItem]);
    setCustomizingProduct(null);
    resetCustomization();
  };

  const resetCustomization = () => {
    setStep(0);
    setSelectedPhotos([]);
    setConfig({
      budStyle: '',
      bgStyle: '',
      fontStyle: '',
      bagType: '',
      quantity: 1,
      resellerLogo: null
    });
  };

  const togglePhoto = (id: number) => {
    if (selectedPhotos.includes(id)) {
      setSelectedPhotos(selectedPhotos.filter(p => p !== id));
    } else if (selectedPhotos.length < 5) {
      setSelectedPhotos([...selectedPhotos, id]);
    }
  };

  const handleFinish = () => {
    // Logic to send email/notify staff
    const newOrder = {
      id: `BCF-${Math.floor(Math.random() * 9000) + 1000}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
      total: cart.reduce((acc, item) => acc + item.price, 0),
      items: cart.length
    };
    setPastOrders([newOrder, ...pastOrders]);
    setCart([]);
    setView('orders');
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-neutral-900 rounded-3xl p-8 border border-neutral-800 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-gradient-to-br from-orange-500 to-red-600 p-4 rounded-2xl shadow-lg mb-4">
              <Flame size={40} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">BC Flame</h1>
            <p className="text-neutral-500 mt-2">Premium Client Portal</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">Username</label>
              <input type="text" required className="w-full bg-neutral-800 border-none rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-orange-600 transition-all outline-none" placeholder="Enter your username" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">Password</label>
              <input type="password" required className="w-full bg-neutral-800 border-none rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-orange-600 transition-all outline-none" placeholder="••••••••" />
            </div>
            <button type="submit" className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold py-4 rounded-xl shadow-lg hover:opacity-90 transition-all active:scale-[0.98]">
              Enter Secure Portal
            </button>
          </form>
          <p className="text-center text-xs text-neutral-600 mt-8 uppercase tracking-widest font-semibold">
            Authorized Access Only
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-neutral-900 bg-neutral-950 p-6 flex flex-col hidden lg:flex">
        <div className="flex items-center space-x-3 mb-12 px-2">
          <Flame size={32} className="text-orange-500" />
          <span className="text-xl font-bold tracking-tighter">BC FLAME</span>
        </div>
        
        <nav className="flex-1 space-y-2">
          <SidebarItem icon={LayoutDashboard} label="Catalog" active={view === 'catalog'} onClick={() => setView('catalog')} />
          <SidebarItem icon={Package} label="My Orders" active={view === 'orders'} onClick={() => setView('orders')} />
          <SidebarItem icon={MessageSquare} label="Messages" active={view === 'chat'} onClick={() => setView('chat')} />
          <SidebarItem icon={Settings} label="Settings" active={view === 'settings'} onClick={() => setView('settings')} />
        </nav>

        <div className="mt-auto border-t border-neutral-900 pt-6">
          <div className="flex items-center space-x-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center border border-neutral-700">
              <User size={18} className="text-orange-400" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate">{user?.name}</p>
              <p className="text-xs text-neutral-500 truncate">Premium Member</p>
            </div>
          </div>
          <button onClick={() => setIsLoggedIn(false)} className="w-full flex items-center space-x-2 text-red-500 hover:text-red-400 px-2 transition-colors">
            <LogOut size={18} />
            <span className="text-sm font-medium">Log out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-20 border-b border-neutral-900 flex items-center justify-between px-8 bg-neutral-950/50 backdrop-blur-md">
          <h2 className="text-2xl font-bold capitalize">{view}</h2>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setView('orders')} 
              className="relative p-2 text-neutral-400 hover:text-white transition-colors"
            >
              <ShoppingBag size={24} />
              {cart.length > 0 && (
                <span className="absolute top-1 right-1 bg-orange-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-neutral-950">
                  {cart.length}
                </span>
              )}
            </button>
            <div className="h-8 w-[1px] bg-neutral-800" />
            <div className="flex items-center space-x-2 text-sm text-neutral-400">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>System Online</span>
            </div>
          </div>
        </header>

        {/* Dynamic Views */}
        <section className="flex-1 overflow-y-auto p-8">
          {view === 'catalog' && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {PRODUCTS.map(product => (
                <div key={product.id} className="group bg-neutral-900 rounded-3xl border border-neutral-800 p-5 hover:border-orange-500/50 transition-all duration-300 flex flex-col">
                  <div className="h-48 rounded-2xl bg-neutral-800 mb-4 overflow-hidden relative">
                    <div className="absolute top-3 left-3 px-3 py-1 bg-neutral-900/80 backdrop-blur text-[10px] font-bold text-orange-400 rounded-full border border-neutral-700">
                      {product.stock}
                    </div>
                    {/* Placeholder for Product Image */}
                    <div className="w-full h-full flex items-center justify-center text-neutral-600 group-hover:scale-110 transition-transform duration-500">
                      <Box size={48} />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-1">{product.name}</h3>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-neutral-500 text-sm">{product.category}</span>
                    <span className="text-orange-500 font-bold">${product.price}</span>
                  </div>
                  <p className="text-sm text-neutral-400 mb-6 flex-1 line-clamp-2">
                    {product.description}
                  </p>
                  <button 
                    onClick={() => setCustomizingProduct(product)}
                    className="w-full py-3 rounded-xl bg-neutral-800 hover:bg-orange-600 text-white font-semibold transition-all flex items-center justify-center space-x-2"
                  >
                    <Settings size={18} />
                    <span>Customize & Order</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {view === 'orders' && (
            <div className="max-w-5xl mx-auto">
              {cart.length > 0 && (
                <div className="mb-12 bg-neutral-900 rounded-3xl border border-orange-500/30 p-8 shadow-2xl shadow-orange-950/10">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-2xl font-bold">Current Batch</h3>
                      <p className="text-neutral-400 text-sm">Review your customizations before submitting</p>
                    </div>
                    <span className="bg-orange-600/20 text-orange-500 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Draft Session</span>
                  </div>
                  <div className="space-y-4 mb-8">
                    {cart.map(item => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-neutral-950 rounded-2xl border border-neutral-800">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-lg bg-neutral-900 flex items-center justify-center border border-neutral-800">
                            <Box size={20} className="text-orange-500" />
                          </div>
                          <div>
                            <p className="font-bold">{item.name}</p>
                            <p className="text-xs text-neutral-500">
                              {item.customization.bagType} • {item.customization.budStyle}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-6">
                          <span className="font-bold text-orange-500">${item.price}</span>
                          <button 
                            onClick={() => setCart(cart.filter(c => c.id !== item.id))}
                            className="p-2 text-neutral-600 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end space-x-4">
                    <button 
                      onClick={() => setView('catalog')}
                      className="px-6 py-3 rounded-xl text-neutral-400 hover:text-white transition-colors"
                    >
                      Add More
                    </button>
                    <button 
                      onClick={handleFinish}
                      className="px-8 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold rounded-xl shadow-lg hover:opacity-90 active:scale-95 transition-all"
                    >
                      Finish Order & Notify Staff
                    </button>
                  </div>
                </div>
              )}

              <h3 className="text-xl font-bold mb-6 flex items-center space-x-3">
                <Clock size={20} className="text-neutral-500" />
                <span>Order History</span>
              </h3>
              <div className="bg-neutral-900 rounded-3xl border border-neutral-800 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-neutral-950 border-b border-neutral-800">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase">Order ID</th>
                      <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase">Date</th>
                      <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase text-right">Total Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800">
                    {pastOrders.map(order => (
                      <tr key={order.id} className="hover:bg-neutral-800/50 transition-colors group cursor-pointer">
                        <td className="px-6 py-4 font-mono text-sm text-neutral-300">{order.id}</td>
                        <td className="px-6 py-4 text-sm text-neutral-400">{order.date}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                            order.status === 'Delivered' ? 'bg-green-500/10 text-green-500' : 
                            order.status === 'In Bagging' ? 'bg-orange-500/10 text-orange-500' : 'bg-blue-500/10 text-blue-500'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-white">${order.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {(view === 'chat' || view === 'settings') && (
            <div className="flex flex-col items-center justify-center h-full text-neutral-500">
              <div className="p-8 rounded-full bg-neutral-900 mb-4 border border-neutral-800">
                {view === 'chat' ? <MessageSquare size={48} /> : <Settings size={48} />}
              </div>
              <p className="text-lg">Section coming soon</p>
              <p className="text-sm">We are currently optimizing the encrypted {view} module.</p>
            </div>
          )}
        </section>
      </main>

      {/* Customization Wizard Modal */}
      {customizingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/90 backdrop-blur-md">
          <div className="bg-neutral-900 w-full max-w-4xl max-h-[90vh] rounded-[40px] border border-neutral-800 shadow-2xl flex flex-col overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-8 border-b border-neutral-800 flex justify-between items-start">
              <div>
                <span className="text-orange-500 font-bold uppercase tracking-widest text-xs">Phase 1: Customization</span>
                <h2 className="text-3xl font-black mt-1">Configure {customizingProduct.name}</h2>
              </div>
              <button 
                onClick={() => setCustomizingProduct(null)}
                className="p-2 hover:bg-neutral-800 rounded-full transition-colors text-neutral-500"
              >
                <Plus size={24} className="rotate-45" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8">
              <StepIndicator currentStep={step} totalSteps={4} />

              {/* Step 1: Media Selection */}
              {step === 0 && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold flex items-center space-x-2">
                      <ImageIcon size={20} className="text-orange-500" />
                      <span>Select Marketing Media (5 Max)</span>
                    </h3>
                    <span className="px-3 py-1 bg-neutral-800 rounded-full text-xs font-bold text-neutral-400">
                      {selectedPhotos.length} / 5 Selected
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {[...Array(10)].map((_, i) => (
                      <div 
                        key={i} 
                        onClick={() => togglePhoto(i)}
                        className={`aspect-square rounded-2xl cursor-pointer border-2 transition-all relative overflow-hidden group ${
                          selectedPhotos.includes(i) ? 'border-orange-500' : 'border-neutral-800 hover:border-neutral-700'
                        }`}
                      >
                        <div className="w-full h-full flex items-center justify-center bg-neutral-800 text-neutral-600">
                          <ImageIcon size={24} />
                        </div>
                        <div className="absolute inset-0 bg-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        {selectedPhotos.includes(i) && (
                          <div className="absolute top-2 right-2 bg-orange-500 rounded-full p-1 text-white shadow-lg">
                            <Check size={12} />
                          </div>
                        )}
                        <div className="absolute bottom-2 left-2 text-[10px] font-bold text-neutral-500">PHOTO-0{i+1}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Branding & Styles */}
              {step === 1 && (
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-bold text-neutral-500 uppercase tracking-widest mb-3 block flex items-center space-x-2">
                        <Box size={14} /> <span>Bud Style Selection</span>
                      </label>
                      <div className="space-y-2">
                        {BUD_STYLES.map(s => (
                          <button 
                            key={s} 
                            onClick={() => setConfig({...config, budStyle: s})}
                            className={`w-full text-left p-4 rounded-xl border transition-all ${
                              config.budStyle === s ? 'border-orange-500 bg-orange-500/10 text-white' : 'border-neutral-800 text-neutral-400 hover:border-neutral-700'
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-bold text-neutral-500 uppercase tracking-widest mb-3 block flex items-center space-x-2">
                        <Palette size={14} /> <span>Background Theme</span>
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {BG_STYLES.map(s => (
                          <button 
                            key={s} 
                            onClick={() => setConfig({...config, bgStyle: s})}
                            className={`p-3 rounded-xl border text-xs text-center transition-all ${
                              config.bgStyle === s ? 'border-orange-500 bg-orange-500/10 text-white' : 'border-neutral-800 text-neutral-400 hover:border-neutral-700'
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-bold text-neutral-500 uppercase tracking-widest mb-3 block flex items-center space-x-2">
                        <Type size={14} /> <span>Typography</span>
                      </label>
                      <div className="space-y-2">
                        {FONT_STYLES.map(s => (
                          <button 
                            key={s} 
                            onClick={() => setConfig({...config, fontStyle: s})}
                            className={`w-full text-left p-4 rounded-xl border transition-all ${
                              config.fontStyle === s ? 'border-orange-500 bg-orange-500/10 text-white' : 'border-neutral-800 text-neutral-400 hover:border-neutral-700'
                            }`}
                          >
                            <span className={s === 'Elegant Serif' ? 'font-serif' : s === 'Modern Sans' ? 'font-sans' : ''}>{s}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-bold text-neutral-500 uppercase tracking-widest mb-3 block flex items-center space-x-2">
                        <Upload size={14} /> <span>Reseller Identity</span>
                      </label>
                      <div className="p-6 rounded-2xl border-2 border-dashed border-neutral-800 flex flex-col items-center justify-center text-neutral-500 hover:border-orange-500/50 transition-colors cursor-pointer group">
                        <Upload size={32} className="mb-2 group-hover:text-orange-500 transition-colors" />
                        <p className="text-sm">Upload Business Logo</p>
                        <p className="text-[10px] uppercase mt-1">PNG, SVG (Max 2MB)</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Bagging & Ops */}
              {step === 2 && (
                <div className="max-w-xl mx-auto space-y-8">
                  <div className="bg-neutral-950 p-8 rounded-3xl border border-neutral-800">
                    <h4 className="text-xl font-bold mb-6 flex items-center space-x-2">
                      <ShoppingBag size={20} className="text-orange-500" />
                      <span>Pre-Bagging Service</span>
                    </h4>
                    <div className="space-y-4">
                      {BAG_TYPES.map(s => (
                        <div 
                          key={s}
                          onClick={() => setConfig({...config, bagType: s})}
                          className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                            config.bagType === s ? 'border-orange-500 bg-orange-500/5' : 'border-neutral-900 hover:border-neutral-800'
                          }`}
                        >
                          <span className={config.bagType === s ? 'text-white font-medium' : 'text-neutral-500'}>{s}</span>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            config.bagType === s ? 'border-orange-500' : 'border-neutral-700'
                          }`}>
                            {config.bagType === s && <div className="w-2.5 h-2.5 bg-orange-500 rounded-full" />}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-neutral-500 uppercase mb-3">Units Required</label>
                    <div className="flex items-center space-x-4">
                      <button 
                        onClick={() => setConfig({...config, quantity: Math.max(1, config.quantity - 1)})}
                        className="w-12 h-12 rounded-xl bg-neutral-800 flex items-center justify-center text-xl font-bold text-white"
                      >
                        -
                      </button>
                      <div className="flex-1 h-12 bg-neutral-950 rounded-xl border border-neutral-800 flex items-center justify-center text-xl font-bold">
                        {config.quantity}
                      </div>
                      <button 
                        onClick={() => setConfig({...config, quantity: config.quantity + 1})}
                        className="w-12 h-12 rounded-xl bg-neutral-800 flex items-center justify-center text-xl font-bold text-white"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Final Summary */}
              {step === 3 && (
                <div className="max-w-2xl mx-auto bg-neutral-950 p-8 rounded-3xl border border-neutral-800">
                   <h4 className="text-2xl font-bold mb-8 text-center">Summary of Configurations</h4>
                   <div className="space-y-4">
                     <div className="flex justify-between border-b border-neutral-900 pb-3">
                        <span className="text-neutral-500">Product</span>
                        <span className="font-bold">{customizingProduct.name}</span>
                     </div>
                     <div className="flex justify-between border-b border-neutral-900 pb-3">
                        <span className="text-neutral-500">Marketing Assets</span>
                        <span className="font-bold text-orange-500">{selectedPhotos.length} Photos Chosen</span>
                     </div>
                     <div className="flex justify-between border-b border-neutral-900 pb-3">
                        <span className="text-neutral-500">Packaging Type</span>
                        <span className="font-bold">{config.bagType || 'Not Selected'}</span>
                     </div>
                     <div className="flex justify-between border-b border-neutral-900 pb-3">
                        <span className="text-neutral-500">Theme</span>
                        <span className="font-bold">{config.bgStyle} / {config.fontStyle}</span>
                     </div>
                     <div className="flex justify-between pt-4">
                        <span className="text-xl font-bold">Estimated Cost</span>
                        <span className="text-2xl font-black text-orange-500">${customizingProduct.price * config.quantity}</span>
                     </div>
                   </div>
                   <div className="mt-8 p-4 bg-orange-600/10 rounded-2xl border border-orange-500/20 text-center">
                      <p className="text-sm text-orange-400">Items will be added to your current draft batch.</p>
                   </div>
                </div>
              )}
            </div>

            {/* Modal Footer Controls */}
            <div className="p-8 border-t border-neutral-800 flex justify-between bg-neutral-950/30">
              <button 
                onClick={() => setStep(Math.max(0, step - 1))}
                disabled={step === 0}
                className="flex items-center space-x-2 text-neutral-400 hover:text-white disabled:opacity-0 transition-all"
              >
                <ChevronLeft size={20} />
                <span>Back</span>
              </button>
              
              <div className="flex space-x-4">
                {step < 3 ? (
                  <button 
                    onClick={() => setStep(step + 1)}
                    disabled={step === 0 && selectedPhotos.length === 0}
                    className="flex items-center space-x-2 bg-neutral-800 hover:bg-neutral-700 px-8 py-3 rounded-xl font-bold transition-all disabled:opacity-50"
                  >
                    <span>Continue</span>
                    <ChevronRight size={20} />
                  </button>
                ) : (
                  <button 
                    onClick={addToCart}
                    className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-10 py-3 rounded-xl font-bold shadow-lg shadow-orange-950/20 hover:opacity-90 active:scale-95 transition-all flex items-center space-x-2"
                  >
                    <CheckCircle2 size={20} />
                    <span>Confirm Configuration</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
