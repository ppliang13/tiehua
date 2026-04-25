import * as THREE from 'three';
import gsap from 'gsap';
import { setupShake } from '../utils/shake.js';

/**
 * 划线击打逻辑 (Slash Mode) - 触碰即击中版
 */
export function setupHit(hammer, sparks, smoke, camera, lights, scene, irons, slash) {
    const shake = setupShake(camera);
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const currentMouseWorld = new THREE.Vector3();
    
    const audio = new Audio('audio/打铁花开头.mp3');
    
    // 强制预加载并设置初始音量
    audio.load();
    audio.volume = 1.0;

    // 添加交互监听，解决浏览器自动播放限制
    let audioContextResumed = false;
    const resumeAudio = () => {
        if (audioContextResumed) return;
        // 播放一段静音或空音频以激活音频上下文
        audio.play().then(() => {
            audio.pause();
            audio.currentTime = 0;
            audioContextResumed = true;
            console.log("Audio Context Resumed");
        }).catch(e => console.log("Audio resume failed:", e));
    };
    window.addEventListener('mousedown', resumeAudio, { once: true });
    window.addEventListener('mousemove', resumeAudio, { once: true });
    window.addEventListener('touchstart', resumeAudio, { once: true });
    
    // 隐藏铁锤
    hammer.visible = false;

    // 一个深度的垂直平面，用于捕捉鼠标位置
    const hitPlaneGeom = new THREE.PlaneGeometry(2000, 2000);
    const hitPlaneMat = new THREE.MeshBasicMaterial({ visible: false });
    const hitPlane = new THREE.Mesh(hitPlaneGeom, hitPlaneMat);
    hitPlane.position.z = 0; 
    scene.add(hitPlane);

    // 始终显示划痕
    slash.show();

    function updateHammer() {
        // 让铁锤平滑跟随鼠标位置
        hammer.position.lerp(currentMouseWorld, 0.4);
        
        // 旋转铁锤使其更有“切割”或“击打”的动感
        hammer.rotation.x = -Math.PI / 3;
        hammer.rotation.y = Math.PI / 4;
        hammer.rotation.z = Math.sin(Date.now() * 0.005) * 0.2; // 稍微晃动增加灵动感
        
        requestAnimationFrame(updateHammer);
    }
    updateHammer();

    window.addEventListener('mousemove', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(hitPlane);
        
        if (intersects.length > 0) {
            currentMouseWorld.copy(intersects[0].point);
            
            // 只要移动就更新划痕
            slash.update(currentMouseWorld);
            // 实时检测碰撞，无需按下左键
            checkCollision();
        }
    });

    function checkCollision() {
        const activeIrons = irons.getIrons();
        const data = slash.getData();
        if (data.points.length < 2) return;

        // 获取最新的线段 (最后两个采样点)
        const p2 = data.points[data.points.length - 1].pos;
        const p1 = data.points[data.points.length - 2].pos;

        // 速度因子 (基础 1.0, 越快爆发越强)
        const speedFactor = Math.min(3.0, Math.max(1.0, data.speed * 10));

        activeIrons.forEach(iron => {
            if (iron.isHit) return;

            // 线段与球体碰撞检测的简化版：计算球心到线段的距离
            const spherePos = iron.mesh.position;
            const dist = pointToLineDistance(spherePos, p1, p2);
            
            // 判定范围：火球半径 + 容差
            if (dist < 6.0) { 
                triggerHit(spherePos, speedFactor);
                irons.hit(iron);
            }
        });
    }

    // 计算点到线段的距离
    function pointToLineDistance(p, a, b) {
        const ab = new THREE.Vector3().subVectors(b, a);
        const ap = new THREE.Vector3().subVectors(p, a);
        const bp = new THREE.Vector3().subVectors(p, b);

        const e = ap.dot(ab);
        if (e <= 0) return ap.length();
        const f = ab.dot(ab);
        if (e >= f) return bp.length();
        return Math.sqrt(ap.lengthSq() - (e * e) / f);
    }

    function triggerHit(pos, speedFactor = 1.0) {
        if (lights && lights.pointLight) {
            lights.pointLight.position.copy(pos);
            lights.pointLight.intensity = 80 * speedFactor; 
            gsap.to(lights.pointLight, { intensity: 0, duration: 1.2 });
        }

        sparks.spawn(pos, speedFactor);
        smoke.spawn(pos, speedFactor);
        shake.trigger(0.25 * speedFactor, 0.2); // 击中震动受速度影响
        
        // 确保音频对象在击中时被重置并播放
        if (audio) {
            const hitAudio = audio.cloneNode();
            hitAudio.volume = Math.min(1.0, 0.6 * speedFactor);
            hitAudio.play().catch(e => console.warn("Audio play blocked:", e));
        }
    }

    // 自动产生火球的循环 - 降低频率
    function autoSpawn() {
        // 降低产生频率和数量
        irons.spawn();
        
        // 随机下次产生时间：拉长间隔 (1.0秒 - 2.5秒)
        const nextSpawn = 700 + Math.random() * 1000;
        setTimeout(autoSpawn, nextSpawn);
    }
    autoSpawn();
}
