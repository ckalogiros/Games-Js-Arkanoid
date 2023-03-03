"use strict";

const FS_DEFAULT = `#version 300 es

#define MAX_NUM_PARAMS_BUFFER 5
#define YELLOW  vec4(1.0, 1.0, 0.0, 1.0)
#define BLUE    vec4(0.0, 0.5, 0.7, 1.0)
#define WHITE   vec4(1.0, 1.0, 1.0, 1.0)

precision highp float;
out vec4 FragColor;


in mediump vec4  v_Color;
in mediump vec2  v_Wpos;
in mediump vec2  v_Dim;
in mediump vec2  v_Scale;
in mediump float v_RoundCorners;
in mediump float v_Border;
in mediump float v_Feather;
in mediump float v_Params[MAX_NUM_PARAMS_BUFFER];                               // [0]:WinWidth, [1]:WinHeight, [3]:Time

void main(void) {

    FragColor = v_Color;
    FragColor.rgb *= FragColor.a;                           // Premultiply alpha

    mediump float uRadius       = v_RoundCorners;           // Radius(in pixels) for rounding corners
    mediump float borderWidth   = v_Border;                 // Border Width
    mediump float featherWidth  = v_Feather;                // Border Feather Distance

    float ypos   = v_Params[1] - v_Wpos.y;                  // Transform y coord from top=0 to top=windowHeight
    float left   = v_Wpos.x - v_Dim.x * v_Scale.x;          // Left side of current geometry
    float right  = v_Wpos.x + v_Dim.x * v_Scale.x;
    float top    = ypos + v_Dim.y * v_Scale.x;
    float bottom = ypos - v_Dim.y * v_Scale.x;


    vec4 borderColor = v_Color;
    if(borderWidth > 0.0)
        borderColor += vec4(0.233, 0.233, 0.233, 0.233);    // Just a bit lighter color from v_Color

    float pixelXpos = gl_FragCoord.x;
    float pixelYpos = gl_FragCoord.y;
    float pixelDist = 0.0;
    

    // Set Border Line
    // LEFT BORDER
    if(v_Color.a > 0.0)
    if(pixelXpos < left+borderWidth+featherWidth )
    {
        FragColor = borderColor;
        
        if(pixelXpos < left+featherWidth
            && pixelYpos < top-borderWidth && pixelYpos > bottom+borderWidth) 
        {
            // float alpha = (1.0/featherWidth) * (pixelXpos-left); 
            pixelDist = length(pixelXpos - left);
            float alpha = (1.0/featherWidth) * (pixelDist); 
            FragColor.rgb *= alpha;
            FragColor.a = alpha;
        }
    }
    // RIGHT BORDER 
    else if(pixelXpos > right-borderWidth-featherWidth )
    {
        FragColor = borderColor;
            
        if(pixelXpos > right-featherWidth
            && pixelYpos < top-borderWidth && pixelYpos > bottom+borderWidth) 
        {
            pixelDist = length(right - pixelXpos);
            float alpha = (1.0/featherWidth) * (pixelDist); 
            FragColor.rgb *= alpha;
            FragColor.a = alpha;
        }
    }
    if(v_Color.a > 0.0)
    // TOP BORDER
    if(pixelYpos > top-borderWidth-featherWidth) 
        // && pixelXpos > left+borderWidth && pixelXpos < right-borderWidth) 
    {
        if(pixelXpos > left+borderWidth+featherWidth && pixelXpos < right-borderWidth-featherWidth)
            FragColor = borderColor;
            
        if(pixelYpos > top-featherWidth
            && pixelXpos > left+borderWidth && pixelXpos < right-borderWidth) 
        {
            // float alpha = (1.0/featherWidth) * (top - pixelYpos); 
            pixelDist = length(top - pixelYpos);
            float alpha = (1.0/featherWidth) * (pixelDist); 
            FragColor.rgb *= alpha;
            FragColor.a = alpha;
        }
    }
    // BOTTOM BORDER
    else if(pixelYpos < bottom+borderWidth+featherWidth
        && pixelXpos > left+borderWidth && pixelXpos < right-borderWidth) 
    {
        if(pixelXpos > left+borderWidth+featherWidth && pixelXpos < right-borderWidth-featherWidth)
            FragColor = borderColor;
        
        if(pixelYpos < bottom+featherWidth)
        {
            // float alpha = (1.0/featherWidth) * (pixelYpos-bottom); 
            pixelDist = length(pixelYpos - bottom);
            float alpha = (1.0/featherWidth) * (pixelDist); 
            FragColor.rgb *= alpha;
            FragColor.a = alpha;
        }
    }

    /* * * * * * * * * * * * * * * * * * * * * * * END OF BORDER */
    float check = 0.0;
    vec2 pixelXYpos = gl_FragCoord.xy;
    // // Create Round Corners (for LEFT-UP corner)
    if(v_Color.a > 0.0)
    if(pixelXpos < v_Wpos.x && pixelYpos > ypos && pixelXpos < left+uRadius+featherWidth && pixelYpos > top-uRadius-featherWidth) 
    {
        pixelDist = length(pixelXYpos - vec2(left+uRadius+featherWidth, top-uRadius-featherWidth));        // Calc the distance of curr pixel pos to the meshe's corner pos
        if(pixelDist > uRadius)                                                                             // Set feathered outer border side
        {
            float alpha = 1.0-(1.0/featherWidth) * (pixelDist-uRadius); 
            FragColor = borderColor;
            FragColor.rgb *= alpha;
            FragColor.a = alpha;
        }
        else if(pixelDist > uRadius-borderWidth) // -borderWidth to have round inner corner
            FragColor = borderColor;
    }
    // Create Round Corners (for RIGTH-UP corner)
    else if( pixelXpos > v_Wpos.x && pixelYpos > ypos && pixelXpos > right-uRadius-featherWidth && pixelYpos > top-uRadius-featherWidth) 
    {
        pixelDist = length(pixelXYpos - vec2(right-uRadius-featherWidth, top-uRadius-featherWidth));        // Calc the distance of curr pixel pos to the meshe's corner pos
        if(pixelDist > uRadius)                                                                             // Set feathered outer border side
        {
            float alpha = 1.0-(1.0/featherWidth) * (pixelDist-uRadius); 
            FragColor = borderColor;
            FragColor.rgb *= alpha;
            FragColor.a = alpha;
        }
        else if(pixelDist > uRadius-borderWidth) // -borderWidth to have round inner corner
            FragColor = borderColor;

    }
    // Create Round Corners (for RIGHT-DOWN corner)
    else if(pixelXpos > v_Wpos.x && pixelYpos < ypos && pixelXpos > right-uRadius-featherWidth && pixelYpos < bottom+uRadius+featherWidth) 
    {
        pixelDist = length(pixelXYpos - vec2(right-uRadius-featherWidth, bottom+uRadius+featherWidth));         // Calc the distance of curr pixel pos to the meshe's corner pos
        if(pixelDist > uRadius)                                                                                 // Set feathered outer border side
        {
            float alpha = 1.0-(1.0/featherWidth) * (pixelDist-uRadius); 
            FragColor = borderColor;
            FragColor.rgb *= alpha;
            FragColor.a = alpha;
        }
        else if(pixelDist > uRadius-borderWidth) // -borderWidth to have round inner corner
            FragColor = borderColor;
    }
    // Create Round Corners (for LEFT-DOWN corner)
    else if(pixelXpos < v_Wpos.x && pixelYpos < ypos && pixelXpos < left+uRadius+featherWidth && pixelYpos < bottom+uRadius+featherWidth) 
    {
        pixelDist = length(pixelXYpos - vec2(left+uRadius+featherWidth, bottom+uRadius+featherWidth));          // Calc the distance of curr pixel pos to the meshe's corner pos
        if(pixelDist > uRadius)                                                                                 // Set feathered outer border side
        {
            float alpha = 1.0-(1.0/featherWidth) * (pixelDist-uRadius); 
            FragColor = borderColor;
            FragColor.rgb *= alpha;
            FragColor.a = alpha;
        }
        else if(pixelDist > uRadius-borderWidth) // -borderWidth to have round inner corner
            FragColor = borderColor;
    }
}
`;

