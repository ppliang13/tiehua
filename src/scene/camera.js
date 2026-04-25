import * as THREE from 'three';

export function createCamera() {
    const camera = new THREE.PerspectiveCamera(
        40, 
        window.innerWidth / window.innerHeight,
        0.1,
        3000
    );
    
    // 远景视角：拉远到 60，高度提升到 15，观察全局
    camera.position.set(0, 25, 100);
    
    // 视点稍微向下倾斜，看向 y=6，这样能同时看到空中的打击点和地面
    camera.lookAt(0, 3, 0);
    
    return camera;
}
