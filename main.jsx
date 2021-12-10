/******************************************************************************
 *                             CONSTANTS & GLOBALS                            *
 ******************************************************************************/

const exp = Math.exp
const round = Math.round

const GRAY = "#999999"
const DIY = 365.25 // days in year
const DIM = DIY/12 // days in month

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

// Net Present Value of principal x plus premium p*x paid in daily installments
// equal to fraction f of daily revenue, where monthly revenue is m and the
// yearly discount rate is r.
// Mathematica: 
// TimeValue[Annuity[f*m/DIM, x(1+p)/(f*m/DIM)], EffectiveInterest[r/DIY, 0], 0]
function npv(x, p, f, m, r) {
  return f*m/DIM * (1-exp(r/DIY)**(-((DIM*(1 + p)*x)/(f*m)))) / (exp(r/DIY)-1)
}

// Effective Interest Rate (as a percentage) that makes the above stream of
// repayments have the same time-value as the principal of the loan.
function eir(x, p, f, m) {
  return 23 // TODO
}

// -----------------------------------------------------------------------------
class Loan extends React.Component {
  constructor(props) { super(props); this.state = {
    x: 0, // (DOL)  principal aka loan amount
    p: 0, // (FRAC) premium aka fraction of principal to be paid as interest
    f: 0, // (FRAC) fraction of daily revenue that goes to paying back the loan
    m: 0, // (DOL)  monthly revenue
    r: 0, // (FRAC) yearly discount rate as a fraction
  } }
  
  // Glitch mistakenly says syntax error on next line but it's fine, really!
  dX = e => { // do this when the x field changes
    const x = par$e(e.target.value)
    const p = this.state.p; //$("p").value = showfrac(p)
    const f = this.state.f; //$("f").value = showfrac(f)
    const m = this.state.m; $("m").value = $how(m)
    const r = this.state.r; $("r").value = showfrac(r)
    this.setState({ x })    
  }

  dP = e => { // do this when the p field changes
    const x = this.state.x; $("x").value = $how(x)
    const p = parsefrac(e.target.value)
    const f = this.state.f; //$("f").value = showfrac(f)
    const m = this.state.m; $("m").value = $how(m)
    const r = this.state.r; $("r").value = showfrac(r)
    this.setState({ p })
  }

  dF = e => { // do this when the f field changes
    const x = this.state.x; $("x").value = $how(x)
    const p = this.state.p; //$("p").value = showfrac(p)
    const f = parsefrac(e.target.value)
    const m = this.state.m; $("m").value = $how(m)
    const r = this.state.r; $("r").value = showfrac(r)
    this.setState({ f })
  }

  dM = e => { // do this when the m field changes
    const x = this.state.x; $("x").value = $how(x)
    const p = this.state.p; //$("p").value = showfrac(p)
    const f = this.state.f; //$("f").value = showfrac(f)
    const m = par$e(e.target.value)
    const r = this.state.r; $("r").value = showfrac(r)
    this.setState({ m })
  }

  dR = e => { // do this when the r field changes
    const x = this.state.x; $("x").value = $how(x)
    const p = this.state.p; //$("p").value = showfrac(p)
    const f = this.state.f; //$("f").value = showfrac(f)
    const m = this.state.m; $("m").value = $how(m)
    const r = parsefrac(e.target.value)
    this.setState({ r })
  }
  
  render() { return ( <div>
    <div className="control-group">
      <label className="control-label" for="x">
        Principal aka loan amount:
      </label>
      <div className="controls">
        <input id="x" className="form-control" type="text" autofocus
               placeholder="dollar value"
               onChange={this.dX}/> &nbsp;
      </div>
      <br></br>
      <label className="control-label" for="p">
        Premium aka fraction of principal to be paid as interest:
      </label>
      <div className="controls">
        <input id="p" className="form-control" type="text"
               placeholder="fraction" 
               onChange={this.dP}/> &nbsp;
        <font color={GRAY}>{showfrac(this.state.p)}%</font>
      </div>
      <br></br>
      <label className="control-label" for="f">
        Fraction of daily revenue that goes to paying back the loan:
      </label>
      <div className="controls">
        <input id="f" className="form-control" type="text"
               placeholder="fraction" 
               onChange={this.dF}/>
      </div>
      <br></br>
      <label className="control-label" for="m">
        Monthly revenue:
      </label>
      <div className="controls">
        <input id="m" className="form-control" type="text"
               placeholder="dollar value" 
               onChange={this.dM}/>
      </div>
      <br></br>
      <label className="control-label" for="r">
        Yearly discount rate aka effective annualized interest:
      </label>
      <div className="controls">
        <input id="r" className="form-control" type="text"
               placeholder="fraction" 
               onChange={this.dR}/>
      </div>
    </div>
    <div>
      <br></br><hr></hr><br></br>
      <b>TODO principal is ${$how(this.state.x)}</b>
      <br></br>
      <br></br>
      TODO 
      ${$how(this.state.f)} {/* */}
      (TODO).
      <br></br>
      <br></br>
      Amount repaid in 60 days: 
      ${$how(this.state.m/DIM*this.state.f*60)}
      <br></br>
      <br></br>
      ${$how(this.state.x*(1+this.state.p))} {/* */}
      fully paid in {/* */}
      {round(this.state.x*(1+this.state.p) / (this.state.m/DIM*this.state.f))}
      {/* */} {/* */}
      days
    </div>
  </div> ) }
}

ReactDOM.render(<Loan/>, document.getElementById('root'))

/******************************************************************************
 *                              STATIC WEBSITE                                *
 ******************************************************************************/


/******************************************************************************
 *                      STUFF WE'RE NOT CURRENTLY USING                       *
 ******************************************************************************/


// -----------------------------------------------------------------------------
