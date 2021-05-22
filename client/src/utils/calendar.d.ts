declare namespace lunarCalendar {
  interface LunarCalendar extends Object {
    date: string;
    lunarDate: string;
    festival?: any;
    lunarFestival?: any;
    lYear: number;
    lMonth: number;
    lDay: number;
    Animal: string;
    IMonthCn: string;
    IDayCn: string;
    cYear: number;
    cMonth: number;
    cDay: number;
    gzYear: string;
    gzMonth: string;
    gzDay: string;
    isToday: boolean;
    isLeap: boolean;
    nWeek: number;
    ncWeek: string;
    isTerm: boolean;
    Term?: any;
    astro: string;
  }

  /**
   * 传入阳历年月日获得详细的公历、农历object信息 <=>JSON
   * @param y  solar year
   * @param m  solar month
   * @param d  solar day
   * @return JSON object
   * @eg:console.log(calendar.solar2lunar(1987,11,01));
   */
  export function solar2lunar(y, m, d): LunarCalendar;

  export var fn: LunarCalendar;

  export var calendar;
}

export = lunarCalendar
