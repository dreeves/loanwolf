/******************************************************************************
 *                             CONSTANTS & GLOBALS                            *
 ******************************************************************************/

const GRAY = "#999999"
const DIY = 365.25 // days in year
const DIM = DIY/12 // days in month

/******************************************************************************
 *                             REACT-IVE WEBSITE                              *
 ******************************************************************************/

const exp   = Math.exp
const log   = Math.log
const abs   = Math.abs
const round = Math.round

function $(id) { return document.getElementById(id) } // convenience function

// Singular or Plural: Pluralize the given noun properly, if n is not 1. 
// Provide the plural version if irregular.
// Eg: splur(3, "boy") -> "3 boys", splur(3, "man", "men") -> "3 men"
function splur(n, noun, nounp='') {
  if (nounp === '') { nounp = noun+'s' }
  return n.toString()+' '+(n === 1 ? noun : nounp)
}

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

// Handles fractions and percents and any arithmatic expression
function parsefrac(s) {
  s = s.replace(/^([^\%]*)\%(.*)$/, '($1)/100$2')
  const x = laxeval(s)
  return x===null ? NaN : x
}

function showfrac(x) {
  return round(100*x)+'%'
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

function showdays(x) {
  return x==='' ? '?' : isNaN(x) ? '0' : round(x)
}

// #SCHDEL
// Net Present Value of x dollars paid in daily installments equal to fraction
// fr of daily revenue, where monthly revenue is mr and the yearly discount rate
// is rt. Mathematica: 
// TimeValue[Annuity[fr*mr/DIM, x/(fr*mr/DIM)], EffectiveInterest[rt/DIY, 0], 0]
//function npvold(x, fr, mr, rt) {
//  return fr*mr/DIM*(1-exp(rt/DIY)**(-x*DIM/fr/mr))/(exp(rt/DIY)-1)
//}

// Net Present Value of x dollars paid in daily installments of d dollars, with
// yearly discount rate r. Mathematica: 
// TimeValue[Annuity[d, x/d], EffectiveInterest[r/DIY, 0], 0]
function npv(x, d, r) {
  return -d * (exp(-x/d*r/DIY) - 1) / (exp(r/DIY) - 1)
}

// Effective Interest Rate that makes a stream of payments totaling la+lc (loan
// amount + loan cost) have the same time-value as la, the principal of the
// loan. Daily payments are fr*mr/DIM. Mathematica:
// NSolve[npv[la + lc, fr*mr/DIM, r] == la, r, Reals][[1, 1, 2]]
function eir(la, lc, fr, mr, rmin=0, rmax=1) {
  if (rmax>100) { return Infinity } // >10,000% interest? give up.
  const rmid = (rmin+rmax)/2
  if (abs(rmin-rmax)<0.005)     return rmid
  const d = fr*mr/DIM
  if (npv(la+lc, d, rmax) > la) return eir(la, lc, fr, mr, rmin, 2*rmax)
  if (npv(la+lc, d, rmid) < la) return eir(la, lc, fr, mr, rmin, rmid)
                                return eir(la, lc, fr, mr, rmid, rmax)
}

// Find the loan cost that yields the given interest rate.
// Mathematica solved this analytically so this is just pasting that in.
function flc(la, fr, mr, rt) {
  return -la - (fr*mr*log((DIM*la-DIM*exp(rt/DIY)*la+fr*mr) / (fr*mr))) / 
               (DIM*log(exp(rt/DIY)))
}

// -----------------------------------------------------------------------------
class Loan extends React.Component {
  constructor(props) { super(props); this.state = {
    la: 0, // DOL: principal aka loan amount
    lc: 0, // DOL: premium aka fixed fee for the loan aka loan cost
    //fl: 0, // FRAC: fraction of principal to be paid as interest
    fr: 0, // FRAC: fraction of daily revenue that goes to paying back the loan
    mr: 0, // DOL:  monthly revenue
    rt: 0, // FRAC: yearly discount rate as a fraction
    minp: 0,  // DOL: minimum repayment amount per {freq} days
    freq: 60, // DAYS: number of days for {minp}
  } }
  
  // Daily repayment: daily revenue times fraction thereof to apply as payment
  dai() { return this.state.mr/DIM*this.state.fr }
  
  // Dollar amount paid per freq days
  pp() { return this.dai()*this.state.freq }
  
  // Glitch mistakenly says syntax error on next line but it's fine, really!
  dLA = e => { // do this when the la field changes
    const la = par$e(e.target.value)
    const lc = this.state.lc; //$("lc").value = $how(lc)
    //const fl = lc/la; $("fl").value = showfrac(fl)
    const fr = this.state.fr; //$("fr").value = showfrac(fr)
    const mr = this.state.mr; //$("mr").value = $how(mr)
    const rt = eir(la, lc, fr, mr); $("rt").value = showfrac(rt)
    this.setState({ la, rt })
  }

  dLC = e => { // do this when the lc field changes
    const la = this.state.la; //$("la").value = $how(la)
    const lc = par$e(e.target.value)
    //const fl = lc/la; $("fl").value = showfrac(fl)
    const fr = this.state.fr; //$("fr").value = showfrac(fr)
    const mr = this.state.mr; //$("mr").value = $how(mr)
    const rt = eir(la, lc, fr, mr); $("rt").value = showfrac(rt)
    this.setState({ lc, rt })
  }

  //dFL = e => { // do this when the fl field changes
  //  const la = this.state.la; //$("la").value = $how(la)
  //  const fl = parsefrac(e.target.value)
  //  const lc = la*fl; $("lc").value = $how(lc)
  //  const fr = this.state.fr; //$("fr").value = showfrac(fr)
  //  const mr = this.state.mr; //$("mr").value = $how(mr)
  //  const rt = eir(la, lc, fr, mr); $("rt").value = showfrac(rt)
  //  this.setState({ fl, lc, rt })
  //}

  dFR = e => { // do this when the fr field changes
    const la = this.state.la; //$("la").value = $how(la)
    const lc = this.state.lc; //$("lc").value = $how(lc)
    //const fl = this.state.fl; //$("fl").value = showfrac(fl)
    const fr = parsefrac(e.target.value)
    const mr = this.state.mr; //$("mr").value = $how(mr)
    const rt = eir(la, lc, fr, mr); $("rt").value = showfrac(rt)
    this.setState({ fr, rt })
  }

  dMR = e => { // do this when the mr field changes
    const la = this.state.la; //$("la").value = $how(la)
    const lc = this.state.lc; //$("lc").value = $how(lc)
    //const fl = this.state.fl; //$("fl").value = showfrac(fl)
    const fr = this.state.fr; //$("fr").value = showfrac(fr)
    const mr = par$e(e.target.value)
    const rt = eir(la, lc, fr, mr); $("rt").value = showfrac(rt)
    this.setState({ mr, rt })
  }

  dRT = e => { // do this when the rt field changes
    const rt = parsefrac(e.target.value)
    const la = this.state.la; //$("la").value = $how(la)
    const fr = this.state.fr; //$("fr").value = showfrac(fr)
    const mr = this.state.mr; //$("mr").value = $how(mr)
    const lc = flc(la, fr, mr, rt); $("lc").value = $how(lc)
    //const fl = lc/la; $("fl").value = showfrac(fl)
    this.setState({ rt, lc })
  }
  
  dMinp = e => { // do this when the minp field changes
    const minp = par$e(e.target.value)
    //const freq = this.state.freq; //$("freq").value = laxeval(freq)
    //const la = this.state.la; //$("la").value = $how(la)
    //const lc = this.state.lc; //$("lc").value = $how(lc)
    //const fl = this.state.fl; //$("fl").value = showfrac(fl)
    //const fr = this.state.fr; //$("fr").value = showfrac(fr)
    //const mr = this.state.mr; //$("mr").value = $how(mr)
    //const rt = this.state.rt; //$("rt").value = showfrac(rt)
    this.setState({ minp })
  }

  dFreq = e => { // do this when the freq field changes
    const freq = laxeval(e.target.value)
    //const minp = this.state.minp; //$("minp").value = $how(minp)
    //const la = this.state.la; //$("la").value = $how(la)
    //const lc = this.state.lc; //$("lc").value = $how(lc)
    //const fl = this.state.fl; //$("fl").value = showfrac(fl)
    //const fr = this.state.fr; //$("fr").value = showfrac(fr)
    //const mr = this.state.mr; //$("mr").value = $how(mr)
    //const rt = this.state.rt; //$("rt").value = showfrac(rt)
    this.setState({ freq })
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
               placeholder="dollar value" 
               onChange={this.dLC}/>
      </div>
      <br></br>
      <label className="control-label" for="fr">
        Fraction of daily revenue that goes to paying back the loan:
      </label>
      <div className="controls">
        <input id="fr" className="form-control" type="text"
               placeholder="fraction" 
               //value={this.state.fr}
               onChange={this.dFR}/> &nbsp;
        <font color={GRAY}>{showfrac(this.state.fr)}</font>
      </div>
      <br></br>
      <label className="control-label" for="mr">
        Monthly revenue:
      </label>
      <div className="controls">
        <input id="mr" className="form-control" type="text"
               placeholder="dollar value" 
               onChange={this.dMR}/> <font color="#FF0000">
        {this.state.mr/DIM*this.state.fr*this.state.freq < this.state.minp ?
          'too little' : ''} </font>
      </div>
      <br></br>
      <label className="control-label" for="minp">
        Minimum payment:
      </label>
      <div className="controls">
        <input id="minp" className="form-control" type="text"
               placeholder="dollar value" 
               onChange={this.dMinp}/> {/* */}
        <font color={this.state.minp <= this.pp() ? "#000000" : "#FF0000"}>
        {this.state.minp < this.pp() ? '<' :
         this.state.minp > this.pp() ? '>' : '='} {/* */}
        ${$how(this.pp())}
        </font>
      </div>
      <label className="control-label" for="mr">
        every 
      </label>
      <div className="controls">
        <input id="freq" className="form-control" type="text"
               placeholder="number of days" 
               value={this.state.freq}
               onChange={this.dFreq}/>
        {this.state.freq === 1 ? " day" : " days"}
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
Say you're a business with 
${$how(this.state.mr)} {/* */}
monthly revenue.
(Adjust these numbers above!)
You're offered a loan of 
${$how(this.state.la)}.
As interest on the loan, you'll pay a single fixed fee of
${$how(this.state.lc)}.
The principal plus the interest, totaling 
${$how(this.state.la+this.state.lc)}, 
you'll pay in daily amounts of {/* */}
{showfrac(this.state.fr)} {/* */}
of your daily revenue, i.e.,
${$how(this.dai())}/day.
That will get the whole 
${$how(this.state.la)} + 
${$how(this.state.lc)} paid back in {/* */}
{splur(showdays((this.state.la+this.state.lc)/this.dai()), "day")}. {/* */}
<font color="#FF0000">
{this.state.minp > this.pp() ? 
`But wait! The loan has a minimum repayment rate of \
$${$how(this.state.minp)} \
every \
${splur(showdays(this.state.freq), "day")} \
and your revenue of \
$${$how(this.state.mr)}/mo \
isn't enough for the \
${showfrac(this.state.fr)} \
of revenue to hit that. \
Bump up your revenue until the red text goes away. \
Then this will be actually, not just hypothetically, true!` : ''
}
</font> {/* */}
This is equivalent to a traditional loan with an annual interest rate of {/* */}
{showfrac(this.state.rt)} {/* */}
and no prepayment penalty or any fees at all or other shenanigans. {/* */}
{this.pp() > 1+this.state.minp ? 
`(Note that the lower your revenue the better deal this is. \
Try decreasing that \
$${$how(this.state.mr)}/mo \
to see!)` : 
abs(this.state.minp - this.pp()) < 1 && this.state.minp > 0 ? 
`✨
Note that if your revenue were any lower than \
$${$how(this.state.mr)}/mo \
then you'd bump into the minimum payments so \
${showfrac(this.state.rt)} \
APR is the best possible effective interest rate for this loan. \
✨` :
''}
      <br></br>
      <br></br>
    </div>
  </div> ) }
}

/*
68500
8220
.2
21621.92
8524.45
60
15%
*/

ReactDOM.render(<Loan/>, $('root'))

/******************************************************************************
 *                              STATIC WEBSITE                                *
 ******************************************************************************/

// -----------------------------------------------------------------------------
