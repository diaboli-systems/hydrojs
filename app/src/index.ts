import $ from "../../dom/elements";

export default function Page() {
    return [
        $.title("HydroJS framework"),
        $.link({
            rel: "stylesheet",
            href: "style.css"
        }),
        $.link({
            rel: "icon",
            type: "image/x-icon",
            href: "/favicon.ico"
        }),
        $.h1("h1"),
        $.h2("h2", {
            style: "color: red;"
        }),
        $.div([
            $.p([
                $.span("with a span tag!"),
                " this is a paragraph tag",
            ])
        ]),
        $.a($.button("go to joe's page!"), {
            href: "/joe"
        }),
    ];
}