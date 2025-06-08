import { API_ENDPOINTS } from '../utils/constants';
import { Story } from '../types';

export const fetchStories = async (storyType: string): Promise<number[]> => {
  try {
    let endpoint = '';
    switch (storyType) {
      case 'askstories':
        endpoint = API_ENDPOINTS.ASK_STORIES;
        break;
      case 'beststories':
        endpoint = API_ENDPOINTS.BEST_STORIES;
        break;
      case 'jobstories':
        endpoint = API_ENDPOINTS.JOB_STORIES;
        break;
      case 'newstories':
        endpoint = API_ENDPOINTS.NEW_STORIES;
        break;
      case 'showstories':
        endpoint = API_ENDPOINTS.SHOW_STORIES;
        break;
      case 'topstories':
        endpoint = API_ENDPOINTS.TOP_STORIES;
        break;
      default:
        endpoint = API_ENDPOINTS.ASK_STORIES; // Default to Ask Stories
    }
    
    const response = await fetch(endpoint);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch stories: ${response.statusText}`);
    }
    
    return await response.json() as number[];
  } catch (error) {
    console.error('Error fetching stories:', error);
    throw error;
  }
};



export const fetchStoryDetails = async (id: number | string): Promise<Story> => {
  try {
    const response = await fetch(`${API_ENDPOINTS.ITEM}${id}.json?print=pretty`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch story details: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching story details:', error);
    throw error;
  }
};

export const fetchUserDetails = async (userId: string): Promise<Story> => {
  try {
    const response = await fetch(`${API_ENDPOINTS.USER}${userId}.json?print=pretty`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch user details: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching user details:', error);
    throw error;
  }

};