import React from 'react';
import { Text } from 'react-native';

type ProgressSummaryProps = {
  data: {
    assess?: string;
    gainedMuscle?: number;
    gainedFat?: number;
  };
};

const ProgressSummary: React.FC<ProgressSummaryProps> = ({ data }) => {
  return (
    <Text className="text-sm text-center mb-4">
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