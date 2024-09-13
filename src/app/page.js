"use client";

import { useState, useRef, useEffect } from "react";
import Canvas from "./components/Canvas";
import Panel from "./components/Panel";
import html2canvas from 'html2canvas-pro';
import { fetchFile, toBlobURL } from '@ffmpeg/util'
import { createFFmpeg, FS } from '../../node_modules/@ffmpeg/ffmpeg/src'
import { fitInRect } from "./util";

export default function Home() {
  
  const minCanvasSize = {
    width: 50,
    height: 50
  }
  const maxCanvasSize = {
    width: 600,
    height: 400
  }

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
  const [canvasSize, setCanvasSize] = useState({
    width: 300,
    height: 260
  });
  
  const canvasRef = useRef(null);

  const ffmpegRef = useRef(createFFmpeg({ log: true }))

  useEffect(() => {
    loadEmoji('/images/dance.gif')
  }, []); 

  const loadEmoji = async (src) => {
    let image = new Image();
    image.src = src
    image.onload = () => {
        let emojiContainerRect = { left: 16 + 64 + 20, top: 46, width: 195, height: 195 }
        let fitedEmojiRect = fitInRect(emojiContainerRect, { left: 0, top: 0, width: image.width, height: image.height })
        setEmojiRect({
            left: 16 + 64 + 20,
            top: 46,
            width: fitedEmojiRect.width,
            height: fitedEmojiRect.height
        });
        setEmoji(image.src);
    };
  }

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

  const handleContentEmojiChange = (emoji) => {
    loadEmoji(emoji);
  }

  const handleWidthChange = (width) => {
    setCanvasSize({ ...canvasSize, width: width });
  }

  const handleHeightChange = (height) => {
    setCanvasSize({ ...canvasSize, height: height });
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
    <div className="bg-slate-100">
      <main className="flex gap-8 row-start-2 items-center sm:items-start w-full h-[100vh] overflow-hidden">
        <div className="relative w-[600px] h-[400px] top-[50%] translate-y-[-50%] left-[50%] translate-x-[-60%]">
          <Canvas ref={canvasRef} showContent={false} avatar={avatar} nickname={nickname} emojiRect={emojiRect} width={canvasSize.width} height={canvasSize.height} />
          <Canvas showContent={true} avatar={avatar} nickname={nickname} contentEmoji={emoji} emojiRect={emojiRect} width={canvasSize.width} height={canvasSize.height} />
        </div>

        <Panel 
          avatar={avatar} 
          nickname={nickname} 
          onAvatarChange={handleAvatarChange} 
          onNicknameChange={handleNicknameChange} 
          exportImage={exportImage} 
          contentEmoji={emoji} 
          contentEmojiRect={emojiRect} 
          onContentEmojiChange={handleContentEmojiChange}
          canvasSize={canvasSize}
          minCanvasSize={minCanvasSize}
          maxCanvasSize={maxCanvasSize}
          onWidthChange={handleWidthChange}
          onHeightChange={handleHeightChange}
        />
      </main>
    </div>
  );
}
