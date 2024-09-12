import { useState } from 'react';

const Panel = (props) => {

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

    return (
        <div className="bg-white w-[300px] h-[400px] border-[1px] border-slate-200 rounded-lg p-4 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <label>头像：</label>
                <img src={props.avatar} alt="" className="w-[64px] h-[64px] rounded-lg border-[1px] border-slate-200 cursor-pointer" onClick={chooseImage} />
            </div>
            
            <div className="flex flex-col gap-2">
                <label>昵称：</label>
                <input type="text" className="w-full h-[30px] border-[1px] border-slate-200 rounded-lg p-2" value={props.nickname} onChange={onNicknameChange} />
            </div>

            <button className="w-full h-[30px] bg-blue-500 text-white rounded-lg" onClick={props.exportImage}>生成</button>
        </div>
    )
}

export default Panel;