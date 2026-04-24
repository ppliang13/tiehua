import * as THREE from 'three';
import gsap from 'gsap';
import { setupShake } from '../utils/shake.js';

export function setupHit(hammer, sparks, smoke, camera, lights, scene) {
    const shake = setupShake(camera);
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    const audio = new Audio('/audio/打铁花开头.mp3');
    
    let isHitting = false;
    hammer.visible = true;

    // 空中打击平面：提升到 y=12
    const hitHeight = 12;
    const hitPlaneGeom = new THREE.PlaneGeometry(300, 300);
    const hitPlaneMat = new THREE.MeshBasicMaterial({ visible: false });
    const hitPlane = new THREE.Mesh(hitPlaneGeom, hitPlaneMat);
    hitPlane.rotation.x = -Math.PI / 2;
    hitPlane.position.y = hitHeight; 
    scene.add(hitPlane);

    const targetPos = new THREE.Vector3(0, hitHeight + 1, 0);

    window.addEventListener('mousemove', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(hitPlane);
        
        if (intersects.length > 0) {
            targetPos.copy(intersects[0].point);
            targetPos.y = hitHeight + 1.5; // 稍微抬高，给击打留出空间
        } else {
            const vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
            vector.unproject(camera);
            const dir = vector.sub(camera.position).normalize();
            const distance = 40; 
            const pos = camera.position.clone().add(dir.multiplyScalar(distance));
            targetPos.copy(pos);
            targetPos.y = Math.max(targetPos.y, hitHeight + 1.5);
        }
    });

    function updateHammerPosition() {
        if (!isHitting) {
            hammer.position.lerp(targetPos, 0.8);
            hammer.rotation.x = -Math.PI / 4;
            hammer.rotation.y = Math.PI / 6;
            hammer.rotation.z = 0;
        }
        requestAnimationFrame(updateHammerPosition);
    }
    updateHammerPosition();

    window.addEventListener('mousedown', () => {
        if (isHitting) return;
        isHitting = true;

        // 击打动画：向下猛冲
        gsap.to(hammer.rotation, {
            x: Math.PI / 6,
            duration: 0.08,
            ease: "power2.in",
            onComplete: () => {
                // 精确获取锤头打击面的世界坐标
                // 根据 hammer.js，打击面在 local 坐标 (0, 0.9, 0.151)
                const impactPoint = new THREE.Vector3(0, 0.9, 0.15);
                hammer.localToWorld(impactPoint);

                if (lights && lights.pointLight) {
                    lights.pointLight.position.copy(impactPoint);
                    lights.pointLight.intensity = 60; 
                    gsap.to(lights.pointLight, { intensity: 0, duration: 1.0 });
                }

                // 从锤头位置爆发火花
                sparks.spawn(impactPoint);
                smoke.spawn(impactPoint);
                
                shake.trigger(0.2, 0.2);
                
                audio.currentTime = 0;
                audio.play().catch(() => {});

                // 反弹恢复
                gsap.to(hammer.rotation, {
                    x: -Math.PI / 4,
                    duration: 0.2,
                    ease: "back.out(2.5)",
                    onComplete: () => {
                        isHitting = false;
                    }
                });
            }
        });
    });
}
