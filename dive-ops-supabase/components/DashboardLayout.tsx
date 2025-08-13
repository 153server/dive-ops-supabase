import { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  
  const signOut = () => {
    // Clear any session data or tokens here
    router.push('/login');
  };

  const isActive = (pathname: string) => {
    return router.pathname === pathname;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Top Navigation */}
      <header className="bg-gradient-to-r from-blue-800 to-blue-900 text-white shadow-lg">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-white p-1 rounded-md shadow">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 w-10 h-10 rounded flex items-center justify-center text-white font-bold">
              </div>
            </div>
            <h1 className="text-xl font-bold tracking-tight">MOBY-TEK DIVE CENTER</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex flex-col items-end">
              <span className="font-medium">Admin User</span>
              <span className="text-sm text-blue-200">Dive Manager</span>
            </div>
            <button 
              onClick={signOut}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition flex items-center shadow-md"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-white shadow-lg hidden md:block border-r border-gray-200">
          <nav className="p-4">
            <div className="mb-8 mt-2">
              <h2 className="text-xs uppercase tracking-wider text-gray-500 font-medium pl-3 mb-2">
                Operations
              </h2>
              <ul className="space-y-1">
                <li>
                  <Link 
                    href="/scan" 
                    className={`flex items-center p-3 rounded-lg transition ${
                      isActive('/scan') 
                        ? 'bg-blue-50 text-blue-800 font-semibold border-l-4 border-blue-600' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-3 bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs">
                      1
                    </span>
                     Equipment Scan
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/trips" 
                    className={`flex items-center p-3 rounded-lg transition ${
                      isActive('/trips') 
                        ? 'bg-blue-50 text-blue-800 font-semibold border-l-4 border-blue-600' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-3 bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs">
                      2
                    </span>
                     Trip Management
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/gas" 
                    className={`flex items-center p-3 rounded-lg transition ${
                      isActive('/gas') 
                        ? 'bg-blue-50 text-blue-800 font-semibold border-l-4 border-blue-600' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-3 bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs">
                      3
                    </span>
                     Cylinder Filling
                  </Link>
                </li>
              </ul>
            </div>

            <div className="mb-4">
              <h2 className="text-xs uppercase tracking-wider text-gray-500 font-medium pl-3 mb-2">
                Monitoring
              </h2>
              <ul className="space-y-1">
                <li>
                  <Link 
                    href="/status" 
                    className={`flex items-center p-3 rounded-lg transition ${
                      isActive('/status') 
                        ? 'bg-blue-50 text-blue-800 font-semibold border-l-4 border-blue-600' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-3 bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs">
                      4
                    </span>
                     Status Dashboard
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/reports" 
                    className={`flex items-center p-3 rounded-lg transition ${
                      isActive('/reports') 
                        ? 'bg-blue-50 text-blue-800 font-semibold border-l-4 border-blue-600' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-3 bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs">
                      5
                    </span>
                     Dive Reports
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xs uppercase tracking-wider text-gray-500 font-medium pl-3 mb-2">
                Administration
              </h2>
              <ul className="space-y-1">
                <li>
                  <Link 
                    href="/billing" 
                    className={`flex items-center p-3 rounded-lg transition ${
                      isActive('/billing') 
                        ? 'bg-blue-50 text-blue-800 font-semibold border-l-4 border-blue-600' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-3 bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs">
                      6
                    </span>
                     Billing Management
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/settings" 
                    className={`flex items-center p-3 rounded-lg transition ${
                      isActive('/settings') 
                        ? 'bg-blue-50 text-blue-800 font-semibold border-l-4 border-blue-600' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-3 bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs">
                      7
                    </span>
                     System Settings
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
          
          <div className="px-4 py-3 border-t border-gray-200 mt-auto">
            <div className="text-xs text-gray-500 mb-1">DiveOps v1.2</div>
            <div className="text-xs text-gray-400">© 2023 Moby-Tek</div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-6 bg-gray-50 min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  );
}
