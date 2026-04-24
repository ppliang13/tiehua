import * as THREE from 'three';

export function createLights(scene) {
    // 基础环境光 - 稍微调亮以看清地面
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    // 主平行光（月光/微弱背光）
    const mainLight = new THREE.DirectionalLight(0x444466, 0.8);
    mainLight.position.set(5, 10, 5);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 1024;
    mainLight.shadow.mapSize.height = 1024;
    scene.add(mainLight);

    // 重点：打击点火光（暖色，位置随打击点变化，这里先定在铁砧上方）
    const pointLight = new THREE.PointLight(0xff4400, 0, 10);
    pointLight.position.set(0, 1.2, 0);
    pointLight.castShadow = true;
    scene.add(pointLight);

    return { ambientLight, mainLight, pointLight };
}
