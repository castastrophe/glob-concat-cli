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

import { promises as fsp } from "fs";
import { relative, extname } from "path";

import chalk from "chalk";
import fg from "fast-glob";
import Concat from "concat-with-sourcemaps";

const MESSAGES = {
	no_input_files: `No files provided to concatenate.`,
	base64_conversion_failed: `Failed to convert sourcemap to base64.`,
	no_found_files: (files, cwd) =>
		`No files found matching the provided glob pattern(s): ${chalk.yellow(
			files.map((f) => relative(cwd, f)).join(", ")
		)}; use --allowEmpty to suppress this error.`,
	empty_file: (f, cwd) => `File ${relative(cwd, f)} is empty.`,
};

/**
 * Fetches the custom property details from provided CSS content;
 * content is broken down into user-defined buckets
 * @param {string|string[]} files - the filepaths to read-in and combine
 * @param {string|undefined} [outputFile] - the path to write the combined content to (optional)
 * @param {{ map: boolean; allowEmpty: boolean; cwd: string; } & import('fast-glob').Options}
 * @returns {Promise<{ inputFiles: string[]; content: string; map: string; }>}
 */
export default async function (
	files,
	outputFile = undefined,
	{
		map = true,
		allowEmpty = true,
		cwd = process.cwd(),
		/** @link https://github.com/mrmlnc/fast-glob#options-3 */
		...fgOpts
	} = {}
) {
	/** @todo throw a warning here that no files were provided */
	if (!files || !files.length)
		return Promise.reject(new Error(MESSAGES.no_input_files));
	if (typeof files === "string" && files.trim() === "")
		return Promise.reject(new Error(MESSAGES.no_input_files));

	if (typeof files === "string") files = [files];

	const concat = new Concat(map, outputFile ?? "stdout", `\n\n`);

	const checkInputFiles = (files) => {
		return files.reduce((acc, file) => {
			const ext = extname(file);
			if (!acc) return ext;
			if (acc !== ext) return false;
			return acc;
		}, undefined);
	};

	const outputExt = outputFile ? extname(outputFile) : checkInputFiles(files);
	const isEmpty = (content) => !content || content.trim() === "";
	const inlineMap = (sourcemap) => {
		if (!sourcemap || typeof sourcemap !== "string" || sourcemap.trim() === "")
			return;
		let base64;
		try {
			base64 = Buffer.from(sourcemap)?.toString("base64");
		} catch (e) {}

		// Warn if the base64 conversion failed, but don't throw an error because we don't want to break a build over this
		if (!base64) console.warn(MESSAGES.base64_conversion_failed);

		if ([".ts", ".js", ".jsx"].includes(outputExt))
			return `//# sourceMappingURL=data:application/json;base64,${base64}`;
		if ([".css"].includes(outputExt))
			return `/*# sourceMappingURL=data:application/json;base64,${base64} */`;
		/** Inline sourcemaps are not supported for formats other than js, jsx, ts, and css */ else
			return "";
	};

	/** @todo is there a way to interpolate this syntax from the extname? */
	const header = (file) => {
		if (!file || !outputExt) return;
		if ([".css", ".js", ".ts", ".tsx"].includes(outputExt))
			return `/* Source: ${file} */`;
		if ([".html", ".xml", ".md"].includes(outputExt))
			return `<!-- Source: ${file} -->`;
		if ([".txt", ".sh"].includes(outputExt)) return `# Source: ${file}`;
		else return;
	};

	/** This is the return data */
	const results = {
		inputFiles: [],
		content: "",
		map: "",
	};

	const inputFiles = await fg(files, {
		unique: true, // ideally we don't want duplicates but allow this to be overridden if needed
		...(fgOpts ?? {}),
		// Whether the below settings exist in fgOpts or not,
		// we want to force the following settings:
		onlyDirectories: false,
		onlyFiles: true,
		stats: false,
		objectMode: false,
		suppressErrors: allowEmpty,
	});

	if (!inputFiles.length) {
		if (!allowEmpty) {
			return Promise.reject(new Error(MESSAGES.no_found_files(files)));
		} else {
			return Promise.resolve(results);
		}
	}

	// Running files through fg ensures any globs are expanded
	// and the files are absolute paths
	for (const file of inputFiles) {
		// Read the file contents and add it to the concat object in the order it was provided
		/** @todo support parallel processing when order is flagged unimportant? */
		await fsp
			.readFile(file, "utf-8")
			.then((content) => {
				if (!isEmpty(content)) {
					results.inputFiles.push(file);
					/** @todo incorporate existing sourcemaps when provided */
					concat.add(
						file,
						`${header(relative(cwd, file)) ?? ""}\n${content.trim()}`
					);
				} else if (!allowEmpty) {
					/** throw an error if no file is found and we're not supporting empty results */
					return Promise.reject(new Error(MESSAGES.empty_file(file, cwd)));
				}
			})
			.catch((e) => !allowEmpty && Promise.reject(e));
	}

	let content = concat.content?.toString()?.trim() + "\n";
	const sourcemap = concat.sourceMap ? concat.sourceMap + "\n" : "";

	if (!isEmpty(content)) {
		/** Return the content without the inline'ed sourcemap b/c the sourcemap is returned separately */
		results.content = content;

		const inline = inlineMap(sourcemap) ?? "";

		/** If no output file name is provided, we'll add the sourcemap to the stdout */
		if (!isEmpty(sourcemap)) {
			if (!outputFile && inline) content += `${inline}\n`;
			else if (outputFile) await fsp.writeFile(`${outputFile}.map`, sourcemap);
		}

		// Inject trailing newline as well
		if (outputFile) await fsp.writeFile(outputFile, content);

		results.map = sourcemap;
	}

	/**
	 * Return the fast-glob resolved file list so we know
	 * what files were used to generate the content
	 */
	return Promise.resolve(results);
}

export { MESSAGES };
