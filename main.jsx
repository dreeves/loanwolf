/******************************************************************************
 *                             CONSTANTS & GLOBALS                            *
 ******************************************************************************/

const GRAY = "#999999"

/******************************************************************************
 *                             REACT-IVE WEBSITE                              *
 ******************************************************************************/

function $(id) { return document.getElementById(id) } // convenience function

// Return the current date like "2021.06.15"
function ymd() {
  const o = new Date()
  const y = o.getFullYear()
  const m = 1 + o.getMonth()
  const d = o.getDate()
  return `${y}.${m < 10 ? '0' + m : m}.${d < 10 ? '0' + d : d}`
}

// Eval but just return null if syntax error. 
// Obviously don't use serverside with user-supplied input.
function laxeval(s) {
  try { 
    const x = eval(s)
    return typeof x === 'undefined' ? null : x
  } catch(e) { return null } 
}

function parsefrac(s) {
  s = s.replace(/^([^\%]*)\%(.*)$/, '($1)/100$2')
  const x = laxeval(s)
  return x===null ? NaN : x
}

function showfrac(x) {
  return Math.round(100*x)
}

// Parse a string representing a dollar amount
function par$e(s) {
  s = s.replace(/\$/g, '') // strip out any dollar signs
  const x = laxeval(s)     // allow any arithmetic like "1/2" or whatever
  return x===null ? NaN : x
}

// Show a dollar amount as a string
function $how(x) {
  return isNaN(x) ? '' : Math.round(100*x) / 100
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
    const pie = parsefrac(e.target.value)
    const fmv = this.state.fmv;  $("fmv").value = $how(fmv)
    const pay = fmv * (1 - pie); $("pay").value = $how(pay)
    const get = fmv * pie;       $("get").value = $how(get)
    this.setState({ pie, pay, get })
  }

  dFmv = e => { // do this when the fmv field changes
    const pie = this.state.pie
    const fmv = par$e(e.target.value) // contents of the actual field
    const pay = fmv * (1 - pie); $("pay").value = $how(pay)
    const get = fmv * pie;       $("get").value = $how(get)
    this.setState({ fmv, pay, get })
  }
  
  dPay = e => { // do this when the pay field changes
    const pie = this.state.pie
    const pay = par$e(e.target.value) // contents of the actual field
    const fmv = pay / (1 - pie); $("fmv").value = $how(fmv)
    const get = fmv * pie;       $("get").value = $how(get)
    this.setState({ fmv, pay, get })
  }
  
  dGet = e => { // do this when the get field changes
    const pie = this.state.pie
    const get = par$e(e.target.value) // contents of the actual field
    const fmv = get / pie;       $("fmv").value = $how(fmv)
    const pay = fmv * (1 - pie); $("pay").value = $how(pay)
    this.setState({ fmv, pay, get })
  }
  
  render() { return ( <div>
    <div className="control-group">
      <label className="control-label" for="pie">
        Fraction of the thing/decision that's yours:
      </label>
      <div className="controls">
        <input id="pie" className="form-control" type="text" autofocus
               placeholder="a number from 0 to 1"
               onChange={this.dPie}/> &nbsp;
        <font color={GRAY}>{`${showfrac(1-this.state.pie)}/` +
                            `${showfrac(this.state.pie)} them/you`}</font>
      </div>
      <br></br><hr></hr><br></br>
      <b>Your Bid:</b> {/* */}
        <font color={GRAY}>(any of these imply the other two)</font>
      <br></br>
      <br></br>
      <label className="control-label" for="fmv">
        Fair Market Value (FMV):
      </label>
      <div className="controls">
        <input id="fmv" className="form-control" type="text"
               placeholder="dollar value" 
               onChange={this.dFmv}/>
      </div>
      <br></br>
      <label className="control-label" for="pay">
        Most you pay if you win:
      </label>
      <div className="controls">
        <input id="pay" className="form-control" type="text"
               placeholder="dollar value" 
               onChange={this.dPay}/>
      </div>
      <br></br>
      <label className="control-label" for="get">
        What you get paid if you lose:
      </label>
      <div className="controls">
        <input id="get" className="form-control" type="text"
               placeholder="dollar value" 
               onChange={this.dGet}/>
      </div>
    </div>
    <div>
      <br></br><hr></hr><br></br>
      <b>If your FMV of ${$how(this.state.fmv)} is higher:</b>
      <br></br>
      <br></br>
      You'll pay up to 
      ${$how(this.state.pay)} {/* */}
      (for the {showfrac(1-this.state.pie)}% that's not yours).
      <br></br>
      <br></br>
      <br></br>
      <b>If <i>their</i> FMV is higher:</b>
      <br></br>
      <br></br>
      You'll get paid 
      ${$how(this.state.get)} {/* */}
      (for the {showfrac(this.state.pie)}% that's yours).
      <br></br>
      <pre>
        iou[{ymd()}, {$how(this.state.get)}, them, you, "decision auction"]
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
