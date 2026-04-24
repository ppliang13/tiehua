import * as THREE from 'three';

export function createRenderer() {
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // 启用阴影
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // 颜色管理
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = 1.2;

    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    return renderer;
}
