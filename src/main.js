import { createRenderer } from './scene/renderer.js';
import { createCamera } from './scene/camera.js';
import { createLights } from './scene/lights.js';
import { createScene } from './scene/scene.js';
import { createAnvil } from './objects/anvil.js';
import { createHammer } from './objects/hammer.js';
import { createGround } from './objects/ground.js';
import { createSparks } from './effects/sparks.js';
import { createSmoke } from './effects/smoke.js';
import { createBloom } from './effects/bloom.js';
import { setupHit } from './controls/hit.js';

const scene = createScene();
const camera = createCamera();
const renderer = createRenderer();

document.body.appendChild(renderer.domElement);

const lights = createLights(scene);

// 物体
const anvil = createAnvil(scene);
const hammer = createHammer(scene);
const ground = createGround(scene);

// 特效
const sparks = createSparks(scene);
const smoke = createSmoke(scene);

// 恢复 Bloom 效果，专门为火花提供辉光
const composer = createBloom(renderer, scene, camera);

// 交互
setupHit(hammer, sparks, smoke, camera, lights, scene);

// 渲染循环
function animate() {
    requestAnimationFrame(animate);
    
    const delta = 0.016;
    sparks.update(delta);
    smoke.update(delta);
    
    // 使用 composer 进行渲染以支持 Bloom
    composer.render();
}

animate();

// 处理窗口调整
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
