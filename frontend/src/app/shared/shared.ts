// import { Unit } from "../pages/loans/loan/scheme/scheme";

import { Unit } from "../pages/loans/loan/scheme/scheme.model";

export interface StringDictionary {
    [index: string]: string;
}

export interface StringUnitsDictionary {
  [index: string]: Unit[];
}

export interface Choice {
  value: string;
  label: string;
}
