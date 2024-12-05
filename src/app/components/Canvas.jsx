import React, { useState, useEffect } from "react";

const Canvas = React.forwardRef((props, ref) => {
  return (
    <div
      className="m-auto absolute top-0 left-0 overflow-hidden border-radius-[6px] border-[1px] border-slate-200"
      style={{
        width: props.width + "px",
        height: props.height + "px",
      }}
    >
      <div
        className="absolute top-0 left-0 w-full h-full"
        ref={ref}
        style={{
          width: props.width + "px",
          height: props.height + "px",
          maskImage: "linear-gradient(to bottom, white, white 100%)",
          backgroundColor:
            (props.background == 'transparent' && props.selectedMenu === "dance") ? "transparent" : "white",
        }}
      >
        {(() => {
          switch (props.selectedMenu) {
            case "dance":
              return (
                <div className="w-full h-full relative">
                  <img
                    src={props.avatar.src}
                    alt=""
                    className="rounded-[6px] fixed block bg-white"
                    style={{
                      left: "16px",
                      top: 16 + 6 + "px",
                      width: 64,
                      height: 64,
                    }}
                  />

                  <div
                    className="text-[17px] fixed block text-[#3c3c4399]"
                    style={{
                      left: 16 + 64 + 20 + "px",
                      top: 16 + "px",
                      fontWeight: props.background === "transparent" ? 500 : 300,
                    }}
                  >
                    {props.nickname}
                  </div>

                  <img
                    src={props.contentEmoji}
                    alt=""
                    className="fixed block"
                    style={{
                      left: props.emojiRect.left,
                      top: props.emojiRect.top,
                      width: props.emojiRect.width,
                      height: props.emojiRect.height,
                      display:
                        props.emojiRect.width > 0 && props.showContent
                          ? "block"
                          : "none",
                    }}
                  />
                </div>
              );
            case "longtu":
              return (
                <div className="w-full h-full relative bg-[#FFFBFF]">
                  <img
                    src={props.longtu?.src}
                    alt=""
                    className="absolute block"
                    style={{
                      left: props.longtuRect.left,
                      top: props.longtuRect.top,
                      width: props.longtuRect.width,
                      height: props.longtuRect.height,
                    }}
                  />
                  <div
                    className="absolute bottom-0 left-0 w-full flex items-center justify-center overflow-hidden"
                    style={{
                      height: props.longtuTextHeight + "px",
                    }}
                  >
                    <div
                      className="text-center text-black font-bold whitespace-pre-wrap"
                      style={{
                        fontSize: props.longtuTextSize + "px",
                      }}
                    >
                      {props.longtuText}
                    </div>
                  </div>
                </div>
              );
            case "chistmashat":
              return (
                <div className="w-full h-full relative bg-[#FFFBFF]">
                  <img
                    src={props.avatar.src}
                    alt=""
                    className="rounded-[6px] absolute block bg-white"
                    style={{
                      left: 0,
                      top: 0,
                      width: '100%',
                      height: '100%',
                    }}
                  />

                  <img
                    src={props.selectedChistmashat.src}
                    alt=""
                    className="absolute block"
                    style={{
                      left: props.selectedChistmashatRect.x + 'px',
                      top: props.selectedChistmashatRect.y + 'px',
                      width: props.selectedChistmashatRect.width + 'px',
                      height: props.selectedChistmashat.height / props.selectedChistmashat.width * props.selectedChistmashatRect.width + "px",
                      transform: `rotate(${props.selectedChistmashatRect.rotate}deg)`,
                    }}
                  />
                </div>
              );
            default:
              return null;
          }
        })()}
      </div>
    </div>
  );
});

export default Canvas;
