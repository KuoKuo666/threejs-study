import * as THREE from 'three'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export const loadGLTF = (url: string) => new Promise<THREE.Group>((resolve, reject) => {
    const loader = new GLTFLoader()
    loader.load(url, (gltf: GLTF) => {
        console.log(gltf)
        resolve(gltf.scene)
    })
})