const FS_DEFAULT_TEXTURE_SDF = `#version 300 es
    
precision mediump float;

in mediump vec4 v_Color;
in mediump vec2 v_TexCoord;
in mediump vec2 v_SdfParams;       // [0]:SdfInner, [1]:SdfOuter

uniform sampler2D u_Sampler0;

out vec4 FragColor;

void main(void) {
    
    FragColor = v_Color;
    FragColor = vec4(texture( u_Sampler0, v_TexCoord ).r);
    float inner = v_SdfParams.x;
    float outer = v_SdfParams.y;
        
    float b = max(texture(u_Sampler0, v_TexCoord).r, max(texture(u_Sampler0, v_TexCoord).g, texture(u_Sampler0, v_TexCoord).b));
    float pixelDist = 1. - b;
    float alpha = 1. - smoothstep(inner, inner + outer, pixelDist);
    FragColor = v_Color * vec4(alpha);
    // FragColor = v_Color;
}
`;

const FS_DEFAULT_TEXTURE = `#version 300 es
    
    precision mediump float;

    in mediump vec4 v_Color;
    in mediump vec2 v_TexCoord;

    uniform sampler2D u_Sampler0;
    out vec4 FragColor;

    void main(void) {
        
        FragColor = texture( u_Sampler0, v_TexCoord);
        float alpha = max(texture(u_Sampler0, v_TexCoord).r, max(texture(u_Sampler0, v_TexCoord).g, texture(u_Sampler0, v_TexCoord).b));
        FragColor.a *= alpha;
        FragColor.rgb *= vec3(alpha);
    }
`;

