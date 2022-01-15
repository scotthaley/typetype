import { Component, DebugElement, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as PIXI from 'pixi.js';

@Component({
  selector: 'app-background',
  templateUrl: './background.component.html',
  styleUrls: ['./background.component.scss']
})
export class BackgroundComponent implements OnInit {

  @ViewChild("background") backgroundDiv: ElementRef;

  constructor() { }


  private pixiApp: PIXI.Application = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0xffffff,
  }); 

  private textShader = `
    precision mediump float;
    varying vec2 vTextureCoord;
    uniform sampler2D uSampler;
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;

    void main(){
      vec4 mask = texture2D(uSampler, vTextureCoord);
      vec2 coord = gl_FragCoord.xy / u_resolution;
      vec2 mouse = u_mouse.xy / u_resolution;
      vec2 offset = vec2(mouse.x, mouse.y);
      float dist = distance(coord, mouse) * 4.0;

      vec4 gray = vec4(0.95, 0.95, 0.95, 1.0);
      vec4 blue = vec4(0.0, 0.75, 1.0, 1.0);
      vec4 mixColor = mix(gray, blue, clamp(1.0 - dist, 0.0, 1.0));

      gl_FragColor = vec4(mixColor.r, mixColor.g, mixColor.b, mask.a);
    }
  `

  private lines: {a: PIXI.BitmapText, b: PIXI.BitmapText, speed: number}[] = [];

  ngOnInit(): void {
      
  }

  ngAfterViewInit(): void {
    this.backgroundDiv.nativeElement.appendChild(this.pixiApp.view);

    PIXI.BitmapFont.from('bitter', {
      fill: '#000',
      fontSize: 40,
      fontWeight: 400,
    });

    let filter = new PIXI.Filter('', this.textShader, { u_mouse: [0, 0], u_resolution: [window.innerHeight, window.innerHeight]});

    for (let i = 0; i < window.innerHeight; i += 40)
    {
      const bitmapTextA = this.createLine();
      bitmapTextA.filters = [filter];
      const bitmapTextB = this.createLine();
      bitmapTextB.filters = [filter];
      bitmapTextB.position.x = -bitmapTextB.width;
      bitmapTextA.position.y = i;
      bitmapTextB.position.y = i;
      this.lines.push({a: bitmapTextA, b: bitmapTextB, speed: Math.random() * 1.5 - 0.75});
      this.pixiApp.stage.addChild(bitmapTextA);
      this.pixiApp.stage.addChild(bitmapTextB);
    }

    this.pixiApp.stage.interactive = true;

    this.pixiApp.stage.on('mousemove', (e: PIXI.InteractionEvent) => {
      filter.uniforms.u_mouse[0] = e.data.global.x;
      filter.uniforms.u_mouse[1] = window.innerHeight - e.data.global.y;
    })

    this.pixiApp.ticker.add(delta => {
      for (let i = 0; i < this.lines.length; i ++) {
        const l = this.lines[i];
        l.a.position.x += l.speed * delta;
        l.b.position.x += l.speed * delta;

        if (l.speed > 0) {
          if (Math.abs(l.b.position.x) < 0.5) {
            l.a.position.x = -l.a.width;
          }
          if (Math.abs(l.a.position.x) < 0.5) {
            l.b.position.x = -l.b.width;
          }
        } else {
          if (Math.abs(l.a.position.x + l.a.width - window.innerWidth) < 0.5) {
            l.b.position.x = window.innerWidth;
          }
          if (Math.abs(l.b.position.x + l.b.width - window.innerWidth) < 0.5) {
            l.a.position.x = window.innerWidth;
          }
        }
      }
    })

  }

  createLine(): PIXI.BitmapText {
    return new PIXI.BitmapText("TYPETYPE TYPETYPE TYPETYPE TYPETYPE TYPETYPE TYPETYPE TYPETYPE TYPETYPE TYPETYPE TYPETYPE TYPETYPE TYPETYPE TYPETYPE TYPETYPE ", {
      fontName: 'bitter',
      fontSize: 40,
      align: 'right'
    });
  }
}
