# glob-concat-cli

> A command-line interface for concatenating files leveraging [fast-glob](https://github.com/mrmlnc/fast-glob#fast-glob).

## Key features

- Concatenates files on the command line
- Supports robust glob patterns via [fast-glob](https://github.com/mrmlnc/fast-glob#pattern-syntax)
- Allows empty files to be ignored (great for use with automated build tools)
- Can output to stdout or a file
- Provides a sourcemap for the concatenated files by default

## Install

```sh
npm install --dev glob-concat-cli
```

```sh
yarn add --dev glob-concat-cli
```

## API

### `files`

Type: `string[]`<br>
Alias: `f`<br>
Required: `true`

The files to concatenate. Supports glob patterns via fast-glob. This is the only required option.

### `output`

Type: `string`<br>
Alias: `o`<br>
Default: `stdout`

The file to output the concatenated files to. If not provided, the concatenated files will be output to stdout.

### `allowEmpty`

Type: `boolean`<br>
Alias: `ae`<br>
Default: `true`

Whether to fail the command if no files are found or if any of the provided inputs can't be found. If set to `true`, the command will exit with a status code of `0` and no output will be written.

### `sourcemap`

Type: `boolean`<br>
Alias: `map`<br>
Default: `true`

Whether to output a sourcemap for the concatenated files. If set to `false`, no sourcemap will be written to disk.

### Other supported options

When leveraging this package, you can also pass in any of the options supported by [fast-glob](https://github.com/mrmlnc/fast-glob#options-3).

Due to how this utility is built, the following options are not supported:

- `onlyDirectories` (this is always set to `false` because this utility is meant to concatenate files)
- `stats`
- `objectMode`

## Contributing

Contributions are welcome! Please open an [issue](https://github.com/castastrophe/glob-concat-cli/issues/new) or submit a pull request.

## License

This project is licensed under the Apache 2.0 License - see the [LICENSE](LICENSE) file for details. This means you can use this however you like as long as you provide attribution back to this one. It's nice to share but it's also nice to get credit for your work. 😉

## Funding ☕️

If you find this plugin useful and would like to buy me a coffee/beer as a small thank you, I would greatly appreciate it! Funding links are available in the GitHub UI for this repo.

<a href="https://www.buymeacoffee.com/castastrophe" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>
