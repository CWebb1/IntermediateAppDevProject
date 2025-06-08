import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/card';
const StoryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  const { data: story, isLoading, error } = useQuery({
    queryKey: ['story', id],
    queryFn: async () => {
      const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`);
      if (!response.ok) {
        throw new Error('Failed to fetch story details');
      }
      return response.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-lg text-center">Loading story details...</p>
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertDescription>
            Error fetching story details: {error instanceof Error ? error.message : 'Unknown error'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Convert Unix timestamp to readable date
  const formatTime = (timestamp: number): string => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>{story.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">By</h3>
              <p>{story.by}</p>
            </div>
            <div>
              <h3 className="font-semibold">Score</h3>
              <p>{story.score}</p>
            </div>
            <div>
              <h3 className="font-semibold">Time</h3>
              <p>{formatTime(story.time)}</p>
            </div>
            <div>
              <h3 className="font-semibold">Type</h3>
              <p>{story.type}</p>
            </div>
          </div>
          
          {story.url && (
            <div>
              <h3 className="font-semibold">URL</h3>
              <a 
                href={story.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline break-words"
              >
                {story.url}
              </a>
            </div>
          )}
          
          <div>
            <h3 className="font-semibold">Kids</h3>
            {story.kids && story.kids.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {story.kids.slice(0, 5).map((kidId: number) => (
                  <a
                    key={kidId}
                    href={`https://hacker-news.firebaseio.com/v0/item/${kidId}.json?print=pretty`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {kidId}
                  </a>
                ))}
              </div>
            ) : (
              <p>N/A</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <button 
            onClick={() => window.history.back()} 
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Back to Stories
          </button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default StoryDetail;