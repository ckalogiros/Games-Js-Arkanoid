
// const FIRE_FS = `#version 300 es

// #define pi 3.1415926535897932384626433832795
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

//     vec2 i = floor( p + (p.x+p.y) *K1 );
//     vec2 a = p - i + (i.x + i.y)  *K2;
//     vec2 o = (a.x>a.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);
//     vec2 b = a - o + K2;
//     vec2 c = a - 1.0 + 2.0*K2;

//     vec3 h = max( 0.5-vec3(dot(a,a), dot(b,b), dot(c,c) ), 0.0 );

//     vec3 n = h*h*h*h*h* vec3( dot(a,hash(i+0.0)), dot(b,hash(i+o)), dot(c,hash(i+1.0)));
//     return dot( n, vec3(100.0) );
// }

// float fbm(vec2 uv)
// {
//     float f; float x = 1.9; float y = 1.6;
//     mat2 m = mat2( x, y, y, -x );
//     f  = 0.5000 * noise(uv); uv = m*uv;
//     f += 0.2500 * noise(uv); uv = m*uv;
//     f += 0.1250 * noise(uv); uv = m*uv;
//     f += 0.0625 * noise(uv); uv = m*uv;
//     f = 0.55 + 0.5*f;
//     return f;
// }


// in mediump vec4 v_Color;
// in mediump vec2 v_Pos;
// in mediump vec2 v_Wpos;
// in mediump float v_Params[5];           

// out vec4 FragColor;

// void main()
// {
//     float xdir = v_Params[0];
//     float ydir = v_Params[1];
//     float time = v_Params[2];

//     float dimf = 1.0;
//     vec2 dim = vec2(700. * dimf, 800. * dimf);

//     vec2 uv = gl_FragCoord.xy / dim;
//     uv += vec2(-.5, -.0); // 0 to 1

//     // vec2 mpos = vec2(v_Params[3]/dim.x, 1.-(v_Params[4]/dim.y)-0.5); 
//     vec2 mpos = vec2(v_Params[3]/dim.x-.5, 1.-(v_Params[4]/dim.y)); 
//     // mpos = abs(mpos);

//     vec2 q = uv * vec2(2.,2.);

//     float f = 45.5;
//     float sf = sin(f);
//     float cf = cos(f);

//     float s = 2.;
//     // float noiz = fbm(q*3.2 - vec2(xdir*s,ydir*s));
//     float noiz = fbm(q*3.2);

//     float shape = fbm(q*4.2-vec2(mpos.x*ydir, mpos.y*ydir));

//     float size = .3;  // Better to make short but also in large numbers changes the width
//     float ratio = 1./max(xdir,ydir)/min(xdir,ydir);
//     q *= mat2(cf*mpos.x, sf, -sf, cf*mpos.x);


//     float z = 1.-smoothstep(.05, 0.22,length(q-vec2(mpos.x*2., mpos.y*2.)));
//     // float v = 1.-smoothstep(.2, 0.4, length(z-vec2(shape)));
//     // float v = 1.-smoothstep(.2, 0.4, length(q*vec2(1.8+q.y*0.5, z) - mpos*z));
//     // float v = 1.-length(q*vec2(z, 0.2*mpos.x));


//         float c = 1. - 16. * pow( 
//                 // max( 0., length(q*vec2(1.8+uv.y*1.5,.75) ) - noiz * max( 0., q.y+size ) ), 1.0 
//                 // max( 0., length(q*vec2(width+uv.y*0.1,.1) ) - noiz * max( 0., q.y+size ) ), 1.0 
//                 max( 0., length(q*vec2(1.8+uv.y*1.5, .75) ) - max( 0., q.x+size ) ), 2.0 
//                 // max( 0., length(vec2(uv.x,q.y)) ) - max( 0.,1.) , 1.0 
//             );
//     // float c = z;


//     float flameIntensity = 1.4;                         // Intensify all (very strong)
//     float flameIntensity2 = 1.3;                        // Greater contrast
//     float flameIntensFalloff = 1.0;                     // Reversed. Makes flame taller/shorter
//     // float c1 = noiz * c * (flameIntensity-pow(flameIntensFalloff*uv.y, flameIntensity2));
//     float c1 = c;

//     c1=clamp(c1,0.,1.);

//     vec3 col = vec3(1.5*c1, 1.5*c1*c1*c1, c1*c1*c1*c1*c1*c1);

//     float a = 1.-c;
//     col = col.zyx;                                      // BLUE_FLAME
//     // FragColor = vec4(mix(vec3(0.),col*noiz, 1.-a), 1.);
//     // FragColor = vec4(mix(vec3(0.),col, 1.-a), 1.);
//     FragColor = vec4(vec3(noiz*col), 1.);
//     // FragColor = vec4(vec3(v), z);


//     float alpha = smoothstep(0.0, 0.15, mix(FragColor.r, FragColor.g, FragColor.r));
//     // FragColor.a *= alpha;
// }
// `;


// const FIRE_FS = `#version 300 es

//     precision highp float;

//     // procedural noise from IQ
//     vec2 hash(vec2 p)
//     {
//         p = vec2( dot(p,vec2(127.1,311.7)),
//                  dot(p,vec2(269.5,183.3)) );
//         return -1.0 + 2.0*fract((p)*43758.5453123);
//     }

//     float noise(in vec2 p)
//     {
//         const float K1 = 0.366025404; // (sqrt(3)-1)/2;
//         const float K2 = 0.211324861; // (3-sqrt(3))/6;

//         vec2 i = floor( p + (p.x+p.y)*K1 );
//         vec2 a = p - i + (i.x+i.y)*K2;
//         vec2 o = (a.x>a.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);
//         vec2 b = a - o + K2;
//         vec2 c = a - 1.0 + 2.0*K2;

//         // vec3 h = max( 0.5-vec3(dot(a,a), dot(b,b), dot(c,c) ), 0.0 );
//         vec3 h = max( 0.5-vec3(dot(a,a), dot(a,a), dot(a,a) ), 0.0 );

