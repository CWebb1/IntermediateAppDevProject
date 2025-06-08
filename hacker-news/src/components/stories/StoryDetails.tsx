import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchStoryDetails } from '../../api/hackerNewsApi';
import { formatTime } from '../../utils/formatTime';
import { Card } from '../ui/card';
import { Story } from '../../types';

const StoryDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    
    const { data, isLoading, error } = useQuery({
        queryKey: ['storyDetails', id],
        queryFn: () => id ? fetchStoryDetails(id) : Promise.reject('No ID provided')
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error || !data) {
        return <div>Error fetching story details.</div>;
    }

    const { by, kids = [], score, time, title, type, url } = data as Story;

    return (
        <Card>
            <div className="p-4">
                <h2 className="text-xl font-bold mb-2">{title}</h2>
                <p>By: {by}</p>
                <p>Score: {score}</p>
                <p>Time: {formatTime(time)}</p>
                <p>Type: {type}</p>
                {url && <p><a href={url} target="_blank" rel="noopener noreferrer">Read more</a></p>}
                <p>Kids: {kids.length > 0 ? kids.slice(0, 5).map((kidId: number) => (
                    <a key={kidId} href={`https://hacker-news.firebaseio.com/v0/item/${kidId}.json?print=pretty`} 
                       target="_blank" rel="noopener noreferrer" className="mr-2">
                        {kidId}
                    </a>
                )) : 'N/A'}</p>
            </div>
        </Card>
    );
};

export default StoryDetails;