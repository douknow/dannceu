import React, { useState, useEffect } from 'react';

const Canvas = React.forwardRef((props, ref) => {

  const [data, setData] = useState(null);
  const [src, setSrc] = useState(null);
  const [emojiRect, setEmojiRect] = useState({
      left: 0,
      top: 0,
      width: 0,
      height: 0
  });

  useEffect(() => {
    let image = new Image();
    image.src = '/images/dance.gif';
    image.onload = () => {
        let emojiWidth = 140;
        let emojiHeight = image.height / image.width * emojiWidth;
        setEmojiRect({
            left: 16 + 64 + 20,
            top: 46,
            width: emojiWidth,
            height: emojiHeight
        });
        setSrc(image.src);
    };
  }, []); 

  useEffect(() => {
    if (props.emojiRectChange && typeof props.emojiRectChange === 'function') props.emojiRectChange(emojiRect);
    
  }, [emojiRect]);

  useEffect(() => {
    if (props.emojiLoaded && typeof props.emojiLoaded === 'function') props.emojiLoaded(src);
  }, [src]);

  return (
    <div className="bg-white w-[300px] h-[260px] m-auto absolute top-0 left-0" ref={ref}>
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
            display: (emojiRect.width > 0 && props.showContent) ? 'block' : 'none'
        }} />
    </div>
  );
});

export default Canvas;
