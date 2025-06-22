import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as echarts from 'echarts';
import { EChartsOption } from 'echarts';
import jsPDF, { GState } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AngularCommonModule } from '../../../../../module/angular-common/angular-common.module';
import { PrimengUiModule } from '../../../../../module/primeng-ui/primeng-ui.module';
import { CommonService } from '../../../../../service/common.service';
import { TravelSchedule } from '../../../model/travel-schedule.model';
import { COST_TYPE_OPTIONS } from '../../../../../constant/constant';
import { CommonUtils } from '../../../../../ui/utils/common.utils';

@Component({
  selector: 'app-pdf-export-dialog',
  imports: [
    AngularCommonModule,
    PrimengUiModule
  ],
  templateUrl: './pdf-export-dialog.component.html',
  styleUrl: './pdf-export-dialog.component.scss'
})
export class PdfExportDialogComponent {

  /**
   * 花費類型選項
   *
   * @memberof PdfExportDialogComponent
   */
  readonly costTypeOptions = COST_TYPE_OPTIONS;

  /**
   * 行程資訊
   *
   * @type {TravelSchedule}
   * @memberof PdfExportDialogComponent
   */
  @Input() schedule: TravelSchedule;

  /**
   * 是否顯示 PDF 匯出設定對話框
   *
   * @memberof PdfExportDialogComponent
   */
  @Input() exportPdfSettingDialog = false;

  /**
   * 顯示狀態改變時觸發的輸出事件
   *
   * @memberof PdfExportDialogComponent
   */
  @Output() exportPdfSettingDialogChange = new EventEmitter<boolean>();

  /**
   * 是否要輸出預算表
   *
   * @memberof PdfExportDialogComponent
   */
  isExportCostRecord = true;

  /**
   * 圖表載入狀態
   *
   * @memberof PdfExportDialogComponent
   */
  chartLoading = false;

  /**
   * PDF 下載中狀態
   *
   * @memberof PdfExportDialogComponent
   */
  pdfLoading = false;

  /**
   * 圖表花費圖片網址
   *
   * @type {string}
   * @memberof PdfExportDialogComponent
   */
  costAnanalysisChartImageDataURL: string

  /**
   * 建構子
   * @memberof PdfExportDialogComponent
   */
  constructor(
    private _commonService: CommonService,
    private _decimalPipe: DecimalPipe,
    private _datePipe: DatePipe
  ) { }

  /**
   * 關閉 PDF 匯出設定對話框
   *
   * @memberof PdfExportDialogComponent
   */
  closeExportPdfSettingDialog(): void {
    this.exportPdfSettingDialog = false;
    this.exportPdfSettingDialogChange.emit(this.exportPdfSettingDialog);
  }

