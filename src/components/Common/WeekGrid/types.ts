export interface WeekDay {
    id: string;
    dayNumber: number;
  }
  
  export interface WeekRange {
    start: number;
    end: number;
    name: string;
  }
  
  export interface Period extends WeekRange {
    exercises?: any[];
  }