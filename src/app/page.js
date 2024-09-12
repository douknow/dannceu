"use client";

import { useState } from "react";
import Canvas from "./components/Canvas";
import Panel from "./components/Panel";

export default function Home() {

  const [avatar, setAvatar] = useState('/images/demo_avatar.png');
  const [nickname, setNickname] = useState('陈八');

  const handleAvatarChange = (avatar) => {
    setAvatar(avatar);
  }

  const handleNicknameChange = (nickname) => {
    setNickname(nickname);
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-slate-100">
      <main className="flex gap-8 row-start-2 items-center sm:items-start">
        <Canvas avatar={avatar} nickname={nickname} />
        <Panel avatar={avatar} nickname={nickname} onAvatarChange={handleAvatarChange} onNicknameChange={handleNicknameChange} />
      </main>
    </div>
  );
}
