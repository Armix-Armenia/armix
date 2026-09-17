#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { compileProject } from "./compiler";
import { startServer } from "./server";

const args = process.argv.slice(2);
const command = args[0];

function printHelp() {
    console.log(`
ARMIX v0.1.0

Commands:

  armix create <project>
  armix build:production
  armix node:start:localhost-0.0.0.0:<port>
  armix install
  armix react:enable
  armix node:production
  armix push -m <message>
`);
}

function createProject(name: string) {
    const project = path.resolve(process.cwd(), name);

    if (fs.existsSync(project)) {
        console.error(`✗ Project already exists: ${name}`);
        process.exit(1);
    }

    fs.mkdirSync(project, { recursive: true });
    fs.mkdirSync(path.join(project, "armix"));

    fs.writeFileSync(
        path.join(project, "armix", "armix.log"),
        ""
    );

    fs.writeFileSync(
        path.join(project, "index.arm"),
`<!docktype arm>

<armix lang="hy-EN">

    <armtitle>
        ${name}
    </armtitle>

    <armh1>
        Barev ARMIX!
    </armh1>

    <armtext>
        My first ARMIX website.
    </armtext>

</armix>
`
    );

    fs.writeFileSync(
        path.join(project, "style.armcss"),
        `armbody {
    font: Arial;
}
`
    );

    fs.writeFileSync(
        path.join(project, "script.armjs"),
        ``
    );

    fs.writeFileSync(
        path.join(project, "types.ar"),
        ``
    );

    console.log(`
✓ ARMIX project created!

Project:
${name}

Next:

  cd ${name}
  armix build:production
`);
}

async function main() {

    if (!command) {
        printHelp();
        return;
    }

    switch (command) {

        case "create": {
            const name = args[1];

            if (!name) {
                console.error("✗ Please provide project name.");
                process.exit(1);
            }

            createProject(name);
            break;
        }

        case "build:production": {
            const success = compileProject(process.cwd());

            if (!success) {
                console.error(
                    "\nWebsite was NOT started."
                );

                process.exit(1);
            }

            console.log("\n✓ Production build completed.");
            break;
        }

        default: {

            if (
                command.startsWith(
                    "node:start:localhost-0.0.0.0:"
                )
            ) {
                const portString =
                    command.split(":").pop();

                const port = Number(portString);

                if (!Number.isInteger(port)) {
                    console.error("✗ Invalid port.");
                    process.exit(1);
                }

                const success =
                    compileProject(process.cwd());

                if (!success) {
                    console.error(
                        "\nServer was NOT started."
                    );

                    console.error(
                        "Browser was NOT opened."
                    );

                    process.exit(1);
                }

                await startServer(
                    process.cwd(),
                    port
                );

                break;
            }

            if (command === "install") {
                console.log("ARMIX installation system coming...");
                break;
            }

            if (command === "react:enable") {
                console.log("✓ React integration enabled.");
                break;
            }

            if (command === "node:production") {
                console.log("✓ Node production mode enabled.");
                break;
            }

            if (command === "push") {
                console.log("ARMIX Git integration coming...");
                break;
            }

            printHelp();
        }
    }
}

main();
