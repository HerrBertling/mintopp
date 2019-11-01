const getOptions = argv => {
  const options = argv
    .splice(2)
    .reduce((acc, el, i, src) => {
      const next = src[i + 1]
      if (/^--/.test(el) && next && !/^--/.test(next)) {
        el = el + '=' + next
        acc.push(el)
        return acc
      }

      if (/^--/.test(el)) {
        acc.push(el)
      }

      return acc
    }, [])
    .reduce((acc, el) => {
      const cleaned = el.replace(/^--/, '').split('=')
      acc[cleaned[0]] = cleaned[1] || true
      return acc
    }, {})

  return options
}

const parseableNumber = number => number.replace(',', '.')
const parseableDate = date => date.replace(' ', 'T')
const numberToCommaSeparatedString = number => number.replace('.', ',')

const checkStringAgainstArray = (string, array) => {
  return array.some(item => string.includes(item))
}

const isCreditInvest = string => {
  if (!string) {
    return false
  }
  return checkStringAgainstArray(string, [
    'Investment principal increase',
    'Investment principal rebuy',
    'Investment principal repayment',
    'investment in loan',
    'secondary market transaction'
  ])
}

const isDeposit = string => {
  return checkStringAgainstArray(string, [
    'Incoming client payment',
    'Affiliate bonus',
    'principal received'
  ])
}

const isInterest = string => {
  return checkStringAgainstArray(string, [
    'Interest income',
    'Late payment fee income',
    'Delayed interest income',
    'interest received',
    'late fees received'
  ])
}

const isWithdrawal = string => {
  return string.includes('Reversed incoming client payment')
}

module.exports = {
  getOptions,
  isCreditInvest,
  isDeposit,
  isInterest,
  isWithdrawal,
  numberToCommaSeparatedString,
  parseableDate,
  parseableNumber
}
