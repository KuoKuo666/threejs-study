import * as THREE from 'three'

export const initScene = () => {
    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#282c34')
    const light = new THREE.AmbientLight('white', 1)
    scene.add(light)
    return scene
}

export const initCamera = () => {
    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.set(0, 3, 5)
    camera.lookAt(new THREE.Vector3(0, 0, 0))
    return camera
}

export const initWebGLRenderer = () => {
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)
    return renderer
}
