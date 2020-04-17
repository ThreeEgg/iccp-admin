import React from 'react';
import dynamic from 'umi/dynamic';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

const NIMChat = dynamic(import('@/components/IM'), {
  ssr: false,
});

const IM = () => {
  return <PageHeaderWrapper className="customer-service-list">
    <div style={{ padding: '100px', height: '100%', backgroundColor: '#000000' }}>
      <NIMChat />
    </div>;
    </PageHeaderWrapper>
}
export default IM