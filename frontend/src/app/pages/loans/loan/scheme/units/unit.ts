export interface AreaType {
    value: string;
}
export interface AssetClass {
    value: string;
}
export interface AreaMetric {
    value: string;
}

export interface Unit {
    id: number,
    quantity: number,
    type: string,
    beds?: number,
    area?: number,
    area_type?: AreaType,
    area_metric?: AreaMetric,
    asset_class: AssetClass,
    scheme_id: number
}