// const FIRE_FS = `#version 300 es

// #define MAX_NUM_PARAMS_BUFFER 9
// precision highp float;

// // procedural noise from IQ
// vec2 hash(vec2 p)
// {
//     p = vec2( dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)) );
//     return -1.0 + 2.0*fract(sin(p)*43758.5453123);
// }

// float noise(in vec2 p)
// {
//     const float K1 = 0.366025404; // (sqrt(3)-1)/2;
//     const float K2 = 0.211324861; // (3-sqrt(3))/6;
    
//     vec2 i = floor( p + (p.x+p.y)*K1 );
//     vec2 a = p - i + (i.x+i.y)*K2;
//     vec2 o = (a.x>a.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);
//     vec2 b = a - o + K2;
//     vec2 c = a - 1.0 + 2.0*K2;
    
//     vec3 h = max( 0.5-vec3(dot(a,a), dot(b,b), dot(c,c) ), 0.0 );
    
//     vec3 n = h*h*h*h*h*vec3( dot(a,hash(i+0.0)), dot(b,hash(i+o)), dot(c,hash(i+1.0)));
//     return dot( n, vec3(100.0) );
// }

// float fbm(vec2 uv)
// {
//     float f; float n = 1.4; float a = 0.1;
//     mat2 m = mat2( n, -n, n,  n );
//     f  = 0.5000 * noise(uv); uv = m*uv; f += 0.2500 * noise(uv); uv = m*uv; f += 0.1250 * noise(uv); uv = m*uv; f += 0.0625 * noise(uv); uv = m*uv; f = 0.55 + 0.5*f; 
//     return f;
// }

// in mediump vec4 v_Color;
// in mediump vec2 v_Dim;
// in mediump vec2 v_Wpos;
// in mediump float v_ParamsFireShader[MAX_NUM_PARAMS_BUFFER];           // [0]:WinWidth, [1]:WinHeight, [3]:Time

// out vec4 FragColor;

// void main(void)
// {
//     float xdir = v_ParamsFireShader[0];
//     float ydir = -v_ParamsFireShader[1];
//     float time = v_ParamsFireShader[2];
//     float amtx = v_ParamsFireShader[5];
//     float amty = v_ParamsFireShader[6];
//     float xdir2 = v_ParamsFireShader[7];
//     float ydir2 = v_ParamsFireShader[8];

    
//     vec2 dim = vec2(700., 800.0);
//     vec2 mpos = vec2(v_ParamsFireShader[3]/dim.x-.5, 1.-(v_ParamsFireShader[4]/dim.y)-.5); 
    
