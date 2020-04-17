import React from 'react';
import dynamic from 'umi/dynamic';
import IM from '@/components/IM';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

const NIMChat = dynamic(import('@/components/IM'), {
  ssr: false,
});

const Chat = () => <PageHeaderWrapper className="customer-service-list">
  <div style={{ height: '700px' }}>
    <IM />
  </div>;
  </PageHeaderWrapper>
export default Chat