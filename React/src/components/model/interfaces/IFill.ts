import { Moment } from "moment";

export default interface IFill {
    index: number;
    date: Moment;
    spend: number;
    pricePerLitre: number;
    totalVolume: number;
    discountApplied: number;
}