//         // vec3 n = h*h*h*h*h*vec3( dot(a,hash(i)), dot(b,hash(i)), dot(c,hash(i)));
//         vec3 n = h*h*h*h*h*vec3( dot(a,hash(i)), dot(a,hash(i)), dot(a,hash(i)));
//         // mat2 rot = mat2(cos(p.x), sin(p.y), -sin(p.x), cos(p.y));
//         // n.xy = rot*n.xy;
//         return dot( n, vec3(70.0) );
//     }

//     float fbm(vec2 uv)
//     {
//         float f;
//         float r = 1.2;
//         mat2 m = mat2( r,  r, -r,  r );
//         // mat2 m = mat2( 1.6,  -1.2, 1.4,  1.6 );
//         f  = 0.5000 * noise(uv); uv = m*uv;
//         f += 0.2500 * noise(uv); uv = m*uv;
//         f += 0.1250 * noise(uv); uv = m*uv;
//         f += 0.0625 * noise(uv); uv = m*uv;
//         f = 0.5 + 0.5*f;
//         return f;
//     }


//     in mediump vec4 v_Color;
//     in mediump vec2 v_Pos;
//     in mediump vec2 v_Wpos;
//     in mediump float v_Params[5];         

//     out vec4 FragColor;

//     void main()
//     {
//         float xdir   = v_Params[0];
//         float ydir   = v_Params[1];
//         float iTime  = v_Params[2];
//         float ypos   = 700. - v_Pos.y;             // Transform y coord from top=0 to top=windowHeight
//         float left   = (v_Pos.x - v_Wpos.x);                 // Left side of current geometry
//         float right  = (v_Pos.x + v_Wpos.x);
//         float top    = ypos + v_Wpos.y;
//         float bottom = ypos - v_Wpos.y;

//         float dimf = 1.1;
//         vec2 dim = vec2(700. * dimf, 800. * dimf);
//         vec2 localDim = vec2(v_Pos.x-v_Wpos.x*dimf, v_Pos.y+v_Wpos.y*dimf);

//         vec2 uv = gl_FragCoord.xy / dim;
//         vec2 q = uv;

//         q.y *= 2.;
//         float strength = floor(q.x+1.);
//         float T3 = max(3.,1.25*strength)*iTime;

//         q.x = mod(q.x, 1.)-0.5;
//         q.y -= 0.3;    

//         float noiz = fbm(strength*q - vec2(T3,T3));


//         float size = 0.35;  // Better to make short but also in large numbers changes the width
//         float c = 1. - 16. * pow( 
//                     // max( 0., length(q*vec2(1.8+uv.y*1.5,.75) ) - noiz * max( 0., q.y+size ) ), 1.0 
//                     max( 0., length(q*vec2(1.8+uv.y*1.5,.75) ) - max( 0., q.y+size ) ), 1.0 
//                 );

//         float flameIntensity = 1.4;                         // Intensify all (very strong)
//         float flameIntensity2 = 1.3;                        // Greater contrast
//         float flameIntensFalloff = 1.0;                     // Reversed. Makes flame taller/shorter
//         float c1 = noiz * c * (flameIntensity-pow(flameIntensFalloff*uv.y, flameIntensity2));

//         c1=clamp(c1,0.,1.);

//         vec3 col = vec3(1.5*c1, 1.5*c1*c1*c1, c1*c1*c1*c1*c1*c1);

//         float a = c * (1.-pow(uv.y, 3.));
//         col = col.zyx;                                      // BLUE_FLAME
//         FragColor = vec4(mix(vec3(0.),col, a), 1.);

//         float alpha = smoothstep(0.0, 0.3, mix(FragColor.r, FragColor.g, FragColor.r));
//         FragColor.a *= alpha;
//     }
// `;

// prev
// const FIRE_FS = `#version 300 es

//     precision highp float;

//     // procedural noise from IQ
//     vec2 hash(vec2 p)
//     {
//         p = vec2( dot(p,vec2(127.1,311.7)),
//                  dot(p,vec2(269.5,183.3)) );
//         return -1.0 + 2.0*fract(sin(p)*43758.5453123);
//     }

//     float noise(in vec2 p)
//     {
//         const float K1 = 0.366025404; // (sqrt(3)-1)/2;
//         const float K2 = 0.211324861; // (3-sqrt(3))/6;

//         vec2 i = floor( p + (p.x+p.y)*K1 );
//         vec2 a = p - i + (i.x+i.y)*K2;
//         vec2 o = (a.x>a.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);
//         vec2 b = a - o + K2;
//         vec2 c = a - 1.0 + 2.0*K2;

//         vec3 h = max( 0.5-vec3(dot(a,a), dot(b,b), dot(c,c) ), 0.0 );

//         vec3 n = h*h*h*h*h*vec3( dot(a,hash(i+0.0)), dot(b,hash(i+o)), dot(c,hash(i+1.0)));
//         // mat2 rot = mat2(cos(p.x), sin(p.y), -sin(p.x), cos(p.y));
//         // n.xy = rot*n.xy;
//         return dot( n, vec3(100.0) );
//     }

//     float fbm(vec2 uv)
//     {
//         float f;
//         mat2 m = mat2( 1.6,  1.2, -1.4,  1.6 );
//         // mat2 m = mat2( 1.6,  -1.2, 1.4,  1.6 );
//         // mat2 m = mat2( 1.0,  1.2, -1.2,  1.0 );
//         float a = 0.1;
//         f  = 0.5000 * noise(uv); uv = m*uv;
//         f += 0.2500 * noise(uv); uv = m*uv;
//         f += 0.1250 * noise(uv); uv = m*uv;
//         f += 0.0625 * noise(uv); uv = m*uv;
//         f = 0.55 + 0.5*f;
//         return f;
//     }


//     in mediump vec4 v_Color;
//     in mediump vec2 v_Pos;
//     in mediump vec2 v_Wpos;
//     in mediump float v_Params[7];           // [0]:WinWidth, [1]:WinHeight, [3]:Time

//     out vec4 FragColor;

