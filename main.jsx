/******************************************************************************
 *                             CONSTANTS & GLOBALS                            *
 ******************************************************************************/

let TID = null     // Timer ID for interval timer, for refreshing every second
const GRAY = "#999999"

/******************************************************************************
 *                             REACT-IVE WEBSITE                              *
 ******************************************************************************/

function $(id) { return document.getElementById(id) } // convenience function

// Round x to 2 decimal places
function r2(x) { return Math.round(100*x) / 100 }

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
    const pay = this.state.pay
    const pie = e.target.value.trim() // contents of the actual field
    const fmv = r2(pay / (1 - pie)); $("fmv").value = fmv
    const get = r2(fmv * pie);       $("get").value = get
    this.setState({ pie, fmv, get })
  }

  dFmv = e => { // do this when the fmv field changes
    const pie = this.state.pie
    const fmv = e.target.value.trim() // contents of the actual field
    const pay = r2(fmv * (1 - pie)); $("pay").value = pay
    const get = r2(fmv * pie);       $("get").value = get
    this.setState({ fmv, pay, get })
  }
  
  dPay = e => { // do this when the fmv field changes
    const pie = this.state.pie
    const pay = e.target.value.trim() // contents of the actual field
    const fmv = r2(pay / (1 - pie)); $("fmv").value = fmv
    const get = r2(fmv * pie);       $("get").value = get
    this.setState({ fmv, pay, get })
  }
  
  dGet = e => { // do this when the fmv field changes
    const pie = this.state.pie
    const get = e.target.value.trim() // contents of the actual field
    const fmv = r2(get / pie);       $("fmv").value = fmv
    const pay = r2(fmv * (1 - pie)); $("pay").value = pay
    this.setState({ fmv, pay, get })
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
