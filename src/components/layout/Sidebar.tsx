import React from 'react';
import { Link, useLocation } from 'react-router-dom'; // Assuming react-router-dom for navigation
import { Home, Search, Library, PlusSquare, Heart, Settings } from 'lucide-react'; // Example icons
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area'; // Using shadcn ScrollArea

// Define props for Sidebar, if any dynamic content is needed
interface NavItem {
  path: string;
  name: string;
  icon: React.ReactNode;
}

const mainNavItems: NavItem[] = [
  { path: '/', name: 'Home', icon: <Home className="mr-3 h-5 w-5" /> },
  { path: '/search', name: 'Search', icon: <Search className="mr-3 h-5 w-5" /> },
  { path: '/library', name: 'Your Library', icon: <Library className="mr-3 h-5 w-5" /> },
];

const secondaryNavItems: NavItem[] = [
  { path: '/playlist/create', name: 'Create Playlist', icon: <PlusSquare className="mr-3 h-5 w-5" /> },
  { path: '/collection/tracks', name: 'Liked Songs', icon: <Heart className="mr-3 h-5 w-5" /> },
];


const Sidebar: React.FC = () => {
  console.log("Rendering Sidebar");
  const location = useLocation();

  const renderNavList = (items: NavItem[]) => (
    <ul className="space-y-1">
      {items.map((item) => (
        <li key={item.path}>
          <Button
            variant={location.pathname === item.path ? "secondary" : "ghost"}
            className="w-full justify-start text-sm font-medium"
            asChild
          >
            <Link to={item.path}>
              {item.icon}
              {item.name}
            </Link>
          </Button>
        </li>
      ))}
    </ul>
  );

  return (
    <aside className="w-64 bg-zinc-900 text-white flex flex-col space-y-4 p-4 border-r border-zinc-800 h-screen fixed top-0 left-0">
      {/* Logo or App Name Placeholder */}
      <div className="p-2 mb-2">
        <Link to="/" className="text-2xl font-bold hover:text-blue-400 transition-colors">
            DoraMusic
        </Link>
      </div>

      <nav className="space-y-4">
        {renderNavList(mainNavItems)}
      </nav>

      <hr className="border-zinc-700" />

      <nav className="space-y-4">
        {renderNavList(secondaryNavItems)}
      </nav>

      {/* Playlists section (example) */}
      <div className="flex-grow overflow-y-auto">
        <h3 className="px-3 py-2 text-xs font-semibold text-zinc-400 uppercase">Playlists</h3>
        <ScrollArea className="h-[calc(100%-2rem)]"> {/* Adjust height as needed */}
          <ul className="space-y-1 p-2">
            {/* Example Playlists - this would typically be dynamic */}
            <li><Button variant="ghost" className="w-full justify-start text-sm truncate">Chill Vibes</Button></li>
            <li><Button variant="ghost" className="w-full justify-start text-sm truncate">Workout Hits</Button></li>
            <li><Button variant="ghost" className="w-full justify-start text-sm truncate">Focus Mode</Button></li>
            {/* ... more playlists */}
          </ul>
        </ScrollArea>
      </div>

      {/* Settings or User Profile Link (Optional) */}
      <div className="mt-auto border-t border-zinc-700 pt-4">
        <Button variant="ghost" className="w-full justify-start text-sm" asChild>
            <Link to="/settings">
                <Settings className="mr-3 h-5 w-5" />
                Settings
            </Link>
        </Button>
      </div>
    </aside>
  );
}
export default Sidebar;