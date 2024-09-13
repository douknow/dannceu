import { useState, useEffect } from 'react';

const Panel = (props) => {

    const emojiContainerRect = { left: 0, top: 0, width: 120, height: 120 }
    const innerEmojiContentRect = { left: 16, top: 16, width: 100, height: 100 }
    
    const [emojiRect, setEmojiRect] = useState({
        left: 0,
        top: 0,
        width: 0,
        height: 0
    })

    useEffect((v) => {
        console.log('--- ', v)
        
        // calc new rect fit in container, and keep emoji rect aspect ratio
        if (Math.min(props.contentEmojiRect.width, props.contentEmojiRect.height) <= 0) 
            return

        let emojiContentRect = props.contentEmojiRect
        let emojiFitRect = innerEmojiContentRect
        if (emojiContentRect.height > emojiContentRect.width) {
            emojiFitRect.width = emojiContentRect.width / emojiContentRect.height * emojiFitRect.height
        } else {
            emojiFitRect.height = emojiContentRect.height / emojiContentRect.width * emojiFitRect.width
        }

        emojiFitRect.left = emojiContainerRect.left + (emojiContainerRect.width - emojiFitRect.width) / 2
        emojiFitRect.top = emojiContainerRect.top + (emojiContainerRect.height - emojiFitRect.height) / 2

        console.log(emojiFitRect)
        setEmojiRect(emojiFitRect)
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

    return (
        <div className="bg-white w-[300px] border-[1px] border-slate-200 rounded-lg p-4 flex flex-col gap-4">
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

            <button className="w-full h-[30px] bg-blue-500 text-white rounded-lg" onClick={props.exportImage}>生成</button>
        </div>
    )
}

export default Panel;