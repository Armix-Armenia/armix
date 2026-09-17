import fs from "fs";
import path from "path";

export function compileProject(
    projectPath: string
): boolean {

    const input = path.join(
        projectPath,
        "index.arm"
    );

    const outputDir = path.join(
        projectPath,
        "dist"
    );

    const logFile = path.join(
        projectPath,
        "armix",
        "armix.log"
    );

    try {

        if (!fs.existsSync(input)) {
            throw new Error(
                "index.arm was not found."
            );
        }

        const source =
            fs.readFileSync(input, "utf8");

        validate(source);

        const title =
            getTag(source, "armtitle");

        const h1 =
            getTag(source, "armh1");

        const text =
            getTag(source, "armtext");

        const html = `<!DOCTYPE html>
<html lang="hy">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
        content="width=device-width, initial-scale=1.0">

    <title>${escapeHtml(title)}</title>
</head>

<body>

    <h1>${escapeHtml(h1)}</h1>

    <p>${escapeHtml(text)}</p>

</body>
</html>`;

        fs.mkdirSync(
            outputDir,
            { recursive: true }
        );

        fs.writeFileSync(
            path.join(outputDir, "index.html"),
            html
        );

        // Clear previous errors
        fs.writeFileSync(logFile, "");

        console.log(
            "✓ ARMIX project compiled successfully."
        );

        return true;

    } catch (error) {

        const message =
            error instanceof Error
                ? error.message
                : String(error);

        const log = `
[ARMIX ERROR]

${message}

Website was NOT started.
`;

        fs.mkdirSync(
            path.dirname(logFile),
            { recursive: true }
        );

        fs.writeFileSync(
            logFile,
            log
        );

        console.error(log);

        return false;
    }
}

function validate(source: string) {

    if (!source.includes("<!docktype arm>")) {
        throw new Error(
            "ARM001: Missing <!docktype arm>"
        );
    }

    if (!source.includes("<armix")) {
        throw new Error(
            "ARM002: Missing <armix> root element"
        );
    }

    checkTag(source, "armtitle");
    checkTag(source, "armh1");
    checkTag(source, "armtext");
}

function checkTag(
    source: string,
    tag: string
) {

    const open =
        `<${tag}>`;

    const close =
        `</${tag}>`;

    if (
        source.includes(open) &&
        !source.includes(close)
    ) {
        throw new Error(
            `ARM101: <${tag}> has no closing tag.`
        );
    }
}

function getTag(
    source: string,
    tag: string
): string {

    const regex =
        new RegExp(
            `<${tag}>([\\s\\S]*?)</${tag}>`,
            "i"
        );

    const match =
        source.match(regex);

    return match
        ? match[1].trim()
        : "";
}

function escapeHtml(
    value: string
): string {

    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}