//     void main()
//     {
//         float xdir = v_Params[0];
//         float ydir = v_Params[1];
//         float time = v_Params[2];
//         // vec2 mpos = vec2(v_Params[3], v_Params[4]);
//         float xvecdiff = v_Params[5];
//         float yvecdiff = v_Params[6];

//         float dimf = 1.0;
//         vec2 dim = vec2(200.*dimf, 200.0*dimf);
//         // vec2 mpos = vec2(v_Params[3]/dim.x, 1.-(v_Params[4]/dim.y)-0.5); 
//         // vec2 mpos = vec2(v_Params[3]/dim.x+.5, 1.-(v_Params[4]/dim.y)); 
//         vec2 mpos = vec2(v_Params[3]/dim.x, 1.-(v_Params[4]/dim.y)); 
//         vec2 uv = gl_FragCoord.xy / dim;
//         vec2 q = uv;

//         // float noise = fbm(3.*q-mpos - vec2(xdir*0.2,ydir*0.2*time));
//         float complexity = 3.;
//         float noise = fbm(complexity * q-mpos);
//         // float noise = fbm(vec2(xdir*0.2,ydir*0.2));
//         // float noise = fbm(strength*q - vec2(xdir,ydir*time));
//         // float noise = fbm(strength*q - vec2(mpos.x,mpos.y*time));
//         // float noise = fbm(q - vec2(0,time));

//         // float angle = tan(length(ydir / xdir));
//         // float angle = atan(ydir / xdir);
//         // float sf = sin(angle);
//         // float cf = cos(angle);
//         // // vec2 w = q*mat2(cf, sf, -sf, cf);
//         // q*=mat2(cf, sf, -sf, cf);

//         float size = 0.35;  // Better to make short but also in large numbers changes the width
//         // float c = 1. - 16. *  pow( max( 0., length(q*vec2(1.8+uv.y*1.5,.75) ) - noise * max( 0., q.y+size ) ), 1.0 ) ;
//         // float c = 1. - 16. *  pow( max( 0., length(q*vec2(2.8+uv.y*1.5,.35) -mpos ) -noise * 0.4), 1.0 ) ;
//         // float c = 1. - 16. *  pow( max( 0., length(q*vec2(1.,.55) -mpos ) -noise * 0.4), 1.0 ) ;
//         float c = 1. - 8. *  pow( max( 0., length(q*vec2(1.,.55) -mpos ) -noise * 0.2), 0.8 ) ;

//         float flameIntensity = 1.4; float flameIntensity2 = 1.8; float flameIntensFalloff = 0.5;
//         float c1 = noise * c * (flameIntensity-pow(flameIntensFalloff, flameIntensity2));
//         // float c1 = noise * c;
//         c1=clamp(c1,0.,1.);

//         vec3 col = vec3(1.5*c1, 1.5*c1*c1*c1, c1*c1*c1*c1*c1*c1);

//         col = col.zyx;              // BLUE_FLAME
//         // float a = c * (1.-pow(uv.y, 3.));
//         float a = c * (1.-pow(length(q-mpos), 5.));
//         FragColor = vec4(mix(vec3(0.),col, a), 1.);

//         float alpha = 1.0;
//         alpha *= smoothstep(0.0, 0.3, mix(FragColor.r, FragColor.g, FragColor.r));
//         // alpha *= smoothstep(0.0, 0.1, mix(FragColor.r, FragColor.g, FragColor.r));
//         // alpha *= smoothstep(0.0, 0.02, mix(FragColor.r, FragColor.g, FragColor.r));
//         // FragColor.a *= alpha;
//     }
// `;

// prev
// const FIRE_FS = `#version 300 es
        
//         precision highp float;
    
//         // procedural noise from IQ
//         vec2 hash(vec2 p)
//         {
//             p = vec2( dot(p,vec2(127.1,311.7)),
//                      dot(p,vec2(269.5,183.3)) );
//             return -1.0 + 2.0*fract(sin(p)*43758.5453123);
//         }
        
//         float noise(in vec2 p)
//         {
//             const float K1 = 0.366025404; // (sqrt(3)-1)/2;
//             const float K2 = 0.211324861; // (3-sqrt(3))/6;
            
//             vec2 i = floor( p + (p.x+p.y)*K1 );
//             vec2 a = p - i + (i.x+i.y)*K2;
//             vec2 o = (a.x>a.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);
//             vec2 b = a - o + K2;
//             vec2 c = a - 1.0 + 2.0*K2;
            
//             vec3 h = max( 0.5-vec3(dot(a,a), dot(b,b), dot(c,c) ), 0.0 );
            
//             vec3 n = h*h*h*h*h*vec3( dot(a,hash(i+0.0)), dot(b,hash(i+o)), dot(c,hash(i+1.0)));
//             // mat2 rot = mat2(cos(p.x), sin(p.y), -sin(p.x), cos(p.y));
//             // n.xy = rot*n.xy;
//             return dot( n, vec3(100.0) );
//         }
        
//         float fbm(vec2 uv)
//         {
//             float f;
//             mat2 m = mat2( 1.6,  1.2, -1.4,  1.6 );
//             // mat2 m = mat2( 1.6,  -1.2, 1.4,  1.6 );
//             // mat2 m = mat2( 1.0,  1.2, -1.2,  1.0 );
//             float a = 0.1;
//             f  = 0.5000 * noise(uv); uv = m*uv;
//             f += 0.2500 * noise(uv); uv = m*uv;
//             f += 0.1250 * noise(uv); uv = m*uv;
//             f += 0.0625 * noise(uv); uv = m*uv;
//             f = 0.55 + 0.5*f;
//             return f;
//         }
        
    
//         in mediump vec4 v_Color;
//         in mediump vec2 v_Pos;
//         in mediump vec2 v_Wpos;
//         in mediump float v_Params[7];           // [0]:WinWidth, [1]:WinHeight, [3]:Time
    
//         out vec4 FragColor;
    
//         void main()
//         {
//             float xdir = v_Params[0];
//             float ydir = v_Params[1];
//             float time = v_Params[2];
//             // vec2 mpos = vec2(v_Params[3], v_Params[4]);
//             float xvecdiff = v_Params[5];
//             float yvecdiff = v_Params[6];
            
