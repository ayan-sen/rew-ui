import { Component, OnInit } from '@angular/core';
import * as Chartist from 'chartist';
import * as tooltip from 'chartist-plugin-tooltips';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor() {
    var toltip = tooltip;
   }

  ngOnInit(): void {

    var datawebsiteViewsChart = {
      labels: ['J', 'F', 'M', 'A'],
      series: [
        [542, 443, 320, 780],
        [326, 434, 568, 610]
      ]

    };
    var optionswebsiteViewsChart = {
      axisX: {
        showGrid: false
      },
      low: 0,
      high: 1000,
      chartPadding: { top: 0, right: 5, bottom: 0, left: 0 },
      plugins: [
        Chartist.plugins.tooltip()
      ]
    };
    var responsiveOptions: any[] = [
      ['screen and (max-width: 800px)', {
        seriesBarDistance: 5, 
        axisX: {
          labelInterpolationFnc: function (value) {
            return value[0];
          }
        }
      }]
    ];
    var websiteViewsChart = new Chartist.Bar('#websiteViewsChart', datawebsiteViewsChart, optionswebsiteViewsChart, responsiveOptions);

    //start animation for the Emails Subscription Chart
    this.startAnimationForBarChart(websiteViewsChart);
  }

  startAnimationForBarChart(chart) {
    let seq2: any, delays2: any, durations2: any;

    seq2 = 0;
    delays2 = 80;
    durations2 = 500;
    chart.on('draw', function (data) {
      if (data.type === 'bar') {
        seq2++;
        data.element.animate({
          opacity: {
            begin: seq2 * delays2,
            dur: durations2,
            from: 0,
            to: 1,
            easing: 'ease'
          }
        });
      }
    });

    seq2 = 0;
  };
}
