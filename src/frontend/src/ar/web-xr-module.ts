// WebXR Module for AR Ad Previews
// This module uses the WebXR API to display AR ad previews in the browser.

import * as THREE from 'three';
import { ARButton } from 'three/examples/jsm/webxr/ARButton.js';

class WebXRModule {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private adObject: THREE.Object3D | null = null;

  constructor(containerId: string) {
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error("Container not found for WebXR module.");
    }

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.xr.enabled = true;
    container.appendChild(this.renderer.domElement);

    const arButton = ARButton.createButton(this.renderer);
    document.body.appendChild(arButton);

    this.renderer.setAnimationLoop(() => this.render());
  }

  private render() {
    this.renderer.render(this.scene, this.camera);
  }

  public showAdPreview(adUrl: string) {
    // Load the 3D model for the ad
    const loader = new THREE.ObjectLoader(); // In a real app, use GLTFLoader
    loader.load(adUrl, (object) => {
      this.adObject = object;
      this.scene.add(this.adObject);
    });
  }

  public removeAdPreview() {
    if (this.adObject) {
      this.scene.remove(this.adObject);
      this.adObject = null;
    }
  }
}

export default WebXRModule;
