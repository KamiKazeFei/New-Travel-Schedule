import { animate, state, style, transition, trigger } from '@angular/animations';

/**
 * 基本動畫
 *
 * @export
 * @constant BASIC_ANIMATIONS
 */
export const BASIC_ANIMATIONS =
  trigger('fadeInOut', [
    state('void', style({
      opacity: 0,
      visibility: 'hidden'
    })),
    state('*', style({
      opacity: 1,
      visibility: 'visible'
    })),
    transition(':enter', [
      animate('0.25s')
    ]),
    transition(':leave', [
      animate('0.25s')
    ])
  ])


/**
 * 最大日期
 */
export const MAX_DATE = new Date(8640000000000000);

/**
 * 最小日期
 */
export const MIN_DATE = new Date(-8640000000000000);

/**
 * 預算類型選項
 *
 * @export
 * @constant COST_TYPE_OPTIONS
 */
export const COST_TYPE_OPTIONS = [
  { label: '機票/車票', value: 'A' },
  { label: '住宿', value: 'B' },
  { label: '景點', value: 'C' },
  { label: '交通', value: 'D' },
  { label: '餐食', value: 'E' },
  { label: '禮物/伴手禮', value: 'F' },
  { label: '其他', value: 'G' }
];
