document.addEventListener("DOMContentLoaded", () => {
    const html = document.documentElement;
    const canvas = document.getElementById("scroll-animation-bg");
    
    if (!canvas) return;
    
    const context = canvas.getContext("2d");
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';

    const frameCount = 300;
    const images = [];

    // Function to get the path of a given frame
    const currentFrame = index => (
        `./images/scroll-animation-assets/ezgif-frame-${index.toString().padStart(3, '0')}.jpg`
    );

    // Preload all images
    for (let i = 1; i <= frameCount; i++) {
        const img = new Image();
        img.src = currentFrame(i);
        images.push(img);
    }

    // Set first frame
    images[0].onload = () => {
        canvas.width = images[0].width || 1920;
        canvas.height = images[0].height || 1080;
        context.drawImage(images[0], 0, 0);
    };

    let currentFrameIndex = 0;

    window.addEventListener('scroll', () => {  
        const scrollTop = html.scrollTop;
        const maxScrollTop = html.scrollHeight - window.innerHeight;
        
        if (maxScrollTop <= 0) return;

        const scrollFraction = scrollTop / maxScrollTop;
        
        // Determine frame index
        const frameIndex = Math.min(
            frameCount - 1,
            Math.floor(scrollFraction * frameCount)
        );

        requestAnimationFrame(() => {
            if (frameIndex !== currentFrameIndex) {
                currentFrameIndex = frameIndex;
                if (images[frameIndex] && images[frameIndex].complete) {
                    context.drawImage(images[frameIndex], 0, 0);
                }
            }
        });
    });
});
