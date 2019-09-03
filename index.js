const fs = require('fs')
const path = require('path')
const csv = require('csvtojson')

const TRANSACTION_ID = 'Transaction ID'
const TRANSACTION_DATE = 'Date'
const TRANSACTION_DETAILS = 'Details'
const TRANSACTION_TURNOVER = 'Turnover'
const TRANSACTION_CURRENCY = 'Currency'
const TYPE_INTEREST = 'Zinsen'
const TYPE_DEPOSIT = 'Einlage'
const TYPE_WITHDRAWAL = 'Entnahme'

const CSV_HEADER =
  'Datum;Typ;Wert;Buchungswährung;Steuern;Stück;ISIN;WKN;Ticker-Symbol;Wertpapiername;Notiz\n'

const csvFilePath = path.join(__dirname, 'input/20190902-account-statement.csv')
const csvOutputPath = path.join(
  __dirname,
  'output/import-for-portfolio-performance.csv'
)

const parseableNumber = number => number.replace(',', '.')
const parseableDate = date => date.replace(' ', 'T')
const numberToCommaSeparatedString = number => number.replace('.', ',')

const getTransactionType = string => {
  if (
    string.includes('Incoming client payment') ||
    string.includes('Affiliate bonus')
  ) {
    return TYPE_DEPOSIT
  }
  if (
    string.includes('Interest income') ||
    string.includes('Late payment fee income') ||
    string.includes('Delayed interest income')
  ) {
    return TYPE_INTEREST
  }
  if (string.includes('Reversed incoming client payment')) {
    return TYPE_WITHDRAWAL
  }
  return ''
}

async function transformCsvExport(path) {
  const data = await csv({
    delimiter: ';'
  }).fromFile(path)
  let csvData = CSV_HEADER
  data.forEach(datum => {
    const interest = parseableNumber(datum[TRANSACTION_TURNOVER])
    const noteString = `ID: ${datum[TRANSACTION_ID]}, ${datum[TRANSACTION_DETAILS]}`
    const entry = {
      amount: numberToCommaSeparatedString(interest),
      date: parseableDate(datum[TRANSACTION_DATE]),
      type: getTransactionType(datum[TRANSACTION_DETAILS]),
      currency: datum[TRANSACTION_CURRENCY],
      note: noteString
    }
    csvData += `${entry.date};${entry.type};${entry.amount};${entry.currency};;;;;;;${entry.note}\n`
  })
  fs.writeFile(csvOutputPath, csvData, function(err) {
    if (err) {
      return console.log(err)
    }
    console.log('The file was saved to', csvOutputPath)
  })
}

transformCsvExport(csvFilePath)
