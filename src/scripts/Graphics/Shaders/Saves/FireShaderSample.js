{ // Rocket type
    
    const FIRE_FS = `#version 300 es
    
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
        
        vec2 i = floor( p + (p.x+p.y) *K1 );
        vec2 a = p - i + (i.x + i.y)  *K2;
        vec2 o = (a.x>a.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);
        vec2 b = a - o + K2;
        vec2 c = a - 1.0 + 2.0*K2;
        
        vec3 h = max( 0.5-vec3(dot(a,a), dot(b,b), dot(c,c) ), 0.0 );
        
        vec3 n = h*h*h*h*h* vec3( dot(a,hash(i+0.0)), dot(b,hash(i+o)), dot(c,hash(i+1.0)));
        return dot( n, vec3(100.0) );
    }
    
    float fbm(vec2 uv)
    {
        float f; float x = 1.9; float y = 1.6;
        mat2 m = mat2( x, y, y, -x );
        f  = 0.5000 * noise(uv); uv = m*uv;
        f += 0.2500 * noise(uv); uv = m*uv;
        f += 0.1250 * noise(uv); uv = m*uv;
        f += 0.0625 * noise(uv); uv = m*uv;
        f = 0.55 + 0.5*f;
        return f;
    }
    

    in mediump vec4 v_Color;
    in mediump vec2 v_Pos;
    in mediump vec2 v_Wpos;
    in mediump float v_Params[5];           

    out vec4 FragColor;
        
    // float ypos   = 800. - v_Pos.y;              // Transform y coord from top=0 to top=windowHeight
    // float left   = (v_Pos.x - v_Wpos.x);        // Left side of current geometry
    // float right  = (v_Pos.x + v_Wpos.x);
    // float top    = ypos + v_Wpos.y;
    // float bottom = ypos - v_Wpos.y;

    // vec2 localDim = abs(v_Pos);// * vec2(2.);
    // vec2 localDim = vec2((v_Wpos.x-v_Pos.x), (v_Wpos.y-v_Pos.y));
    // vec2 localDim = vec2((v_Pos.x-v_Wpos.x), (v_Pos.y+v_Wpos.y));
    // vec2 localDim = vec2((right-left), (top-bottom));
    void main()
    {
        float xdir = v_Params[0];
        float ydir = v_Params[1];
        float time = v_Params[2];
        
        float dimf = 1.0;
        vec2 dim = vec2(700. * dimf, 800. * dimf);
        
        vec2 uv = gl_FragCoord.xy / dim;
        uv += vec2(-.5, -.0); // 0 to 1
        
        // This is the -1 to 1 correct interpolation. When x = 0 then is centered 
        // vec2 mpos = vec2(v_Params[3]/dim.x, 1.-(v_Params[4]/dim.y)-0.5); 
        vec2 mpos = vec2(v_Params[3]/dim.x-.5, 1.-(v_Params[4]/dim.y)); 
        // mpos = abs(mpos);
        
        vec2 q = uv * vec2(2.,2.);
        
        float s = 2.;
        // float noiz = fbm(q*3.2 - vec2(xdir*s,ydir*s));
        float noiz = fbm(q*3.2);
        // noiz *= 1.8;
        
        // float shape = fbm(q*4.2-vec2(mpos.x*ydir, mpos.y*ydir));
        float shape = fbm(q*4.2-vec2(mpos.x*ydir, mpos.y*ydir));

        float size = .3;  // Better to make short but also in large numbers changes the width
        float ratio = 1./max(xdir,ydir)/min(xdir,ydir);
        float y = 1. - 4. *  max( 
            // 0., length(q*vec2(2.8+shape, 1.1+shape) ) - noiz* max( 0.27, q.y+size+(q.x) ) 
            0., length(q*vec2(2.8, 1.1) ) - noiz* max( 0.27, q.y+size+(q.x) ) 
            // 0., length(q*vec2(2.8, 1.1) ) - shape* max( 0.27, q.y+size+(q.x) ) 
            );
        // float y = 1. - 4. * length(q*vec2(2.8, 1.1) ) - noiz* max( 0.27, q.y+size+(q.x) ) ;

        // mpos.y *= y;
        // float z = 1.-smoothstep(.1, 0.15,length(uv-vec2(mpos.x, mpos.y))) - shape * max( 0.27, q.x+size-(q.y*sin(time)));
        // float z = 1.-smoothstep(.1, 0.55,length(q-vec2(mpos.x*2., mpos.y*2.)));
        // float z = 1.-smoothstep(.1, 0.33,length(q-vec2(mpos.x*2.+shape, mpos.y*2.+shape)));
        // float z = 1.-smoothstep(.05, 0.22,length(q-vec2(mpos.x*2., mpos.y*2.)));
        float z = smoothstep(.05, 0.22,length(q-vec2(mpos.x*2., mpos.y*2.)));
        // float v = 1.-smoothstep(.2, 0.4, length(z-vec2(shape)));
        float v = 1.-smoothstep(.3, 0.5, length(q*vec2(1.1+q.y*1.5,.25) - mpos*shape));
        // float v = max( 0., length(q*vec2(1.8+uv.y*1.5,.75) ) - shape * max( 0., q.y ) );
        // float v = smoothstep(.3, 0.9, 1.-length(q*vec2(1.8+q.y*1.5,.75) - shape* mpos.y));
        // float c = z;
        float c = v;
        // float c = z*v;

        
        float flameIntensity = 1.4;                         // Intensify all (very strong)
        float flameIntensity2 = 1.3;                        // Greater contrast
        float flameIntensFalloff = 1.0;                     // Reversed. Makes flame taller/shorter
        // float c1 = noiz * c * (flameIntensity-pow(flameIntensFalloff*uv.y, flameIntensity2));
        // float c1 = noiz;
        float c1 = c;
        
        c1=clamp(c1,0.,1.);
    
        vec3 col = vec3(1.5*c1, 1.5*c1*c1*c1, c1*c1*c1*c1*c1*c1);
        
        // float a = c * (1.-pow(uv.y, 3.));
        // float a = c * (pow(uv.y, 3.));
        float a = 1.-c;
        col = col.zyx;                                      // BLUE_FLAME
        // FragColor = vec4(mix(vec3(0.),col*noiz, 1.-a), 1.);
        // FragColor = vec4(mix(vec3(0.),col, 1.-a), 1.);
        FragColor = vec4(vec3(noiz*col), 1.);
        // FragColor = vec4(vec3(noiz), a);


        float alpha = smoothstep(0.0, 0.15, mix(FragColor.r, FragColor.g, FragColor.r));
        // FragColor.a *= alpha;
    }
`;
}

