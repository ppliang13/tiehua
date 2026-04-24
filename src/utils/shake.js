import gsap from 'gsap';

export function setupShake(camera) {
    // 动态获取当前位置作为基准，防止相机移动后抖动回原点
    return {
        trigger(intensity = 0.1, duration = 0.5) {
            const originalPos = camera.position.clone();
            const tl = gsap.timeline();
            
            for (let i = 0; i < 10; i++) {
                tl.to(camera.position, {
                    x: originalPos.x + (Math.random() - 0.5) * intensity,
                    y: originalPos.y + (Math.random() - 0.5) * intensity,
                    z: originalPos.z + (Math.random() - 0.5) * intensity,
                    duration: duration / 10,
                    ease: "none"
                });
            }
            
            tl.to(camera.position, {
                x: originalPos.x,
                y: originalPos.y,
                z: originalPos.z,
                duration: 0.1,
                ease: "power2.out"
            });
        }
    };
}
