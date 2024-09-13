"use client";

import { useState, useRef, useEffect } from "react";
import Canvas from "./components/Canvas";
import Panel from "./components/Panel";
import html2canvas from 'html2canvas-pro';
import { fetchFile, toBlobURL } from '@ffmpeg/util'
import { createFFmpeg, FS } from '../../node_modules/@ffmpeg/ffmpeg/src'

export default function Home() {
  
  const [avatar, setAvatar] = useState('/images/demo_avatar.png');
  const [nickname, setNickname] = useState('陈八');
  const [loaded, setLoaded] = useState(false);
  const [emoji, setEmoji] = useState(null);
  const [emojiRect, setEmojiRect] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0
  });
  
  const canvasRef = useRef(null);

  const ffmpegRef = useRef(createFFmpeg({ log: true }))

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
        setEmoji(image.src);
    };
  }, []); 

  const load = async () => {
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm'
    const ffmpeg = ffmpegRef.current
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm')
    })
    setLoaded(true)
  }

  const handleAvatarChange = (avatar) => {
    setAvatar(avatar);
  }

  const handleNicknameChange = (nickname) => {
    setNickname(nickname);
  }

  const emojiLoaded = (emoji) => {
    setEmoji(emoji);
  }

  const exportImage = async () => {
    if (!loaded) {
      await load();
      console.log('ffmpeg loaded complete');
    }

    console.log(canvasRef.current);
    // 获取Canvas元素
    const canvasElement = canvasRef.current;
    // 使用html2canvas库将DOM元素转换为canvas
    // scale = 1
    html2canvas(canvasElement, {scale: 1}).then(async (canvas) => {
      // 将canvas转换为图片数据URL
      const imageDataUrl = canvas.toDataURL('image/png');

      console.log(emojiRect);
      let ffmpeg = ffmpegRef.current
      await ffmpeg.FS('writeFile', 'input.png', await fetchFile(imageDataUrl));
      await ffmpeg.FS('writeFile', 'emoji.gif', await fetchFile(emoji));
      await ffmpeg.run(
        '-i', 'input.png',
        '-i', 'emoji.gif', 
        "-filter_complex",
        [
          `[1:v]scale=${emojiRect.width}:-1[gif];`,
          `[0:v][gif]overlay=${emojiRect.left}:${emojiRect.top}:format=auto,split[v1][v2];`,
          "[v1]palettegen=reserve_transparent=on:transparency_color=ffffff[p];",
          "[v2][p]paletteuse=new=1:dither=none:alpha_threshold=128",
        ].join(''),
        "-loop", "0",
        "result.gif"
      );
      const data = await ffmpeg.FS('readFile', 'result.gif');
      const outputDataUrl = URL.createObjectURL(new Blob([data.buffer], {type: 'image/png'}));

      // 创建一个临时的a标签用于下载
      const link = document.createElement('a');
      link.href = outputDataUrl;
      link.download = '导出图片.gif';
      
      // 触发下载
      link.click();
    });
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-slate-100">
      <main className="flex gap-8 row-start-2 items-center sm:items-start">
        <div className="relative w-[600px] h-[400px]">
          <Canvas ref={canvasRef} showContent={false} avatar={avatar} nickname={nickname} emojiRect={emojiRect} />
          <Canvas showContent={true} avatar={avatar} nickname={nickname} emojiLoaded={emojiLoaded} contentEmoji={emoji} emojiRect={emojiRect} />
        </div>

        <Panel avatar={avatar} nickname={nickname} onAvatarChange={handleAvatarChange} onNicknameChange={handleNicknameChange} exportImage={exportImage} contentEmoji={emoji} contentEmojiRect={emojiRect}/>
      </main>
    </div>
  );
}
