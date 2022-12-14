process.env.TS_NODE_TRANSPILE_ONLY = true;

export default {
  extensions: {
    ts: "module",
  },
  nodeArguments: ["--loader=ts-node/esm"],
};
