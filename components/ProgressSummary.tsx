import React from 'react';
import { Text } from "@/components/Text"

type ProgressSummaryProps = {
  data: {
    assess?: string;
    gainedMuscle?: number;
    gainedFat?: number;
  },
  fontSize?: number;
};

const ProgressSummary: React.FC<ProgressSummaryProps> = ({ data , fontSize = 16}) => {
  return (
    <Text style={{ fontSize, textAlign: 'center', marginBottom: 16 }}>
      {data.assess} You've{' '}
      {data && typeof data.gainedMuscle === 'number' ? (
        <>
          {data.gainedMuscle < 0 ? 'lost ' : 'gained '}
          <Text style={{ color: data.gainedMuscle < 0 ? 'red' : 'green' }}>
            {Math.abs(data.gainedMuscle).toFixed(2)} kg
          </Text>{' '}
          of Lean Muscle and{' '}
        </>
      ) : (
        '0.00'
      )}
      {data && typeof data.gainedFat === 'number' ? (
        <>
          {data.gainedFat < 0 ? 'lost ' : 'gained '}
          <Text style={{ color: data.gainedFat < 0 ? 'green' : 'red' }}>
            {Math.abs(data.gainedFat).toFixed(2)} %
          </Text>
        </>
      ) : (
        '0.00'
      )}{' '}
      of Body Fat Compared to Last Week
    </Text>
  );
};

export default ProgressSummary;