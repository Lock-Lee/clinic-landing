"use client";

// วัตถุโครเมียมเหลวใน hero (แทนวิดีโอ 3D แบบ fahrunstudio.com) วาดสดด้วย WebGL ไม่ต้องโหลดไลบรารี
// ลูกบอลหลายลูกหลอมรวมกัน + วงแหวนบาง สะท้อนไฟสตูดิโอ หมุนตามเมาส์
// หยุดวาดเมื่อเลื่อนพ้นจอ, ผู้ใช้ที่ปิดแอนิเมชันเห็นภาพนิ่ง, เครื่องที่ไม่มี WebGL เห็นแสงไล่สีแทน

import { useEffect, useRef } from "react";

const VERT = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;

mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}
float smin(float a,float b,float k){float h=clamp(.5+.5*(b-a)/k,0.,1.);return mix(b,a,h)-k*h*(1.-h);}

float map(vec3 p){
  p.xz*=rot(uTime*.12+uMouse.x*.6);
  p.yz*=rot(uMouse.y*.4);
  float t=uTime*.45;
  float d=length(p-vec3(sin(t)*.3,cos(t*1.3)*.2,0.))-.62;
  d=smin(d,length(p-vec3(cos(t*.8)*.72,sin(t*.9)*.48,sin(t*.6)*.35))-.34,.5);
  d=smin(d,length(p-vec3(-sin(t*.7)*.68,-cos(t*1.1)*.52,cos(t*.5)*.4))-.29,.5);
  vec3 q=p;
  q.xy*=rot(.7+sin(t*.4)*.35);
  q.yz*=rot(1.2+cos(t*.3)*.2);
  d=smin(d,length(vec2(length(q.xz)-1.12,q.y))-.03,.3);
  d+=.022*sin(p.x*5.+t*2.)*sin(p.y*4.-t*1.6)*sin(p.z*5.+t*1.2);
  return d;
}

vec3 nrm(vec3 p){
  vec2 e=vec2(.002,0.);
  return normalize(vec3(map(p+e.xyy)-map(p-e.xyy),map(p+e.yxy)-map(p-e.yxy),map(p+e.yyx)-map(p-e.yyx)));
}

// ไฟสตูดิโอ: ไฟบน, ไฟหลัก, ขอบน้ำเงินม่วง, แสงสะท้อนชมพูจากด้านล่าง, แถบ softbox
vec3 env(vec3 r){
  vec3 c=vec3(.01);
  c+=vec3(1.)*smoothstep(.5,.95,r.y)*.85;
  c+=vec3(1.)*pow(max(dot(r,normalize(vec3(-.7,.35,.6))),0.),30.)*2.5;
  c+=vec3(.32,.38,1.)*pow(max(dot(r,normalize(vec3(.85,-.05,.5))),0.),10.)*1.4;
  c+=vec3(.95,.55,.72)*pow(max(dot(r,normalize(vec3(.1,-.95,.3))),0.),5.)*.7;
  c+=vec3(.9)*smoothstep(.07,0.,abs(r.x+.4))*smoothstep(-.3,.5,r.y);
  c+=vec3(.8)*smoothstep(.05,0.,abs(r.x-.55))*smoothstep(.2,-.4,r.y)*.6;
  return c;
}

void main(){
  vec2 uv=(gl_FragCoord.xy-.5*uRes)/min(uRes.x,uRes.y);
  vec3 ro=vec3(0.,0.,3.7);
  vec3 rd=normalize(vec3(uv,-1.5));
  float t=0.;
  for(int i=0;i<80;i++){
    float d=map(ro+rd*t);
    if(d<.001||t>7.)break;
    t+=d*.8;
  }
  if(t>7.){gl_FragColor=vec4(0.);return;}
  vec3 p=ro+rd*t;
  vec3 n=nrm(p);
  float fr=pow(1.-max(dot(n,-rd),0.),3.);
  vec3 col=env(reflect(rd,n))*(.55+.45*fr);
  gl_FragColor=vec4(col,1.);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  return shader;
}

export function ChromeBlob({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: true, antialias: false });
    if (!gl) {
      canvas.classList.add("is-fallback");
      return;
    }

    const program = gl.createProgram()!;
    gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      canvas.classList.add("is-fallback");
      return;
    }
    gl.useProgram(program);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, "uRes");
    const uTime = gl.getUniformLocation(program, "uTime");
    const uMouse = gl.getUniformLocation(program, "uMouse");

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const start = performance.now();
    let raf = 0;
    let visible = true;

    const draw = (now: number) => {
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, still ? 4 : (now - start) / 1000 + 4);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      canvas.classList.add("is-ready");
    };

    const loop = (now: number) => {
      draw(now);
      if (visible && !still) raf = requestAnimationFrame(loop);
    };

    const resize = () => {
      // จอเล็กใช้ความละเอียดต่ำลง ประหยัดแบตมือถือ
      const dpr = Math.min(window.devicePixelRatio || 1, canvas.clientWidth < 640 ? 1 : 1.5);
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      draw(performance.now());
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    const onMove = (e: PointerEvent) => {
      mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible && !still) raf = requestAnimationFrame(loop);
    });
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