//             float dimf = 1.0;
//             vec2 dim = vec2(200.*dimf, 200.0*dimf);
//             vec2 mpos = vec2(v_Params[3]/dim.x, 1.-(v_Params[4]/dim.y)+3.); 
//             vec2 uv = gl_FragCoord.xy / dim;
//             vec2 q = uv;

//             float complexity = 2.;
//             float noise = fbm(complexity*q-mpos - vec2(xdir,ydir*-time));
//             // float noise = fbm(complexity * q-mpos);
//             float shape = fbm(abs(complexity*q-mpos)- vec2(xdir,ydir*-time));
            
            
//             // float c = length(q*vec2(1.,1.) - mpos*vec2(1., 1.) ) -noise * sin(time);
//             // float c = 1.05 - 5.9 * abs(q.x- (shape*mpos.x+shape)) *  
//             // float c = 1.05 - 2.9 * abs(q.x- (mpos.x*(shape+shape))) *  
//             float c = 1.05 - 3.9 * abs(q.x- (mpos.x)) *  
//             pow( max( 0., (length(q*vec2(1.,1.) - mpos*vec2(1., 1.3) ) -noise * 0.4)), 0.4 ) ;
            
//             // float d = q.y - abs(q.x) * (20.-abs(q.x))/100.;
//             // float d = length( abs(q.y-mpos.y) - abs(q.x));
//             // float c = d;// * pow( max( 0., (d -noise * 0.4)), 0.4 ) ;
//             // float c = 1. -d;// * pow( max( 0., (d -noise * 0.4)), 0.4 ) ;
//             // float c = 1. - abs(q.x - (mpos.x)); // * pow( max( 0., (d -noise * 0.4)), 0.4 ) ;
//             // float c = 1.05 - 3.9 * abs(q.x- (mpos.x)); // * pow( max( 0., (d -noise * 0.4)), 0.4 ) ;
            
//             // float c = 2.0 - 2. *  pow( max( 0., length(q -mpos) ), 0.8 ) ;
//             // c = mix(0.2, c, noise);
//             // float c = 1.05 - 16. *  pow( max( 0., length(q*vec2(1.,1.) -mpos*vec2(1., 1.) ) -noise * 0.2), 0.8 ) ;
//             float s = 1.05 - 16. *  pow( max( 0., length(q*vec2(1.,1.) -mpos*vec2(1., 1.) ) -noise * 0.4), 0.4 ) ;
//             // c = s;
//             // c = min(c, s);

//             float flameIntensity = 1.4; float flameIntensity2 = 1.8; float flameIntensFalloff = 0.5;
//             float c1 = noise * c * (flameIntensity-pow(flameIntensFalloff, flameIntensity2));
//             // float c1 = noise * c;
//             c1=clamp(c1,0.,1.);
            
//             vec3 col = vec3(1.5*c1, 1.5*c1*c1*c1, c1*c1*c1*c1*c1*c1);
            
//             col = col.zyx;              // BLUE_FLAME
//             // float a = c * (1.-pow(uv.y, 3.));
//             float a = c * (1.-pow(length(q-mpos), 5.));
//             FragColor = vec4(mix(vec3(0.),col, a), 1.);
    
//             float alpha = 1.0;
//             alpha *= smoothstep(0.0, 0.3, mix(FragColor.r, FragColor.g, FragColor.r));
//             // alpha *= smoothstep(0.0, 0.1, mix(FragColor.r, FragColor.g, FragColor.r));
//             // alpha *= smoothstep(0.0, 0.02, mix(FragColor.r, FragColor.g, FragColor.r));
//             // FragColor.a *= alpha;
            
//         }
//     `;
// const FIRE_FS = `#version 300 es
        
//         precision highp float;
    
//         // procedural noise from IQ
//         vec2 hash(vec2 p)
//         {
//             p = vec2( dot(p,vec2(127.1,311.7)),
//                      dot(p,vec2(269.5,183.3)) );
//             return -1.0 + 2.0*fract(sin(p)*43758.5453123);
//         }
        
//         float noise(in vec2 p)
//         {
//             const float K1 = 0.366025404; // (sqrt(3)-1)/2;
//             const float K2 = 0.211324861; // (3-sqrt(3))/6;
            
//             vec2 i = floor( p + (p.x+p.y)*K1 );
//             vec2 a = p - i + (i.x+i.y)*K2;
//             vec2 o = (a.x>a.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);
//             vec2 b = a - o + K2;
//             vec2 c = a - 1.0 + 2.0*K2;
            
//             vec3 h = max( 0.5-vec3(dot(a,a), dot(b,b), dot(c,c) ), 0.0 );
            
//             vec3 n = h*h*h*h*h*vec3( dot(a,hash(i+0.0)), dot(b,hash(i+o)), dot(c,hash(i+1.0)));
//             // mat2 rot = mat2(cos(p.x), sin(p.y), -sin(p.x), cos(p.y));
//             // n.xy = rot*n.xy;
//             return dot( n, vec3(100.0) );
//         }
        
//         float fbm(vec2 uv)
//         {
//             float f;
//             float n = 1.4;
//             mat2 m = mat2( n, -n, n,  n );
//             // mat2 m = mat2( 1.6,  -1.2, 1.4,  1.6 );
//             // mat2 m = mat2( 1.0,  1.2, -1.2,  1.0 );
//             float a = 0.1;
//             f  = 0.5000 * noise(uv); uv = m*uv;
//             f += 0.2500 * noise(uv); uv = m*uv;
//             f += 0.1250 * noise(uv); uv = m*uv;
//             f += 0.0625 * noise(uv); uv = m*uv;
//             f = 0.55 + 0.5*f;
//             return f;
//         }
        
    
//         in mediump vec4 v_Color;
//         in mediump vec2 v_Pos;
//         in mediump vec2 v_Wpos;
//         in mediump float v_Params[7];           // [0]:WinWidth, [1]:WinHeight, [3]:Time
    
//         out vec4 FragColor;
    
