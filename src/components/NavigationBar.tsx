
import { Home, FileText, Settings } from 'lucide-react';

interface NavigationBarProps {
  currentPage: 'home' | 'report' | 'settings';
}

const NavigationBar = ({ currentPage }: NavigationBarProps) => {
  const navItems = [
    { id: 'home', icon: Home, label: '홈', href: '/' },
    { id: 'report', icon: FileText, label: '제보', href: '/report' },
    { id: 'settings', icon: Settings, label: '설정', href: '/settings' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="flex justify-around py-2">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <a
              key={item.id}
              href={item.href}
              className={`flex flex-col items-center py-2 px-4 min-w-0 transition-colors ${
                isActive 
                  ? 'text-red-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
};

export default NavigationBar;
