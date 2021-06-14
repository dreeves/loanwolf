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
  pay = () => this.state.get

  chgP = e => { // do this when the pay field changes
    this.setState({get: e.target.value.trim()})
  }

  chgG = e => { // do this when the get field changes
    this.setState({get: e.target.value.trim()})
  }
  
  chgF = e => { // do this when the fraction-of-pie field changes
    this.set
  }
  
  render() { return ( <div>
    <div className="control-group">
      <label className="control-label" for="heep">
        Current/as-of time (YMDHMS or unixtime):
      </label>
      <div className="controls">
        <input className="form-control" type="text" autofocus
               placeholder="time of day, default now"
               //value={genTOD(now())} // doing this doesn't let you edit it :(
               onChange={this.chgA}/>
      </div>
      <br></br>
      <label className="control-label" for="dead">
        Deadline (as above or, e.g., +{beetils.genHMS(1*3600+5*60)}):
      </label>
      <div className="controls">
        <input className="form-control" type="text"
               placeholder="time of day or amount of time" 
               onChange={this.chgD}/>
      </div>
      <br></br>
      <label className="control-label" for="tz">
        Timezone string:
      </label>
      <div className="controls">
        <input className="form-control" type="text"
               placeholder="e.g., America/Los_Angeles" 
               onChange={this.chgT}/>
      </div>
    </div>
    <h2>Canonicalized Inputs</h2>
    <p><font size="+2">As of: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      {shd(this.state.ao, this.state.tz, true)}</font> &nbsp;&nbsp;
      <font size="-4">{Math.round(this.state.ao)}</font>
    </p>
    <p><font size="+2">Deadline: &nbsp;
      {shd(this.dl(), this.state.tz, true)}</font>
      &nbsp; &nbsp;
      <font size="-4">{Math.round(this.dl(), this.state.tz)}</font>
    </p>
    <p><font size="+2">Timezone: {' '}
      {beetils.tzDescribe(this.state.tz, this.dl())}</font></p>
    <h2>Outputs</h2>
    <font size="+2">
    <p><div dangerouslySetInnerHTML={{__html: 
      this.dl() - this.state.ao < 0 ? this.red(this.doomTill()) :
                                      this.doomTill()}}/></p>
    <p>{this.doomWhen()}</p>
    <p>{this.doomWhenTZ()}</p>
    </font>
{/* <p><font color={GRAY}>[DEBUG: 
  {this.state.ao}, {this.state.nw ? "now" : "fixed"}, 
  dl={this.state.dl}, td={this.state.td}, {this.state.tz}]</font></p> 
*/}
    <p><font color={GRAY}>For adding the above to the test suite:<br/> <pre>[
      {this.state.ao}, {this.dl()}, {constify(this.state.tz)},
      "{this.doomTill()}", "{this.doomWhen()}", "{this.doomWhenTZ()}"],</pre>
{/* "{beetils.doomTill(this.state.ao, this.dl())}",
    "{beetils.doomWhen(this.state.ao, this.dl(), false, this.state.tz)}",
    "{beetils.doomWhen(this.state.ao, this.dl(), true,  this.state.tz)}"],</pre>
*/}
    </font></p>
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
