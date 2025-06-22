import { Component, Input } from '@angular/core';
import { COST_TYPE_OPTIONS } from '../../../../../constant/constant';
import { AngularCommonModule } from '../../../../../module/angular-common/angular-common.module';
import { PrimengUiModule } from '../../../../../module/primeng-ui/primeng-ui.module';
import { CommonService } from '../../../../../service/common.service';
import { TravelCostRecord, TravelSchedule } from '../../../model/travel-schedule.model';
import { CostChartComponent } from '../cost-chart/cost-chart.component';

@Component({
  selector: 'app-cost-record',
  imports: [
    AngularCommonModule,
    PrimengUiModule,
    CostChartComponent
  ],
  templateUrl: './cost-record.component.html',
  styleUrl: './cost-record.component.scss'
})
export class CostRecordComponent {

  /**
   * 行程資料
   *
   * @type {TravelSchedule}
   * @memberof CostRecordComponent
   */
  @Input() schedule: TravelSchedule;

  /**
   * 花費類型陣列
   *
   * @memberof CostRecordComponent
   */
  costTypeOptions = COST_TYPE_OPTIONS;

  /**
   * 排序紀錄
   *
   * @memberof ScheduleDetailComponent
   */
  costRecordSortMap = {};


  /**
   * 花費分析對話框是否可見
   *
   * @type {boolean}
   * @memberof CostRecordComponent
   */
  costAnalysisDialogVisible = false;

  /**
   * 建構子
   * @memberof CostRecordComponent
   */
  constructor(
    private _commonService: CommonService
  ) { }

  /**
   * 移除預算紀錄
   *
   * @param {TravelCostRecord} data
   * @memberof CostRecordComponent
   */
  deleteCostRecord(data: TravelCostRecord): void {
    this.schedule.costRecords = this.schedule.costRecords.filter(ele => ele.id !== data.id)
    this.schedule.realCost = this.schedule.costRecords.reduce((acc, ele) => acc + ele.cost, 0);
  }

  /**
   * 計算花費成本
   *
   * @param {TravelCostRecord} record
   * @memberof CostRecordComponent
   */
  calculateCost(): void {
    this.schedule.realCost = this.schedule.costRecords.reduce((acc, ele) => acc + ele.cost, 0);
  }

  /**
   * 檢查排序鍵值是否已經在Map中
   *
   * @param {string} columnName
   * @return {*}  {boolean}
   * @memberof ScheduleDetailComponent
   */
  checkSortKeyInMap(columnName: string): boolean {
    return Object.keys(this.costRecordSortMap).includes(columnName)
  }

  /**
   * 進行預算紀錄表排序
   *
   * @param {string} column
   * @memberof ScheduleDetailComponent
   */
  sortCostRecordsData(column: string): void {
    this.costRecordSortMap[column] = !this.costRecordSortMap[column];
    column === 'cost'
      ? this.schedule.costRecords.sort((a, b) => this.costRecordSortMap[column] ? a[column] - b[column] : b[column] - a[column])
      : this.schedule.costRecords.sort((a, b) => this.costRecordSortMap[column] ? a[column].localeCompare(b[column]) : b[column].localeCompare(a[column]))
    this.schedule.costRecords.forEach((ele, i) => ele.serNo = i + 1);
  }

  /**
   * 建立預算紀錄
   *
   * @memberof CostRecordComponent
   */
  createCostRecord(): void {
    const costRecord = new TravelCostRecord();
    costRecord.scheduleId = this.schedule.id;
    if (!this.schedule.costRecords) {
      this.schedule.costRecords = []
    }
    // 行動裝置的話往下加，反之從頭插入
    this._commonService.isMobileDevice()
      ? this.schedule.costRecords.push(costRecord)
      : this.schedule.costRecords.splice(0, 0, costRecord)
    this.schedule.costRecords.forEach((ele, i) => ele.serNo = (i + 1));
  }

  /**
   * 開啟花費分析對話框
   *
   * @memberof CostRecordComponent
   */
  openCostAnalysisDialog(): void {
    this.costAnalysisDialogVisible = true;
  }
}
