import * as fs from "fs";

// write dom elements
fs.writeFileSync("dom/elements.ts", "export default function $(){};\n");

const convertProps = `let attributes: Array<string> = []; if (props) Object.entries(props).forEach((attribute) => { attributes.push(attribute[0] + "='" + attribute[1] + "'");});`;

const elements = JSON.parse(fs.readFileSync("dom/list.json", "utf8"));
elements.forEach((element: {
    tag: string,
    type: number
}) => {
    switch (element.type) {
        case 1: // children and other props
            fs.appendFileSync("dom/elements.ts", `
                $.${element.tag} = (value: any, props?: any) => {
                    if (props && typeof props != "object") console.error("Props must be an object");
                    ${convertProps}
                    if (!props) {
                        if (typeof value === "object") return "<${element.tag}>" + value.join("") + "</${element.tag}>";
                        return "<${element.tag}>" + value + "</${element.tag}>";
                    } else {
                        if (typeof value === "object") return "<${element.tag} " + attributes.join(" ") + ">" + value.join("") + "</${element.tag}>";
                        return "<${element.tag} " + attributes.join(" ") + ">" + value + "</${element.tag}>";
                    }
                };\n`);
            break;
        case 2:
            // only children
            fs.appendFileSync("dom/elements.ts", `$.${element.tag} = (value: string | number | boolean) => {return "<${element.tag}>" + value + "</${element.tag}>";};\n`);
            break;
        case 3: // only props
            fs.appendFileSync("dom/elements.ts", `
                $.${element.tag} = (props: any) => { ${convertProps} return "<${element.tag} " + attributes.join(" ") + " />"; };\n`);
            break;
        default:
            console.error("Unknown element type");
            break;
    }
});