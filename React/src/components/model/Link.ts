import ILink from "./interfaces/ILink";

export class Link implements ILink {
    label: string;
    link: string;

    constructor(label: string, link: string) {
        this.label = label;
        this.link = link;
    }
}
