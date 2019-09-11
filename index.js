const fs = require('fs')
const path = require('path')
const csv = require('csvtojson')

const {
  getOptions,
  isCreditInvest,
  isDeposit,
  isInterest,
  isWithdrawal,
  numberToCommaSeparatedString,
  parseableDate,
  parseableNumber
} = require('./helper/')

const options = getOptions(process.argv)

const TRANSACTION_ID = 'Transaction ID'
const TRANSACTION_DATE = 'Date'
const TRANSACTION_DETAILS = 'Details'
const TRANSACTION_TURNOVER = 'Turnover'
const TRANSACTION_CURRENCY = 'Currency'
const TYPE_INTEREST = 'Zinsen'
const TYPE_DEPOSIT = 'Einlage'
const TYPE_WITHDRAWAL = 'Entnahme'

const DELIMITER = options.delimiter || ','
const INPUT_PATH = options.input
const OUTPUT_PATH =
  options.output || 'output/import-for-portfolio-performance.csv'

const CSV_HEADER =
  'Datum;Typ;Wert;Buchungswährung;Steuern;Stück;ISIN;WKN;Ticker-Symbol;Wertpapiername;Notiz\n'

if (!options.input) {
  throw new Error('No input file – no output. Stopping the process.')
}

const csvFilePath = path.join(__dirname, INPUT_PATH)
const csvOutputPath = path.join(__dirname, OUTPUT_PATH)

const getTransactionType = string => {
  if (isDeposit(string)) {
    return TYPE_DEPOSIT
  }
  if (isInterest(string)) {
    return TYPE_INTEREST
  }
  if (isWithdrawal(string)) {
    return TYPE_WITHDRAWAL
  }
  console.log(`######## Could not process: ${string}`)
  return ''
}

const createCsvRow = datum => {
  const interest = parseableNumber(datum[TRANSACTION_TURNOVER])
  const noteString = `ID: ${datum[TRANSACTION_ID]}, ${datum[TRANSACTION_DETAILS]}`
  const entry = {
    amount: numberToCommaSeparatedString(interest),
    date: parseableDate(datum[TRANSACTION_DATE]),
    type: getTransactionType(datum[TRANSACTION_DETAILS]),
    currency: datum[TRANSACTION_CURRENCY],
    note: noteString
  }
  return `${entry.date};${entry.type};${entry.amount};${entry.currency};;;;;;;${entry.note}\n`
}

async function transformCsvExport(path) {
  const data = await csv({
    delimiter: DELIMITER
  }).fromFile(path)
  let csvData = CSV_HEADER
  data
    .filter(datum => !isCreditInvest(datum[TRANSACTION_DETAILS]))
    .forEach(datum => {
      csvData += createCsvRow(datum)
    })
  fs.writeFile(csvOutputPath, csvData, function(err) {
    if (err) {
      return console.log(err)
    }
    console.log('🚀 The file was saved to', csvOutputPath)
  })
}

transformCsvExport(csvFilePath)
