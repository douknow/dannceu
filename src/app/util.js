
export function fitInRect(container, content) {
    if (Math.min(content.width, content.height) <= 0) 
        return container
    
    let fitRect = Object.assign({}, container)
    if (content.height > content.width) {
        fitRect.width = content.width / content.height * container.height
    } else {
        fitRect.height = content.height / content.width * container.width
    }

    fitRect.left = container.left + (container.width - fitRect.width) / 2
    fitRect.top = container.top + (container.height - fitRect.height) / 2

    return fitRect
}