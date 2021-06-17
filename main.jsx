/******************************************************************************
 *                             CONSTANTS & GLOBALS                            *
 ******************************************************************************/

const GRAY = "#999999"

/******************************************************************************
 *                             REACT-IVE WEBSITE                              *
 ******************************************************************************/

function $(id) { return document.getElementById(id) } // convenience function

// Round x to 2 decimal places
function r2(x) { return Math.round(100*x) / 100 }

// Return the current date like "2021.06.15"
function ymd() {
  const o = new Date()
  const y = o.getFullYear()
  const m = 1 + o.getMonth()
  const d = o.getDate()
  return `${y}.${m < 10 ? '0' + m : m}.${d < 10 ? '0' + d : d}`
}

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
    const fmv = this.state.fmv
    const pie = e.target.value.trim() // contents of the actual field
    const pay = r2(fmv * (1 - pie)); $("pay").value = pay
    const get = r2(fmv * pie);       $("get").value = get
    this.setState({ pie, pay, get })
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
        Fraction of the thing/decision that's yours:
      </label>
      <div className="controls">
        <input id="pie" className="form-control" type="text" autofocus
               value={this.state.pie}
               placeholder="a number from 0 to 1"
               onChange={this.dPie}/> &nbsp;
        test
      </div>
      <br></br><hr></hr><br></br>
      <b>Your Bid:</b> {/* */}
        <font color={GRAY}>(any of these imply the other two)</font>
      <br></br>
      <br></br>
      <label className="control-label" for="fmv">
        Fair Market Value (FMV) of the decision:
      </label>
      <div className="controls">
        <input id="fmv" className="form-control" type="text"
               placeholder="dollar value" 
               onChange={this.dFmv}/>
      </div>
      <br></br>
      <label className="control-label" for="pay">
        Most you'll pay if you win:
      </label>
      <div className="controls">
        <input id="pay" className="form-control" type="text"
               placeholder="dollar value" 
               onChange={this.dPay}/>
      </div>
      <br></br>
      <label className="control-label" for="get">
        Amount you'll get paid if you lose:
      </label>
      <div className="controls">
        <input id="get" className="form-control" type="text"
               placeholder="dollar value" 
               onChange={this.dGet}/>
      </div>
    </div>
    <div>
      <br></br><hr></hr><br></br>
      <b>If your FMV of ${this.state.fmv} is higher:</b>
      <br></br>
      <br></br>
      You'll pay up to 
      ${this.state.pay} {/* */}
      (for the {Math.round(100*(1-this.state.pie))}% that's not yours).
      <br></br>
      <br></br>
      <br></br>
      <b>If <i>their</i> FMV is higher:</b>
      <br></br>
      <br></br>
      You'll get paid 
      ${this.state.get} {/* */}
      (for the {Math.round(100*this.state.pie)}% that's yours).
      <br></br>
      <pre>
        iou[{ymd()}, {this.state.get}, them, you, "decision auction"]
      </pre>      
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
