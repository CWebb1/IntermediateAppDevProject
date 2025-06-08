import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import StoryGrid from '../components/stories/StoryGrid';
import { fetchStories, fetchStoryDetails } from '../api/hackerNewsApi';
import { Story } from '../types';

interface HomeProps {
  storyType: string;
}

const Home: React.FC<HomeProps> = ({ storyType }) => {
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  const { data: storyIds, isLoading, error } = useQuery<number[]>({
    queryKey: ['stories', storyType],
    queryFn: () => fetchStories(storyType),
  });

  console.log('Story IDs fetched:', storyIds); // Debug log for story IDs

  useEffect(() => {
    const loadStoryDetails = async () => {
      if (!storyIds?.length) return;
      
      console.log('Starting to fetch story details for IDs:', storyIds.slice(0, 25)); // Debug which IDs we're fetching
      setIsLoadingDetails(true);
      try {
        const storyPromises = storyIds
          .slice(0, 25)
          .map((id: number) => {
            console.log(`Fetching story ID: ${id}`); // Debug each ID being fetched
            return fetchStoryDetails(id);
          });
        
        const fetchedStories = await Promise.all(storyPromises);
        console.log('Fetched stories:', fetchedStories); // Debug what stories were actually fetched
        setStories(fetchedStories.filter(story => story && story.id)); // Filter out any null or invalid stories
      } catch (err) {
        console.error('Error fetching story details:', err);
      } finally {
        setIsLoadingDetails(false);
      }
    };

    loadStoryDetails();
  }, [storyIds]);

  
  // Map of story types to display titles
  const storyTypeToTitle: Record<string, string> = {
    'askstories': 'Ask Stories',
    'beststories': 'Best Stories',
    'jobstories': 'Job Stories',
    'newstories': 'New Stories',
    'showstories': 'Show Stories',
    'topstories': 'Top Stories',
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{storyTypeToTitle[storyType] || 'Stories'}</h1>
      {stories.length === 0 && !isLoading && !isLoadingDetails && (
        <div className="text-red-500 mb-4">No stories were loaded. Check console for details.</div>
      )}
      <StoryGrid 
        stories={stories} 
        isLoading={isLoading || isLoadingDetails} 
        error={error as Error | null} 
      />
    </div>
  );
};

export default Home;