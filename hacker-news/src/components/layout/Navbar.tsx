import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';

const Navbar: React.FC = () => {
    return (
        <nav className="bg-white shadow-md border-b border-gray-200">
            <div className="container mx-auto flex flex-wrap justify-between items-center py-4 px-6">
                <div className="flex items-center gap-3">
                    {/* You can replace this with a logo if you have one */}
                    <span className="text-2xl font-extrabold text-gray-900 tracking-tight">Daily Hacksmith</span>
                </div>
                <div className="flex flex-wrap gap-1">
                    <Link to="/">
                        <Button variant="ghost" className="text-gray-800 hover:text-orange-500 font-medium px-4 py-2 rounded transition-colors">Ask Stories</Button>
                    </Link>
                    <Link to="/best">
                        <Button variant="ghost" className="text-gray-800 hover:text-orange-500 font-medium px-4 py-2 rounded transition-colors">Best Stories</Button>
                    </Link>
                    <Link to="/job">
                        <Button variant="ghost" className="text-gray-800 hover:text-orange-500 font-medium px-4 py-2 rounded transition-colors">Job Stories</Button>
                    </Link>
                    <Link to="/new">
                        <Button variant="ghost" className="text-gray-800 hover:text-orange-500 font-medium px-4 py-2 rounded transition-colors">New Stories</Button>
                    </Link>
                    <Link to="/show">
                        <Button variant="ghost" className="text-gray-800 hover:text-orange-500 font-medium px-4 py-2 rounded transition-colors">Show Stories</Button>
                    </Link>
                    <Link to="/top">
                        <Button variant="ghost" className="text-gray-800 hover:text-orange-500 font-medium px-4 py-2 rounded transition-colors">Top Stories</Button>
                    </Link>
                    <Link to="/leaders">
                        <Button variant="ghost" className="text-gray-800 hover:text-orange-500 font-medium px-4 py-2 rounded transition-colors">Leaders</Button>
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;