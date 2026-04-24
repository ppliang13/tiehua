import * as THREE from 'three';

export function createSmoke(scene) {
    const maxCount = 100;
    const geometry = new THREE.BufferGeometry();
    
    const positions = new Float32Array(maxCount * 3);
    const velocities = new Float32Array(maxCount * 3);
    const sizes = new Float32Array(maxCount);
    const opacities = new Float32Array(maxCount);
    const ages = new Float32Array(maxCount);

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // 创建烟雾纹理
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, 'rgba(200, 200, 200, 0.2)');
    gradient.addColorStop(0.5, 'rgba(100, 100, 100, 0.05)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
    
    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
        size: 2,
        transparent: true,
        blending: THREE.NormalBlending,
        map: texture,
        depthWrite: false,
        opacity: 0.5,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let activeCount = 0;

    return {
        spawn(position) {
            const count = 5 + Math.random() * 5;
            for (let i = 0; i < count; i++) {
                if (activeCount >= maxCount) break;
                
                const idx = activeCount;
                positions[idx * 3] = position.x + (Math.random() - 0.5) * 0.2;
                positions[idx * 3 + 1] = position.y;
                positions[idx * 3 + 2] = position.z + (Math.random() - 0.5) * 0.2;

                velocities[idx * 3] = (Math.random() - 0.5) * 0.5;
                velocities[idx * 3 + 1] = 0.5 + Math.random() * 1.0;
                velocities[idx * 3 + 2] = (Math.random() - 0.5) * 0.5;

                sizes[idx] = 1 + Math.random() * 2;
                ages[idx] = 0;

                activeCount++;
            }
        },

        update() {
            const posAttr = geometry.getAttribute('position');
            const sizeAttr = geometry.getAttribute('size');

            for (let i = 0; i < activeCount; i++) {
                // 缓慢上升和飘散
                positions[i * 3] += velocities[i * 3] * 0.016;
                positions[i * 3 + 1] += velocities[i * 3 + 1] * 0.016;
                positions[i * 3 + 2] += velocities[i * 3 + 2] * 0.016;

                ages[i] += 0.016;
                
                // 变大变淡
                sizes[i] += 0.01;

                if (ages[i] > 3.0) {
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
                        i--;
                    }
                    activeCount--;
                }
            }

            posAttr.needsUpdate = true;
            sizeAttr.needsUpdate = true;
            geometry.setDrawRange(0, activeCount);
        }
    };
}
