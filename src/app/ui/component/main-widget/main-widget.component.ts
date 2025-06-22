import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { BASIC_ANIMATIONS } from '../../../constant/constant';
import { AngularCommonModule } from '../../../module/angular-common/angular-common.module';
import { PrimengUiModule } from '../../../module/primeng-ui/primeng-ui.module';
import { CommonService } from '../../../service/common.service';
import { LoadingComponent } from '../loading/loading.component';

@Component({
  selector: 'app-main-widget',
  standalone: true,
  imports: [
    PrimengUiModule,
    AngularCommonModule,
    LoadingComponent,
    RouterOutlet,
  ],
  animations: [
    BASIC_ANIMATIONS
  ],
  templateUrl: './main-widget.component.html',
  styleUrl: './main-widget.component.scss',
  providers: [
    CommonService,
    MessageService,
    ConfirmationService
  ]
})
export class MainWidgetComponent {

  /**
   * 訊息訂閱器
   *
   * @type {Subscription}
   * @memberof MainWidgetComponent
   */
  msgSubscriber?: Subscription;

  /**
   * 黑屏訂閱
   *
   * @type {Subscription}
   * @memberof MainWidgetComponent
   */
  blockSubscriber?: Subscription;

  /**
   * 是否顯示黑屏
   *
   * @memberof MainWidgetComponent
   */
  block = false

  /**
   * 載入
   *
   * @memberof MainWidgetComponent
   */
  loading = false;

  /**
   * 菜單
   *
   * @memberof MainWidgetComponent
   */
  menu = [
    { label: '我的行程列表', url: 'schedule', active: true },
    { label: '分帳計算', url: 'balance', active: false },
  ];

  /**
   * 建構子
   * @param {CommonService} commonService
   * @param {Router} router
   * @param {MessageService} messageService
   * @param {ConfirmationService} confirmationService
   * @memberof MainWidgetComponent
   */
  constructor(
    private _router: Router,
    private _commonService: CommonService,
    private _messageService: MessageService
  ) {
    this._setSubscriber();
  }

  isMenuOpen = false;

  /**
   * 設定訂閱
   *
   * @private
   * @memberof MainWidgetComponent
   */
  private _setSubscriber(): void {
    this.msgSubscriber = this._commonService.msgEmitter.subscribe((msg) => {
      this._messageService.add(msg);
    });
    this.blockSubscriber = this._commonService.blockEmitter.subscribe((block) => {
      this.block = block;
    });
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  goto(event: Event, url: string): void {
    event.preventDefault();
    this.menu.forEach(item => item.active = false);
    const clickedItem = this.menu.find(item => item.url === url);
    if (clickedItem) {
      clickedItem.active = true;
    }

    // 關閉手機版選單
    this.isMenuOpen = false;

    // 平滑滾動到對應區域（如果是錨點）
    if (url.startsWith('#')) {
      const element = document.querySelector(url);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    } else {
      this._router.navigate([url]);
    }
  }
}
