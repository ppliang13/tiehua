import * as THREE from 'three';

export function createHammer(scene) {
    const group = new THREE.Group();

    // 锤柄 (木质感)
    const handleGeometry = new THREE.CylinderGeometry(0.02, 0.02, 1, 16);
    const handleMaterial = new THREE.MeshStandardMaterial({
        color: 0x442200,
        roughness: 0.9,
    });
    const handle = new THREE.Mesh(handleGeometry, handleMaterial);
    handle.position.y = 0.4; // 偏离中心以便旋转
    handle.castShadow = true;
    group.add(handle);

    // 锤头 (重工业感)
    const headGeometry = new THREE.BoxGeometry(0.15, 0.15, 0.3);
    const headMaterial = new THREE.MeshStandardMaterial({
        color: 0x222222,
        roughness: 0.7,
        metalness: 0.8,
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 0.9;
    head.castShadow = true;
    group.add(head);

    // 锤子打击面 (炽热)
    const faceGeometry = new THREE.PlaneGeometry(0.1, 0.25);
    const faceMaterial = new THREE.MeshStandardMaterial({
        color: 0xff3300,
        emissive: 0xff1100,
        emissiveIntensity: 1.5,
    });
    const face = new THREE.Mesh(faceGeometry, faceMaterial);
    face.position.set(0, 0.9, 0.151); // 贴在锤头一侧
    group.add(face);

    // 初始位置
    group.position.set(0, 1.2, -0.1);
    group.rotation.x = Math.PI / 3;

    // 整体放大一些，作为指针更清晰
    group.scale.set(1.5, 1.5, 1.5);
    
    scene.add(group);
    return group;
}
