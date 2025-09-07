// Mock Unity WebGL Module Integration for Meta Studio Ad Studio App
// This module will handle the communication between the React SPA and the Unity-based VR/AR experience.

interface UnityInstance {
  SendMessage: (gameObjectName: string, methodName: string, parameter?: string | number | boolean) => void;
  Quit: () => Promise<void>;
}

class UnityModule {
  private unityInstance: UnityInstance | null = null;

  constructor(containerId: string, buildUrl: string) {
    this.loadUnityScript(buildUrl)
      .then(() => this.createUnityInstance(containerId))
      .catch(error => console.error("Failed to initialize Unity WebGL module:", error));
  }

  private loadUnityScript(buildUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `${buildUrl}/Build/UnityLoader.js`;
      script.onload = () => resolve();
      script.onerror = (error) => reject(error);
      document.body.appendChild(script);
    });
  }

  private createUnityInstance(containerId: string): void {
    // Assuming createUnityInstance is globally available after loader script runs
    // @ts-ignore
    window.createUnityInstance(document.getElementById(containerId), {
      dataUrl: "Build/my-unity-app.data",
      frameworkUrl: "Build/my-unity-app.framework.js",
      codeUrl: "Build/my-unity-app.wasm",
    }).then((instance: UnityInstance) => {
      this.unityInstance = instance;
      console.log("Unity instance created successfully.");
    }).catch((error: Error) => {
      console.error("Failed to create Unity instance:", error);
    });
  }

  // Send ad data to the Unity scene for VR/AR preview
  public previewAdInVR(adData: object): void {
    if (!this.unityInstance) {
      console.warn("Unity instance not available.");
      return;
    }
    const adDataJson = JSON.stringify(adData);
    this.unityInstance.SendMessage("AdManager", "LoadAdCreative", adDataJson);
  }

  // Gracefully shut down the Unity instance
  public async shutdown(): Promise<void> {
    if (this.unityInstance) {
      await this.unityInstance.Quit();
      this.unityInstance = null;
      console.log("Unity instance shut down.");
    }
  }
}

export default UnityModule;
