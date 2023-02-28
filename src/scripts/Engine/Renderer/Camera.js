import { Mat4Orthographic } from '../../Helpers/Math/Matrix.js';

export class Camera
{
   camera = null;
   CameraSet() {
		this.camera = new Mat4Orthographic(0, Viewport.width, Viewport.height, 0, -100.0, 1000); 
	}
	CameraUpdate(glContext) {
		if (!this.camera) alert('Forget to set camera. I_GlProgram.js');
		glContext.uniformMatrix4fv(this.shaderInfo.uniforms.orthoProj, false, this.camera);
	}
}