//===================== Orthographic Matrix =====================
// | left-right | 0				| 0							| 0 |
// | 0			| top - bottom	|							| 0 |
// |			|				| zFar - zNear				| 0 |
// |-(r+l)/(r-l)|-(t+b) / (t-b) |-(zFar+zNear)/(zFar-zNear)	| 1 |
export function Mat4Orthographic(left, right, bottom, top, zNear, zFar){

	let out = [
		2.0  / (right - left),
		0.0, 
		0.0, 
		0.0, 
		0.0,								
		2.0  / (top - bottom),				
		0.0, 
		0.0, 
		0.0, 
		0.0,								
		-2.0 / (zFar - zNear),				
		0.0,								
		-(right + left) / (right - left),	
		-(top + bottom) / (top - bottom),	
		-(zFar + zNear) / (zFar - zNear),	
		1.0
	]


	return out;
}

