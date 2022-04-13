import * as OGL from 'ogl'
import { createRoot } from 'react-ogl'

// Init rendering internals
const canvas = document.querySelector('canvas')
const renderer = new OGL.Renderer({ canvas })
const camera = new OGL.Camera(renderer.gl)
camera.position.z = 5
const scene = new OGL.Transform(renderer.gl)

// Or you can use our own internals. This will also set up a render loop.
// const { root, renderer, camera, scene } = createInternals(camera, config)

// Set initial size
renderer.setSize(window.innerWidth, window.innerHeight)
camera.perspective({ aspect: window.innerWidth / window.innerHeight })

// Create root
const root = createRoot(canvas, { renderer, camera, scene })
root.render(
  <mesh>
    <box />
    <program
      vertex={`
        attribute vec3 position;
        attribute vec3 normal;

        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform mat3 normalMatrix;

        varying vec3 vNormal;

        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `}
      fragment={`
        precision highp float;

        uniform vec3 uColor;
        varying vec3 vNormal;

        void main() {
          vec3 normal = normalize(vNormal);
          float lighting = dot(normal, normalize(vec3(10)));

          gl_FragColor.rgb = uColor + lighting * 0.1;
          gl_FragColor.a = 1.0;
        }
      `}
      uniforms={{ uColor: 'white' }}
    />
  </mesh>,
  )

// Render to screen
const animate = () => {
  requestAnimationFrame(animate)
  renderer.render({ scene, camera })
}
animate()