  /**
   * 繪製花費分析圖表
   *
   * @return {*}  {Promise<void>}
   * @memberof PdfExportDialogComponent
   */
  async drawCostAnalaysisChart(): Promise<void> {
    this.chartLoading = false;
    setTimeout(async () => {
      // 圖表設定
      const option: EChartsOption = {
        animation: false,
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
          subtext: '總花費：' + (this.schedule.realCost !== undefined && this.schedule.realCost !== null ? this.schedule.realCost : 0),
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
          left: 'left'
        },
        series: [
          {
            type: 'pie',
            radius: '70%',
            label: {
              formatter: ((ele) => {
                return (ele.value as number) > 1000 ? this._decimalPipe.transform(Number(ele.value), '3.0-0') as any : ele.value
              })
            },
            data: Array.from(new Set(this.schedule.costRecords.map(ele => ele.type))).map(
              type => {
                /** 初始值 */
                return {
                  name: type ? this.costTypeOptions.find(val => val.value === type).label : '未指定',
                  value: this.schedule.costRecords.reduce((acc, ele) => acc + ele.cost, 0),
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
      const element = document.getElementById('hiddenChart');
      if (element) {
        const chart = echarts.init(element);
        chart.setOption(option as any);
        const imageDataURL = chart.getDataURL({
          pixelRatio: 1.2,
          backgroundColor: '#fff',
        });
        this.costAnanalysisChartImageDataURL = imageDataURL;
        console.log(this.costAnanalysisChartImageDataURL);
      }
    }, 100)
  }

  /**
   * 下載PDF
   *
   * @return {*}  {Promise<void>}
   * @memberof ScheduleDetailComponent
   */
  async downloadPdf(): Promise<void> {

    this.pdfLoading = true;
    this._commonService.setBlock(true);

    if (this.isExportCostRecord) {
      await this.drawCostAnalaysisChart();
      console.log(this.costAnanalysisChartImageDataURL);
    }

    /** 取出字體檔 */
    const font = await import('../../../../../../assets/msjh-normal.js');
    if (font) {
      // 現在時間
      const nowTime = this._datePipe.transform(new Date(), 'yyyy/MM/dd HH:mm:ss');
      const doc = new jsPDF();
      doc.setFont('msjh');
      // 標題列
      const topArray = [
        // 旅程標題
        this.schedule.title,
        // 旅程時段
        (this._datePipe.transform(this.schedule.startDate, 'yyyy/MM/dd (EE)')) + '~' + (this._datePipe.transform(this.schedule.endDate, 'yyyy/MM/dd (EE)')),
        // 敘述
        this.schedule.description,
        '_________________________________________________________________________________________________'
      ]

      // 標題列
      autoTable(doc, {
        startY: 10,
        columns: [{ header: '', dataKey: '0' }],
        body: topArray.map(ele => ({ '0': ele })),
        columnStyles: { 0: { cellWidth: 190 } },
        styles: { font: 'msjh', fontSize: 12 },
        didParseCell: ((data) => {
          if (data.section === 'body') {
            data.cell.styles.fillColor = 'white';
            data.cell.styles.halign = 'left';
            data.cell.styles.minCellHeight = 1
            if (data.cell.text.join('') === this.schedule.title) {
              data.cell.styles.fontSize = 25
            }
          }
        }),
      })
      /** 檢查是否為第一天 */
      let firstDayCheck = false
      let c = 0
      // 加上每日行程表
      for (const ele of this.schedule.dayIntroduces) {
        autoTable(doc, {
          startY: !firstDayCheck ? doc['previousAutoTable']['finalY'] : 15,
          columns: [{ header: '', dataKey: '0' }],
          body: [{ 0: CommonUtils.returnDays(ele.date) }],
          columnStyles: { 0: { cellWidth: 183 } },
          styles: { font: 'msjh', fontSize: 16, halign: 'center' },
          didParseCell: ((data) => {
            data.cell.styles.textColor = 'darkCyan';
            data.cell.styles.fontSize = 20;
          })
        })
        autoTable(doc, {
          startY: doc['previousAutoTable']['finalY'],
          columns: [
            { header: '', dataKey: 'type' },
            { header: '時段', dataKey: 'time' },
            { header: '敘述', dataKey: 'description' },
          ],
          body: ele?.scheduleList?.length > 0 ? ele.scheduleList.map(daySchedule => {
            const obj = {
              type: '',
              time: daySchedule.time,
              description: daySchedule.description
            }
            return obj;
          }) : [{ type: '', time: '', description: '查無此日行程' }],
          columnStyles: {
            'type': { cellWidth: 15 },
            'time': { cellWidth: 38 },
            'description': { cellWidth: 130 },
          },
          styles: { font: 'msjh', fontSize: 12 },
          didParseCell: ((data) => {
            if (data.cell.raw === '移動') {
              data.cell.styles.textColor = 'darkcyan'
            }
            if (data.cell.raw === '停留') {
              data.cell.styles.textColor = 'green'
            }
            if (data.section === 'body') {
              data.cell.styles.minCellHeight = 1;
            } else if (data.section === 'head') {
              data.cell.styles.fillColor = 'darkcyan';
              data.cell.styles.textColor = 'white'
            }
          })
        })

        // 加上住宿 & 餐食
        autoTable(doc, {
          startY: doc['previousAutoTable']['finalY'] + 10,
          columns: [
            { header: '住宿&餐食', dataKey: 'detail' },
          ],
          body: [
            {
              detail: '【住宿】：' + (ele.hotelName ? ele.hotelName : '無') + '\n' +
                '【早餐】：' + (ele.breakfast ? ele.breakfast : '無') + '\n' +
                '【午餐】：' + (ele.launch ? ele.launch : '無') + '\n' +
                '【晚餐】：' + (ele.dinner ? ele.dinner : '無'),
            }
          ],
          columnStyles: {
            'detail': { cellWidth: 183 },
          },
          styles: { font: 'msjh', fontSize: 12 },
          didParseCell: ((data) => {
            if (data.section === 'body') {
              data.cell.styles.minCellHeight = 1;
            } else if (data.section === 'head') {
              data.cell.styles.fillColor = 'darkcyan';
              data.cell.styles.textColor = 'white'
            }
            data.cell.styles.minCellHeight = 1.5;
          })
        })

        // 加上購物清單列表
        autoTable(doc, {
          startY: doc['previousAutoTable']['finalY'] + 5,
          columns: [{ header: '購物清單', dataKey: 'shopping' }],
          body: [{ shopping: ele.shoppingDetail ? this.decodeHtmlEntities(ele.shoppingDetail) : '無' }],
          columnStyles: { 'shopping': { cellWidth: 183 } },
          styles: { font: 'msjh', fontSize: 12 },
          didParseCell: ((data) => {
            if (data.section === 'body') {
              data.cell.styles.minCellHeight = 1;
            } else if (data.section === 'head') {
              data.cell.styles.fillColor = 'darkcyan';
              data.cell.styles.textColor = 'white'
            }
          })
        })

        // 加上備註
        autoTable(doc, {
          startY: doc['previousAutoTable']['finalY'] + 5,
          columns: [
            { header: '備註', dataKey: 'memo' },
          ],
          body: [{ memo: ele.memo ? this.decodeHtmlEntities(ele.memo) : '無' }],
          columnStyles: { 'memo': { cellWidth: 183 }, },
          styles: { font: 'msjh', fontSize: 12 },
          didParseCell: ((data) => {
            if (data.section === 'body') {
              data.cell.styles.minCellHeight = 1;
            } else if (data.section === 'head') {
              data.cell.styles.fillColor = 'darkcyan';
              data.cell.styles.textColor = 'white'
            }
          })
        })

        c++;
        c < this.schedule.dayIntroduces.length ? doc.addPage() : null;
        firstDayCheck = true
      }

      // 增加預算表
      if (this.schedule.costRecords.length > 0) {
        doc.addPage();
        // 標題列
        autoTable(doc, {
          startY: 10,
          columns: [{ header: '', dataKey: '0' }],
          body: [{ '0': '預算紀錄表' }],
          columnStyles: { 0: { cellWidth: 180 } },
          styles: { font: 'msjh', fontSize: 22 }
        })
        autoTable(doc, {
          startY: doc['previousAutoTable']['finalY'],
          columns: [
            { header: '總花費', dataKey: 'real' },
          ],
          body: [{
            real: [null, undefined, NaN].includes(this.schedule.realCost) ? '0' : this._decimalPipe.transform(this.schedule.realCost, '3.0-0')
          }],
          columnStyles: { real: { cellWidth: 180 } },
          styles: { font: 'msjh', fontSize: 14 },
          didParseCell: ((data) => {
            data.cell.styles.halign = 'center';
            if (data.section === 'body') {
              data.cell.styles.fillColor = 'white';
            }
          }),
        })
        autoTable(doc, {
          startY: doc['previousAutoTable']['finalY'],
          columns: [
            { header: '類型', dataKey: 'type' },
            { header: '敘述', dataKey: 'description' },
            { header: '價格', dataKey: 'cost' },
          ],
          body: this.schedule.costRecords.map(ele => {
            return {
              type: this.costTypeOptions.find(val => val.value == ele.type) ? this.costTypeOptions.find(val => val.value == ele.type).label : '-',
              description: ele.description,
              cost: ele.cost > 1000 ? this._decimalPipe.transform(ele.cost, '3.0-0') : ele.cost
            }
          }),
          columnStyles: { type: { cellWidth: 25 }, description: { cellWidth: 125 }, cost: { cellWidth: 30 } },
          styles: { font: 'msjh', fontSize: 11 },
          didParseCell: ((data) => {
            if (data.section === 'body') {
              if (data.column.dataKey === 'cost') {
                data.cell.styles.halign = 'right';
              }
            }
          }),
        })
      }

      // 增加預算圖表
      if (this.costAnanalysisChartImageDataURL && this.schedule.costRecords.length > 0) {
        doc.addPage()
        doc.addImage(this.costAnanalysisChartImageDataURL, 10, 15, 195, 220);
      }

      // 印上頁碼
      for (let i = 0; i < doc.getNumberOfPages(); i++) {
        doc.setPage(i + 1);
        doc.setGState(new GState({ opacity: 1 }));
        doc.setFontSize(10);
        doc.text(`${i + 1} / ${doc.getNumberOfPages()}`, 100, 290);
        /** 頁尾 */
        doc.text(nowTime, 170, 290);
        doc.setGState(new GState({ opacity: 0.065 }));
        doc.setFontSize(11);
        doc.setGState(new GState({ opacity: 1 }));
      }
      const fileName = this.schedule.title
      doc.save(fileName)
      doc.close();
      this.closeExportPdfSettingDialog();
    } else {
      this._commonService.showMsg('e', '下載失敗')
    }
  }

  /**
   * 移除HTML Code
   *
   * @param {string} inputStr
   * @return {*}  {string}
   * @memberof ScheduleDetailComponent
   */
  decodeHtmlEntities(inputStr: string): string {
    inputStr = inputStr.replace(/<.*?>/g, '\n').replace(/\n+/g, '\n');
    const entities = [
      { char: '&lt;', replacement: '<' },
      { char: '&gt;', replacement: '>' },
      { char: '&amp;', replacement: '&' },
      { char: '&quot;', replacement: '"' },
      { char: '&apos;', replacement: "'" },
      { char: '&#39;', replacement: "'" }
    ];

    for (let i = 0; i < entities.length; i++) {
      const entity = entities[i];
      const regex = new RegExp(entity.char, 'g');
      inputStr = inputStr.replace(regex, entity.replacement);
    }
    return inputStr.replace(/^\n+/, '').replace(/\n$/, '')
  }
}
