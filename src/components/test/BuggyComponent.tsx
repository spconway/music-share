import React from 'react';

const BuggyComponent = () => {
  throw new Error('Simulated error for testing');
};

export default BuggyComponent;
