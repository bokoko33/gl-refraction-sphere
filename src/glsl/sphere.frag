uniform sampler2D uTexture;
uniform vec2 uScreenCoord;
varying vec3 vNormal;
varying vec3 vEye;

float random(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float fresnel(vec3 eye, vec3 normal) {
  return pow(1.0 + dot(eye, normal), 1.5);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uScreenCoord.xy;

  float refractPower = 0.1;
  float f = fresnel(vEye, vNormal);
  f = smoothstep(0.1, 1.0 - refractPower, f);

  // float r = texture2D(uTexture, uv - vNormal.xy * f * (0.1 + 0.1 * 1.0)).r;
  // float g = texture2D(uTexture, uv - vNormal.xy * f * (0.1 + 0.1 * 1.5)).g;
  // float b = texture2D(uTexture, uv - vNormal.xy * f * (0.1 + 0.1 * 2.0)).b;

  float slide;
  vec3 refractCol = vec3(0.0);
  vec2 refractUvR;
  vec2 refractUvG;
  vec2 refractUvB;
  // float refractPower = 0.3;
  vec2 refractNormal = vNormal.xy * ( 1.0 - vNormal.z * 0.85 );

  float transparent = 1.0;

  for (int i = 0; i < 16; i ++) {

    slide = float(i) / 16.0 * 0.1; // ノイズっぽい滲み

    refractUvR = uv - refractNormal * (refractPower + slide * 1.0) * transparent;
    refractUvG = uv - refractNormal * (refractPower + slide * 1.5) * transparent;
    refractUvB = uv - refractNormal * (refractPower + slide * 2.0) * transparent;

    refractCol.x += texture2D(uTexture, refractUvR).x;
    refractCol.y += texture2D(uTexture, refractUvG).y;
    refractCol.z += texture2D(uTexture, refractUvB).z;

  }
  refractCol /= float(16);

  // fresnel
  // refractUvR = uv - refractNormal * (refractPower + f * 1.0) * transparent;
  // refractUvG = uv - refractNormal * (refractPower + f * 1.5) * transparent;
  // refractUvB = uv - refractNormal * (refractPower + f * 2.0) * transparent;

  // refractCol.x += texture2D(uTexture, refractUvR).x;
  // refractCol.y += texture2D(uTexture, refractUvG).y;
  // refractCol.z += texture2D(uTexture, refractUvB).z;
  
  // vec3 color = vNormal;
  // vec3 color = vec3(r, g, b);
  gl_FragColor = vec4(refractCol, 1.0);
}