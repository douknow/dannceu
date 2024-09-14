"use client";

import { useState, useRef, useEffect } from "react";
import Canvas from "./components/Canvas";
import Panel from "./components/Panel";
import html2canvas from "html2canvas-pro";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { createFFmpeg, FS } from "../../node_modules/@ffmpeg/ffmpeg/src";
import { fitInRect } from "./util";

export default function Home() {
  const minCanvasSize = {
    width: 50,
    height: 50,
  };
  const maxCanvasSize = {
    width: 600,
    height: 400,
  };
  const defaultCanvasDance = {
    width: 300,
    height: 260,
  };

  const defaultLongtus = ["/images/longtu1.png"];

  const [avatar, setAvatar] = useState("/images/demo_avatar.png");
  const [nickname, setNickname] = useState("陈八");
  const [loaded, setLoaded] = useState(false);
  const [emoji, setEmoji] = useState(null);
  const [emojiRect, setEmojiRect] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  });
  const [canvasSize, setCanvasSize] = useState({
    width: 300,
    height: 260,
  });
  const [background, setBackground] = useState("white");
  const [loadingText, setLoadingText] = useState("加载中...");
  const [exporting, setExporting] = useState(false);

  const [selectedMenu, setSelectedMenu] = useState("longtu");
  const [longtuTextHeight, setLongtuTextHeight] = useState(38);
  const [longtuRect, setLongtuRect] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  });
  /// An Image Type
  const [selectedLongtu, setSelectedLongtu] = useState(null);
  const [longtuText, setLongtuText] = useState("既见朕，为何不跪！");
  const [longtuTextSize, setLongtuTextSize] = useState(20);

  const canvasRef = useRef(null);
  const ffmpegRef = useRef(createFFmpeg({ log: true }));

  useEffect(() => {
    console.log("selectedMenu changed: ", selectedMenu);
    switch (selectedMenu) {
      case "dance":
        setCanvasSize(defaultCanvasDance);
        loadEmoji("/images/dance.gif");
        break;
      case "longtu":
        loadLongtu(defaultLongtus[0]);
        break;
    }
  }, [selectedMenu]);

  useEffect(() => {
    if (selectedMenu !== "longtu" || !selectedLongtu) {
      return;
    }

    let idealLongtuWidth = 200;
    let idealLongtuContentSize = {
      width: idealLongtuWidth,
      height: idealLongtuWidth * (selectedLongtu.height / selectedLongtu.width),
    };
    setLongtuRect({
      left: 0,
      top: 0,
      width: idealLongtuWidth,
      height: idealLongtuContentSize.height,
    });
    let canvasH = Math.min(
      idealLongtuContentSize.height + longtuTextHeight,
      maxCanvasSize.height
    );
    setCanvasSize({
      width: idealLongtuContentSize.width,
      height: canvasH,
    });
    console.log(
      "idealLongtuContentSize.height: ",
      idealLongtuContentSize.height,
      longtuTextHeight,
      canvasH
    );
  }, [selectedLongtu, longtuTextHeight]);

  const loadEmoji = async (src) => {
    let image = new Image();
    image.src = src;
    image.onload = () => {
      let emojiContainerRect = {
        left: 16 + 64 + 20,
        top: 46,
        width: 195,
        height: 195,
      };
      let fitedEmojiRect = fitInRect(emojiContainerRect, {
        left: 0,
        top: 0,
        width: image.width,
        height: image.height,
      });
      setEmojiRect({
        left: 16 + 64 + 20,
        top: 46,
        width: fitedEmojiRect.width,
        height: fitedEmojiRect.height,
      });
      setEmoji(image.src);
    };
  };

  const loadLongtu = async (src) => {
    let image = new Image();
    image.src = src;
    image.onload = () => {
      setSelectedLongtu(image);
    };
  };

  const load = async () => {
    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm";
    const ffmpeg = ffmpegRef.current;
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        "application/wasm"
      ),
    });
    setLoaded(true);
  };

  const handleAvatarChange = (avatar) => {
    setAvatar(avatar);
  };

  const handleNicknameChange = (nickname) => {
    setNickname(nickname);
  };

  const handleContentEmojiChange = (emoji) => {
    loadEmoji(emoji);
  };

  const handleWidthChange = (width) => {
    setCanvasSize({ ...canvasSize, width: width });
  };

  const handleHeightChange = (height) => {
    setCanvasSize({ ...canvasSize, height: height });
  };

  const handleBackgroundChange = (background) => {
    setBackground(background);
  };

  const handleLongtuTextChange = (longtuText) => {
    setLongtuText(longtuText);
  };

  const handleLongtuTextHeightChange = (longtuTextHeight) => {
    setLongtuTextHeight(longtuTextHeight / 1);
  };

  const handleLongtuTextSizeChange = (longtuTextSize) => {
    setLongtuTextSize(longtuTextSize);
  };

  const exportImage = async () => {
    setExporting(true);
    if (!loaded && selectedMenu === "dance") {
      setLoadingText("Loading ffmpeg...");
      await load();
    }

    setLoadingText("导出中...");
    console.log(canvasRef.current);
    // 获取Canvas元素
    const canvasElement = canvasRef.current;
    // 使用html2canvas库将DOM元素转换为canvas
    // scale = 1
    html2canvas(canvasElement, {
      scale: 1,
      backgroundColor: "transparent",
    }).then(async (canvas) => {
      // 将canvas转换为图片数据URL
      const imageDataUrl = canvas.toDataURL("image/png");
      let outputDataUrl;

      if (selectedMenu === "longtu") {
        outputDataUrl = imageDataUrl;
      } else {
        let ffmpeg = ffmpegRef.current;
        await ffmpeg.FS(
          "writeFile",
          "input.png",
          await fetchFile(imageDataUrl)
        );
        await ffmpeg.FS("writeFile", "emoji.gif", await fetchFile(emoji));
        await ffmpeg.run(
          "-i",
          "input.png",
          "-i",
          "emoji.gif",
          "-filter_complex",
          [
            `[1:v]scale=${emojiRect.width}:-1[gif];`,
            `[0:v][gif]overlay=${emojiRect.left}:${emojiRect.top}:format=auto,split[v1][v2];`,
            "[v1]palettegen=reserve_transparent=on:transparency_color=ffffff[p];",
            "[v2][p]paletteuse=new=1:dither=none:alpha_threshold=128",
          ].join(""),
          "-loop",
          "0",
          "result.gif"
        );
        const data = await ffmpeg.FS("readFile", "result.gif");
        outputDataUrl = URL.createObjectURL(
          new Blob([data.buffer], { type: "image/png" })
        );
      }

      // 创建一个临时的a标签用于下载
      const link = document.createElement("a");
      link.href = outputDataUrl;
      link.download = "导出图片.gif";

      // 触发下载
      link.click();
      setExporting(false);
    });
  };

  return (
    <div className="bg-slate-100">
      <div
        className="absolute top-0 left-0 w-full h-full z-10 bg-black/70 flex justify-center items-center"
        style={{ display: exporting ? "flex" : "none" }}
      >
        <div className="rounded-lg border-[1px] border-slate-200 p-4 w-[300px] h-[200px] flex flex-col gap-4 justify-center items-center bg-white">
          <div role="status">
            <svg
              aria-hidden="true"
              className="inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          </div>
          <div className="">{loadingText}</div>
        </div>
      </div>

      <div className="rounded-lg border-slate-200 bg-white border-[1px] p-4 w-[300px] h-[64px] flex flex-row gap-4 justify-center items-center fixed top-1 left-[50%] translate-x-[-50%]">
        <div
          className={
            "w-[44px] h-[44px] cursor-pointer border-[1px] border-slate-200 rounded-md text-xs text-center leading-4 flex justify-center items-center " +
            (selectedMenu === "dance"
              ? "bg-blue-500 text-white"
              : "bg-white text-black")
          }
          onClick={() => setSelectedMenu("dance")}
        >
          <div>跳舞</div>
        </div>
        <div
          className={
            "w-[44px] h-[44px] cursor-pointer border-[1px] border-slate-200 rounded-md text-xs text-center leading-4 flex justify-center items-center " +
            (selectedMenu === "longtu"
              ? "bg-blue-500 text-white"
              : "bg-white text-black")
          }
          onClick={() => setSelectedMenu("longtu")}
        >
          <div>龙图</div>
        </div>

        <div className="flex-1"></div>
      </div>

      <main className="flex gap-8 row-start-2 items-center sm:items-start w-full h-[100vh] overflow-hidden">
        <div className="w-full h-full">
          <div className="relative w-[600px] h-[400px] top-[50%] translate-y-[-50%] left-[50%] translate-x-[-60%]">
            <Canvas
              ref={canvasRef}
              showContent={false}
              avatar={avatar}
              nickname={nickname}
              emojiRect={emojiRect}
              width={canvasSize.width}
              height={canvasSize.height}
              background={background}
              selectedMenu={selectedMenu}
              longtu={selectedLongtu}
              longtuRect={longtuRect}
              longtuText={longtuText}
              longtuTextHeight={longtuTextHeight}
              longtuTextSize={longtuTextSize}
            />
            <Canvas
              showContent={true}
              avatar={avatar}
              nickname={nickname}
              contentEmoji={emoji}
              emojiRect={emojiRect}
              width={canvasSize.width}
              height={canvasSize.height}
              background={background}
              selectedMenu={selectedMenu}
              longtu={selectedLongtu}
              longtuRect={longtuRect}
              longtuText={longtuText}
              longtuTextHeight={longtuTextHeight}
              longtuTextSize={longtuTextSize}
            />
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
            background={background}
            onBackgroundChange={handleBackgroundChange}
            selectedMenu={selectedMenu}
            onLongtuTextChange={handleLongtuTextChange}
            onLongtuTextHeightChange={handleLongtuTextHeightChange}
            onLongtuTextSizeChange={handleLongtuTextSizeChange}
            longtuText={longtuText}
            longtuTextHeight={longtuTextHeight}
            longtuTextSize={longtuTextSize}
          />
        </div>
      </main>
    </div>
  );
}
