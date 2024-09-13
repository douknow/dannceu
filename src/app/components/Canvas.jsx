import React, { useState, useEffect } from 'react';

const Canvas = React.forwardRef((props, ref) => {
  return (
    <div className="bg-white m-auto absolute top-0 left-0"
        style={{
            width: props.width + 'px',
            height: props.height + 'px'
        }}
        ref={ref}>
        <img src={props.avatar} alt="" className='w-[64px] h-[64px] rounded-[6px] absolute block bg-white' style={{
          left: '16px',
          top: 16 + 6 + 'px'
        }} />

        <div className='text-[17px] absolute block text-[#3c3c4399]' style={{
          left: 16 + 64 + 20 + 'px',
          top: 16 + 'px'
        }} >{props.nickname}</div>

        <img src={props.contentEmoji} alt="" className='w-[600px] h-[400px] absolute block' style={{
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