//         void main()
//         {
//             float xdir = v_Params[0];
//             float ydir = v_Params[1];
//             float time = v_Params[2];
//             float xvecdiff = v_Params[5];
//             float yvecdiff = v_Params[6];
            
//             vec2 dim = vec2(700., 700.0);
//             vec2 mpos = vec2(v_Params[3]/dim.x-.5, 1.-(v_Params[4]/dim.y)-.5); 
//             // vec2 mpos = vec2(0.); 
            
//             vec2 uv = gl_FragCoord.xy / dim;
            
//             vec2 q = uv - vec2(.5, 0.5);
//             q = q - mpos;

//             vec3 col = v_Color.xyz;

//             // float complexity = q.y*12.;
//             float complexity = 2.;
//             float noise = fbm(complexity * q * vec2(1., 0.6) - vec2(0.,time*2.));;
            
//             float num = 5.0;
//             float s = 0.01 * cos(atan(q.y/q.x)* num);
//             float r = .2;
            
//             float ld = (length(uv.y-mpos.y)*15.);
//             complexity = ld;
//             vec2 g = vec2(0.5);
//             // if(uv.y < q.y) g = q;
//             float shape = fbm(complexity * q * vec2(1., 0.6) - vec2(0.,time*2.)) * 3.3;
//             float speed = 1.2; // Reversed. Greater = less tail 
//             float d = length(q*shape*vec2(3.4-q.y*4., .45*speed));
//             // float d = pow(max(0.01, length(q*shape*vec2(2.4-q.y*2., .75*speed))),1.);
           
//             float c1 = shape*d+1.3;
//             col = vec3(1.5*c1, 1.5*c1*c1*c1, c1*c1*c1*c1*c1*c1) * 0.3;
            
//             // Color
//             // col += smoothstep(r, r+0.08, d);
//             col += smoothstep(r, r+0.01, d);
//             col *= 2.0 - 4.5 * pow( max( 0., d ), .7 );
//             col *= noise;
            
            
            
            
//             // col = col.zyx;                                      // Red flame
//             // float a = d * (pow(uv.y, 1.));
//             // FragColor = vec4(mix(vec3(0.),col, noise), 1.);   
            
//             float alpha = smoothstep(0.0, 1., mix(FragColor.r, FragColor.g, FragColor.r));
//             // FragColor.a *= alpha;
//             FragColor = vec4(col, 1.);    
//             // FragColor = vec4(col, alpha);    
//             // FragColor = vec4((col*col*col), alpha);    
            
//         }
//     `;




///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// const FIRE_FS = `#version 300 es

//     precision highp float;

//     // procedural noise from IQ
//     vec2 hash( vec2 p )
//     {
//         p = vec2( dot(p,vec2(127.1,311.7)),
//                  dot(p,vec2(269.5,183.3)) );
//         return -1.0 + 2.0*fract(sin(p)*43758.5453123);
//     }

//     float noise( in vec2 p )
//     {
//         const float K1 = 0.366025404; // (sqrt(3)-1)/2;
//         const float K2 = 0.211324865; // (3-sqrt(3))/6;

//         vec2 i = floor( p + (p.x+p.y)*K1 );

//         vec2 a = p - i + (i.x+i.y)*K2;
//         vec2 o = (a.x>a.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);
//         vec2 b = a - o + K2;
//         vec2 c = a - 1.0 + 2.0*K2;

//         vec3 h = max( 0.5-vec3(dot(a,a), dot(b,b), dot(c,c) ), 0.0 );

//         vec3 n = h*h*h*h*vec3( dot(a,hash(i+0.0)), dot(b,hash(i+o)), dot(c,hash(i+1.0)));

//         return dot( n, vec3(70.0) );
//     }

//     float fbm(vec2 uv)
//     {
//         float f;
//         mat2 m = mat2( 1.6,  1.2, -1.2,  1.6 );
//         f  = 0.5000*noise( uv ); uv = m*uv;
//         f += 0.2500*noise( uv ); uv = m*uv;
//         f += 0.1250*noise( uv ); uv = m*uv;
//         f += 0.0625*noise( uv ); uv = m*uv;
//         f = 0.5 + 0.5*f;
//         return f;
//     }


//     in mediump vec4 v_Color;
//     in mediump vec2 v_Pos;
//     in mediump vec2 v_Wpos;
//     in highp vec3 v_Params;           // [0]:WinWidth, [1]:WinHeight, [3]:Time

//     out vec4 FragColor;

//     void main()
//     {
//         vec2 iResolution = vec2(700, 800);
//         // float iTime = 1.0;
//         // vec2 iResolution = vec2(v_Params.x, v_Params.y);
//         float iTime = v_Params.x;

//         float ypos   = iResolution.y - v_Pos.y;             // Transform y coord from top=0 to top=windowHeight
//         float left   = (v_Pos.x - v_Wpos.x);                 // Left side of current geometry
//         float right  = (v_Pos.x + v_Wpos.x);
//         float top    = ypos + v_Wpos.y;
//         float bottom = ypos - v_Wpos.y;

//         float dimf = 1.0;
//         vec2 dim = vec2(700.*0.2*dimf, 800.0*0.4*dimf);
//         vec2 uv = gl_FragCoord.xy / dim;
//         // uv.y -= 0.2;                                        // Move in y axis
//         uv.y -= 0.3/dimf;                                        // Move in y axis
//         vec2 q = uv;
//         q.y *= 2.;
//         float strength = floor(q.x+1.);
//         float T3 = max(3.,1.25*strength)*iTime;
//         q.x = mod(q.x, 1.)-0.5;
//         q.x -/= 0.5;
//         q.y -= 0.25;                                        // Moves in y axis but also used for intensity
//         float noise = fbm(strength*q - vec2(0,T3));
//         float size = 0.35;  // Better to make short but also in large numbers changes the width
//         float c = 1. - 16. * pow( max( 0., length(q*vec2(1.8+uv.y*1.5,.75) ) - noise * max( 0., q.y+size ) ), 1.0 );
//         // float c1 = noise * c * (1.4-pow(1.25*uv.y,4.));
//         // float c1 = noise * c * (1.5-pow(2.50*uv.y,4.));
//         float flameIntensity = 1.4;                         // Intensify all (very strong)
//         float flameIntensity2 = 1.3;                        // Greater contrast
//         float flameIntensFalloff = 1.0;                     // Reversed. Makes flame taller/shorter
//         float c1 = noise * c * (flameIntensity-pow(flameIntensFalloff*uv.y, flameIntensity2));
//         c1=clamp(c1,0.,1.);

