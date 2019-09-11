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

const isCreditInvest = string => {
  return (
    string.includes('Investment principal increase') ||
    string.includes('Investment principal rebuy') ||
    string.includes('Investment principal repayment')
  )
}

const isDeposit = string => {
  return (
    string.includes('Incoming client payment') ||
    string.includes('Affiliate bonus')
  )
}

const isInterest = string => {
  return (
    string.includes('Interest income') ||
    string.includes('Late payment fee income') ||
    string.includes('Delayed interest income')
  )
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
