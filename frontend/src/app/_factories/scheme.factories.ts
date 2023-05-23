import { Scheme, Unit } from '../_interfaces/scheme.interface';
import { AssetClassType } from '../_types/custom.type';

export class AssetClassFactory {
  constructor(private scheme: Scheme) {}

  defineAssetClass(use: string): AssetClassType {
    const baseAssetClass = {
      schemeId: this.scheme.id,
      // subUse:'',
      investmentStrategy: '',
    };

    switch (use) {
      case 'hotel':
        return { ...baseAssetClass, use: 'hotel' };
      case 'residential':
        return { ...baseAssetClass, use: 'residential' };
      case 'commercial':
        return { ...baseAssetClass, use: 'commercial' };
      case 'studentAccommodation':
        return { ...baseAssetClass, use: 'studentAccommodation' };
      case 'office':
        return { ...baseAssetClass, use: 'office' };
      case 'shoppingCentre':
        return { ...baseAssetClass, use: 'shoppingCentre' };
      case 'parking':
          return { ...baseAssetClass, use: 'parking' };
      default:
        return { ...baseAssetClass, use: 'residential' };
    }
  }
}

// export class UnitFactory {
//   constructor(private assetClass: AssetClassType, private scheme: Scheme) {}

//   defineUnit() {
//     return {
//       assetClassId: this.assetClass.id,
//       label: this.defineUnitLabel(),
//       beds: this.hasBeds(),
//       area_type: this.defineUnitAreaType(),
//       area_system: this.defineAreaSystem(),
//     };
//   }

//   defineUnitLabel() {
//     const hasRooms = ['hotel', 'studentAccommodation'];
//     const hasUnits = ['commercial', 'office', 'shoppingCentre', 'residential'];
//     return hasRooms.includes(this.assetClass.use) ? 'room' : 'unit';
//   }

//   defineUnitAreaType() {
//     const isNIA = ['hotel', 'studentAccommodation', 'residential'];
//     const isGIA = ['commercial', 'office', 'shoppingCentre'];
//     return isNIA.includes(this.assetClass.use) ? 'NIA' : 'GIA';
//   }

//   hasBeds() {
//     const hasBeds = ['studentAccommodation', 'hotel', 'residential'];
//     return hasBeds.includes(this.assetClass.use);
//   }

//   defineAreaSystem() {
//     return this.scheme.system;
//   }
// }

// export class LeaseFactory{
//   constructor(private assetClass: AssetClassType, private unit: Unit){}

//   defineLease(){
//     return {
//       unitId: this.unit.id,
//       leaseType: 'openMarket',
//       rentFrequency: this.defineRentFrequency()
//     }
//   }

//   defineRentFrequency(): 'perWeek' | 'perMonth' {
//     const use: string = this.assetClass.use;
//     return use === 'studentAcommodation' ? 'perWeek' : 'perMonth';
//   }

// }