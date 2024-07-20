export interface Property {
    
  property_name: string;
  address: string;
  price: number;
  type: string;
  bedroom: number;
  bathroom: number;
  total_floors: number;
  garden: boolean;
  power: string;
  description: string;
  images: string[];
}
export class Property implements Property {
    constructor(
        public person_name: string,
        public property_name: string,
        public address: string,
        public price: number,
        public type: string,
        public nrBathrooms: number,
        public nrBedrooms: number,
        public nrFloors: number,
        public garden: boolean,
        public powerBackUp: boolean,
        public description: string,
        public imageUrls: string[],
    ) {}
}