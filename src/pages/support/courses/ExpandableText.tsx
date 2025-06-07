// app/ui/atoms/ExpandableText.tsx
'use client';

import { FC, useState } from 'react';

interface ExpandableTextProps {
  /** The full text to display */
  text: string;
  /** How many words to show before “See more” */
  initialWords?: number;
}

export const ExpandableText: FC<ExpandableTextProps> = ({
  text,
  initialWords = 20,
}) => {
  const [expanded, setExpanded] = useState(false);

  // Split into words so we don’t cut mid-word
  const words = text.trim().split(/\s+/);
  const needsTruncate = words.length > initialWords;

  // Preview is first N words joined back into a string
  const preview = words.slice(0, initialWords).join(' ');

  return (
    <p className="text-sm text-gray-200">
      {expanded || !needsTruncate
        ? text
        : preview + '...'}
      {needsTruncate && (
        <button
          onClick={() => setExpanded((e) => !e)}
          className="ml-2 text-blue-400 hover:underline focus:outline-none"
        >
          {expanded ? 'See less' : 'See more'}
        </button>
      )}
    </p>
  );
};
