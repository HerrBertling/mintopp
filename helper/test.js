import test from 'ava'
import {
  getOptions,
  isCreditInvest,
  isDeposit,
  isInterest,
  isWithdrawal,
  numberToCommaSeparatedString,
  parseableDate,
  parseableNumber
} from './'

test('getOptions returns options object', t => {
  const options = getOptions(['1', '2', '--hello', '--input=output'])
  t.is(options.hello, true)
  t.is(options.input, 'output')
  t.is(Object.keys(options).length, 2)
})

test('parseableNumber returns a String you can parse as a number', t => {
  t.is(parseableNumber('3,14'), '3.14')
})

test('parseableDate returns a correctly formatted date string', t => {
  t.is(parseableDate('2019-02-03 07:26:00'), '2019-02-03T07:26:00')
})

test('correctly parses withdrawal string', t => {
  t.is(
    isWithdrawal('Something something Reversed incoming client payment'),
    true
  )
  t.is(isWithdrawal('Definitely something else'), false)
})

test('correctly parses affiliate bonus as deposit', t => {
  t.is(isDeposit('Affiliate bonus'), true)
  t.is(isDeposit('Incoming client payment'), true)
  t.is(isDeposit('Reversed something'), false)
})

test('correctly parses interest strings', t => {
  t.is(isInterest('Interest income'), true)
  t.is(isInterest('Late payment fee income'), true)
  t.is(isInterest('Delayed interest income'), true)
  t.is(isInterest('Nothing to see here'), false)
})

test('correctly parses credit invest', t => {
  t.is(isCreditInvest('Investment principal increase'), true)
  t.is(isCreditInvest('Investment principal rebuy'), true)
  t.is(isCreditInvest('Investment principal repayment'), true)
  t.is(isCreditInvest('Nothing to see here'), false)
})

test('numberToCommaSeparatedString correctly does what it says it does', t => {
  t.is(numberToCommaSeparatedString('3.14'), '3,14')
})
