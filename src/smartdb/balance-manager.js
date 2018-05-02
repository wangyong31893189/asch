let bignum = require('bignumber')
let AschCore = require('../asch-smartdb').AschCore

class BalanceManager {
  constructor(sdb) {
    this.sdb = sdb
  }

  _getBalanceId(address, currency){
    return AschCore.CompositeKey.makeKey( address, currency)
  }

  get(address, currency) {
    let item = this.sdb.getCached('Balance', this._getBalanceId(address, currency))
    let balance = item ? item.balance : '0'
    return bignum(balance)
  }

  getCurrencyFlag(currency) {
    if (currency === 'XAS') {
      return 1
    } else if (currency.indexOf('.') !== -1) {
      // UIA
      return 2
    } else {
      // gateway currency
      return 3
    }
  }

  increase(address, currency, amount) {
    if (bignum(amount).eq(0)) return

    let balanceId = this._getBalanceId(address, currency)
    let item = this.sdb.getCached('Balance', balanceId)
    if (item !== null) {
      item.balance = bignum(item.balance).plus(amount)
    } else {
      item = this.sdb.create('Balance', balanceId)
      item.address = address
      item.balance = amount
      item.flag = this.getCurrencyFlag(currency)
    }
  }

  decrease(address, currency, amount) {
    this.increase(address, currency, '-' + amount)
  }
  
  transfer(currency, amount, from, to) {
    this.decrease(from, currency, amount)
    this.increase(to, currency, amount)
  }
}

module.exports = BalanceManager