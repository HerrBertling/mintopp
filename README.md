# Mintos to Portfolio Performance

This is a very simple and right now incomplete nodejs script to turn Mintos account statements into importable `*.csv` files for Portfolio Performance.

If you do not know how to run a node script, you should better wait until I've turned this into a simple website :smile:

## Installation

1. Clone this repo
1. `cd` into the folder
1. Run `npm install`

## Usage

1. Export an account statement from Mintos, including interest payments, deposits, affiliate payments
1. Change the input file to whatever you have via the `csvFilePath` in `index.js`
1. Run `node .` to let the script run
1. Add [options](#options)
1. Import the generated CSV file into Portfolio Performance
1. ???
1. Profit! :money_with_wings:

## Options

| Option        | Description                                                               | Default                                       |
| ------------- | ------------------------------------------------------------------------- | --------------------------------------------- |
| `--input`     | **Required value** Path to the input file (should be in the input folder) | `none`                                        |
| `--delimiter` | The CSV file delimiter                                                    | `;`                                           |
| `--output`    | File output path                                                          | `output/import-for-portfolio-performance.csv` |

## Roadmap

Hahaha, "roadmap". Well, whatever. Things that should happen:

- [x] Make input file a config
- [ ] Parse any possible account statement content instead of just a few
- [ ] Make a website where you drop the file & receive some CSV output for that file
- [x] More documentation!
- [ ] Tests (hahaha! :wink:)
