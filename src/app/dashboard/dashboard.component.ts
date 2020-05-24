import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as Chartist from 'chartist';
import * as tooltip from 'chartist-plugin-tooltips';
import { InventoryService } from '../transaction/inventory.service';
import { InventoryChart } from './inventory-chart';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {

  chartData: InventoryChart;
  constructor(private inventoryService: InventoryService) {
    var toltip = tooltip;
  }

  ngOnInit(): void {

    this.inventoryService.getInventoryStatus().subscribe(inv => {
      this.chartData = inv;

      var datawebsiteViewsChart = {
        labels: this.chartData.labels,
        series: [
          this.chartData.dumdum,
          this.chartData.singur
        ]

      };
      var optionswebsiteViewsChart = {
        axisX: {
          showGrid: false,
        },
        axisY: {
          offset: 50
        },
        seriesBarDistance: 15,
        chartPadding: { top: 0, right: 5, bottom: 0, left: 0 },
        plugins: [
          Chartist.plugins.tooltip()
        ]
      };
      var responsiveOptions: any[] = [
        ['screen and (max-width: 1000px)', {
          seriesBarDistance: 5,
          axisX: {
            labelInterpolationFnc: function (value) {
              return value;
            }
          }
        }]
      ];
      var websiteViewsChart = new Chartist.Bar('#websiteViewsChart', datawebsiteViewsChart, optionswebsiteViewsChart, responsiveOptions);

      this.startAnimationForBarChart(websiteViewsChart);

    });
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
