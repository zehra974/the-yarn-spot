import { createRequire } from "module";

const require = createRequire(import.meta.url);

const backend = require("../server.js");

export default backend;