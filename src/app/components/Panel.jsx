import { useState, useEffect } from 'react';
import { fitInRect } from '../util';

const Panel = (props) => {

    const emojiContainerRect = { left: 0, top: 0, width: 120, height: 120 }
    const innerEmojiContentRect = { left: 10, top:10, width: 100, height: 100 }
    
    const [emojiRect, setEmojiRect] = useState({
        left: 0,
        top: 0,
        width: 0,
        height: 0
    })

    useEffect((v) => {
        console.log(' innerEmojiContentRect: ', innerEmojiContentRect)
        let emojiRect = fitInRect(innerEmojiContentRect, props.contentEmojiRect)
        setEmojiRect(emojiRect)
    }, [props.contentEmojiRect])

    const chooseImage = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                props.onAvatarChange(reader.result);
            }
        }
        input.click();
    }

    const onNicknameChange = (e) => {
        props.onNicknameChange(e.target.value);
    }

    const chooseContentEmoji = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                props.onContentEmojiChange(reader.result);
            }
        }
        input.click();
    }

    const onWidthChange = (e) => {
        props.onWidthChange(e.target.value);
    }

    const onHeightChange = (e) => {
        props.onHeightChange(e.target.value);
    }

    return (
        <div className="bg-white w-[300px] border-[1px] border-slate-200 rounded-lg p-4 flex flex-col gap-4 fixed right-20 top-[50%] translate-y-[-50%] max-h-[80%] overflow-y-auto shadow-lg">
            <div className="flex flex-col gap-2">
                <label className="font-bold">头像：</label>
                <img src={props.avatar} alt="" className="w-[64px] h-[64px] rounded-lg border-[1px] border-slate-200 cursor-pointer" onClick={chooseImage} />
            </div>

            <div className="flex flex-col gap-2">
                <label className="font-bold">昵称：</label>
                <input type="text" className="w-full h-[30px] border-[1px] border-slate-200 rounded-lg p-2" value={props.nickname} onChange={onNicknameChange} />
            </div>

            <div className="flex flex-col gap-2">
                <label className="font-bold">动图：</label>
                <div className="relative rounded-lg border-[1px] border-slate-200 cursor-pointer"
                    style={{
                        width: emojiContainerRect.width + 'px',
                        height: emojiContainerRect.height + 'px',
                    }}
                    onClick={chooseContentEmoji}>
                    <img src={props.contentEmoji} alt="" className="w-full h-full rounded-lg absolute"
                        style={{
                            width: emojiRect.width + 'px',
                            height: emojiRect.height + 'px',
                            left: emojiRect.left + 'px',
                            top: emojiRect.top + 'px'
                        }}
                    />
                </div>
            </div>

            <div className="w-full h-[1px] bg-slate-200"></div>

            <div className="flex flex-col gap-2">
                <label className="font-bold">宽度：</label>
                <input type="range" min={props.minCanvasSize.width} max={props.maxCanvasSize.width} value={props.canvasSize.width} onChange={onWidthChange}/>
            </div>

            <div className="flex flex-col gap-2">
                <label className="font-bold">高度：</label>
                <input type="range" min={props.minCanvasSize.height} max={props.maxCanvasSize.height} value={props.canvasSize.height} onChange={onHeightChange}/>
            </div>

            <div className="w-full h-[1px] bg-slate-200"></div>

            <button className="w-full h-[30px] bg-blue-500 text-white rounded-lg" onClick={props.exportImage}>生成</button>
        </div>
    )
}

export default Panel;