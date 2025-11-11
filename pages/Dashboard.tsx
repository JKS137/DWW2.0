import React, { useState, useMemo, useEffect } from 'react';
import Layout from '../components/Layout';
import WarrantyCard from '../components/WarrantyCard';
import WarrantyList from '../components/WarrantyList';
import AddWarrantyModal from '../components/AddWarrantyModal';
import EditWarrantyModal from '../components/EditWarrantyModal';
import ShareWarrantyModal from '../components/ShareWarrantyModal';
import OnboardingBanner from '../components/OnboardingBanner';
import StatsCard from '../components/StatsCard';
import ToggleSwitch from '../components/ToggleSwitch';
import UploadForm from '../components/UploadForm';
import { PlusIcon } from '../components/icons/PlusIcon';
import { ViewGridIcon } from '../components/icons/ViewGridIcon';
import { ViewListIcon } from '../components/icons/ViewListIcon';
import { useWarranties } from '../context/WarrantiesContext';
import { useAuth } from '../context/AuthContext';
import { Spinner } from '../components/icons/Spinner';
import type { Warranty, Category } from '../types';
import { categories } from '../types';
import { ShieldCheckIcon } from '../components/icons/ShieldCheckIcon';
import { TagIcon } from '../components/icons/TagIcon';
import { CalendarIcon } from '../components/icons/CalendarIcon';
import { ExportIcon } from '../components/icons/ExportIcon';

type WarrantyStatus = 'expired' | 'expiring' | 'safe';
type SortOrder = 'latest' | 'expiryAsc' | 'expiryDesc' | 'nameAsc' | 'nameDesc';

type WarrantyStatusInfo = {
    status: WarrantyStatus;
    daysLeft: number;
    progress: number;
    statusText: string;
}

const getWarrantyStatusInfo = (purchaseDateStr: string, expiryDateStr: string): WarrantyStatusInfo => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const purchaseDate = new Date(purchaseDateStr);
    const expiryDate = new Date(expiryDateStr);

    if (isNaN(purchaseDate.getTime()) || isNaN(expiryDate.getTime())) {
        return { status: 'safe', daysLeft: 0, progress: 0, statusText: 'Invalid date' };
    }

    const diffTime = expiryDate.getTime() - today.getTime();
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let status: WarrantyStatus = 'safe';
    if (daysLeft < 0) {
        status = 'expired';
    } else if (daysLeft <= 30) {
        status = 'expiring';
    }

    const totalDuration = expiryDate.getTime() - purchaseDate.getTime();
    const elapsedDuration = today.getTime() - purchaseDate.getTime();
    
    let progress = 0;
    if (totalDuration > 0) {
        progress = Math.max(0, Math.min(100, (elapsedDuration / totalDuration) * 100));
    } else if (today.getTime() >= purchaseDate.getTime()) {
        progress = 100;
    }
    
    if (status === 'expired') {
        progress = 100;
    }

    const statusText = status === 'expired' ? 'Expired' : `${Math.max(0, daysLeft)} days left`;

    return { status, daysLeft: Math.max(0, daysLeft), progress, statusText };
};


const demoWarranties: Warranty[] = [
    { id: 'demo-1', user_id: 'demo', product_name: 'SuperPixel Smartphone', purchase_date: '2023-10-15', warranty_duration: 12, expiry_date: '2024-10-14', file_url: `https://picsum.photos/seed/tech/400/200`, ocr_raw: null, created_at: new Date().toISOString(), category: 'phone' },
    { id: 'demo-2', user_id: 'demo', product_name: 'InstaFreeze Refrigerator', purchase_date: '2023-01-20', warranty_duration: 24, expiry_date: new Date(new Date().setDate(new Date().getDate() + 25)).toISOString(), file_url: `https://picsum.photos/seed/kitchen/400/200`, ocr_raw: null, created_at: new Date().toISOString(), category: 'appliance' },
    { id: 'demo-3', user_id: 'demo', product_name: 'Roadster EV Sedan', purchase_date: '2022-08-01', warranty_duration: 18, expiry_date: '2024-02-01', file_url: `https://picsum.photos/seed/car/400/200`, ocr_raw: null, created_at: new Date().toISOString(), category: 'car' },
];

