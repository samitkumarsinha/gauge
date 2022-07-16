import { Component, AfterViewInit, OnInit, Input } from '@angular/core';
import * as d3 from 'd3';
@Component({
  selector: 'app-gaugemeter',
  templateUrl: './gaugemeter.component.html',
  styleUrls: ['./gaugemeter.component.scss'],
})
export class GaugemeterComponent implements OnInit, AfterViewInit {
  @Input()
  value;
  @Input()
  cat;
  gaugemap = { configure: null, update: null, isRendered: null, render: null };
  constructor() {}
  ngOnInit() {}
  ngAfterViewInit() {
    this.draw();
  }
  gauge(container, configuration) {
    const config = {
      size: 200,
      clipWidth: 200,
      clipHeight: 110,
      ringInset: 20,
      ringWidth: 20,
      pointerWidth: 5,
      pointerTailLength: 5,
      pointerHeadLengthPercent: 0.9,
      minValue: 0,
      maxValue: 10,
      minAngle: -90,
      maxAngle: 90,
      transitionMs: 750,
      majorTicks: 6,
      labelFormat: d3.format('d'),
      labelInset: 10,
      // arcColorFn: d3.interpolateHsl('red', 'green'),
    };
    let range;
    let r;
    let pointerHeadLength;
    const value = 0;
    let svg;
    let arc;
    let scale;
    let ticks;
    let tickData;
    let pointer;
    const donut = d3.pie();
    const deg2rad = (deg) => (deg * Math.PI) / 180;
    const newAngle = (d) => {
      const ratio = scale(d);
      const newAngles = config.minAngle + ratio * range;
      return newAngles;
    };
    const configure = (configval) => {
      for (const prop in configval) {
        if (configval) {
          config[prop] = configuration[prop];
        }
      }
      range = config.maxAngle - config.minAngle;
      r = config.size / 2;
      pointerHeadLength = 90; //Math.round(r * config.pointerHeadLengthPercent);
      scale = d3
        .scaleLinear()
        .range([0, 1])
        .domain([config.minValue, config.maxValue]);

      ticks = scale.ticks(config.majorTicks);
      tickData = d3.range(config.majorTicks).map(() => 1 / config.majorTicks);
      arc = d3
        .arc()
        .innerRadius(r - config.ringWidth - config.ringInset)
        .outerRadius(r - config.ringInset)
        .startAngle((d: any, i) => {
          const ratio = d * i;
          return deg2rad(config.minAngle + ratio * range);
        })
        .endAngle((d: any, i) => {
          const ratio = d * (i + 1);
          return deg2rad(config.minAngle + ratio * range);
        });
    };
    this.gaugemap.configure = configure;
    const centerTranslation = () => 'translate(' + r + ',' + r + ')';
    const isRendered = () => svg !== undefined;
    this.gaugemap.isRendered = isRendered;
    const render = (newValue) => {
      svg = d3
        .select(container)
        .append('svg:svg')
        .attr('class', 'gauge')
        .attr('width', config.clipWidth)
        .attr('height', config.clipHeight);
      const centerTx = centerTranslation();
      const colors = [
        '#C6D5BB',
        '#9EB78C',
        '#FFEEC1',
        '#FDE197',
        '#F5B3B8',
        '#EC7F87',
      ];
      const arcs = svg
        .append('g')
        .attr('class', 'arc')
        .attr('transform', centerTx);
      arcs
        .selectAll('path')
        .data(tickData)
        .enter()
        .append('path')
        .attr('fill', (d, i) => colors[i])
        .attr('d', arc);
      const label = [
        'LOW',
        'LOW TO MODERATE',
        'MODERATE',
        'MODERATELY HIGH',
        'HIGH',
        'VERY HIGH',
      ];

      svg
        .append('text')
        .style('font-size', '12px')
        .attr('x', 60)
        .attr('y', 220)
        .text(label[0]);
      svg
        .append('text')
        .style('font-size', '10px')
        .attr('x', 70)
        .attr('y', 140)
        .text(label[1]);
      svg
        .append('text')
        .style('font-size', '10px')
        .attr('x', 180)
        .attr('y', 100)
        .text(label[2]);
      svg
        .append('text')
        .style('font-size', '8px')
        .attr('x', 260)
        .attr('y', 100)
        .text(label[3]);
      svg
        .append('text')
        .style('font-size', '12px')
        .attr('x', 350)
        .attr('y', 150)
        .text(label[4]);
      svg
        .append('text')
        .style('font-size', '10px')
        .attr('x', 380)
        .attr('y', 220)
        .text(label[5]);
      svg
        .append('line')
        .style('stroke', 'black')
        .style('stroke-width', 40)
        .attr('x1', 20)
        .attr('y1', 270)
        .attr('x2', 480)
        .attr('y2', 270);
      svg
        .append('text')
        .style('font-size', '14px')
        .attr('x', 180)
        .attr('y', 275)
        .style('fill', 'white')
        .style('font-weight', 'bold')
        .text(this.cat + ' RISKOMETER');

      const lineData = [
        [config.pointerWidth / 2, 0],
        [0, -pointerHeadLength],
        [-(config.pointerWidth / 2), 0],
        [0, config.pointerTailLength],
        [config.pointerWidth / 2, 0],
      ];
      const pointerLine = d3.line().curve(d3.curveLinear);
      const pg = svg
        .append('g')
        .data([lineData])
        .attr('class', 'pointer')
        .attr('transform', centerTx);

      pointer = pg
        .append('path')
        .attr('d', pointerLine /*function(d) { return pointerLine(d) +'Z';}*/)
        .attr('transform', 'rotate(' + config.minAngle + ')');

      update(newValue === undefined ? 0 : newValue);
    };
    this.gaugemap.render = render;
    const update = (newValue, newConfiguration?) => {
      if (newConfiguration !== undefined) {
        configure(newConfiguration);
      }
      const ratio = scale(newValue);
      const newAngles = config.minAngle + ratio * range;
      pointer
        .transition()
        .duration(config.transitionMs)
        .ease(d3.easeElastic)
        .attr('transform', 'rotate(' + newAngles + ')');
    };
    this.gaugemap.update = update;
    configure(configuration);
    return this.gaugemap;
  }
  draw() {
    const powerGauge = this.gauge('#power-gauge', {
      size: 500,
      clipWidth: 500,
      clipHeight: 400,
      ringWidth: 140,
      maxValue: 10,
      transitionMs: 4000,
    });
    powerGauge.render(this.value);
  }
}
