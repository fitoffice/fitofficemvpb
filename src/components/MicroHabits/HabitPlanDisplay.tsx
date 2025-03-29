import React from 'react';
import ReactMarkdown from 'react-markdown';

interface HabitPlanDisplayProps {
  planContent: string;
}

const HabitPlanDisplay: React.FC<HabitPlanDisplayProps> = ({ planContent }) => {
  return (
    <div className="habit-plan-display">
      <ReactMarkdown>{planContent}</ReactMarkdown>
      <style jsx>{`
        .habit-plan-display {
          background: white;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          max-width: 800px;
          margin: 0 auto;
        }

        .habit-plan-display :global(h1) {
          color: #2563eb;
          font-size: 1.8rem;
          margin-bottom: 1.5rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #e5e7eb;
        }

        .habit-plan-display :global(h2) {
          color: #1f2937;
          font-size: 1.4rem;
          margin-top: 1.5rem;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .habit-plan-display :global(ul) {
          list-style-type: none;
          padding-left: 1rem;
        }

        .habit-plan-display :global(li) {
          margin-bottom: 0.5rem;
          line-height: 1.6;
        }

        .habit-plan-display :global(strong) {
          color: #4b5563;
        }

        .habit-plan-display :global(p) {
          margin-bottom: 1rem;
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
};

export default HabitPlanDisplay;
