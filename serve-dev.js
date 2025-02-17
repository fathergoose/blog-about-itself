import handler from "serve-handler";
import http from "node:http";
import childProcess from "node:child_process";

function serveSite() {
  const server = http.createServer((req, res) =>
    handler(req, res, {
      public: "www",
    }),
  );
  server.listen(8080, () => {
    console.log("Running at http://localhost:8080");
  });
}

const skipBuild = process.argv.some(
  (arg) => arg === "-s" || arg === "--skip-build",
);

if (skipBuild) {
  serveSite();
} else {
  childProcess.exec("./bin/build", (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      console.error("Errors from build stderr:\n", stderr);
      process.exit(1);
    }
    console.log(stdout);
    serveSite();
  });
}
