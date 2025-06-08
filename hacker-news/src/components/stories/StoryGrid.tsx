import React from 'react';
import StoryCard from './StoryCard';
import { Story } from '../../types';
import { Alert, AlertDescription } from '../ui/alert';

interface StoryGridProps {
  stories: Story[];
  isLoading: boolean;
  error: Error | null;
}

// Helper to randomize card sizes for mosaic effect
const mosaicClasses = [
  "col-span-1 row-span-1",
  "col-span-2 row-span-1",
  "col-span-1 row-span-2",
  "col-span-2 row-span-2"
];

const getRandomMosaicClass = () => {
  // Weighted to favor smaller cards for better layout
  const weights = [0.5, 0.2, 0.2, 0.1];
  const rand = Math.random();
  let sum = 0;
  for (let i = 0; i < weights.length; i++) {
    sum += weights[i];
    if (rand < sum) return mosaicClasses[i];
  }
  return mosaicClasses[0];
};

const StoryGrid: React.FC<StoryGridProps> = ({ stories, isLoading, error }) => {
  if (isLoading) {
    return <div className="flex justify-center items-center p-8">
      <p className="text-lg">Loading stories...</p>
    </div>;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Error fetching stories: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  if (!stories || stories.length === 0) {
    return (
      <Alert>
        <AlertDescription>
          No stories available.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 auto-rows-[180px] gap-5">
      {stories.map((story) => (
        <StoryCard
          key={story.id}
          story={story}
          mosaicClass={getRandomMosaicClass()}
        />
      ))}
    </div>
  );
};

export default StoryGrid;