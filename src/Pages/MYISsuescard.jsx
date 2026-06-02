import React from 'react';

const MYISsuescard = ({ issue }) => {
  if (!issue) return null;
  return (
    <div className="rounded-xl shadow-lg border-2 border-gray-200 dark:border-gray-700 p-4">
      <h3 className="text-lg font-semibold">{issue.title}</h3>
      <p className="text-sm text-gray-500">{issue.category}</p>
    </div>
  );
};

export default MYISsuescard;
