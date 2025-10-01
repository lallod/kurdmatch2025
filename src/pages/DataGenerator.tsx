import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { generateAllData } from '@/utils/dataGenerator/generateAllData';
import { Loader2, Database, CheckCircle2 } from 'lucide-react';

export default function DataGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    setIsGenerating(true);
    setStats(null);
    
    try {
      const result = await generateAllData();
      
      if (result.success) {
        setStats(result.stats);
        toast({
          title: 'Data Generated Successfully!',
          description: 'All activity data has been generated for users.',
        });
      } else {
        toast({
          title: 'Generation Failed',
          description: result.error || 'Failed to generate data',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred during data generation',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-6 h-6" />
            Database Data Generator
          </CardTitle>
          <CardDescription>
            Generate comprehensive test data for all authenticated users including messages, likes, matches, posts, comments, stories, events, and followers.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">What will be generated:</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Likes & Matches between users</li>
              <li>• Messages & Conversations</li>
              <li>• Posts with reactions & comments</li>
              <li>• Stories with views</li>
              <li>• Events with attendees</li>
              <li>• Follower relationships</li>
            </ul>
          </div>

          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Data...
              </>
            ) : (
              <>
                <Database className="mr-2 h-4 w-4" />
                Generate All Data
              </>
            )}
          </Button>

          {stats && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-2 text-success">
                <CheckCircle2 className="w-5 h-5" />
                <h3 className="font-semibold">Generation Complete!</h3>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Likes" value={stats.likes} />
                <StatCard label="Matches" value={stats.matches} />
                <StatCard label="Messages" value={stats.messages} />
                <StatCard label="Posts" value={stats.posts} />
                <StatCard label="Comments" value={stats.comments} />
                <StatCard label="Stories" value={stats.stories} />
                <StatCard label="Events" value={stats.events} />
                <StatCard label="Followers" value={stats.followers} />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-muted/30 p-4 rounded-lg text-center">
      <div className="text-2xl font-bold text-primary">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}
