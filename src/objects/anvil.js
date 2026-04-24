import * as THREE from 'three';

export function createAnvil(scene) {
    const group = new THREE.Group();

    // 铁砧底座 (梯形棱柱效果)
    const baseGeometry = new THREE.CylinderGeometry(0.3, 0.45, 0.6, 6);
    const metalMaterial = new THREE.MeshStandardMaterial({
        color: 0x333333,
        roughness: 0.8,
        metalness: 0.6,
    });
    const base = new THREE.Mesh(baseGeometry, metalMaterial);
    base.position.y = 0.3;
    base.castShadow = true;
    base.receiveShadow = true;
    group.add(base);

    // 铁砧顶部
    const topGeometry = new THREE.BoxGeometry(0.8, 0.25, 0.35);
    const top = new THREE.Mesh(topGeometry, metalMaterial);
    top.position.y = 0.725;
    top.castShadow = true;
    top.receiveShadow = true;
    group.add(top);

    // 炽热的铁水容器 (一个小圆盘在顶部，颜色发红)
    const moltenGeometry = new THREE.CylinderGeometry(0.12, 0.12, 0.02, 32);
    const moltenMaterial = new THREE.MeshStandardMaterial({
        color: 0xff4400,
        emissive: 0xff2200,
        emissiveIntensity: 2,
    });
    const molten = new THREE.Mesh(moltenGeometry, moltenMaterial);
    molten.position.y = 0.85;
    group.add(molten);

    scene.add(group);
    return group;
}
