import React from 'react';
import { useNavigate } from 'react-router-dom';

interface PostContentProps {
  content: string;
}

export const PostContent = ({ content }: PostContentProps) => {
  const navigate = useNavigate();

  // Split content by hashtags and render them as clickable links
  const renderContent = () => {
    const hashtagRegex = /#[\w\u0600-\u06FF]+/g;
    const parts = content.split(hashtagRegex);
    const hashtags = content.match(hashtagRegex) || [];

    return (
      <>
        {parts.map((part, index) => (
          <span key={index}>
            {part}
            {hashtags[index] && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/hashtag/${hashtags[index].slice(1)}`);
                }}
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                {hashtags[index]}
              </button>
            )}
          </span>
        ))}
      </>
    );
  };

  return (
    <span className="text-foreground whitespace-pre-wrap">
      {renderContent()}
    </span>
  );
};

export default PostContent;