//         vec3 col = vec3(1.5*c1, 1.5*c1*c1*c1, c1*c1*c1*c1*c1*c1);

//         col = col.zyx;              // BLUE_FLAME
//         // col = 0.85*col.yxz;      // GREEN_FLAME
//         float a = c * (1.-pow(uv.y, 3.));
//         FragColor = vec4(mix(vec3(0.),col, a), 1.);

//         float alpha = 1.0;
//         alpha *= smoothstep(0.0, 0.3, mix(FragColor.r, FragColor.g, FragColor.r));
//         // alpha *= smoothstep(0.0, 0.1, mix(FragColor.r, FragColor.g, FragColor.r));
//         // alpha *= smoothstep(0.0, 0.02, mix(FragColor.r, FragColor.g, FragColor.r));
//         // FragColor.a *= alpha;
//     }
// `;

{ // Thunder Like
    //     const FIRE_FS = `#version 300 es

    //     precision highp float;

    //     // procedural noise from IQ
    //     vec2 hash(vec2 p)
    //     {
    //         p = vec2( dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)) );
    //         return -1.0 + 2.0*fract(sin(p)*43758.5453123);
    //     }

    //     float noise(in vec2 p)
    //     {
    //         const float K1 = 0.366025404; // (sqrt(3)-1)/2;
    //         const float K2 = 0.211324861; // (3-sqrt(3))/6;

    //         vec2 i = floor( p + (p.x+p.y) *K1 );
    //         vec2 a = p - i + (i.x + i.y)  *K2;
    //         vec2 o = (a.x>a.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);
    //         // vec2 o = (a.x>0) ? vec2(1.0,0.0) : vec2(0.0,1.0);
    //         vec2 b = a - o + K2;
    //         vec2 c = a - 1.0 + 2.0*K2;

    //         vec3 h = max( 0.5-vec3(dot(a,a), dot(b,b), dot(c,c) ), 0.0 );

    //         vec3 n = h*h*h*h*h* vec3( dot(a,hash(i+0.0)), dot(b,hash(i+o)), dot(c,hash(i+1.0)));
    //         return dot( n, vec3(100.0) );
    //     }

    //     float fbm(vec2 uv)
    //     {
    //         // mat2 m = mat2( 1.8,  -1.8, 1.8,  1.8 );
    //         // mat2 m = mat2( 2.1,  2.1, -2.1,  2.1 );
    //         // mat2 m = mat2( 3.1,  3.1, -3.1,  3.1 );

    //         float x = 1.9;
    //         float y = 1.6;
    //         mat2 m = mat2( x, y, y, -x );
    //         float f;
    //         f  = 0.5000 * noise(uv); uv = m*uv;
    //         f += 0.2500 * noise(uv); uv = m*uv;
    //         f += 0.1250 * noise(uv); uv = m*uv;
    //         f += 0.0625 * noise(uv); uv = m*uv;
    //         // f += 0.03125 * noise(uv); uv = m*uv;
    //         // f += 0.015625 * noise(uv); uv = m*uv;
    //         f = 0.55 + 0.5*f;
    //         return f;
    //     }


    //     in mediump vec4 v_Color;
    //     in mediump vec2 v_Pos;
    //     in mediump vec2 v_Wpos;
    //     // in highp vec3 v_Params;           
    //     in mediump float v_Params[5];           

    //     out vec4 FragColor;

    //     void main()
    //     {
    //         float xdir = v_Params[0];
    //         float ydir = v_Params[1];
    //         float time = v_Params[2];
    //         vec2 mpos = vec2(v_Params[3], v_Params[4]); // Mouse x pos
    //         float ypos   = 800. - v_Pos.y;             // Transform y coord from top=0 to top=windowHeight
    //         float left   = (v_Pos.x - v_Wpos.x);                 // Left side of current geometry
    //         float right  = (v_Pos.x + v_Wpos.x);
    //         float top    = ypos + v_Wpos.y;
    //         float bottom = ypos - v_Wpos.y;

    //         // vec2 localDim = abs(v_Pos);// * vec2(2.);
    //         // vec2 localDim = vec2((v_Wpos.x-v_Pos.x), (v_Wpos.y-v_Pos.y));
    //         // vec2 localDim = vec2((v_Pos.x-v_Wpos.x), (v_Pos.y+v_Wpos.y));
    //         // vec2 localDim = vec2((right-left), (top-bottom));

    //         float dimf = 1.0;
    //         vec2 dim = vec2(700. * dimf, 800. * dimf);
    //         // vec2 dim = vec2(v_Pos.x-v_Wpos.x*dimf, v_Pos.y+v_Wpos.y*dimf);

    //         vec2 uv = gl_FragCoord.xy / dim;
    //         uv += vec2(-.5, .0); // center
    //         mpos = vec2(mpos.x/dim.x, 1.-(mpos.y/dim.y)); // +vec2(.5);
    //         vec2 q = uv * vec2(2.,2.);

    //         mpos = abs(mpos);

    //         // float strength = floor(q.x+1.);
    //         float strength = 12.;
    //         // float s = max(3.,1.25*strength);
    //         float s = strength;


    //         // float noiz = fbm(strength*q - vec2(xdir*.2,ydir*.2));
    //         float noiz = fbm(q*3.2 - vec2(xdir*s*.2,ydir*s));
    //         // float noiz = fbm(q - vec2(s,s));
    //         // noiz = noiz*noiz;
    //         noiz *= 1.8;

    //         float shape = fbm(q*3.2-vec2(0., time));

    //         float size = .3;  // Better to make short but also in large numbers changes the width
    //         float ratio = 1./max(xdir,ydir)/min(xdir,ydir);
    //         float y = 1. - 4. *  pow( max( 
    //                 0., length(q*vec2(2.8-shape, 1.1 - shape) ) - noiz* max( 0.27, q.y+size+(q.x) ) 
    //                 // 0., length(q*vec2(2.8, 1.1) ) - noiz* max( 0.27, q.y+size+(q.x) ) 
    //                 ), 1.0 );

    //         mpos.y *= y;
    //         // float x = smoothstep(.1, 0.15,length(uv-vec2(mpos.x, mpos.y))) - shape * max( 0.27, q.x+size-(q.y*sin(time)));
    //         float z = 1.-smoothstep(.1, 0.55,length(uv-vec2(mpos.x, mpos.y)));
    //         // float z = 1.-smoothstep(.1, 0.15,length(uv-vec2(mpos.x, mpos.y*y)));
    //         float c = z;
    //         // float c = z*x;


    //         float flameIntensity = 1.4;                         // Intensify all (very strong)
    //         float flameIntensity2 = 1.3;                        // Greater contrast
    //         float flameIntensFalloff = 1.0;                     // Reversed. Makes flame taller/shorter
    //         // float c1 = noiz * c * (flameIntensity-pow(flameIntensFalloff*uv.y, flameIntensity2));
    //         float c1 = c;
    //         // float c1 = noiz;

    //         c1=clamp(c1,0.,1.);

    //         vec3 col = vec3(1.5*c1, 1.5*c1*c1*c1, c1*c1*c1*c1*c1*c1);

    //         // float a = c * (1.-pow(uv.y, 3.));
    //         // float a = c * (pow(uv.y, 3.));
    //         float a = 1.-c;
    //         col = col.zyx;                                      // BLUE_FLAME
    //         // FragColor = vec4(mix(vec3(0.),col*noiz, 1.-a), 1.);
    //         // FragColor = vec4(mix(vec3(0.),col, 1.-a), 1.);
    //         FragColor = vec4(vec3(noiz*col), 1.);
    //         // FragColor = vec4(vec3(noiz), a);


    //         float alpha = smoothstep(0.0, 0.15, mix(FragColor.r, FragColor.g, FragColor.r));
    //         FragColor.a *= alpha;
    //     }
    // `;
}
//Save 3
//     const FIRE_FS = `#version 300 es

