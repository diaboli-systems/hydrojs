import $ from "../../dom/elements";

export default function Page() {
    return [
        $.title("Joe' Personal Page"),
        $.h1("welcome to joe's page", {
            style: "text-align: center;"
        }),
        $.img({
            src: "/joe.png",
            style: "display: block; margin: auto;"
        })
    ]
}