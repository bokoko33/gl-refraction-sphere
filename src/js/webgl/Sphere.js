import * as THREE from 'three';
import vertexShader from '~/glsl/sphere.vert';
import fragmentShader from '~/glsl/sphere.frag';

export class Sphere {
  constructor({ screenCoord }) {
    const geometry = new THREE.IcosahedronGeometry(1, 32);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uTexture: { value: null },
        uScreenCoord: { value: screenCoord },
      },
      vertexShader,
      fragmentShader,
    });
    // const material = new THREE.MeshNormalMaterial();
    // material.onBeforeCompile = (shader) => {
    //   console.log(shader.vertexShader);
    // };
    this.mesh = new THREE.Mesh(geometry, material);
  }

  update = ({ time, texture }) => {
    this.mesh.material.uniforms.uTime.value = time;
    this.mesh.material.uniforms.uTexture.value = texture;
    // this.mesh.rotation.y = time;
  };

  dispose = (stage) => {
    stage.scene?.remove(this.mesh);

    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
  };
}
