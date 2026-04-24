import * as THREE from 'three';

export function createGround(scene) {
    // 显著扩大地面范围，以匹配远景视角和高空飞溅半径
    const geometry = new THREE.PlaneGeometry(500, 500);
    const material = new THREE.MeshStandardMaterial({
        color: 0x111111, // 稍微调亮一点，防止完全看不见
        roughness: 0.1, 
        metalness: 0.4,
    });
    
    const ground = new THREE.Mesh(geometry, material);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.1;
    ground.receiveShadow = true;
    
    scene.add(ground);

    // 添加一个辅助网格，让地面有空间感（半透明，很淡）
    const grid = new THREE.GridHelper(500, 50, 0x333333, 0x222222);
    grid.position.y = 0.01;
    grid.material.opacity = 0.2;
    grid.material.transparent = true;
    scene.add(grid);

    // 添加一些地面纹理感 (可选，这里用简单的颜色变化)
    return ground;
}
