#!/usr/bin/env python3
"""Inject a release signing config into the Expo-generated Android project.

This runs in CI after `expo prebuild`. It:
  1. Adds a `release` signingConfig (reading values from environment variables)
     inside the existing `signingConfigs { ... }` block.
  2. Points the `release` buildType at `signingConfigs.release` instead of the
     default `signingConfigs.debug`.

Secrets are passed via environment variables at build time, so nothing
sensitive is written into tracked files.
"""

import re
import sys

GRADLE_PATH = "android/app/build.gradle"

RELEASE_SIGNING = """
        release {
            storeFile file(System.getenv("ZUZU_STORE_FILE") ?: "release.keystore")
            storePassword System.getenv("ZUZU_STORE_PASSWORD")
            keyAlias System.getenv("ZUZU_KEY_ALIAS")
            keyPassword System.getenv("ZUZU_KEY_PASSWORD")
        }
"""


def main():
    try:
        with open(GRADLE_PATH, "r") as f:
            gradle = f.read()
    except FileNotFoundError:
        print("ERROR: %s not found. Did `expo prebuild` run?" % GRADLE_PATH)
        sys.exit(1)

    if "signingConfigs {" not in gradle:
        print("ERROR: no signingConfigs block found in build.gradle")
        sys.exit(1)

    # 1) Add the release signingConfig once (idempotent).
    before_build_types = gradle.split("buildTypes")[0]
    already_has_release_signing = re.search(
        r"signingConfigs\s*\{[^}]*\brelease\b", before_build_types, flags=re.S
    )
    if not already_has_release_signing:
        gradle = gradle.replace(
            "signingConfigs {", "signingConfigs {" + RELEASE_SIGNING, 1
        )

    # 2) Point the release buildType at the release signing config.
    new_gradle, count = re.subn(
        r"(buildTypes\s*\{.*?release\s*\{[^}]*?signingConfig\s+signingConfigs\.)debug",
        r"\1release",
        gradle,
        count=1,
        flags=re.S,
    )
    if count > 0:
        gradle = new_gradle

    with open(GRADLE_PATH, "w") as f:
        f.write(gradle)

    # 3) Hard verification: the release buildType MUST reference
    #    signingConfigs.release. If not, fail loudly so we never silently
    #    produce a debug-signed release (which Google Play rejects).
    release_block = re.search(
        r"buildTypes\s*\{.*?release\s*\{(.*?)\n        \}",
        gradle,
        flags=re.S,
    )
    uses_release = bool(
        re.search(
            r"release\s*\{[^}]*?signingConfig\s+signingConfigs\.release",
            gradle,
            flags=re.S,
        )
    )
    if not uses_release:
        print("ERROR: release buildType is NOT using signingConfigs.release.")
        print("Refusing to continue to avoid a debug-signed release build.")
        if release_block:
            print("--- release buildType block ---")
            print(release_block.group(1))
        sys.exit(1)

    print("Signing configured in %s (release buildType -> signingConfigs.release)"
          % GRADLE_PATH)


if __name__ == "__main__":
    main()
