import React, { useState, useEffect } from 'react';

const Canvas = (props) => {

  const [data, setData] = useState(null);
  const [src, setSrc] = useState(null);
  const [emojiRect, setEmojiRect] = useState({
      left: 0,
      top: 0,
      width: 0,
      height: 0
  });

  useEffect(() => {
    // 组件挂载后执行的代码
    console.log('组件即将挂载');
    let image = new Image();
    image.src = '/images/dance.gif';
    image.onload = () => {
        let emojiWidth = 140;
        let emojiHeight = image.height / image.width * emojiWidth;
        setEmojiRect({
            left: 16 + 64 + 20 + 'px',
            top: 46 + 'px',
            width: emojiWidth,
            height: emojiHeight
        });
        console.log(emojiRect);
        setSrc(image.src);
    };
  
    return () => {
      // 组件卸载前执行的清理代码
      console.log('组件即将卸载');
    };
  }, []); 

  return (
    <div className="bg-white w-[600px] h-[400px] m-auto relative">
        <img src={props.avatar} alt="" className='w-[64px] h-[64px] rounded-[6px] absolute block bg-white' style={{
          left: '16px',
          top: 16 + 6 + 'px'
        }} />

        <div className='text-[17px] absolute block text-[#3c3c4399]' style={{
          left: 16 + 64 + 20 + 'px',
          top: 16 + 'px'
        }} >{props.nickname}</div>

        <img src={src} alt="" className='w-[600px] h-[400px] absolute block' style={{
            left: emojiRect.left,
            top: emojiRect.top,
            width: emojiRect.width,
            height: emojiRect.height,
            display: emojiRect.width > 0 ? 'block' : 'none'
        }} />
    </div>
  );
};

export default Canvas;
