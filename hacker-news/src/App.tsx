import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import StoryDetail from './pages/StoryDetail';
import Leaders from './pages/Leaders';

// Create a QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Default route (Top Stories) */}
              <Route path="/" element={<Home storyType="topstories" />} />
              
              {/* Story type routes */}
              <Route path="/ask" element={<Home storyType="askstories" />} />
              <Route path="/best" element={<Home storyType="beststories" />} />
              <Route path="/job" element={<Home storyType="jobstories" />} />
              <Route path="/new" element={<Home storyType="newstories" />} />
              <Route path="/show" element={<Home storyType="showstories" />} />
              <Route path="/top" element={<Home storyType="topstories" />} />
              
              {/* Leaders page route */}
              <Route path="/leaders" element={<Leaders />} />
              
              {/* Story details route */}
              <Route path="/story/:id" element={<StoryDetail />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </QueryClientProvider>
  );
};

export default App;