//     vec2 uv = gl_FragCoord.xy / dim;
    
//     vec2 q = uv - vec2(.5, 0.5);
//     q = q - mpos;
//     // vec3 col = v_Color.xyz;
//     // vec3 col = vec3(0.3);
//     vec3 col = vec3(0.);
//     float complexity = 2.;
    
//     float num = 20.0;
//     float r = .1;
    
//     float ratio = amtx/amty;
    
//     q.x += xdir2*amtx*.01;
//     q.y -= ydir2*amty*.01;
//     // q.y *= .2;
    
//     float dirSpeed = 1.;
//     // complexity = (length(uv.x-mpos.x)*15.);
//     complexity = (length(abs(uv.y-mpos.y))*15.);
//     // complexity = 4.;
//     float noise = fbm(complexity * q * vec2(4.5, 4.5) - vec2(xdir*dirSpeed,ydir*dirSpeed));

//     vec2 pos = q;
//     float d = 1.;
//     float c1 = 0.;

//     // down=0.0, up = 3.2, left = -1.6, right = 1.6 
//     float a = 0.;
//     mat2 rot = mat2(cos(a), -sin(a), sin(a), cos(a));
//     pos = pos*rot;

//     for(int i = 0; i < 5; i++)
//     {
//         float shape = fbm(complexity * pos - vec2(xdir*dirSpeed,ydir*dirSpeed));
//         // d = length(pos*shape);
//         d = length(pos)*10.*shape;


//         // c1 = shape*d+1.3;
//         // c1 = shape*d+0.8;
//         c1 = shape*d+1.3;

//         // Color
//         vec3 temp = vec3(1.5*c1, 1.5*c1*c1*c1, pow(c1, 7.)) * .25;
//         // vec3 temp = vec3(1.5*c1, 1.5*c1*c1*c1, c1*c1*c1*c1*c1*c1*c1) * noise* noise;
//         // col += min(col, 1.-smoothstep(r, r+0.9, d*c1*c1*c1*c1*c1*0.1)) * temp ;
//         // col += max(col, 1.-smoothstep(r, r+0.9, d*c1*c1*c1*c1*c1*0.1)) * temp ;
//         // col += max(col, 1.-smoothstep(r, r+0.9, d)) * temp ;
//         // col += max(col, 1.-smoothstep(r, r+0.6, d)) * temp ;
//         col += (col, 1.-smoothstep(r, r+0.3, d)) * temp ;
//         // col = mix(col, vec3(1.-smoothstep(r, r+0.3, d)), 1.);


//         // pos.y -= .08;
//         pos.y -= .04;
//         pos.x *= 1.25;
//         // complexity *= 1.5;
//         // complexity = d*14.;
//         // complexity *= d*1.9;feedback
//     }
    
//     // col *= 2.0 - 8.5 * pow( max( 0., d ), 1.7 );
//     // col *= 2.0 - 8.5 * pow( max( 0., abs(q.x) ),0.7 );
//     col *= 1.7 - pow( max( 0., length(q) ), .1 );
//     col *= noise;
    
    
    
//     // col = col.zyx;                                      // Red flame
//     float alpha = smoothstep(0.0, 1., mix(FragColor.r, FragColor.g, FragColor.r));
//     FragColor = vec4(col, 1.);    
//     // FragColor.a *= alpha;
//     // FragColor = vec4(col, alpha);    
//     // FragColor = vec4((col*col*col), alpha);    
//     FragColor = vec4((col*col*col*col*col), alpha);    

//     // if(ydir2 == 0.)
//     //     FragColor = vec4(1.);    
    
// }
// `;

