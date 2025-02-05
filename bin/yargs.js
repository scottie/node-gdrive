#!/usr/bin/env node

const yargs = require("yargs");
const chalk = require("chalk");
const error = chalk.bold.red;
const warning = chalk.keyword("orange");
const info = chalk.keyword("gray");
const { Client, Upload, Download, Share } = require("../");

var argv = yargs
  .scriptName(process.argv[1])
  .usage("$0 <cmd> [args]")
  .demandCommand(2)
  .command(
    "upload <file> [options]",
    chalk.blue("Upload file"),
    yargs => {
      yargs
        .usage("usage: $0 upload <file> [options]")
        .option("p", {
          alias: "parent",
          type: "string",
          describe: chalk.gray(
            "Parent id, used to upload file to a specific directory, can be specified multiple times to give many parents"
          )
        })
        /* .option("chunksize <chunksize>", {
          describe: chalk.gray(
            "Set chunk size in bytes, default: 8388608"
          ),
          type: "string"
        }) */
        .option("description <description>", {
          describe: chalk.gray("File description"),
          type: "string"
        })
        .option("mime <mime>", {
          describe: chalk.gray("Force mime type"),
          type: "string"
        })
        .option("share", {
          describe: chalk.gray("Share file"),
          type: "string"
        })
        .option("no-progress", {
          describe: chalk.gray("Hide progress"),
          type: "boolean"
        })
        /* .option("timeout <timeout>", {
          describe: chalk.gray(
            "Set timeout in seconds, use 0 for no timeout. Timeout is reached when no data is transferred in set amount of seconds, default: 300"
          ),
          type: "string"
        }) */
        .option("d", {
          alias: "delete",
          describe: chalk.gray("Delete file after upload"),
          type: "boolean",
          default: false
        })
        .help("help")
        .version(false);
      yargs.example(
        "$0 upload -f foo.js --share khoazero123@gmail.com --delele",
        chalk.gray(
          "Upload foo.js and share to everone then delete file on local"
        )
      );
    },
    function(argv) {
      let options = Object.assign({}, argv, {
        cli: true,
        stdout: true,
        progress: argv.hasOwnProperty("progress") ? false : true,
        share: argv.hasOwnProperty("share")
          ? argv.share
            ? argv.share
            : true
          : false,
        delete: argv.hasOwnProperty("delete")
          ? argv.delete
            ? true
            : false
          : false
      });
      // console.log(options);process.exit(1);
      if (!options.file) {
        yargs.showHelp();
      }
      new Upload(options.file, options);
    }
  )
  .command(
    "download <fileId> [options]",
    chalk.blue("Download file"),
    yargs => {
      yargs
        /* .option("id", {
          alias: "fileId",
          type: "string",
          describe: info("FileId to download")
        }) */
        .option("r", {
          alias: "resumable",
          type: "boolean",
          describe: info("Resume download"),
          default: true
        })
        .option("f", {
          alias: "force",
          type: "boolean",
          describe: info("Override file if exists")
        })
        .option("o", {
          alias: "output",
          type: "string",
          describe: info("Path to save file")
        })
        .help("help")
        .version(false);
    },
    function(argv) {
      var fileId = argv.fileId;
      // console.log(argv);process.exit(1);
      var download = new Download();
      download
        .download(fileId, {
          resumable: argv.resumable,
          force: argv.force,
          output: argv.output
        })
        .then(data => {
          // console.log(data);
        })
        .catch(err => {
          console.error(err.message);
        });
    }
  )
  .command(
    "share <fileId>",
    chalk.blue("Share file"),
    yargs => {
      yargs
        .usage("usage: $0 share <fileId> [options]")
        /* .option("id", {
          type: "string",
          describe: info("FileId to share")
        }) */
        .option("role", {
          type: "string",
          describe: info(
            "Share role: owner/writer/commenter/reader, default: reader"
          )
        })
        .option("type", {
          type: "string",
          describe: info(
            "Share type: user/group/domain/anyone, default: anyone"
          )
        })
        .option("email", {
          type: "string",
          describe: info(
            "The email address of the user or group to share the file with. Requires 'user' or 'group' as type"
          )
        })
        .option("discoverable", {
          type: "boolean",
          describe: info("Make file discoverable by search engines")
        })
        .option("revoke", {
          type: "boolean",
          describe: info(
            "Delete all sharing permissions (owner roles will be skipped)"
          )
        })
        .help("help")
        .version(false)
        .updateStrings({
          "Commands:": "item:"
        });
      //.demandOption(['run', 'path'], 'Please provide both run and path arguments to work with this tool');
    },
    function(argv) {
      // console.log(argv);process.exit(1);
      var fileId = argv.fileId;
      try {
        var share = new Share();
        share
          .share(fileId, argv.email)
          .then(result => {
            console.log(result);
          })
          .catch(err => {
            console.error(err.message);
          });
      } catch (err) {
        console.error(err.message);
      }
    }
  )
  .command(
    "token:get",
    chalk.blue("Get token"),
    yargs => {
      yargs
        .positional("t", {
          alias: "type",
          type: "string",
          describe: info("Type auth"),
          choices: ["cli", "web"],
          default: "cli"
        })
        .positional("f", {
          alias: "force",
          type: "boolean",
          describe: info("Override old token"),
          default: true
        });
    },
    function(argv) {
      let auth_type = argv._[1] || argv.type;
      try {
        var client = new Client({ auth_type: auth_type });
        client.authenticate({ force: true });
      } catch (err) {
        process.stdout.write(err.message + "\n");
      }
    }
  )
  .command("token:revoke", chalk.red("Revoke token"), function(yargs) {
    console.log(chalk.red("!") + "Revoke token not yet handled");
  })
  .demandCommand(
    1,
    chalk.red("!") + warning("You need at least one command before moving on")
  )
  .help("h")
  .alias("h", "help")
  .version(true)
  .epilog(chalk.blue("Copyright 2019 - khoazero123")).argv;

function main() {
  
}