import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-600 text-white p-4 mt-8">
      <div className="container mx-auto text-center">
        <p>© {new Date().getFullYear()} Daily Hacksmith</p>
        <p className="text-sm mt-1">Data provided by the Hacker News API</p>
      </div>
    </footer>
  );
};

export default Footer;