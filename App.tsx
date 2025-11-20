
import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { CreatePR } from './components/CreatePR';
import { PRList } from './components/PRList';
import { Dashboard } from './pages/Dashboard';
import { exportToExcel, generatePO_PDF } from './services/exportService';

// Import new pages
import { UserManagement } from './pages/UserManagement';
import { ApproverManagement } from './pages/ApproverManagement';
import { LimitManagement } from './pages/LimitManagement';

const MainLayout: React.FC = () => {
    const [activePage, setActivePage] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { role, orders, requests } = useApp();

    const renderContent = () => {
        switch (activePage) {
            case 'dashboard':
                return <Dashboard />;
            case 'create-pr':
                return <CreatePR onCancel={() => setActivePage('requests')} />;
            case 'requests':
                return (
                    <div className="space-y-6 h-full flex flex-col">
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-800">My Requests</h2>
                        <PRList />
                    </div>
                );
            case 'approvals':
                return (
                    <div className="space-y-6 h-full flex flex-col">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                             <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Pending Approvals</h2>
                             <div className="bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-full text-sm text-indigo-800 flex items-center gap-2 self-start md:self-auto">
                                <i className="bi bi-person-badge-fill"></i>
                                Viewing as: <strong>{role.replace('_', ' ')}</strong>
                            </div>
                        </div>
                        <PRList isApprovalView={true} />
                    </div>
                );
            case 'orders':
                 return (
                    <div className="space-y-6 h-full flex flex-col">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Purchase Orders</h2>
                        </div>
                        
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col">
                            {/* Desktop Table - Hidden on Tablet (lg and below) */}
                            <div className="hidden lg:block overflow-x-auto flex-1">
                                <table className="w-full text-sm text-left min-w-[600px]">
                                    <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                                        <tr>
                                            <th className="px-6 py-4">PO Number</th>
                                            <th className="px-6 py-4">Date</th>
                                            <th className="px-6 py-4">Vendor</th>
                                            <th className="px-6 py-4 text-right">Total</th>
                                            <th className="px-6 py-4 text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {orders.length === 0 ? (
                                            <tr><td colSpan={5} className="p-12 text-center text-slate-400">No POs generated yet.</td></tr>
                                        ) : (
                                            orders.map(po => (
                                                <tr key={po.poNumber} className="hover:bg-slate-50 transition">
                                                    <td className="px-6 py-4 font-mono font-medium text-indigo-600">{po.poNumber}</td>
                                                    <td className="px-6 py-4 text-slate-600">{new Date(po.generatedDate).toLocaleDateString()}</td>
                                                    <td className="px-6 py-4 font-medium text-slate-800">{po.vendorName}</td>
                                                    <td className="px-6 py-4 text-right font-bold text-slate-800">
                                                        {new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(po.prSnapshot.totalAmount)}
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <button 
                                                            onClick={() => generatePO_PDF(po)}
                                                            className="bg-white border border-slate-200 hover:border-red-300 hover:bg-red-50 text-slate-600 hover:text-red-700 px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 mx-auto shadow-sm"
                                                            title="Download Signed PDF"
                                                        >
                                                            <i className="bi bi-file-earmark-pdf-fill text-red-500"></i> Generate PDF
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* Mobile/Tablet Card View for Orders (Visible on lg and below) */}
                            <div className="lg:hidden flex-1 bg-slate-50 p-4 space-y-4 overflow-y-auto">
                                {orders.length === 0 ? (
                                    <div className="text-center text-slate-400 py-8">No POs generated yet.</div>
                                ) : (
                                    orders.map(po => (
                                        <div key={po.poNumber} className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
                                            <div className="flex justify-between items-center mb-3">
                                                <span className="font-mono text-sm font-bold text-indigo-600">{po.poNumber}</span>
                                                <button 
                                                    onClick={() => generatePO_PDF(po)}
                                                    className="bg-red-50 text-red-700 hover:bg-red-100 flex items-center gap-1 text-xs font-bold border border-red-200 px-3 py-1.5 rounded-lg transition"
                                                >
                                                    <i className="bi bi-file-earmark-pdf-fill"></i> PDF
                                                </button>
                                            </div>
                                            <div className="mb-3 space-y-1">
                                                 <p className="text-sm font-medium text-slate-800">{po.vendorName}</p>
                                                 <p className="text-xs text-slate-500">{new Date(po.generatedDate).toLocaleDateString()}</p>
                                            </div>
                                            <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                                                <span className="text-xs text-slate-400">Total Amount</span>
                                                <p className="font-bold text-slate-800">
                                                    {new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(po.prSnapshot.totalAmount)}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                 );
            case 'reports':
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Reports</h2>
                        <div className="bg-white p-8 md:p-12 rounded-xl shadow-sm border border-slate-200 text-center max-w-3xl mx-auto mt-10">
                            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-100 shadow-sm">
                                <i className="bi bi-file-earmark-excel text-4xl text-green-600"></i>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Export Procurement Data</h3>
                            <p className="text-slate-500 mb-8 leading-relaxed">
                                Download a complete comprehensive record of all Purchase Requests and Purchase Orders. 
                                The generated Excel file includes status tracking, item counts, and approval logs.
                            </p>
                            <button 
                                onClick={() => exportToExcel(requests, orders)}
                                className="bg-green-600 text-white px-8 py-3.5 rounded-lg font-medium hover:bg-green-700 transition shadow-lg shadow-green-600/20 flex items-center gap-3 mx-auto hover:-translate-y-0.5 w-full md:w-auto justify-center"
                            >
                                <i className="bi bi-download"></i> Download Excel Report
                            </button>
                        </div>
                    </div>
                );
            // New Admin Pages
            case 'manage-users':
                return <UserManagement />;
            case 'manage-approvers':
                return <ApproverManagement />;
            case 'manage-limits':
                return <LimitManagement />;
            default:
                return <Dashboard />;
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar 
                activePage={activePage} 
                setActivePage={(page) => {
                    setActivePage(page);
                    setSidebarOpen(false); // Close mobile sidebar on selection
                }} 
                isOpen={sidebarOpen}
                setIsOpen={setSidebarOpen}
            />
            
            {/* Main Layout Wrapper - Aligned with fixed sidebar */}
            <div className="flex-1 flex flex-col min-h-screen transition-all duration-300 lg:ml-64 w-full">
                {/* Mobile Header - Sticky */}
                <header className="lg:hidden bg-slate-900 text-white p-4 flex items-center justify-between shadow-md sticky top-0 z-30">
                    <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center text-xs font-bold text-slate-900">
                            PF
                        </div>
                        <h1 className="text-lg font-bold">ProcureFlow</h1>
                    </div>
                    <button 
                        onClick={() => setSidebarOpen(true)}
                        className="text-slate-300 hover:text-white focus:outline-none p-1"
                    >
                        <i className="bi bi-list text-2xl"></i>
                    </button>
                </header>

                {/* Main Content Area - Optimized padding for full screen feel */}
                <main className="flex-1 p-3 md:p-6 lg:p-8 max-w-full overflow-x-hidden flex flex-col">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
