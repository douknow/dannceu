import React, { useState, useEffect } from 'react';

const Canvas = React.forwardRef((props, ref) => {
  return (
    <div className="bg-white m-auto absolute top-0 left-0 overflow-hidden"
        style={{
            width: props.width + 'px',
            height: props.height + 'px',
            maskImage: 'linear-gradient(to bottom, white, white 100%)'
        }}
        ref={ref}>
        <img src={props.avatar} alt="" className='rounded-[6px] fixed block bg-white' style={{
          left: '16px',
          top: 16 + 6 + 'px',
          width: 64,
          height: 64
        }} />

        <div className='text-[17px] fixed block text-[#3c3c4399]' style={{
          left: 16 + 64 + 20 + 'px',
          top: 16 + 'px'
        }} >{props.nickname}</div>

        <img src={props.contentEmoji} alt="" className='fixed block' style={{
            left: props.emojiRect.left,
            top: props.emojiRect.top,
            width: props.emojiRect.width,
            height: props.emojiRect.height,
            display: (props.emojiRect.width > 0 && props.showContent) ? 'block' : 'none'
        }} />
    </div>
  );
});

export default Canvas;