{ // all to donut shape
    const FIRE_FS = `#version 300 es
    
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
        
        vec2 i = floor( p + (p.x+p.y) *K1 );
        vec2 a = p - i + (i.x + i.y)  *K2;
        vec2 o = (a.x>a.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);
        vec2 b = a - o + K2;
        vec2 c = a - 1.0 + 2.0*K2;
        
        vec3 h = max( 0.5-vec3(dot(a,a), dot(b,b), dot(c,c) ), 0.0 );
        
        vec3 n = h*h*h*h*h* vec3( dot(a,hash(i+0.0)), dot(b,hash(i+o)), dot(c,hash(i+1.0)));
        return dot( n, vec3(100.0) );
    }
    
    float fbm(vec2 uv)
    {
        float f; float x = 1.9; float y = 1.6;
        mat2 m = mat2( x, y, y, -x );
        f  = 0.5000 * noise(uv); uv = m*uv;
        f += 0.2500 * noise(uv); uv = m*uv;
        f += 0.1250 * noise(uv); uv = m*uv;
        f += 0.0625 * noise(uv); uv = m*uv;
        f = 0.55 + 0.5*f;
        return f;
    }
    

    in mediump vec4 v_Color;
    in mediump vec2 v_Pos;
    in mediump vec2 v_Wpos;
    in mediump float v_Params[5];           

    out vec4 FragColor;
        
    // float ypos   = 800. - v_Pos.y;              // Transform y coord from top=0 to top=windowHeight
    // float left   = (v_Pos.x - v_Wpos.x);        // Left side of current geometry
    // float right  = (v_Pos.x + v_Wpos.x);
    // float top    = ypos + v_Wpos.y;
    // float bottom = ypos - v_Wpos.y;

    // vec2 localDim = abs(v_Pos);// * vec2(2.);
    // vec2 localDim = vec2((v_Wpos.x-v_Pos.x), (v_Wpos.y-v_Pos.y));
    // vec2 localDim = vec2((v_Pos.x-v_Wpos.x), (v_Pos.y+v_Wpos.y));
    // vec2 localDim = vec2((right-left), (top-bottom));
    void main()
    {
        float xdir = v_Params[0];
        float ydir = v_Params[1];
        float time = v_Params[2];
        
        float dimf = 1.0;
        vec2 dim = vec2(700. * dimf, 800. * dimf);
        
        vec2 uv = gl_FragCoord.xy / dim;
        uv += vec2(-.5, -.0); // 0 to 1
        
        // This is the -1 to 1 correct interpolation. When x = 0 then is centered 
        // vec2 mpos = vec2(v_Params[3]/dim.x, 1.-(v_Params[4]/dim.y)-0.5); 
        vec2 mpos = vec2(v_Params[3]/dim.x-.5, 1.-(v_Params[4]/dim.y)); 
        // mpos = abs(mpos);
        
        vec2 q = uv * vec2(2.,2.);
        
        float s = 2.;
        // float noiz = fbm(q*3.2 - vec2(xdir*s,ydir*s));
        float noiz = fbm(q*3.2);
        // noiz *= 1.8;
        
        // float shape = fbm(q*4.2-vec2(mpos.x*ydir, mpos.y*ydir));
        float shape = fbm(q*4.2-vec2(mpos.x*ydir, mpos.y*ydir));

        float size = .3;  // Better to make short but also in large numbers changes the width
        float ratio = 1./max(xdir,ydir)/min(xdir,ydir);
        float y = 1. - 4. *  max( 
            // 0., length(q*vec2(2.8+shape, 1.1+shape) ) - noiz* max( 0.27, q.y+size+(q.x) ) 
            0., length(q*vec2(2.8, 1.1) ) - noiz* max( 0.27, q.y+size+(q.x) ) 
            // 0., length(q*vec2(2.8, 1.1) ) - shape* max( 0.27, q.y+size+(q.x) ) 
            );
        // float y = 1. - 4. * length(q*vec2(2.8, 1.1) ) - noiz* max( 0.27, q.y+size+(q.x) ) ;

        // mpos.y *= y;
        // float z = 1.-smoothstep(.1, 0.15,length(uv-vec2(mpos.x, mpos.y))) - shape * max( 0.27, q.x+size-(q.y*sin(time)));
        // float z = 1.-smoothstep(.1, 0.55,length(q-vec2(mpos.x*2., mpos.y*2.)));
        // float z = 1.-smoothstep(.1, 0.33,length(q-vec2(mpos.x*2.+shape, mpos.y*2.+shape)));
        // float z = 1.-smoothstep(.05, 0.22,length(q-vec2(mpos.x*2., mpos.y*2.)));
        float z = smoothstep(.05, 0.22,length(q-vec2(mpos.x*2., mpos.y*2.)));
        // float v = 1.-smoothstep(.2, 0.4, length(z-vec2(shape)));
        float v = 1.-smoothstep(.3, 0.5, length(q*vec2(1.1+q.y*0.5,z) - mpos*shape));
        // float v = max( 0., length(q*vec2(1.8+uv.y*1.5,.75) ) - shape * max( 0., q.y ) );
        // float v = smoothstep(.3, 0.9, 1.-length(q*vec2(1.8+q.y*1.5,.75) - shape* mpos.y));
        // float c = z;
        float c = v;
        // float c = z*v;

        
        float flameIntensity = 1.4;                         // Intensify all (very strong)
        float flameIntensity2 = 1.3;                        // Greater contrast
        float flameIntensFalloff = 1.0;                     // Reversed. Makes flame taller/shorter
        // float c1 = noiz * c * (flameIntensity-pow(flameIntensFalloff*uv.y, flameIntensity2));
        // float c1 = noiz;
        float c1 = c;
        
        c1=clamp(c1,0.,1.);
    
        vec3 col = vec3(1.5*c1, 1.5*c1*c1*c1, c1*c1*c1*c1*c1*c1);
        
        // float a = c * (1.-pow(uv.y, 3.));
        // float a = c * (pow(uv.y, 3.));
        float a = 1.-c;
        col = col.zyx;                                      // BLUE_FLAME
        // FragColor = vec4(mix(vec3(0.),col*noiz, 1.-a), 1.);
        // FragColor = vec4(mix(vec3(0.),col, 1.-a), 1.);
        FragColor = vec4(vec3(noiz*col), 1.);
        // FragColor = vec4(vec3(noiz), a);


        float alpha = smoothstep(0.0, 0.15, mix(FragColor.r, FragColor.g, FragColor.r));
        // FragColor.a *= alpha;
    }
`;
}

{ // Milky Way

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
//         float v = 1.-length(q*vec2(z, 0.));

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
}
{//Thunder in y
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
}