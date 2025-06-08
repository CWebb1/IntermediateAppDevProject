import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Story } from '../../types';

interface StoryCardProps {
  story: Story;
  mosaicClass?: string;
}

const StoryCard: React.FC<StoryCardProps> = ({ story, mosaicClass = "" }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/story/${story.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className={`cursor-pointer transition-shadow hover:shadow-2xl ${mosaicClass}`}
      style={{
        minHeight: 0,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Card className="h-full flex flex-col justify-between bg-white border border-gray-200 shadow-md rounded-xl hover:border-orange-400 transition-all">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">{story.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2 text-sm text-gray-600">
            <span>By: <span className="font-medium text-gray-800">{story.by}</span></span>
            <span>Score: <span className="font-medium text-orange-500">{story.score}</span></span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StoryCard;