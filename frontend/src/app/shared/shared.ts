import { Unit } from "../pages/loans/loan/scheme/scheme";

export interface StringDictionary {
    [index: string]: string;
}

export interface StringUnitsDictionary {
  [index: string]: Unit[];
}

export interface Choice {
  value: string;
  display: string;
}
