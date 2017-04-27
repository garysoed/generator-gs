package(default_visibility = ["//:internal"])

# Loads all the GS Bazel dependencies.
<% gsBazelDeps.forEach((gsBazelDep) => { -%>
load("<%- gsBazelDep.from %>", <%- gsBazelDep.targets.map((target) => `"${target}"`).join(', ') %>)
<% }); -%>

package_group(
    name = "internal",
    packages = ["//..."]
)

<% if (hasTypescript) { -%>
ts_library(
    name = "lib_js",
    srcs = [],
    deps = [
        "//src/<%- mainDir %>"
    ]
)

ts_binary(
    name = "bin_js",
    deps = [":lib_js"],
)
<% } -%>

<% if (isWebapp) { -%>
filegroup(
    name = "pack_template",
    srcs = [
        # "@gs_ui//:pack_template",
        # "//src/dir:template",
    ]
)

webpack_binary(
    name = "pack_js",
    package = ":bin_js",
    entry = "src/<%- mainDir %>/<%- mainFile %>",
)

genrule(
    name = "pack",
    srcs = [
        "//:pack_js",
        "//:pack_template",
    ],
    outs = ["pack.js"],
    cmd = "awk 'FNR==1{print \"\"}1' $(SRCS) > $@",
)
<% } -%>

<% if (hasTypescript) { -%>
filegroup(
    name = "tslint_config",
    srcs = ["tslint.json"]
)

test_suite(
    name = "lint",
    tests = [
        # "//src/dir:lint",
    ]
)
<% } -%>

<% if (hasTypescript) { -%>
karma_run(
    name = "test",
    srcs = [
        # "//src/dir:test_src",
    ]
)
<% } -%>