const FS_EXPLOSION = `#version 300 es
#define WHITE  vec4(1., 1., 1., 1.)
#define MAX_NUM_PARAMS_BUFFER 5

precision mediump float;

in mediump vec4  v_Color;
in mediump vec2  v_Wpos;
in mediump float v_Time;
in mediump float v_Params[MAX_NUM_PARAMS_BUFFER];   

out vec4 FragColor;

void main(void)
{
    float time = v_Time*.7;
    vec2 resolution = vec2(v_Params[0], v_Params[1]);
    vec2 uv = gl_FragCoord.xy/resolution;


    vec2 pos = vec2(v_Wpos.x/resolution.x, 1.-v_Wpos.y/resolution.y);
    float col = 0.0;  
    float t = fract(time);  

    
    float d = 1.-smoothstep(.0, .13, length(vec2((uv.x-pos.x)*.8, uv.y-(pos.y+t*.3))))*1.6-(t*4.);
    vec4 c = v_Color;
    FragColor = vec4(d) + vec4(col*(1.0-t*2.2)) * c;
    
}
`;

const FS_EXPLOSION2 = `#version 300 es
    
#define BLACK vec4(.0,.0,.0,1.)
#define MAX_NUM_PARAMS_BUFFER 1
#define MAX_SPEED 20.
precision highp float;

// procedural noise from IQ
vec2 hash(vec2 p)
{
    p = vec2( dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)) );
    return -1.0 + 2.0*fract(sin(p)*43758.5453123);
}

float noise(in vec2 p)
{
    const float K1 = 0.366025404; // (sqrt(3)-1)/2;
    const float K2 = 0.211324861; // (3-sqrt(3))/6;
    
    vec2 i = floor( p + (p.x+p.y)*K1 );
    vec2 a = p - i + (i.x+i.y)*K2;
    vec2 o = (a.x>a.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);
    vec2 b = a - o + K2;
    vec2 c = a - 1.0 + 2.0*K2;
    
    vec3 h = max( 0.5-vec3(dot(a,a), dot(b,b), dot(c,c) ), 0.0 );
    
    vec3 n = h*h*h*h*h*vec3( dot(a,hash(i+0.0)), dot(b,hash(i+o)), dot(c,hash(i+1.0)));
    return dot( n, vec3(100.0) );
}

float fbm(vec2 uv)
{
    float f; float n = 1.4; float a = 0.1;
    mat2 m = mat2( n, -n, n,  n );
    f  = 0.5000 * noise(uv); uv = m*uv; f += 0.2500 * noise(uv); uv = m*uv; f += 0.1250 * noise(uv); uv = m*uv; f += 0.0625 * noise(uv); uv = m*uv; f = 0.55 + 0.5*f; 
    return f;
}

in mediump vec4  v_Col;
in mediump vec2  v_Wpos;
in mediump float v_Time;
in mediump vec2  v_Dim;
in mediump float v_ParamsParticlesShader[MAX_NUM_PARAMS_BUFFER]; 

out vec4 FragColor;

void main(void)
{
    float time  = v_Time;
    float revT  = 1.-time; // Reverse time to be from 1 to 0
    float speed = v_ParamsParticlesShader[0];
    // speed = min(speed, MAX_SPEED/2.);
    speed = 10.;
    
    vec2 res    = vec2(700., 800.);
    vec2 dim = v_Dim/res;
    float ratio = res.x/res.y;
    res.x /= ratio;
    vec2 uv  = vec2(gl_FragCoord.x / res.x, gl_FragCoord.y / (res.y));
    vec2 pos = vec2(v_Wpos.x/res.x, 1.-(v_Wpos.y/res.y)); 
    
    
    // float d  = 1.- smoothstep(.0, .3, (length(uv-pos)*10.));
    // float d  = 1.- smoothstep(.0, dim.x*10., (length(uv-pos)*10.));
    float d  = 1.- smoothstep(6.*dim.x*revT, 9.3*dim.x*revT, (length(uv-pos)*10.));
    
    float complexity = 10.2;
    // float complexity = 4.2;
    float noise = fbm(complexity * uv * vec2(4.5, 4.5));
    // float shape = fbm(complexity * uv * vec2(2., 2.));
    float shape = fbm(complexity * uv * d);
    
    // d *= min(2.9, speed*.5);
    d *= min(1.0, speed*.5);

    // if(speed*.5>1.4 && complexity < 1.6) complexity *= speed;
    // d *= revT*(MAX_SPEED-speed)*.1;
    // complexity *= length(uv-pos)*10.; 

    float c1 = noise*d+1.;
    // float c1 = shape*d+.5;
    // float c1 = noise;
    // vec3 col = vec3(c1, c1*c1*c1, c1*c1*c1*c1*c1*c1*c1) *.3;
    vec3 col = v_Col.rgb*c1*c1*c1;
    col *= pow(shape, 3.); // Longer tail = smaller float
    
    float r = .3;
    // col += (col, 1.-smoothstep(r, r+.6, d)) * noise;

    FragColor = vec4(col*d*revT , d*1.-c1);    
    // FragColor = vec4(col*revT , 1.-c1);    
    // FragColor = vec4(col , 1.);    
}
`;

