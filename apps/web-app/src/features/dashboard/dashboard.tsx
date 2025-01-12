import { FC } from 'react';

export const Dashboard: FC = () => {
  return (
    <div className="w-full h-full">
      <iframe
        src="https://metabase-insight-engine.duckdns.org/public/dashboard/387fcedc-8a86-49c2-8f7c-d544cedb6872"
        title="Dashboard"
        className="w-full h-full border-0"
        style={{ minHeight: '100vh' }}
      />
    </div>
  );
};

export default Dashboard;
