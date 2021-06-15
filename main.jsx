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
    pie: 0.5, // fraction of the decision that's yours
    fmv: 0,   // fair market value: value of the whole decision
    pay: 0,   // how much you'll pay (at most) if you win
    get: 0,   // how much you'll get paid if you lose
  } }
  
  // Glitch mistakenly says syntax error on next line but it's fine, really!
  dPie = e => { // do this when the pie field changes
    const x = e.target.value.trim() // contents of the actual field
    this.setState({
      pie: x,
      fmv: this.state.pay / (1-x),
      pay: this.state.pay,
      get: this.state.pay / (1-x) * x,
    })
    document.getElementById("fmv").value = this.state.fmv
    document.getElementById("pay").value = this.state.pay
    document.getElementById("get").value = this.state.get
  }

  dFmv = e => { // do this when the fmv field changes
    const pie = this.state.pie
    const fmv = e.target.value.trim() // contents of the actual field
    const 
    this.setState({
      fmv: x,
      pay: x * (1 - this.state.pie),
      get: x * this.state.pie,
    })
    document.getElementById("pay").value = x * (1 - this.state.pie)
    document.getElementById("get").value = this.state.get
  }
  
  dPay = e => { // do this when the fmv field changes
    const x = e.target.value.trim() // contents of the actual field
    this.setState({
      fmv: x / (1 - this.state.pie),
      pay: x,
      get: x * this.state.pie / (1 - this.state.pie),
    })
    document.getElementById("fmv").value = this.state.fmv
    document.getElementById("get").value = this.state.get
  }
  
  dGet = e => { // do this when the fmv field changes
    const x = e.target.value.trim() // contents of the actual field
    this.setState({
      pie: this.state.pie,
      fmv: x / this.state.pie,
      pay: x * (1 - this.state.pie) / this.state.pie,
      get: x,
    })
    document.getElementById("pie").value = this.state.pie
    document.getElementById("fmv").value = this.state.fmv
    document.getElementById("pay").value = this.state.pay
  }
  
  render() { return ( <div>
    <div className="control-group">
      <label className="control-label" for="pie">
        Fraction of the decision that's yours:
      </label>
      <div className="controls">
        <input id="pie" className="form-control" type="text" autofocus
               value={this.state.pie}
               placeholder="a number from 0 to 1"
               onChange={this.dPie}/>
      </div>
      <br></br>
      <label className="control-label" for="fmv">
        Fair Market Value (FMV) of the decision:
      </label>
      <div className="controls">
        <input id="fmv" className="form-control" type="text"
               placeholder="any dollar value" 
               onChange={this.dFmv}/>
      </div>
      <br></br>
      <label className="control-label" for="pay">
        Most you'll pay if you win:
      </label>
      <div className="controls">
        <input id="pay" className="form-control" type="text"
               placeholder="dollar value &le; FMV" 
               onChange={this.dPay}/>
      </div>
      <br></br>
      <label className="control-label" for="get">
        Amount you'll get paid if you lose:
      </label>
      <div className="controls">
        <input id="get" className="form-control" type="text"
               placeholder="dollar value &le; FMV" 
               onChange={this.dGet}/>
      </div>
    </div>
    <div>
      <br></br>
      The decision is worth 
      ${this.state.fmv}.
      If you win you will pay up to 
      ${this.state.pay} {/* */}
      (for the {100*(1-this.state.pie)}% that's not yours)
      and if you lose you'll get paid 
      ${this.state.get} {/* */}
      (for the {100*this.state.pie}% that's yours)!
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