const FS_PARTICLES = `#version 300 es

#define BLACK vec4(.0,.0,.0,1.)
#define MAX_NUM_PARAMS_BUFFER 1
#define MAX_SPEED 20.
precision highp float;

// procedural noise from IQ
vec2 hash(vec2 p)
{
    p = vec2( dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)) );
    return -1.0 + 2.0*fract(sin(p)*43758.5453123);
}

float noise(in vec2 p)
{
    const float K1 = 0.366025404; // (sqrt(3)-1)/2;
    const float K2 = 0.211324861; // (3-sqrt(3))/6;
    
    vec2 i = floor( p + (p.x+p.y)*K1 );
    vec2 a = p - i + (i.x+i.y)*K2;
    vec2 o = (a.x>a.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);
    vec2 b = a - o + K2;
    vec2 c = a - 1.0 + 2.0*K2;
    
    vec3 h = max( 0.5-vec3(dot(a,a), dot(b,b), dot(c,c) ), 0.0 );
    
    vec3 n = h*h*h*h*h*vec3( dot(a,hash(i+0.0)), dot(b,hash(i+o)), dot(c,hash(i+1.0)));
    return dot( n, vec3(100.0) );
}

float fbm(vec2 uv)
{
    float f; float n = 1.4; float a = 0.1;
    mat2 m = mat2( n, -n, n,  n );
    f  = 0.5000 * noise(uv); uv = m*uv; f += 0.2500 * noise(uv); uv = m*uv; f += 0.1250 * noise(uv); uv = m*uv; f += 0.0625 * noise(uv); uv = m*uv; f = 0.55 + 0.5*f; 
    return f;
}

in mediump vec4  v_Col;
in mediump vec2  v_Wpos;
in mediump float v_Time;
in mediump vec2  v_Dim;
in mediump float v_ParamsParticlesShader[MAX_NUM_PARAMS_BUFFER]; 

out vec4 FragColor;

void main(void)
{
    float time  = v_Time;
    float revT  = 1.-time; // Reverse time to be from 1 to 0
    float speed = v_ParamsParticlesShader[0];
    speed = min(speed, MAX_SPEED/2.);
    // speed = 10.;
    
    vec2 res    = vec2(700., 800.);
    vec2 dim = v_Dim/res;
    float ratio = res.x/res.y;
    res.x /= ratio;
    vec2 uv  = vec2(gl_FragCoord.x / res.x, gl_FragCoord.y / (res.y));
    vec2 pos = vec2(v_Wpos.x/res.x, 1.-(v_Wpos.y/res.y)); 
    
    float d  = 1.- smoothstep(.0, .3, (length(uv-pos)*10.));
    // float d  = 1.- smoothstep(.0, dim.x*10., (length(uv-pos)*10.));
    // float d  = 1.- smoothstep(9.*dim.x*revT, 9.1*dim.x*revT, (length(uv-pos)*10.));

    d *= min(2.9, speed*.5);


    float complexity = 1.;
    if(speed*.5>1.4 && complexity < 1.6) complexity *= speed;
    d*=revT*(MAX_SPEED-speed)*.1;
    // complexity *= length(uv-pos)*10.; 
    float noise = fbm(complexity * uv * vec2(4.5, 4.5));
    float shape = fbm(complexity * uv * vec2(2., 2.));



    float c1 = shape*d+1.;
    vec3 col = vec3(c1, c1*c1*c1, c1*c1*c1*c1*c1*c1*c1) *.3;
    // vec3 col = v_Col.rgb*c1;
    col *= pow(noise, 3.); // Longer tail = smaller float
    
    FragColor = vec4(col*d*revT , d*1.-c1);    

}
`;

    /* Saves For ball tail

        --------------------------------------------------------------------------------------------------
        vec2 res = vec2(700., 800.);
        float ratio = res.x/res.y;
        res.x /= ratio;
        vec2 uv = vec2(gl_FragCoord.x / res.x, gl_FragCoord.y / (res.y));
        vec2 pos = vec2(v_Wpos.x/res.x, 1.-(v_Wpos.y/res.y)); 
        vec2 q = uv;
        vec2 dim = v_Dim;
        float dirSpeed = 2.;
        float complexity = 4.;
        float noise = fbm(complexity * q * vec2(4.5, 4.5));
        float shape = fbm(complexity * q * vec2(2., 2.));
        float d  = 1.- smoothstep(.0, .32, (length(uv - pos)*10.));
        d *= revT;
        vec3 col = vec3(1.);
        float c1 = shape*d+1.8;
        col = vec3(1.5*c1, 1.5*c1*c1*c1, c1*c1*c1*c1*c1*c1*c1) *.3;
        col *= pow(noise, 4.0);
        FragColor = vec4(col*d*revT , d);    
        FragColor.a *= d*1.-c1; 
        --------------------------------------------------------------------------------------------------
        // Very smooth tail with complexiti * 1.
        void main(void)
        {
            float time = v_Time;
            float revT = 1.-time;
            vec2 res = vec2(700., 800.);
            float ratio = res.x/res.y;
            res.x /= ratio;
            vec2 uv = vec2(gl_FragCoord.x / res.x, gl_FragCoord.y / (res.y));
            vec2 pos = vec2(v_Wpos.x/res.x, 1.-(v_Wpos.y/res.y)); 
            float dirSpeed = 2.;
            float complexity = 2.;
            complexity *= (length(uv-pos)*1.);
            float noise = fbm(complexity * uv * vec2(4.5, 4.5));
            float shape = fbm(complexity * uv * vec2(2., 2.));
            float d  = 1.- smoothstep(.0, .32, (length(uv - pos)*10.));
            d *= revT;
            vec3 col = vec3(1.);
            float c1 = shape*d+1.8;
            col = vec3(1.5*c1, 1.5*c1*c1*c1, c1*c1*c1*c1*c1*c1*c1) *.3;
            col *= pow(noise, 4.0);
            FragColor = vec4(col*d*revT , d);    
            FragColor.a *= d*1.-c1; 
        
        }
        --------------------------------------------------------------------------------------------------
    */

/**
 * Pass @param sid of @type: SID, to get the correct shader
 */
export function FragmentShaderChoose(sid) {

    if (sid & SID.ATTR_TEX2) {
        if (sid & SID.TEXT_SDF && sid & SID.ATTR_SDF_PARAMS) {
            return FS_DEFAULT_TEXTURE_SDF;
        }
        else {
            return FS_DEFAULT_TEXTURE;
        }
    }
    else if (sid & SID.FIRE_FS) {
        return FIRE_FS;
    }
    else if (sid & SID.PARTICLES) {
        return FS_PARTICLES;
    }
    else if(sid & SID.EXPLOSION_FS){
        return FS_EXPLOSION;
    }
    else if(sid & SID.EXPLOSION2_FS){
        return FS_EXPLOSION2;
    }
    else {
        return FS_DEFAULT;
    }
}


/**
 * From GPT-3
 * 
    float randomFloat() {
        return fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233))) * 43758.5453);
    }
 */