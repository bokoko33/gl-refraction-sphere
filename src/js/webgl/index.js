import * as THREE from 'three';
import Stats from 'stats.js';
import { config } from '~/js/webgl/config';
import { Stage } from '~/js/webgl/Stage';
import { SampleScreen } from '~/js/webgl/SampleScreen';
import { Sphere } from '~/js/webgl/Sphere';
import { Background } from '~/js/webgl/Background';
import { Mouse2D } from '~/js/utils/Mouse2D';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLCanvas } from '~/js/webgl/GLCanvas';

export class WebGL {
  constructor({ canvasWrapper, canvas, isDev = false, selfLoop = true }) {
    config.isDev = isDev;

    this.selfLoop = selfLoop; // rafループを外部ループに挿入するか、このclassで実行するか
    this.rafId = 0;

    this.glCanvas = new GLCanvas({
      wrapperEl: canvasWrapper,
      el: canvas,
    });

    const { viewSize } = this.glCanvas;

    // offscreen
    this.offStage = new Stage({
      viewSize: viewSize,
      cameraType: 'perspective',
      isOffscreen: true,
    });

    this.offPlane = new SampleScreen({
      viewSize: viewSize,
    });
    this.offStage.scene.add(this.offPlane.mesh);

    // render scene
    this.stage = new Stage({
      viewSize: viewSize,
      cameraType: 'perspective',
    });

    this.bg = new Background();
    this.stage.scene.add(this.bg.mesh);

    this.sphere = new Sphere({
      screenCoord: this.calcScreenCoord(),
    });
    this.stage.scene.add(this.sphere.mesh);

    this.lastTime = this.getTime();

    this.mouse = Mouse2D.instance;

    if (this.selfLoop) {
      this.ticker();
    }

    window.addEventListener('resize', this.resize);

    // development mode
    if (isDev) {
      // stats.js
      this.stats = new Stats();
      document.body.appendChild(this.stats.dom);

      // OrbitControls
      this.controls = new OrbitControls(
        this.stage.camera,
        this.glCanvas.renderer.domElement
      );
    }
  }

  calcScreenCoord = () => {
    const { width, height } = this.glCanvas.viewSize;
    return new THREE.Vector2(width, height).multiplyScalar(
      window.devicePixelRatio
    );
  };

  getTime = () => {
    return performance.now() * 0.001;
  };

  getTimeScale = (deltaTime) => {
    // 60fpsを基準に時間経過のスケール値を返す
    // ex. 60fps → 1.0, 120fps → 0.5
    return deltaTime * 60;
  };

  ticker = () => {
    this.stats?.begin();

    const time = this.getTime();
    // const deltaTime = time - this.lastTime;
    // const timeScale = this.getTimeScale(deltaTime);
    this.lastTime = time;

    // off render
    this.offPlane.update({ time });
    this.glCanvas.offscreenRender(this.offStage);

    // main render
    this.sphere.update({ time, texture: this.offStage.renderTarget.texture });
    this.bg.update({ texture: this.offStage.renderTarget.texture });
    this.glCanvas.render(this.stage);

    this.stats?.end();

    if (this.selfLoop) {
      this.rafId = window.requestAnimationFrame(this.ticker);
    }
  };

  resize = () => {
    this.glCanvas.resize();
    const newSize = this.glCanvas.viewSize;

    this.stage.resize(newSize);

    this.offPlane.resize(newSize);
  };
}