//     precision highp float;

//     // procedural noise from IQ
//     vec2 hash(vec2 p)
//     {
//         p = vec2( dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)) );
//         return -1.0 + 2.0*fract(sin(p)*43758.5453123);
//     }

//     float noise(in vec2 p)
//     {
//         const float K1 = 0.366025404; // (sqrt(3)-1)/2;
//         const float K2 = 0.211324861; // (3-sqrt(3))/6;

//         vec2 i = floor( p + (p.x+p.y) *K1 );
//         vec2 a = p - i + (i.x + i.y)  *K2;
//         vec2 o = (a.x>a.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);
//         vec2 b = a - o + K2;
//         vec2 c = a - 1.0 + 2.0*K2;

//         vec3 h = max( 0.5-vec3(dot(a,a), dot(b,b), dot(c,c) ), 0.0 );

//         vec3 n = h*h*h*h*h* vec3( dot(a,hash(i+0.0)), dot(b,hash(i+o)), dot(c,hash(i+1.0)));
//         return dot( n, vec3(100.0) );
//     }

//     float fbm(vec2 uv)
//     {
//         float f; float x = 1.9; float y = 1.6;
//         mat2 m = mat2( x, y, y, -x );
//         f  = 0.5000 * noise(uv); uv = m*uv;
//         f += 0.2500 * noise(uv); uv = m*uv;
//         f += 0.1250 * noise(uv); uv = m*uv;
//         f += 0.0625 * noise(uv); uv = m*uv;
//         f = 0.55 + 0.5*f;
//         return f;
//     }


//     in mediump vec4 v_Color;
//     in mediump vec2 v_Pos;
//     in mediump vec2 v_Wpos;
//     in mediump float v_Params[5];           

//     out vec4 FragColor;

//     // float ypos   = 800. - v_Pos.y;              // Transform y coord from top=0 to top=windowHeight
//     // float left   = (v_Pos.x - v_Wpos.x);        // Left side of current geometry
//     // float right  = (v_Pos.x + v_Wpos.x);
//     // float top    = ypos + v_Wpos.y;
//     // float bottom = ypos - v_Wpos.y;

//     // vec2 localDim = abs(v_Pos);// * vec2(2.);
//     // vec2 localDim = vec2((v_Wpos.x-v_Pos.x), (v_Wpos.y-v_Pos.y));
//     // vec2 localDim = vec2((v_Pos.x-v_Wpos.x), (v_Pos.y+v_Wpos.y));
//     // vec2 localDim = vec2((right-left), (top-bottom));
//     void main()
//     {
//         float xdir = v_Params[0];
//         float ydir = v_Params[1];
//         float time = v_Params[2];

//         float dimf = 1.0;
//         vec2 dim = vec2(700. * dimf, 800. * dimf);

//         vec2 uv = gl_FragCoord.xy / dim;
//         uv += vec2(-.5, -.0); // 0 to 1

//         // vec2 mpos = vec2(v_Params[3]/dim.x, 1.-(v_Params[4]/dim.y)-0.5); 
//         vec2 mpos = vec2(v_Params[3]/dim.x-.5, 1.-(v_Params[4]/dim.y)); 
//         // mpos = abs(mpos);

//         vec2 q = uv * vec2(2.,2.);

//         float s = 2.;
//         // float noiz = fbm(q*3.2 - vec2(xdir*s,ydir*s));
//         float noiz = fbm(q*3.2);

//         float shape = fbm(q*4.2-vec2(mpos.x*ydir, mpos.y*ydir));

//         float size = .3;  // Better to make short but also in large numbers changes the width
//         float ratio = 1./max(xdir,ydir)/min(xdir,ydir);

//         float z = smoothstep(.05, 0.22,length(q-vec2(mpos.x*2., mpos.y*2.)));
//         // float v = 1.-smoothstep(.2, 0.4, length(z-vec2(shape)));
//         // float v = 1.-length(q*vec2(1.1+q.y*0.5, z) - mpos*z*time);
//         float v = 1.-length(q*vec2(z, 0.2*mpos.x));

