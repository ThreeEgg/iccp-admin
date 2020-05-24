import { message } from 'antd';

export const getParameter = param => {
  const query = window.location.search;
  const iLen = param.length;
  let iStart = query.indexOf(param);
  if (iStart === -1) {
    return '';
  }
  iStart += iLen + 1;
  const iEnd = query.indexOf('&', iStart);
  if (iEnd === -1) {
    return query.substring(iStart);
  }
  return query.substring(iStart, iEnd);
};

// 富文本编辑器配置
export const controls = [
  'bold',
  'italic',
  'underline',
  'text-color',
  'separator',
  'separator',
  'media',
];

export const myUploadFn = async param => {
  const successFn = result => {
    param.success({
      url: result.res.requestUrls[0].split('?')[0],
      meta: {
        id: result.res.requestUrls[0].split('?')[0],
        title: '测试',
        alt: '测绘',
        loop: false, // 指定音视频是否循环播放
        autoPlay: false, // 指定音视频是否自动播放
        controls: true, // 指定音视频是否显示控制栏
        // poster: 'http://xxx/xx.png', // 指定视频播放器的封面
      },
    });
  };
};

export const validateFn = file => {
  if (file.size >= 1024 * 1024 * 20) {
    message.info('添加的资源不可以大于20M');
  }
  return file.size < 1024 * 1024 * 20;
};
