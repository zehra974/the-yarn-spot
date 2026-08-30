import { createRequire } from "module";

const require = createRequire(import.meta.url);

const backend = require("../backend/server.js");

export default backend;