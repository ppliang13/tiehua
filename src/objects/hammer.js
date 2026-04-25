import * as THREE from 'three';

export function createHammer(scene) {
    const group = new THREE.Group();

    // 锤柄 (改为浅色木纹/金属感)
    const handleGeometry = new THREE.CylinderGeometry(0.02, 0.02, 1, 16);
    const handleMaterial = new THREE.MeshStandardMaterial({
        color: 0xaaaaaa, // 浅灰色
        roughness: 0.3,
        metalness: 0.8,
    });
    const handle = new THREE.Mesh(handleGeometry, handleMaterial);
    handle.position.y = 0.4; 
    handle.castShadow = true;
    group.add(handle);

    // 锤头 (改为高亮银白色/不锈钢感)
    const headGeometry = new THREE.BoxGeometry(0.15, 0.15, 0.3);
    const headMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff, // 纯白/银色
        roughness: 0.1,
        metalness: 0.9,
        emissive: 0x444444, // 带有微弱的自发光，使其在暗处也清晰
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 0.9;
    head.castShadow = true;
    group.add(head);

    // 锤子打击面 (改为极亮白黄色，增加视觉重心)
    const faceGeometry = new THREE.PlaneGeometry(0.12, 0.28);
    const faceMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffff00,
        emissiveIntensity: 5, // 极强发光
    });
    const face = new THREE.Mesh(faceGeometry, faceMaterial);
    face.position.set(0, 0.9, 0.151); 
    group.add(face);

    // 初始位置
    group.position.set(0, 1.2, -0.1);
    group.rotation.x = Math.PI / 3;

    // 极致放大，作为交互指针极其醒目
    group.scale.set(6.0, 6.0, 6.0);
    
    scene.add(group);
    return group;
}
