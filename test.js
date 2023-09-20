/*!
Copyright 2023. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import mock from "mock-fs";

import fs from "fs";
import { join } from "path";

import test from "ava";

import globConcat, { MESSAGES } from "./index.js";

function readFile(filename) {
	return mock.bypass(() =>
		fs.readFileSync(join(process.cwd(), filename), "utf-8")
	);
}

test.beforeEach(() => {
	mock({
		"./fixtures": mock.load("./fixtures", { recursive: true }),
		"./expected": {},
	});
});

test("concatenate two files", async (t) => {
	return (
		globConcat(
			["./fixtures/file-1.md", "./fixtures/file-2.md"],
			"./expected/concat.md",
			{ fs: fs }
		)
			.then((result) => {
				t.is(
					result.content,
					readFile(`./expected/concat.md`),
					"content matches"
				);
				t.assert(result.map, "sourcemap content matches");
			})
			// No errors should be thrown, so fail the test if one is
			.catch((error) => {
				t.fail(error.message);
			})
	);
});

test("concatenate with globs", async (t) => {
	const output = "./expected/concat.md";
	return (
		globConcat(["./fixtures/*.md"], output, { fs: fs })
			.then((result) => {
				t.is(
					result.inputFiles.length,
					2,
					"number of input files found matches expected"
				);
				t.is(result.content, readFile(output), "content matches");
				t.assert(result.map, "sourcemap exists");
			})
			// No errors should be thrown, so fail the test if one is
			.catch((error) => {
				t.fail(error.message);
			})
	);
});

test("concatenate with globs to stdout", async (t) => {
	return (
		globConcat(["./fixtures/*.css"], undefined, { fs: fs })
			.then((result) => {
				t.is(
					result.inputFiles.length,
					2,
					"number of input files found matches expected"
				);
				// Check the stdout for the expected content
				t.is(
					result.content,
					readFile(`./expected/concat-stdout.css`),
					"content matches"
				);
			})
			// No errors should be thrown, so fail the test if one is
			.catch((error) => {
				t.fail(error.message);
			})
	);
});

test("empty file with error", async (t) => {
	const output = "./expected/concat.md";
	return globConcat(["./fixtures/file-empty.md"], output, {
		allowEmpty: false,
		fs: fs,
	})
		.then((result) => {
			t.is(result.content, readFile(output), "content matches");
			t.assert(result.map, "sourcemap content matches");
		})
		.catch((error) => {
			t.is(
				error.message,
				MESSAGES.empty_file("./fixtures/file-empty.md", process.cwd())
			);
		});
});

test("no file input provided to script", async (t) => {
	return globConcat([], undefined, { allowEmpty: false, fs: fs })
		.then(() => t.fail("no input files should throw an error"))
		.catch((error) => {
			t.is(error.message, MESSAGES.no_input_files);
		});
});

test.afterEach(() => {
	mock.restore();
});
