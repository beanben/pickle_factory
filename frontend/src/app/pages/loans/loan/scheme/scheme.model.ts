import { AssetClassType } from './scheme';



// export abstract class AssetClassAbstract {
//     abstract readonly use: string;

//     constructor(
//         // public scheme: Scheme,
//         public schemeId: number,
//         public investmentStrategy: string = "",
//         public id?: number,
//     ) {
//     }
// }

// export class Hotel extends AssetClassAbstract {
//     readonly use = "hotel";
// }

// export class Residential extends AssetClassAbstract {
//     readonly use = "residential";
// }

// export class Commercial extends AssetClassAbstract {
//     readonly use = "commercial";
// }

// export class StudentAccommodation extends AssetClassAbstract {
//     readonly use = "studentAccommodation";
// }

// export class Office extends AssetClassAbstract {
//     readonly use = "office";
// }

// export class ShoppingCentre extends AssetClassAbstract {
//     readonly use = "shoppingCentre";
// }

// export class Unit {
//     readonly label: "unit" | "room";
//     readonly areaType: "NIA" | "GIA";

//     constructor(
//         public assetClass: AssetClassType,
//         public identifier: string = "",
//         public description: string = "",
//         public beds?: number,
//         public areaSize?: number,
//         public areaSystem: "sqft" | "sqm" = "sqft",
//         public id?: number,
//     ) {
//         this.label = this.defineLabel();
//         this.areaType = this.defineAreaType();
//     }

//     defineLabel(): "unit" | "room" {
//         const hasRooms = ["hotel", "studentAccommodation"];
//         const hasUnits = ["commercial", "office", "shoppingCentre", "residential"];
//         return hasRooms.includes(this.assetClass.use.toLowerCase()) ? "room" : "unit";
//     }

//     defineAreaType(): "NIA" | "GIA" {
//         const isNIA = ["hotel", "studentAccommodation", "residential"];
//         const isGIA = ["commercial", "office", "shoppingCentre",];
//         return isNIA.includes(this.assetClass.use.toLowerCase()) ? "NIA" : "GIA";
//     }

//     hasBeds(): boolean {
//         const hasBeds = ["studentAccommodation", "hotel", "residential"];
//         return hasBeds.includes(this.assetClass.use.toLowerCase());
//     }

// }

export class Unit {
  readonly label: 'unit' | 'room';
  readonly areaType: 'NIA' | 'GIA';

  constructor(
    public assetClass: AssetClassType,
    public identifier: string = '',
    public description: string = '',
    public beds?: number,
    public areaSize?: number,
    public areaSystem: 'sqft' | 'sqm' = 'sqft',
    public id?: number
  ) {
    this.label = this.defineLabel();
    this.areaType = this.defineAreaType();
  }

  defineLabel(): 'unit' | 'room' {
    const hasRooms = ['hotel', 'studentAccommodation'];
    const hasUnits = ['commercial', 'office', 'shoppingCentre', 'residential'];
    return hasRooms.includes(this.assetClass.use.toLowerCase()) ? 'room' : 'unit';
  }

  defineAreaType(): 'NIA' | 'GIA' {
    const isNIA = ['hotel', 'studentAccommodation', 'residential'];
    const isGIA = ['commercial', 'office', 'shoppingCentre'];
    return isNIA.includes(this.assetClass.use.toLowerCase()) ? 'NIA' : 'GIA';
  }

  hasBeds(): boolean {
    const hasBeds = ['studentAccommodation', 'hotel', 'residential'];
    return hasBeds.includes(this.assetClass.use.toLowerCase());
  }
}

// export class AssetClassFactory {
//   constructor(private scheme: Scheme) {}

//   defineAssetClass(use: string): AssetClassType {
//     switch (use) {
//       case 'hotel':
//         return new Hotel(this.scheme.id);
//       case 'residential':
//         return new Residential(this.scheme.id);
//       case 'commercial':
//         return new Commercial(this.scheme.id);
//       case 'studentAccommodation':
//         return new StudentAccommodation(this.scheme.id);
//       case 'office':
//         return new Office(this.scheme.id);
//       case 'shoppingCentre':
//         return new ShoppingCentre(this.scheme.id);
//       default:
//         return new Residential(this.scheme.id);
//     }
//   }
// }

export class Sale {
  constructor(
    public unit: Unit,
    public status: 'available' | 'underOffer' | 'exchanged' | 'completed' = 'available',
    public statusDate: Date | null = null,
    public priceTarget: number = 0,
    public priceAchieved: number = 0,
    public buyer: string = '',
    public id?: number
  ) {}
}

export class Lease {
  readonly rentFrequency: 'perWeek' | 'perMonth';
  readonly leaseFrequency: 'weeks' | 'months';

  constructor(
    public unit: Unit,
    public tenant: string = '',
    public leaseType: 'openMarket' | 'discountedMarket' = 'openMarket',
    public rentTarget: number = 0,
    public rentAchieved: number = 0,
    public startDate: Date = new Date(),
    public term: number = 0,
    public endDate: Date = new Date(),
    public id?: number
  ) {
    this.rentFrequency = this.defineRentFrequency();
    this.leaseFrequency = this.defineLeaseFrequency();
  }

  defineRentFrequency(): 'perWeek' | 'perMonth' {
    const use: string = this.unit.assetClass.use;
    return use === 'studentAcommodation' ? 'perWeek' : 'perMonth';
  }

  defineLeaseFrequency(): 'weeks' | 'months' {
    return this.rentFrequency === 'perWeek' ? 'weeks' : 'months';
  }
}
