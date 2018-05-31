import React from 'react'
import styled from 'styled-components'
import axios from 'axios'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'

const BASE_URL = 'https://min-api.cryptocompare.com'

const coins = [
  { key: 'BTC', name: 'Bitcoin' },
  { key: 'ETH', name: 'Ethereum' },
  { key: 'BCH', name: 'Bitcoin Cash' },
  { key: 'XRP', name: 'Ripple' },
  { key: 'LTC', name: 'Litecoin' },
  { key: 'IOT', name: 'IOTA' }
]

const Container = styled.div`
  text-align: center;
  font-family: Pacifico;
`

const Line = styled.div`
  margin: 24px 0;
  font-size: 32px;
  letter-spacing: 3px;
`

const Input = styled.input`
  font-family: Pacifico;
  font-size: 32px;
  letter-spacing: 3px;
`

const Select = styled.select`
  font-family: Pacifico;
  font-size: 32px;
  letter-spacing: 3px;
`

const Fortune = styled.span`
  font-weight: bold;
  font-size: 48px;
`

const Preposition = styled.span`
  margin: 0 20px;
`

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      amount: 100,
      currency: 'BTC',
      date: '2017-01-01',
      investPrice: 0,
      todayPrice: 0
    };
  }

  componentDidMount() {
    this.fetchPrices()
  }

  async fetchPrices() {
    try {
      const sym = this.state.currency
      const ts = new Date(this.state.date).getTime() / 1000
      const response1 = await axios.get(`${BASE_URL}/data/pricehistorical?fsym=${sym}&tsyms=USD&ts=${ts}`)
      const response2 = await axios.get(`${BASE_URL}/data/price?fsym=${sym}&tsyms=USD`)
      this.setState({
        investPrice: response1.data[sym]['USD'],
        todayPrice: response2.data['USD']
      })
    } catch (error) {
      console.error(error)
    }
  }

  handleChangeAmount(amount) {
    this.setState({amount})
  }

  handleChangeCurrency(currency) {
    this.setState({currency}, () => this.fetchPrices())
  }

  handleChangeDate(date) {
    this.setState({date}, () => this.fetchPrices())
  }

  render() {

    const fortune = (this.state.todayPrice && this.state.investPrice)
      ? Number(this.state.amount * this.state.todayPrice / this.state.investPrice).toFixed(2)
      : '---'

    const chartData = [
      {name: this.state.date, value: this.state.amount},
      {name: 'Now', value: Number(fortune)}
    ]

    return(
      <Container>

        <Line>
          If I had just invested
        </Line>

        <Line>
          <Input
            type="number"
            step="1"
            placeholder="Amount"
            value={this.state.amount}
            onChange={event => this.handleChangeAmount(event.target.value)}
            style={{width: 200}}
          />

          <Preposition>in</Preposition>

          <Select
            value={this.state.currency}
            onChange={event => this.handleChangeCurrency(event.target.value)}
          >
            {coins.map(c => <option value={c.key}>{c.name}</option>)}
          </Select>

          <Preposition>on</Preposition>

          <Input
            type="date"
            placeholder="date"
            value={this.state.date}
            onChange={event => this.handleChangeDate(event.target.value)}
            style={{width: 300}}
          />

        </Line>

        <Line>
          it would have been <Fortune>{fortune}</Fortune> by now.
        </Line>

        <BarChart
          style={{margin: '0 auto'}}
          width={300}
          height={300}
          data={chartData}
        >
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis dataKey="name"/>
          <YAxis/>
          <Bar dataKey="value" fill="#1890ff" />
        </BarChart>

      </Container>
    )
  }
}
