import * as THREE from 'three';

/**
 * 打铁花 - 高空大容量火花雨系统 (High-Capacity Spark Rain System)
 * 修复了地面碰撞效果与粒子寿命
 */
export function createSparks(scene) {
    const maxParticles = 200000; // 降低上限以提升性能
    const particles = [];
    
    // 纹理生成
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 256);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');   
    gradient.addColorStop(0.1, 'rgba(255, 255, 150, 1)'); 
    gradient.addColorStop(0.3, 'rgba(255, 150, 0, 0.9)'); 
    gradient.addColorStop(0.6, 'rgba(200, 50, 0, 0.6)');  
    gradient.addColorStop(1, 'rgba(80, 0, 0, 0)');      
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 256);
    const sparkTexture = new THREE.CanvasTexture(canvas);

    const geometry = new THREE.PlaneGeometry(1, 1);
    geometry.translate(0, -0.5, 0); 
    
    const material = new THREE.MeshBasicMaterial({
        map: sparkTexture,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide
    });

    const instancedMesh = new THREE.InstancedMesh(geometry, material, maxParticles);
    instancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    scene.add(instancedMesh);

    const dummy = new THREE.Object3D();

    return {
        spawn(pos, speedFactor = 1.0) {
            // 数量受速度影响，基础 2000-4000
            const count = (2000 + Math.random() * 2000) * speedFactor;
            
            for (let i = 0; i < count; i++) {
                if (particles.length >= maxParticles) break;

                const layerRand = Math.random();
                let size, speedMult, decay;
                
                if (layerRand < 0.2) { 
                    size = 0.15 + Math.random() * 0.1;
                    speedMult = 1.8;
                    decay = 0.25; // 增长寿命
                } else if (layerRand < 0.8) {
                    size = 0.08 + Math.random() * 0.05;
                    speedMult = 1.2;
                    decay = 0.15; // 增长寿命
                } else {
                    size = 0.04 + Math.random() * 0.03;
                    speedMult = 0.8;
                    decay = 0.1; // 增长寿命
                }

                // --- 打铁花扇形喷射逻辑 ---
                // 1. 限制在向上45度的扇形范围内 (theta 接近 0 是向上)
                // Math.random() * 0.25 * Math.PI 约等于 0 到 45 度
                const theta = (Math.random() * 0.5) * Math.PI; 
                const phi = Math.random() * Math.PI * 2;
                
                // 2. 爆发速度：需要足够大以抵消重力产生“上冲”感
                const speed = (20 + Math.random() * 15) * speedMult * speedFactor;
                
                // 3. 计算速度向量：增加向上(Y)的权重，减小横向(X,Z)的扩散
                const vx = Math.sin(theta) * Math.cos(phi) * speed * 1.2; // 横向压缩
                const vy = Math.cos(theta) * speed;                      // 纵向加强
                const vz = Math.sin(theta) * Math.sin(phi) * speed * 1.2; // 横向压缩
                
                particles.push({
                    position: new THREE.Vector3(pos.x, pos.y, pos.z),
                    velocity: new THREE.Vector3(vx, vy, vz),
                    life: 1.0,
                    decay: decay * (0.8 + Math.random() * 0.4),
                    size: size,
                    drag: 0.98 + Math.random() * 0.01, // 略微减小空气阻力让粒子冲得更高
                    onGround: false
                });
            }
        },

        update(delta) {
            const gravity = -45; // 增加重力感，让下落轨迹更明显
            let activeCount = 0;

            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.life -= p.decay * delta;

                if (p.life <= 0) {
                    particles.splice(i, 1);
                    continue;
                }

                // 物理模拟
                if (!p.onGround) {
                    p.velocity.y += gravity * delta;
                    p.velocity.multiplyScalar(p.drag);
                    p.position.addScaledVector(p.velocity, delta);

                    // 落地检测
                    if (p.position.y < 0) {
                        p.position.y = 0;
                        if (Math.abs(p.velocity.y) > 2) {
                            p.velocity.y *= -0.2; // 弹起
                            p.velocity.x *= 0.6;
                            p.velocity.z *= 0.6;
                        } else {
                            p.onGround = true;
                            p.velocity.set(0, 0, 0);
                            p.decay *= 2; // 在地上消失得快一点，但仍有残留
                        }
                    }
                }

                dummy.position.copy(p.position);
                
                if (!p.onGround) {
                    const lookAtTarget = p.position.clone().add(p.velocity);
                    dummy.lookAt(lookAtTarget);
                    dummy.rotateX(Math.PI / 2);
                    
                    // 飞行中的拉伸
                    const stretch = Math.max(0.1, p.velocity.length() * 0.08 * p.life);
                    dummy.scale.set(p.size, stretch, p.size);
                } else {
                    // 落地后变成小亮点
                    dummy.rotation.set(-Math.PI / 2, 0, 0);
                    const groundSize = p.size * p.life * 0.5;
                    dummy.scale.set(groundSize, groundSize, groundSize);
                }

                dummy.updateMatrix();
                instancedMesh.setMatrixAt(activeCount, dummy.matrix);
                activeCount++;
            }

            instancedMesh.count = activeCount;
            instancedMesh.instanceMatrix.needsUpdate = true;
        }
    };
}
