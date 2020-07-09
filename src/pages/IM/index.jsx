import React from 'react';
import IM from '@/components/IM';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

const Chat = () => (
  <PageHeaderWrapper className="customer-service-list" pageHeaderRender={() => <span></span>}>
    <div style={{ height: 'calc(100vh - 88px)', paddingTop: 24 }}>
      <IM />
    </div>
  </PageHeaderWrapper>
);
export default Chat;
