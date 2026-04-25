import * as THREE from 'three';

export function createSmoke(scene) {
    const maxCount = 200;
    const geometry = new THREE.BufferGeometry();
    
    const positions = new Float32Array(maxCount * 3);
    const velocities = new Float32Array(maxCount * 3);
    const sizes = new Float32Array(maxCount);
    const ages = new Float32Array(maxCount);
    const lifespans = new Float32Array(maxCount);

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // 创建烟雾纹理 (更加柔和)
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, 'rgba(150, 150, 150, 0.15)');
    gradient.addColorStop(0.4, 'rgba(80, 80, 80, 0.05)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
    
    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
        size: 20, // 初始尺寸更大
        transparent: true,
        blending: THREE.NormalBlending,
        map: texture,
        depthWrite: false,
        opacity: 0.3,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let activeCount = 0;

    return {
        spawn(position, speedFactor = 1.0) {
            // 数量 6~12，受速度影响
            const count = (6 + Math.random() * 6) * speedFactor;
            
            for (let i = 0; i < count; i++) {
                if (activeCount >= maxCount) break;
                
                const idx = activeCount;
                positions[idx * 3] = position.x + (Math.random() - 0.5) * 1.0;
                positions[idx * 3 + 1] = position.y + (Math.random() - 0.5) * 1.0;
                positions[idx * 3 + 2] = position.z + (Math.random() - 0.5) * 1.0;

                // 缓慢扩散速度
                velocities[idx * 3] = (Math.random() - 0.5) * 2.0;
                velocities[idx * 3 + 1] = 0.5 + Math.random() * 1.5;
                velocities[idx * 3 + 2] = (Math.random() - 0.5) * 2.0;

                sizes[idx] = 2 + Math.random() * 3;
                ages[idx] = 0;
                lifespans[idx] = 5.0; // 生命周期 5 秒

                activeCount++;
            }
        },

        update() {
            const posAttr = geometry.getAttribute('position');
            const sizeAttr = geometry.getAttribute('size');

            for (let i = 0; i < activeCount; i++) {
                // 缓慢上升和扩散
                positions[i * 3] += velocities[i * 3] * 0.016;
                positions[i * 3 + 1] += velocities[i * 3 + 1] * 0.016;
                positions[i * 3 + 2] += velocities[i * 3 + 2] * 0.016;

                ages[i] += 0.016;
                
                // 逐渐变大 (膨胀效果)
                sizes[i] += 0.05;

                // 生命周期结束后移除
                if (ages[i] > lifespans[i]) {
                    const last = activeCount - 1;
                    if (i < last) {
                        positions[i * 3] = positions[last * 3];
                        positions[i * 3 + 1] = positions[last * 3 + 1];
                        positions[i * 3 + 2] = positions[last * 3 + 2];
                        velocities[i * 3] = velocities[last * 3];
                        velocities[i * 3 + 1] = velocities[last * 3 + 1];
                        velocities[i * 3 + 2] = velocities[last * 3 + 2];
                        sizes[i] = sizes[last];
                        ages[i] = ages[last];
                        lifespans[i] = lifespans[last];
                        i--;
                    }
                    activeCount--;
                }
            }

            posAttr.needsUpdate = true;
            sizeAttr.needsUpdate = true;
            geometry.setDrawRange(0, activeCount);
            
            // 动态透明度 (逐渐变淡)
            // 简单处理：通过 PointsMaterial 全局透明度或后期优化为每个粒子不同
            material.opacity = 0.3 * (1.0 - (activeCount > 0 ? ages[0]/lifespans[0] : 0));
        }
    };
}
