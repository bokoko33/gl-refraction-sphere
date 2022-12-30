import * as THREE from 'three';
import vertexShader from '~/glsl/background.vert';
import fragmentShader from '~/glsl/background.frag';

export class Background {
  constructor() {
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: null },
      },
      vertexShader,
      fragmentShader,
      transparent: false,
      depthTest: false,
      depthWrite: false,
    });
    this.mesh = new THREE.Mesh(geometry, material);
  }

  update = ({ texture }) => {
    this.mesh.material.uniforms.uTexture.value = texture;
  };

  dispose = (stage) => {
    stage.scene?.remove(this.mesh);

    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
  };
}
