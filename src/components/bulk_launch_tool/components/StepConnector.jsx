import React from 'react';

/** Step Card 之间的视觉连接线（小型）。 */
const StepConnector = () => (
  <div className="flex justify-center -my-1 pointer-events-none">
    <div className="flex flex-col items-center">
      <div className="w-px h-3 bg-neutral-200" />
      <div className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
      <div className="w-px h-3 bg-neutral-200" />
    </div>
  </div>
);

export default StepConnector;
