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

// Net Present Value of x dollars paid in daily installments equal to fraction
// fr of daily revenue, where monthly revenue is mr and the yearly discount rate
// is rt. Mathematica: 
// TimeValue[Annuity[fr*mr/DIM, x/(fr*mr/DIM)], EffectiveInterest[rt/DIY, 0], 0]
function npv(x, fr, mr, rt) {
  return fr*mr/DIM*(1-exp(rt/DIY)**(-x*DIM/fr/mr))/(exp(rt/DIY)-1)
}

// Effective Interest Rate (as a percentage) that makes a stream of payments
// totaling la+lc (loan amount la plus loan cost lc) have the same time-value as
// la, the principal of the loan. Mathematica:
// NSolve[npv[la + lc, fr, mr, rt] == la, rt, Reals][[1, 1, 2]] * 100
function eir(la, lc, fr, mr) {
  return 23 // TODO
}

// Inverse of above: what x makes GammaCDF(x, A, B) == p
// For TagTime: hours to set aside so Pr(success) == p is ig(p, pings, gap)
function ig(p, A, B, min=0, max=8) {
  if (p<0) { p = 0 }
  if (p>1) { p = 1 }
  var m = (min+max)/2
  if (abs(min-max)<1/60) { return m } // accurate to within 1 minute
  var p2 = GammaCDF(max, A, B)
  //console.log(`${min} ${max} -> ${GammaCDF(min, A, B)} ${p2}`)
  if (p2 < p) { return ig(p, A, B, min, 2*max) }
  var p1 = GammaCDF(min, A, B)
  var pm = GammaCDF(m, A, B)
  if (pm<p) { return ig(p, A, B, m, max) }
  return ig(p, A, B, min, m)
}

// -----------------------------------------------------------------------------
class Loan extends React.Component {
  constructor(props) { super(props); this.state = {
    la: 0, // (DOL)  principal aka loan amount
    lc: 0, // (DOL)  premium aka fixed fee for the loan aka loan cost
    fl: 0, // (FRAC) fraction of principal to be paid as interest
    fr: 0, // (FRAC) fraction of daily revenue that goes to paying back the loan
    mr: 0, // (DOL)  monthly revenue
    rt: 0, // (FRAC) yearly discount rate as a fraction
  } }
  
  // Glitch mistakenly says syntax error on next line but it's fine, really!
  dLA = e => { // do this when the la field changes
    const la = par$e(e.target.value)
    const lc = this.state.lc; //$("lc").value = $how(lc)
    const fl = lc/la; $("fl").value = showfrac(fl)
    const fr = this.state.fr; //$("fr").value = showfrac(fr)
    const mr = this.state.mr; //$("mr").value = $how(mr)
    const rt = eir(la, lc, fr, mr); $("rt").value = showfrac(rt)
    this.setState({ la })
  }

  dLC = e => { // do this when the lc field changes
    const la = this.state.la; $("la").value = $how(la)
    const lc = par$e(e.target.value)
    const fl = this.state.fl; //$("fl").value = showfrac(fl)
    const fr = this.state.fr; //$("fr").value = showfrac(fr)
    const mr = this.state.mr; $("mr").value = $how(mr)
    const rt = this.state.rt; $("rt").value = showfrac(rt)
    this.setState({ lc })
  }

  dFL = e => { // do this when the fl field changes
    const la = this.state.la; $("la").value = $how(la)
    const lc = this.state.lc; //$("lc").value = $how(lc)
    const fl = parsefrac(e.target.value)
    const fr = this.state.fr; //$("fr").value = showfrac(fr)
    const mr = this.state.mr; $("mr").value = $how(mr)
    const rt = this.state.rt; $("rt").value = showfrac(rt)
    this.setState({ fl })
  }

  dFR = e => { // do this when the fr field changes
    const la = this.state.la; $("la").value = $how(la)
    const lc = this.state.lc; //$("lc").value = $how(lc)
    const fl = this.state.fl; //$("fl").value = showfrac(fl)
    const fr = parsefrac(e.target.value)
    const mr = this.state.mr; $("mr").value = $how(mr)
    const rt = this.state.rt; $("rt").value = showfrac(rt)
    this.setState({ fr })
  }

  dMR = e => { // do this when the mr field changes
    const la = this.state.la; $("la").value = $how(la)
    const lc = this.state.lc; //$("lc").value = $how(lc)
    const fl = this.state.fl; //$("fl").value = showfrac(fl)
    const fr = this.state.fr; //$("fr").value = showfrac(fr)
    const mr = par$e(e.target.value)
    const rt = this.state.rt; $("rt").value = showfrac(rt)
    this.setState({ mr })
  }

  dRT = e => { // do this when the rt field changes
    const la = this.state.la; $("la").value = $how(la)
    const lc = this.state.lc; //$("lc").value = $how(lc)
    const fl = this.state.fl; //$("fl").value = showfrac(fl)
    const fr = this.state.fr; //$("fr").value = showfrac(fr)
    const mr = this.state.mr; $("mr").value = $how(mr)
    const rt = parsefrac(e.target.value)
    this.setState({ rt })
  }
  
  render() { return ( <div>
    <div className="control-group">
      <label className="control-label" for="la">
        Principal aka loan amount:
      </label>
      <div className="controls">
        <input id="la" className="form-control" type="text" autofocus
               placeholder="dollar value"
               onChange={this.dLA}/> &nbsp;
      </div>
      <br></br>
      <label className="control-label" for="lc">
        Fixed fee aka interest aka loan cost:
      </label>
      <div className="controls">
        <input id="lc" className="form-control" type="text"
               placeholder="dollar amount" 
               onChange={this.dLC}/>
      </div>
      <br></br>
      <label className="control-label" for="fl">
        Fraction of principal to be paid as interest:
      </label>
      <div className="controls">
        <input id="fl" className="form-control" type="text"
               placeholder="fraction" 
               onChange={this.dFL}/> &nbsp;
        <font color={GRAY}>{showfrac(this.state.fl)}%</font>
      </div>
      <br></br>
      <label className="control-label" for="fr">
        Fraction of daily revenue that goes to paying back the loan:
      </label>
      <div className="controls">
        <input id="fr" className="form-control" type="text"
               placeholder="fraction" 
               onChange={this.dFR}/>
      </div>
      <br></br>
      <label className="control-label" for="mr">
        Monthly revenue:
      </label>
      <div className="controls">
        <input id="mr" className="form-control" type="text"
               placeholder="dollar value" 
               onChange={this.dMR}/>
      </div>
      <br></br>
      <label className="control-label" for="rt">
        Yearly discount rate aka effective annualized interest:
      </label>
      <div className="controls">
        <input id="rt" className="form-control" type="text"
               placeholder="fraction" 
               onChange={this.dRT}/>
      </div>
    </div>
    <div>
      <br></br><hr></hr><br></br>
      Amount repaid per 60 days: 
      ${$how(this.state.mr/DIM*this.state.fr*60)}
      <br></br>
      <br></br>
      ${$how(this.state.la*(1+this.state.fl))} {/* */}
      fully paid in {/* */}
      {round((this.state.la + this.state.lc)/(this.state.mr/DIM*this.state.fr))}
      {/* */} {/* */}
      days
      <br></br>
      <br></br>
    </div>
  </div> ) }
}

ReactDOM.render(<Loan/>, document.getElementById('root'))

/******************************************************************************
 *                              STATIC WEBSITE                                *
 ******************************************************************************/

// -----------------------------------------------------------------------------
