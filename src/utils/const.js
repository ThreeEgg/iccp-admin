import { message } from 'antd';
import { fileUpload } from '@/services/common';

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
      url: result.webUrl,
      meta: {
        id: result.id,
        title: result.oldFileName,
        alt: result.oldFileName,
        loop: false, // 指定音视频是否循环播放
        autoPlay: false, // 指定音视频是否自动播放
        controls: true, // 指定音视频是否显示控制栏
      },
    });
  };

  const progressFn = event => {
    // 上传进度发生变化时调用param.progress
    param.progress((event.loaded / event.total) * 100);
  };

  const errorFn = response => {
    // 上传发生错误时调用param.error
    param.error({
      msg: '上传失败',
    });
  };

  const result = await fileUpload({ file: param.file });
  if (result.code === '0') {
    successFn(result.data);
  } else {
    errorFn(result);
  }
};

export const validateFn = file => {
  if (file.size >= 1024 * 1024 * 20) {
    message.info('添加的资源不可以大于20M');
  }
  return file.size < 1024 * 1024 * 20;
};
