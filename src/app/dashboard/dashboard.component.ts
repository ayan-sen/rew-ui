import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as Chartist from 'chartist';
import * as tooltip from 'chartist-plugin-tooltips';
import legend from 'chartist-plugin-legend';
import { InventoryService } from '../transaction/inventory.service';
import { InventoryChart } from './inventory-chart';
import { Project } from '../transaction/project/project';
import { ProjectService } from '../transaction/project/project.service';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {

  chartData: InventoryChart;
  projectData: any;

  projects: Project[] = [];

  project : Project;

  constructor(private inventoryService: InventoryService,
    private projectService: ProjectService) {
    var toltip = tooltip;
    var legend = legend;
  }

  ngOnInit(): void {
    this.renderMaterialBarChart();
    this.findAllProjects();
   // this.renderProjectProgressChart();
  }

  renderMaterialBarChart() {
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

  renderProjectProgressChart(event : MatSelectChange) {
    let val = event.value;
    this.project = this.projects.filter(p => p.projectId == val)[0];
    
    this.inventoryService.getProjectProjetUpdate(val).subscribe(data => {
      this.projectData = data;

      const dataDailySalesChart: any = {
        labels: this.projectData.labels,
        series: this.projectData.series
      };

      const optionsDailySalesChart: any = {
        lineSmooth: Chartist.Interpolation.cardinal({
          tension: 0
        }),
        low: 0,
        high: (this.projectData.max)[0], // creative tim: we recommend you to set the high sa the biggest value + something for a better look
        chartPadding: { top: 0, right: 0, bottom: 0, left: 0 },
        plugins: [
          Chartist.plugins.tooltip(),
          legend({
            clickable: false
          })
        ]
      }
      var dailySalesChart = new Chartist.Line('#dailySalesChart', dataDailySalesChart, optionsDailySalesChart);
      this.startAnimationForLineChart(dailySalesChart);
    });






  }

  startAnimationForLineChart(chart) {
    let seq: any, delays: any, durations: any;
    seq = 0;
    delays = 80;
    durations = 500;

    chart.on('draw', function (data) {
      if (data.type === 'line' || data.type === 'area') {
        data.element.animate({
          d: {
            begin: 600,
            dur: 700,
            from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
            to: data.path.clone().stringify(),
            easing: Chartist.Svg.Easing.easeOutQuint
          }
        });
      } else if (data.type === 'point') {
        seq++;
        data.element.animate({
          opacity: {
            begin: seq * delays,
            dur: durations,
            from: 0,
            to: 1,
            easing: 'ease'
          }
        });
      }
    });

    seq = 0;
  };

  findAllProjects() { 
    this.projectService.findAll().subscribe(projects => {
      this.projects = projects;
    });
  }
}
