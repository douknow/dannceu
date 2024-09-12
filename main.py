# 安装 OpenCV (cv2) 的步骤：
# 1. 打开命令行或终端
# 2. 运行以下命令：
#    pip install opencv-python
# 3. 安装完成后，你就可以导入 cv2 了

# 使用 requirements.txt 文件的步骤：

# 1. 创建 requirements.txt 文件
# 在项目根目录下创建一个名为 requirements.txt 的文本文件。

# 2. 添加依赖项
# 在 requirements.txt 文件中列出项目所需的所有 Python 包及其版本。
# 例如：
#   opencv-python==4.5.3.56
#   numpy==1.21.2

# 3. 安装依赖项
# 打开命令行或终端，切换到项目目录，然后运行以下命令：
#   pip install -r requirements.txt

# 4. 更新 requirements.txt
# 如果添加了新的依赖项，可以使用以下命令更新 requirements.txt：
#   pip freeze > requirements.txt

# 注意：使用虚拟环境可以更好地管理项目依赖，避免与系统级包冲突。

# 指定 Python 版本
# 在 requirements.txt 文件中，您可以添加以下行来指定 Python 版本：
# python_version >= "3.7"

import cv2
import numpy as np
import subprocess
import tempfile
import os

def detect_avatar_and_nickname(image_path):
    # Read the image
    image = cv2.imread(image_path)
    
    # Convert to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # 使用Haar级联分类器检测人脸
    # 注意：您需要先下载haarcascade_frontalface_default.xml文件
    # 下载步骤：
    # 1. 访问OpenCV的GitHub仓库：https://github.com/opencv/opencv/tree/master/data/haarcascades
    # 2. 找到并下载'haarcascade_frontalface_default.xml'文件
    # 3. 将下载的文件放在您的项目目录中
    # 4. 更新下面的路径以指向您保存的xml文件位置
    face_cascade = cv2.CascadeClassifier('./haarcascade_frontalface_default.xml')
    # 这段代码原本是用于检测人脸的，但实际上我们需要检测的是头像图片
    # 对于矩形的头像图片，我们需要使用不同的方法来检测
    
    # 以下是一个简单的示例，用于检测图像中的矩形区域（可能是头像）
    # 注意：这只是一个基本方法，可能需要根据实际情况进行调整
    
    # 转换为灰度图像
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # 应用边缘检测
    edges = cv2.Canny(gray, 50, 150)
    
    # 查找轮廓
    contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    # 筛选可能的头像轮廓
    potential_avatars = []
    for contour in contours:
        x, y, w, h = cv2.boundingRect(contour)
        aspect_ratio = w / float(h)
        if 0.8 <= aspect_ratio <= 1.2 and w * h > 1000:  # 假设头像近似正方形且面积较大
            potential_avatars.append((x, y, w, h))
    
    # 如果找到可能的头像，使用第一个
    faces = potential_avatars[:1] if potential_avatars else []
    
    # Assume the avatar is the first detected face
    if len(faces) > 0:
        avatar_position = faces[0]
    else:
        avatar_position = None
    
    # Assume the nickname is below the avatar
    if avatar_position is not None:
        avatar_position = (
            avatar_position[0] + avatar_position[2],  # 头像右边界
            avatar_position[1] + avatar_position[3] // 2,  # y为头像大小h的一半
            image.shape[1] - (avatar_position[0] + avatar_position[2]),  # 宽度
            image.shape[0] - (avatar_position[1] + avatar_position[3] // 2)   # 高度
        )
        nickname_position = (avatar_position[0], avatar_position[1] + avatar_position[3], avatar_position[2], 30)  # Assume nickname height is 30 pixels
    else:
        nickname_position = None
    
    return avatar_position, nickname_position

def expand_image(image_path, avatar_position, nickname_position, expansion_ratio=15.5):
    # Read the original image
    original = cv2.imread(image_path)

    # 检查是否成功检测到头像和昵称位置
    if avatar_position is None or nickname_position is None:
        print("未能检测到头像或昵称位置")
        return original, avatar_position, nickname_position

    # 创建一个与原图相同大小的掩码
    mask = np.ones(original.shape[:2], dtype=np.uint8) * 255

    # 在掩码上将头像和昵称区域设为黑色（0）
    x, y, w, h = avatar_position
    mask[y:y+h, x:x+w] = 0

    x, y, w, h = nickname_position
    mask[y:y+h, x:x+w] = 0
    # 提取背景色
    background_color = np.median(original[mask == 255], axis=0).astype(np.uint8)
    
    # 创建一个与原图相同大小的背景色图像
    result = np.full(original.shape, background_color, dtype=np.uint8)
    
    # 将原图中非掩码区域复制到结果图像中
    result[mask == 255] = original[mask == 255]
    
    print("已移除头像和昵称")
    
    # 计算新的尺寸
    new_height = avatar_position[3] * 3  # 头像高度的5倍
    new_width = avatar_position[3] * 3  # 头像高度的4倍
    
    # Create a new blank image
    new_image = np.zeros((new_height, new_width, 3), dtype=np.uint8)
    
    # 将原图放置在新图片的左上角
    x_offset = 0
    y_offset = 0
    
    # 创建一个与新图片大小相同的背景色图像
    # 这里的3表示图像的三个颜色通道（红、绿、蓝）
    new_image = np.full((new_height, new_width, 3), background_color, dtype=np.uint8)
    # 将处理后的图像复制到新图像中
    # 确保不超出新图像的边界
    height_to_copy = min(result.shape[0], new_height - y_offset)
    width_to_copy = min(result.shape[1], new_width - x_offset)
    new_image[y_offset:y_offset+height_to_copy, x_offset:x_offset+width_to_copy] = result[:height_to_copy, :width_to_copy]

    # Save the result
    result_image = "expanded_image.jpg"
    cv2.imwrite(result_image, new_image)

    # 创建临时目录
    with tempfile.TemporaryDirectory() as temp_dir:
        new_gif_width = 120  # 3倍头像宽度

        # 
        x_offset = avatar_position[0] + 8
        y_offset = avatar_position[1] + 8

        # 删除旧的result.gif文件（如果存在）
        if os.path.exists("result.gif"):
            os.remove("result.gif")
            print("已删除旧的result.gif文件")

        # 添加输入流标签
        ffmpeg_cmd = [
            "ffmpeg",
            "-i", result_image,
            "-i", "dance.gif",
            "-filter_complex",
            f"[1:v]scale={new_gif_width}:-1[gif];"
            f"[0:v][gif]overlay={x_offset}:{y_offset}:format=auto,split[v1][v2];"
            "[v1]palettegen=reserve_transparent=on:transparency_color=ffffff[p];"
            "[v2][p]paletteuse=new=1:dither=none:alpha_threshold=128",
            "-loop", "0",
            "result.gif"
        ]
        subprocess.run(ffmpeg_cmd, check=True)

        print("已使用ffmpeg将dance.gif按原比例合成到new_image中心位置，结果保存为result.gif")
        return

    print("已使用ffmpeg将dance.gif合成到mask位置，结果保存为result.gif")

# Usage example
image_path = "demo.png"
avatar_position, nickname_position = detect_avatar_and_nickname(image_path)
expand_image(image_path, avatar_position, nickname_position)

print(f"Original avatar position: {avatar_position}")
print(f"Original nickname position: {nickname_position}")
print(f"New nickname position: {new_nickname_position}")

