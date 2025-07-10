// .lighthouserc.js
module.exports = {
  ci: {
    collect: {
      staticDistDir: "dist/new-project/browser", // 這裡請改成你實際的 build 資料夾
      numberOfRuns: 1,
    },
    assert: {
      preset: "lighthouse:recommended",
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
