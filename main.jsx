/******************************************************************************
 *                             CONSTANTS & GLOBALS                            *
 ******************************************************************************/

let TID = null     // Timer ID for interval timer, for refreshing every second
const GRAY = "#999999"

/******************************************************************************
 *                             REACT-IVE WEBSITE                              *
 ******************************************************************************/

// -----------------------------------------------------------------------------
class Bid extends React.Component {
  constructor(props) { super(props); this.state = {
    pie: 0, // fraction of the decision that's yours
    fmv: 0, // fair market value: value of the whole decision
    pay: 0, // how much you'll pay (at most) if you win
    get: 0, // how much you'll get paid if you lose
  } }
  
  // Glitch mistakenly says syntax error on next line but it's fine, really!
  //pay = () => this.state.get

  // Glitch mistakenly says syntax error on next line but it's fine, really!
  dPie = e => { // do this when the pie field changes
    const x = e.target.value.trim() // contents of the actual field
    this.setState({
      pie: x,
      fmv: this.state.pay / (1-x),
      pay: this.state.pay,
      get: this.state.pay / (1-x) * x,
    })
  }

  dFmv = e => { // do this when the fmv field changes
    const x = e.target.value.trim() // contents of the actual field
    this.setState({
      pie: this.state.pie,
      fmv: x,
      pay: x * (1 - this.state.pie),
      get: x * this.state.pie,
    })
  }
  
  dPay = e => { // do this when the fmv field changes
    const x = e.target.value.trim() // contents of the actual field
    this.setState({
      pie: this.state.pie,
      fmv: x / (1 - this.state.pie),
      pay: x,
      get: x * this.state.pie / (1 - this.state.pie),
    })
  }
  
  dGet = e => { // do this when the fmv field changes
    const x = e.target.value.trim() // contents of the actual field
    this.setState({
      pie: this.state.pie,
      fmv: x / this.state.pie,
      pay: x * (1 - this.state.pie) / this.state.pie,
      get: x,
    })
  }
  
  render() { return ( <div>
    <div className="control-group">
      <label className="control-label" for="pie">
        Fraction of the decision that's yours:
      </label>
      <div className="controls">
        <input className="form-control" type="text" autofocus
               placeholder="a number from 0 to 1"
               onChange={this.dPie}/>
      </div>
      <br></br>
      <label className="control-label" for="fmv">
        Fair Market Value (FMV) of the decision:
      </label>
      <div className="controls">
        <input className="form-control" type="text"
               placeholder="any dollar value" 
               onChange={this.dFmv}/>
      </div>
      <br></br>
      <label className="control-label" for="pay">
        Most you'll pay if you win:
      </label>
      <div className="controls">
        <input className="form-control" type="text"
               placeholder="dollar value &lt; FMV" 
               onChange={this.dPay}/>
      </div>
      <br></br>
      <label className="control-label" for="get">
        Amount you'll get paid if you lose:
      </label>
      <div className="controls">
        <input className="form-control" type="text"
               placeholder="dollar value &lt; FMV" 
               onChange={this.dGet}/>
      </div>
    </div>
  </div> ) }
}

ReactDOM.render(<Bid/>, document.getElementById('root'))

/******************************************************************************
 *                              STATIC WEBSITE                                *
 ******************************************************************************/


/******************************************************************************
 *                      STUFF WE'RE NOT CURRENTLY USING                       *
 ******************************************************************************/


// -----------------------------------------------------------------------------
