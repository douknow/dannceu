"use client";

import { useState, useRef } from "react";
import Canvas from "./components/Canvas";
import Panel from "./components/Panel";
import html2canvas from 'html2canvas-pro';

export default function Home() {

  const [avatar, setAvatar] = useState('/images/demo_avatar.png');
  const [nickname, setNickname] = useState('陈八');
  
  const canvasRef = useRef(null);

  const handleAvatarChange = (avatar) => {
    setAvatar(avatar);
  }

  const handleNicknameChange = (nickname) => {
    setNickname(nickname);
  }

  const exportImage = () => {
    console.log(canvasRef.current);
    // 获取Canvas元素
    const canvasElement = canvasRef.current;
    // 使用html2canvas库将DOM元素转换为canvas
    html2canvas(canvasElement).then(canvas => {
      // 将canvas转换为图片数据URL
      const imageDataUrl = canvas.toDataURL('image/png');
      
      // 创建一个临时的a标签用于下载
      const link = document.createElement('a');
      link.href = imageDataUrl;
      link.download = '导出图片.png';
      
      // 触发下载
      link.click();
    });
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-slate-100">
      <main className="flex gap-8 row-start-2 items-center sm:items-start">
        <div className="relative w-[600px] h-[400px]">
          <Canvas ref={canvasRef} showContent={false} avatar={avatar} nickname={nickname} />
          <Canvas showContent={true} avatar={avatar} nickname={nickname} />
        </div>

        <Panel avatar={avatar} nickname={nickname} onAvatarChange={handleAvatarChange} onNicknameChange={handleNicknameChange} exportImage={exportImage}/>
      </main>
    </div>
  );
}
