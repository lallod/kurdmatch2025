import { Lightbulb, MessageSquare, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ConversationInsightsProps {
  sharedInterests: string[];
  suggestedTopics: string[];
  conversationSummary?: string;
  communicationStyle?: string;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export const ConversationInsights = ({
  sharedInterests,
  suggestedTopics,
  conversationSummary,
  communicationStyle,
  onRefresh,
  isLoading
}: ConversationInsightsProps) => {
  return (
    <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Conversation Insights
        </CardTitle>
        {onRefresh && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
          >
            {isLoading ? 'Analyzing...' : 'Refresh'}
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {sharedInterests.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Shared Interests
            </h4>
            <div className="flex flex-wrap gap-2">
              {sharedInterests.map((interest, index) => (
                <Badge key={index} variant="secondary">
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {suggestedTopics.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Suggested Topics
            </h4>
            <div className="flex flex-wrap gap-2">
              {suggestedTopics.map((topic, index) => (
                <Badge key={index} variant="outline">
                  {topic}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {conversationSummary && (
          <div>
            <h4 className="text-sm font-semibold mb-2">Summary</h4>
            <p className="text-sm text-muted-foreground">{conversationSummary}</p>
          </div>
        )}

        {communicationStyle && (
          <div>
            <h4 className="text-sm font-semibold mb-2">Communication Style</h4>
            <p className="text-sm text-muted-foreground">{communicationStyle}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