const Dashboard: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingWarranty, setEditingWarranty] = useState<Warranty | null>(null);
  const [sharingWarranty, setSharingWarranty] = useState<Warranty | null>(null);
  const { warranties, loading, error, deleteWarranty } = useWarranties();
  const { user } = useAuth();
  
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'safe' | 'expiring' | 'expired'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | Category>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('expiryAsc');
  
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
      if (!loading) {
          const hasDismissed = localStorage.getItem('onboardingDismissed') === 'true';
          if (warranties.length === 0 && !hasDismissed) {
              setShowOnboarding(true);
          }
          if (warranties.length === 0) {
              setIsDemoMode(true);
          }
      }
  }, [loading, warranties.length]);
  
  const handleDismissOnboarding = () => {
      setShowOnboarding(false);
      localStorage.setItem('onboardingDismissed', 'true');
  };

  const dataToDisplay = isDemoMode ? demoWarranties : warranties;

  const filteredWarranties = useMemo(() => {
    return [...dataToDisplay] // Create a shallow copy to avoid mutating the original array
      .map(w => ({ ...w, ...getWarrantyStatusInfo(w.purchase_date, w.expiry_date) }))
      .sort((a, b) => {
          switch (sortOrder) {
              case 'expiryAsc':
                  return new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime();
              case 'expiryDesc':
                  return new Date(b.expiry_date).getTime() - new Date(a.expiry_date).getTime();
              case 'nameAsc':
                  return a.product_name.localeCompare(b.product_name);
              case 'nameDesc':
                  return b.product_name.localeCompare(a.product_name);
              case 'latest':
              default:
                  return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          }
      })
      .filter(w => {
        const matchesSearch = w.product_name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || (statusFilter === 'safe' ? w.status === 'safe' : w.status === statusFilter);
        const matchesCategory = categoryFilter === 'all' || w.category === categoryFilter;

        return matchesSearch && matchesStatus && matchesCategory;
      });
  }, [dataToDisplay, searchTerm, statusFilter, categoryFilter, sortOrder]);
  
  const stats = useMemo(() => {
      const source = warranties; // Always calculate real stats
      const statuses = source.map(w => getWarrantyStatusInfo(w.purchase_date, w.expiry_date).status);
      const expiredCount = statuses.filter(s => s === 'expired').length;
      const expiringCount = statuses.filter(s => s === 'expiring').length;
      const activeCount = source.length - expiredCount - expiringCount;
      return {
          total: source.length,
          active: activeCount,
          expiring: expiringCount,
          expired: expiredCount,
      };
  }, [warranties]);
  
  const handleExportCSV = () => {
    if (filteredWarranties.length === 0) {
        alert("There is no data to export based on the current filters.");
        return;
    }

    const headers = [
        "Product Name",
        "Category",
        "Purchase Date",
        "Warranty Duration (Months)",
        "Expiry Date",
        "Status"
    ];

    const rows = filteredWarranties.map(w => [
        `"${w.product_name.replace(/"/g, '""')}"`,
        w.category || 'N/A',
        w.purchase_date,
        w.warranty_duration,
        w.expiry_date,
        w.status,
    ].join(','));

    const csvContent = [headers.join(','), ...rows].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'warranties_export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  const renderContent = () => {
    if (loading) {
      return <div className="flex justify-center items-center py-16"><Spinner className="w-8 h-8" /></div>;
    }
    if (error) {
      return (
        <div className="text-center py-16 px-6 bg-red-900/50 text-red-300 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Error loading warranties</h3>
          <p>{error}</p>
        </div>
      );
    }
    if (warranties.length === 0 && !isDemoMode) {
      return (
        <section 
          className="text-center py-16 px-6 bg-base-200/50 rounded-lg animate-slide-up"
        >
          <h3 className="text-xl font-semibold text-content-primary mb-2">Your Vault is Empty</h3>
          <p className="text-content-secondary max-w-md mx-auto mb-6">
            Upload your first warranty receipt to begin tracking. Never lose coverage again — we’ll remind you before warranties expire.
          </p>
          <button onClick={() => setIsAddModalOpen(true)} className="flex items-center mx-auto space-x-2 bg-brand-primary text-white font-semibold py-2 px-5 rounded-lg shadow-md hover:bg-opacity-90 transition-all transform hover:scale-105 hover:shadow-glow-blue">
            <PlusIcon className="h-5 w-5" />
            <span>Upload Warranty</span>
          </button>
        </section>
      );
    }
    if (filteredWarranties.length === 0) {
        return <div className="text-center py-16 text-content-secondary">No warranties match your search or filters.</div>
    }

    if (view === 'grid') {
      return (
        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredWarranties.map((warranty) => (
            <WarrantyCard key={warranty.id} warranty={warranty} onEdit={() => setEditingWarranty(warranty)} onShare={() => setSharingWarranty(warranty)} isDemo={isDemoMode} />
          ))}
        </div>
      );
    }
    return <WarrantyList warranties={filteredWarranties} onEdit={setEditingWarranty} onDelete={(id, url) => deleteWarranty(id, url)} onShare={setSharingWarranty} isDemo={isDemoMode} />;
  };

  return (
    <Layout>
      <section>
        {showOnboarding && <OnboardingBanner onDismiss={handleDismissOnboarding} />}
        
        <header className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-content-primary">Dashboard</h1>
            {user && <p className="text-content-secondary mt-1">Hello, {user.email}</p>}
          </div>
           {warranties.length === 0 && !loading && (
             <ToggleSwitch
                label="Demo Mode"
                enabled={isDemoMode}
                onChange={setIsDemoMode}
             />
           )}
        </header>

        <section 
          aria-labelledby="quick-upload-heading" 
          className="mb-8 animate-slide-up"
        >
            <h2 id="quick-upload-heading" className="sr-only">Quick Upload</h2>
            <UploadForm />
        </section>

        <section 
            aria-labelledby="stats-heading"
        >
            <h2 id="stats-heading" className="sr-only">Statistics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8 animate-slide-up">
                <StatsCard title="Total Warranties" value={stats.total} Icon={ShieldCheckIcon} color="blue" />
                <StatsCard title="Active Warranties" value={stats.active} Icon={CalendarIcon} color="teal" />
                <StatsCard title="Expiring Soon" value={stats.expiring} Icon={TagIcon} color="pink" />
                <StatsCard title="Expired" value={stats.expired} Icon={TagIcon} color="pink" />
            </div>
        </section>
        
        <section aria-labelledby="warranties-heading">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                <h2 id="warranties-heading" className="text-2xl font-bold text-content-primary">Your Warranties</h2>
                 <div className="flex items-center space-x-2">
                    <button 
                        onClick={handleExportCSV} 
                        className="flex items-center space-x-2 bg-base-300 text-content-primary font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-base-300/80 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={filteredWarranties.length === 0}
                        aria-label="Export filtered warranties to CSV"
                    >
                        <ExportIcon className="h-5 w-5" />
                        <span>Export CSV</span>
                    </button>
                    <button onClick={() => setIsAddModalOpen(true)} className="flex items-center space-x-2 bg-brand-primary text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-opacity-90 transition-all transform hover:scale-105 hover:shadow-glow-blue">
                        <PlusIcon className="h-5 w-5" />
                        <span>Upload for Analysis</span>
                    </button>
                </div>
            </div>

            {(warranties.length > 0 || isDemoMode) && (
                <div className="bg-base-200/50 backdrop-blur-sm p-4 rounded-lg mb-6 flex flex-wrap items-center gap-4 border border-base-300/50">
                    <div className="flex-grow min-w-[200px]"><input type="text" placeholder="Search by product name..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full px-3 py-2 bg-base-100/70 border border-base-300 text-content-primary rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"/></div>
                    <div className="flex-grow sm:flex-grow-0"><select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} className="w-full px-3 py-2 bg-base-100/70 border border-base-300 text-content-primary rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"><option value="all" className="bg-base-200 text-content-primary">All Statuses</option><option value="safe" className="bg-base-200 text-content-primary">Active</option><option value="expiring" className="bg-base-200 text-content-primary">Expiring Soon</option><option value="expired" className="bg-base-200 text-content-primary">Expired</option></select></div>
                    <div className="flex-grow sm:flex-grow-0"><select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value as any)} className="w-full px-3 py-2 bg-base-100/70 border border-base-300 text-content-primary rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"><option value="all" className="bg-base-200 text-content-primary">All Categories</option>{categories.map(c => <option key={c} value={c} className="capitalize bg-base-200 text-content-primary">{c}</option>)}</select></div>
                    <div className="flex-grow sm:flex-grow-0">
                        <select value={sortOrder} onChange={e => setSortOrder(e.target.value as SortOrder)} className="w-full px-3 py-2 bg-base-100/70 border border-base-300 text-content-primary rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary" aria-label="Sort warranties">
                            <option value="expiryAsc" className="bg-base-200 text-content-primary">Expiry Date (Soonest First)</option>
                            <option value="expiryDesc" className="bg-base-200 text-content-primary">Expiry Date (Latest First)</option>
                            <option value="latest" className="bg-base-200 text-content-primary">Date Added (Newest First)</option>
                            <option value="nameAsc" className="bg-base-200 text-content-primary">Product Name (A-Z)</option>
                            <option value="nameDesc" className="bg-base-200 text-content-primary">Product Name (Z-A)</option>
                        </select>
                    </div>
                    <div className="flex items-center bg-base-200 rounded-md p-1"><button onClick={() => setView('grid')} className={`p-1.5 rounded ${view === 'grid' ? 'bg-brand-primary text-white' : 'text-content-secondary'}`} aria-label="Grid View"><ViewGridIcon className="h-5 w-5"/></button><button onClick={() => setView('list')} className={`p-1.5 rounded ${view === 'list' ? 'bg-brand-primary text-white' : 'text-content-secondary'}`} aria-label="List View"><ViewListIcon className="h-5 w-5" /></button></div>
                </div>
            )}
            
            {renderContent()}
        </section>
      </section>

      <AddWarrantyModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      {editingWarranty && <EditWarrantyModal isOpen={!!editingWarranty} onClose={() => setEditingWarranty(null)} warranty={editingWarranty} />}
      {sharingWarranty && <ShareWarrantyModal isOpen={!!sharingWarranty} onClose={() => setSharingWarranty(null)} warranty={sharingWarranty} />}
    </Layout>
  );
};

export default Dashboard;