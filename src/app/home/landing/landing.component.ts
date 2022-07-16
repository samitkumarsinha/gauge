import { Component, AfterViewInit, OnInit, Input } from '@angular/core';
import { ViewDidEnter } from '@ionic/angular';
/* eslint-disable */
import * as d3 from 'd3';
@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent implements OnInit, AfterViewInit  {
  @Input()
  value;
  gaugemap = {configure:null, update:null, isRendered:null, render:null};
  constructor() {}
  ngOnInit() {

  }
  ngAfterViewInit(){
    this.draw();
  }


  draw() {
    var self = this;
    var gauge = function (container, configuration) {
      var config = {
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
      var range = undefined;
      var r = undefined;
      var pointerHeadLength = undefined;
      var value = 0;

      var svg = undefined;
      var arc = undefined;
      var scale = undefined;
      var ticks = undefined;
      var tickData = undefined;
      var pointer = undefined;

      var donut = d3.pie();

      function deg2rad(deg) {
        return (deg * Math.PI) / 180;
      }

      function newAngle(d) {
        var ratio = scale(d);
        var newAngle = config.minAngle + ratio * range;
        return newAngle;
      }

      function configure(configuration) {
        var prop = undefined;
        for (prop in configuration) {
          config[prop] = configuration[prop];
        }

        range = config.maxAngle - config.minAngle;
        r = config.size / 2;
        pointerHeadLength = 90; //Math.round(r * config.pointerHeadLengthPercent);

        // a linear scale this.gaugemap maps domain values to a percent from 0..1
        scale = d3
          .scaleLinear()
          .range([0, 1])
          .domain([config.minValue, config.maxValue]);

        ticks = scale.ticks(config.majorTicks);
        tickData = d3.range(config.majorTicks).map(function () {
          return 1 / config.majorTicks;
        });

        arc = d3
          .arc()
          .innerRadius(r - config.ringWidth - config.ringInset)
          .outerRadius(r - config.ringInset)
          .startAngle(function (d: any, i) {
            var ratio = d * i;
            return deg2rad(config.minAngle + ratio * range);
          })
          .endAngle(function (d: any, i) {
            var ratio = d * (i + 1);
            return deg2rad(config.minAngle + ratio * range);
          });
      }
      self.gaugemap.configure = configure;

      function centerTranslation() {
        return 'translate(' + r + ',' + r + ')';
      }

      function isRendered() {
        return svg !== undefined;
      }
      self.gaugemap.isRendered = isRendered;

      function render(newValue) {
        svg = d3
          .select(container)
          .append('svg:svg')
          .attr('class', 'gauge')
          .attr('width', config.clipWidth)
          .attr('height', config.clipHeight);

        var centerTx = centerTranslation();
        var colors = ['#C6D5BB', '#9EB78C', '#FFEEC1', '#FDE197', '#F5B3B8', '#EC7F87'];
        var arcs = svg
          .append('g')
          .attr('class', 'arc')
          .attr('transform', centerTx);

        arcs
          .selectAll('path')
          .data(tickData)
          .enter()
          .append('path')
          .attr('fill', function (d, i) {
            return colors[i];
          })
          .attr('d', arc);
        var label = ["LOW", "LOW TO MODERATE", "MODERATE", "MODERATELY HIGH", "HIGH", "VERY HIGH"];

        svg.append("text")
          .style("font-size", "12px")
          .attr("x", 60)
          .attr("y", 220)
          .text(label[0]);
        svg.append("text")
          .style("font-size", "10px")
          .attr("x", 70)
          .attr("y", 140)
          .text(label[1]);
        svg.append("text")
          .style("font-size", "10px")
          .attr("x", 180)
          .attr("y", 100)
          .text(label[2]);
        svg.append("text")
          .style("font-size", "8px")
          .attr("x", 260)
          .attr("y", 100)
          .text(label[3]);
        svg.append("text")
          .style("font-size", "12px")
          .attr("x", 350)
          .attr("y", 150)
          .text(label[4]);
        svg.append("text")
          .style("font-size", "10px")
          .attr("x", 380)
          .attr("y", 220)
          .text(label[5]);
        svg.append('line')
          .style("stroke", "black")
          .style("stroke-width", 40)
          .attr("x1", 20)
          .attr("y1", 270)
          .attr("x2", 480)
          .attr("y2", 270);
        svg.append("text")
          .style("font-size", "14px")
          .attr("x", 180)
          .attr("y", 275)
          .style("fill","white")
          .style("font-weight","bold")
          .text("SCHEME RISKOMETER");

        var lineData = [
          [config.pointerWidth / 2, 0],
          [0, -pointerHeadLength],
          [-(config.pointerWidth / 2), 0],
          [0, config.pointerTailLength],
          [config.pointerWidth / 2, 0],
        ];
        var pointerLine = d3.line().curve(d3.curveLinear);
        var pg = svg
          .append('g')
          .data([lineData])
          .attr('class', 'pointer')
          .attr('transform', centerTx);

        pointer = pg
          .append('path')
          .attr('d', pointerLine /*function(d) { return pointerLine(d) +'Z';}*/)
          .attr('transform', 'rotate(' + config.minAngle + ')');

        update(newValue === undefined ? 0 : newValue);
      }
      self.gaugemap.render = render;
      function update(newValue, newConfiguration?) {
        if (newConfiguration !== undefined) {
          configure(newConfiguration);
        }
        var ratio = scale(newValue);
        var newAngle = config.minAngle + ratio * range;
        pointer
          .transition()
          .duration(config.transitionMs)
          .ease(d3.easeElastic)
          .attr('transform', 'rotate(' + newAngle + ')');
      }
      self.gaugemap.update = update;

      configure(configuration);

      return self.gaugemap;
    };

    var powerGauge = gauge('#power-gauge', {
      size: 500,
      clipWidth: 500,
      clipHeight: 400,
      ringWidth: 140,
      maxValue: 10,
      transitionMs: 4000,
    });
    powerGauge.render(self.value);
  }

}
