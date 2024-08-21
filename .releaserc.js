module.exports = {
  branches: [
    "main", 
    "+([0-9])?(.{+([0-9]),x}).x", 
    { name: "beta/*", prerelease: "rc" } 
  ],
  preset: "conventionalcommits", // identifies "!" as breaking change
  plugins: [
    ["@semantic-release/github", {
      "successComment": false,
      "failTitle": false
    }],
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    ["@semantic-release/npm", {
      verifyReleaseCmd: "echo ${nextRelease.version} > .version"
    }],
    ["@semantic-release/exec", {
      verifyReleaseCmd: "echo ${nextRelease.type} > .type"
    }],
    "@semantic-release/npm"
  ]
}
