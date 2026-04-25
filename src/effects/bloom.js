import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

export function createBloom(renderer, scene, camera) {
    const renderScene = new RenderPass(scene, camera);

    const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        2.0,  // 增加强度，让球体看起来更炽热
        0.1,  // 极小的半径，确保光晕紧贴球体，不扩散
        10  // 阈值调低一点点，让红色部分也能产生辉光
    );

    const composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);
    composer.addPass(new OutputPass());

    window.addEventListener('resize', () => {
        composer.setSize(window.innerWidth, window.innerHeight);
    });

    return composer;
}