//         float c = v;


//         float flameIntensity = 1.4;                         // Intensify all (very strong)
//         float flameIntensity2 = 1.3;                        // Greater contrast
//         float flameIntensFalloff = 1.0;                     // Reversed. Makes flame taller/shorter
//         // float c1 = noiz * c * (flameIntensity-pow(flameIntensFalloff*uv.y, flameIntensity2));
//         float c1 = c;

//         c1=clamp(c1,0.,1.);

//         vec3 col = vec3(1.5*c1, 1.5*c1*c1*c1, c1*c1*c1*c1*c1*c1);

//         float a = 1.-c;
//         col = col.zyx;                                      // BLUE_FLAME
//         // FragColor = vec4(mix(vec3(0.),col*noiz, 1.-a), 1.);
//         // FragColor = vec4(mix(vec3(0.),col, 1.-a), 1.);
//         FragColor = vec4(vec3(noiz*col), 1.);
//         // FragColor = vec4(vec3(v), z);


//         float alpha = smoothstep(0.0, 0.15, mix(FragColor.r, FragColor.g, FragColor.r));
//         // FragColor.a *= alpha;
//     }
// `;

{ // Save 2
    //     const FIRE_FS = `#version 300 es

    //     precision highp float;

    //     // procedural noise from IQ
    //     vec2 hash(vec2 p)
    //     {
    //         p = vec2( dot(p,vec2(127.1,311.7)),
    //                  dot(p,vec2(269.5,183.3)) );
    //         return -1.0 + 2.0*fract(sin(p)*43758.5453123);
    //     }

    //     float noise(in vec2 p)
    //     {
    //         const float K1 = 0.366025404; // (sqrt(3)-1)/2;
    //         const float K2 = 0.211324861; // (3-sqrt(3))/6;

    //         vec2 i = floor( p + (p.x+p.y)*K1 );
    //         vec2 a = p - i + (i.x+i.y)*K2;
    //         vec2 o = (a.x>a.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);
    //         vec2 b = a - o + K2;
    //         vec2 c = a - 1.0 + 2.0*K2;

    //         vec3 h = max( 0.5-vec3(dot(a,a), dot(b,b), dot(c,c) ), 0.0 );

    //         vec3 n = h*h*h*h*h*vec3( dot(a,hash(i+0.0)), dot(b,hash(i+o)), dot(c,hash(i+1.0)));
    //         // mat2 rot = mat2(cos(p.x), sin(p.y), -sin(p.x), cos(p.y));
    //         // n.xy = rot*n.xy;
    //         return dot( n, vec3(100.0) );
    //     }

    //     float fbm(vec2 uv)
    //     {
    //         float f;
    //         mat2 m = mat2( 1.6,  -1.2, 1.4,  1.6 );
    //         float a = 0.1;
    //         f  = 0.5000 * noise(uv); uv = m*uv;
    //         f += 0.2500 * noise(uv); uv = m*uv;
    //         f += 0.1250 * noise(uv); uv = m*uv;
    //         f += 0.0625 * noise(uv); uv = m*uv;
    //         f = 0.55 + 0.5*f;
    //         return f;
    //     }


    //     in mediump vec4 v_Color;
    //     in mediump vec2 v_Pos;
    //     in mediump vec2 v_Wpos;
    //     in highp vec3 v_Params;           // [0]:WinWidth, [1]:WinHeight, [3]:Time

    //     out vec4 FragColor;

    //     void main()
    //     {
    //         float iTime = v_Params.x;
    //         // float ypos   = iResolution.y - v_Pos.y;             // Transform y coord from top=0 to top=windowHeight
    //         // float left   = (v_Pos.x - v_Wpos.x);                 // Left side of current geometry
    //         // float right  = (v_Pos.x + v_Wpos.x);
    //         // float top    = ypos + v_Wpos.y;
    //         // float bottom = ypos - v_Wpos.y;

    //         float dimf = 1.6;
    //         vec2 dim = vec2(700. * 0.2 * dimf, 800. * 0.4 * dimf);
    //         vec2 localDim = vec2(v_Pos.x-v_Wpos.x*dimf, v_Pos.y+v_Wpos.y*dimf);

    //         vec2 uv = gl_FragCoord.xy / dim;
    //         vec2 q = uv;

    //         q.y *= 2.;
    //         float strength = floor(q.x+1.);
    //         float T3 = max(3.,1.25*strength)*iTime;

    //         q.x = mod(q.x, 1.)-0.5;
    //         q.y -= 0.3;    

    //         float noiz = fbm(strength*q - vec2(T3,T3));


    //         float size = 0.35;  // Better to make short but also in large numbers changes the width
    //         float c = 1. - 16. * pow( 
    //                     // max( 0., length(q*vec2(1.8+uv.y*1.5,.75) ) - noiz * max( 0., q.y+size ) ), 1.0 
    //                     max( 0., length(q*vec2(1.8+uv.y*1.5,.75) ) - max( 0., q.y+size ) ), 1.0 
    //                 );

    //         float flameIntensity = 1.4;                         // Intensify all (very strong)
    //         float flameIntensity2 = 1.3;                        // Greater contrast
    //         float flameIntensFalloff = 1.0;                     // Reversed. Makes flame taller/shorter
    //         float c1 = noiz * c * (flameIntensity-pow(flameIntensFalloff*uv.y, flameIntensity2));

    //         c1=clamp(c1,0.,1.);

    //         vec3 col = vec3(1.5*c1, 1.5*c1*c1*c1, c1*c1*c1*c1*c1*c1);

    //         float a = c * (1.-pow(uv.y, 3.));
    //         col = col.zyx;                                      // BLUE_FLAME
    //         FragColor = vec4(mix(vec3(0.),col, a), 1.);

    //         float alpha = smoothstep(0.0, 0.3, mix(FragColor.r, FragColor.g, FragColor.r));
    //         FragColor.a *= alpha;
    //     }
    // `;
}
