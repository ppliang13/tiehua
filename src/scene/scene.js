import * as THREE from 'three';

export function createScene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x010101); // 接近纯黑
    scene.fog = new THREE.FogExp2(0x010101, 0.015); // 降低雾气密度，让远景地面可见
    return scene;
}
