import ILink from "./ILink";

export default interface ILinkWithCallback extends ILink {
    callback: any;
    isLink: boolean;
    hide?: boolean;
}
