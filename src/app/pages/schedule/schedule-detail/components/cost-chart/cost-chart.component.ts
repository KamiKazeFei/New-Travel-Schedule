import { DecimalPipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import * as echarts from 'echarts';
import { EChartsOption } from 'echarts';
import { COST_TYPE_OPTIONS } from '../../../../../constant/constant';
import { AngularCommonModule } from '../../../../../module/angular-common/angular-common.module';
import { PrimengUiModule } from '../../../../../module/primeng-ui/primeng-ui.module';
import { TravelCostRecord } from '../../../model/travel-schedule.model';

@Component({
  selector: 'app-cost-chart',
  imports: [
    AngularCommonModule,
    PrimengUiModule
  ],
  templateUrl: './cost-chart.component.html',
  styleUrl: './cost-chart.component.scss',
  providers: [
    DecimalPipe
  ]
})
export class CostChartComponent implements OnChanges {

  /**
   * 花費記錄
   *
   * @type {TravelCostRecord[]}
   * @memberof CostChartComponent
   */
  @Input() costRecords: TravelCostRecord[] = [];

  /**
   * 是否顯示花費分析對話框
   *
   * @memberof CostChartComponent
   */
  @Input() costAnalysisDialogVisible = false;

  /**
   * 花費分析對話框可見性變更
   *
   * @memberof CostChartComponent
   */
  @Output() costAnalysisDialogVisibleChange = new EventEmitter<boolean>();

  /**
   * 圖表載入狀態
   *
   * @memberof CostChartComponent
   */
  chartLoading = false;

  /**
   * 花費類型陣列
   *
   * @memberof CostChartComponent
   */
  costTypeOptions = COST_TYPE_OPTIONS

  /**
   * 建構子
   * @param {DecimalPipe} decimalPipe
   * @memberof CostChartComponent
   */
  constructor(private decimalPipe: DecimalPipe,) { }

  /**
   * Input屬性變更
   *
   * @param {SimpleChanges} changes
   * @memberof CostChartComponent
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['costRecords']) {
      this.chartLoading = true;
      setTimeout(() => {
        this.drawCostAnalysisChart('costRecordChart');
      }, 100)
    }
  }

  /**
   * 關閉花費分析對話框
   *
   * @memberof CostChartComponent
   */
  closeCostAnalysisDialog(): void {
    this.costAnalysisDialogVisible = false;
    this.costAnalysisDialogVisibleChange.emit(false);
  }

  /**
   * 繪製花費分析圖表
   *
   * @param {string} id
   * @return {*}  {Promise<void>}
   * @memberof CostChartComponent
   */
  async drawCostAnalysisChart(id: string): Promise<void> {
    this.chartLoading = false;
    setTimeout(async () => {
      // 圖表設定
      const option: EChartsOption = {
        animation: true,
        grid: {
          top: '30%',
          right: '0%',
          left: '0%',
          bottom: '2%'
        },
        title: {
          text: '花費分析圖',
          textStyle: {
            fontSize: 28
          },
          subtext: '總花費：' + this.costRecords.reduce((acc, ele) => acc + (ele?.cost ?? 0), 0),
          subtextStyle: {
            fontSize: 18
          },
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left',

        },
        series: [
          {
            type: 'pie',
            radius: '70%',
            label: {
              formatter: ((ele) => {
                return (ele.value as number) > 1000 ? this.decimalPipe.transform(Number(ele.value), '3.0-0') as any : ele.value
              })
            },
            data: Array.from(new Set(this.costRecords.map(ele => ele.type))).map(
              type => {
                return {
                  name: type ? this.costTypeOptions.find(val => val.value === type)?.label : '未指定',
                  value: this.costRecords.filter(ele => ele.type === type).reduce((acc, ele) => acc + (ele?.cost ?? 0), 0)
                }
              }
            ),
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };

      // 畫面物件
      const element = document.getElementById(id);
      if (element) {
        const chart = echarts.init(element);
        chart.setOption(option as any);
      }
    }, 100)
  }
}
