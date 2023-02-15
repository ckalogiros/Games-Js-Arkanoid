/**
 * Drop like shape     
 * 
        in mediump vec4 v_Color;
        in mediump vec2 v_Pos;
        in mediump vec2 v_Wpos;
        in mediump float v_Params[7];           // [0]:WinWidth, [1]:WinHeight, [3]:Time
    
        out vec4 FragColor;
    
        void main()
        {
            float xdir = v_Params[0];
            float ydir = v_Params[1];
            float time = v_Params[2];
            float xvecdiff = v_Params[5];
            float yvecdiff = v_Params[6];
            
            vec2 dim = vec2(700., 700.0);
            vec2 mpos = vec2(v_Params[3]/dim.x, 1.-(v_Params[4]/dim.y)+3.); 
            vec2 uv = gl_FragCoord.xy / dim;
            // vec2 q = uv;

            vec2 q = uv - vec2(.5, 0.5);

            vec3 col = v_Color.xyz;

            
            float num = 20.0;
            float s = 0.01 * cos(atan(q.y/q.x)* num);
            float r = .2;

            float d = length(q); // - (q.y);
            // d = d - abs(q.y)+0.1;
            // d = d - q.y+0.09;

            d = length(q*vec2(1.9-q.y*2.1, .75));

            col += smoothstep(r, r+0.01, d);

            FragColor = vec4(col, 1.);            
            
        }
 */