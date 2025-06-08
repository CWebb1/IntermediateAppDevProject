import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { leaders } from '../data/leaders';
import { Leader } from '../types';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '../components/ui/form';

// Define the form validation schema
const formSchema = z.object({
  leaderName: z.string().min(1, {
    message: "Leader name is required",
  }),
});

const Leaders: React.FC = () => {
  const [selectedLeader, setSelectedLeader] = useState<Leader | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      leaderName: "",
    },
  });

  // Function to handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    
    try {
      // Find the leader by name (case-insensitive partial match)
      const searchTerm = values.leaderName.toLowerCase();
      const leader = leaders.find((l) => 
        l.name.toLowerCase().includes(searchTerm) || l.id.toLowerCase().includes(searchTerm)
      );
      
      if (leader) {
        // If we found a matching leader, fetch their additional data from the API
        const response = await fetch(`https://hacker-news.firebaseio.com/v0/user/${leader.id}.json?print=pretty`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch leader data: ${response.statusText}`);
        }
        
        const apiData = await response.json();
        
        // Merge hardcoded data with API data
        setSelectedLeader({
          ...leader,
          ...apiData,
        });
      } else {
        setError(`No leader found matching "${values.leaderName}"`);
        setSelectedLeader(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setSelectedLeader(null);
    } finally {
      setIsLoading(false);
    }
  }

  // Convert Unix timestamp to readable date
  const formatTime = (timestamp: number): string => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Hacker News Leaders</h1>
      
      <div className="mb-8 max-w-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="leaderName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Search for a Leader</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter leader name..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Searching..." : "Search"}
            </Button>
          </form>
        </Form>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {selectedLeader && (
        <Card className="max-w-3xl">
          <CardHeader>
            <CardTitle>{selectedLeader.name}</CardTitle>
            <CardDescription>ID: {selectedLeader.id}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold">About</h3>
                <p>{selectedLeader.about || 'N/A'}</p>
              </div>
              <div>
                <h3 className="font-semibold">Karma</h3>
                <p>{selectedLeader.karma.toLocaleString()}</p>
              </div>
              <div>
                <h3 className="font-semibold">Created</h3>
                <p>{formatTime(selectedLeader.created)}</p>
              </div>
              <div>
                <h3 className="font-semibold">Submitted Stories</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedLeader.submitted && selectedLeader.submitted.length > 0 ? (
                    selectedLeader.submitted.slice(0, 5).map((itemId) => (
                      <a 
                        key={itemId}
                        href={`https://hacker-news.firebaseio.com/v0/item/${itemId}.json?print=pretty`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {itemId}
                      </a>
                    ))
                  ) : (
                    <span>N/A</span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {!selectedLeader && !error && !isLoading && (
        <p className="text-gray-500">Search for a leader to see their information.</p>
      )}

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Available Leaders</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {leaders.map((leader) => (
            <div 
              key={leader.id} 
              className="bg-gray-100 p-3 rounded cursor-pointer hover:bg-gray-200"
              onClick={() => form.setValue('leaderName', leader.name)}
            >
              <strong>{leader.name}</strong> ({leader.id})
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leaders;