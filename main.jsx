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
    fra: 0, // fraction of the decision that's yours
    pie: 0, // value of the whole decision
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

ReactDOM.render(<Pumpkin/>, document.getElementById('root'))

/******************************************************************************
 *                              STATIC WEBSITE                                *
 ******************************************************************************/

// Take a prefix string p and a string s and return what's left of s after 
// removing the prefix p. Eg, deprefix("cat", "catenary") -> "enary". If p is 
// not actually a prefix of s then all bets are off.
function deprefix(p, s) {
  return s.indexOf(p) !== 0 ? ' ~ ' + s : s.substring(p.length)
}

// Eg, commonprefix("abc", "abx") -> "ab"
function commonprefix(a, b) {
  if (!a || !b || !a.length || !b.length || a.charAt(0)!==b.charAt(0)) return ''
  return a.charAt(0) + commonprefix(a.slice(1), b.slice(1))
}

// Canonicalize spaces, namely, replace weirdo thin spaces with normal ones
function kaspace(s) { return s.replace(/\s/g, ' ') }

// Take test number, as-of time, deadline, timezone; return list of html strings
// for inserting into the table
function gussy(i, ao, dl, tz, trel, tabs, tabstz) {
  tz = tz === null ? BTZ : tz
  const trel2   = beetils.doomString(dl, "countdown", tz,          ao, tz)
  const trel2c  = dl-ao < 0 ? `<font color="#FF0000">${trel2}</font>` : trel2
  const tabs2   = beetils.doomString(dl, "calendar",  tz,          ao, tz)
  const tabstz2 = beetils.doomString(dl, "calendar",  "MAGIC1638", ao, tz)
  const sao     = shd(ao, tz)
  const sdl     = shd(dl, tz)
  const sdlpre  = commonprefix(sao, sdl)
  const sdlpost = deprefix(sdlpre, sdl)
  const stz     = beetils.tzAbbr(tz)
  const strel   = trel===kaspace(trel2) ? trel2c : '<s>'+trel+'</s><br>'+trel2c
  const ftag    = `<font color=${GRAY}>`
  const stabs1  = `${tabs}${ftag}${deprefix(tabs, tabstz)}</font>`
  const stabs2  = `${tabs2}${ftag}${deprefix(tabs2, tabstz2)}</font>`
  const stabs   = stabs1===stabs2 ? stabs1 : `<s>${stabs1}</s><br>${stabs2}`
  const gray = s => `<font color=${GRAY}>${s}</font>`
  const red  = s => `<font color="#B31B1B">${s}</font>`

  return [
    //`<font color=${GRAY} size="-5">${i}</font>`,
    `<pre><font color=${GRAY} size="-5">${i}  </font>` +
    `${sao} &xrarr; ${sdlpre}${red(sdlpost)} ${gray('('+stz+')')}</pre>`,
    //`<pre>${sdl}</pre>`,
    //`<pre>${stz}`,
    `${strel}`, 
    `${stabs}`, 
  ]
}

// Generate a big string to display on the on the web page that can be pasted
// in to replace the test suite, for when we make a change we like and want to 
// update all the reference outputs. Like hitting R in automon.
function gensuite() {
  let s = ''
  let ao, dl, tz, trel, tabs, tabstz
  suite.forEach(row => {
    [ao, dl, tz] = row
    trel   = beetils.doomString(dl, "countdown", tz,          ao, tz)
    tabs   = beetils.doomString(dl, "calendar",  tz,          ao, tz)
    tabstz = beetils.doomString(dl, "calendar",  "MAGIC1639", ao, tz)
    s += 
      `[${ao}, ${dl}, ${constify(tz)}, "${trel}", "${tabs}", "${tabstz}"],\n`    
  })
  return s
}

// Take a list and insert it as a row in the html table at position r
function insertrow(row, r=0) {
  const htmlrow = document.getElementById('ttable').insertRow(r)
  row.forEach((c,i) => htmlrow.insertCell(i).innerHTML = c)
}

// TODO: This +18 is to make the row number in the html match the line numbers
// of the test suite rows in the code. Normally it'd just be +1 to start at 1:
suite.forEach((row,i) => insertrow(gussy(i+18, ...row), -1))

document.getElementById('gsuite').innerHTML = gensuite()

/******************************************************************************
 *                                 TEST SUITE                                 *
 ******************************************************************************/

let ntest = 0 // count how many tests we do
let npass = 0 // count how many pass

// Take a boolean assertion and a message string; print a warning to the browser
// console if the assertion is false. Also increment the test counter.
// (But mainly I wanted to just type "assert" instead of "console.assert")
function assert(test, msg) {
  ntest += 1
  npass += test
  console.assert(test, msg)
}

function testsuite() {
  ntest = npass = 0
  let ao, dl, tz, trel, tabs, tabstz // the 6 fields in a test suite row
  let trel2, tabs2, tabstz2 // calculated versions of above for comparison
  suite.forEach(row => {
    [ao, dl, tz, trel, tabs, tabstz] = row
    trel2   = beetils.doomString(dl, "countdown", tz,          ao, tz)
    tabs2   = beetils.doomString(dl, "calendar",  tz,          ao, tz)
    tabstz2 = beetils.doomString(dl, "calendar",  "MAGIC1436", ao, tz)
    assert(kaspace(trel2) === trel && tabs2 === tabs && tabstz2 === tabstz,
           `ERROR: ${shd(ao)} - ${shd(dl)} (${beetils.tzAbbr(tz)}): ` +
           (trel   === trel2   ? '✓ | ' : `${trel} -> ${trel2} | `) +
           (tabs   === tabs2   ? '✓ | ' : `${tabs} -> ${tabs2} | `) +
           (tabstz === tabstz2 ? '✓ | ' : `${tabstz} -> ${tabstz2}`))
  })
  return npass + "/" + ntest + " tests passed"
}
console.log(testsuite()) // uncomment when testing


/******************************************************************************
 *                      STUFF WE'RE NOT CURRENTLY USING                       *
 ******************************************************************************/

/* TESTS for tzDescribe:
console.log(tzDescribe("America/Los_Angeles", true))
console.log(tzDescribe("America/Los_Angeles", false))
console.log(tzDescribe("America/Caracas", true))
console.log(tzDescribe("America/Caracas", false))
console.log(tzDescribe("Asia/Irkutsk", true))
console.log(tzDescribe("Asia/Irkutsk", false))
*/

/* Original version of tzDescribe:
// Take a timezone string tz like "America/Los_Angeles" and a boolean saying
// whether we want the full string with UTC offset like "(UTC+03)" and return a
// a human-friendly string describing the timezone like "PDT" (if full=false)
// or "PDT (UTC-07)" (if full=true).
// Technical note: To escape characters in a format string, wrap them in square
// brackets.
function tzDescribe(tz, full) {
  var date = moment.tz(tz)
  var tzstr = ''
  if (date.format('z').match(/^[a-z]+$/i)) {
    // check if the timezone has a friendly abbreviation
    tzstr = date.format('z')
  } else {
    // ow: use the city portion of the tz string
    tzstr = tz.replace(/^.*\//, '').replace(/_/g, ' ')
  }
  if (full) {
    tzstr = '['+tzstr+'] (UTCZ)'
    return date.format(tzstr).replace(/:00/,'')
  } else {
    return date.format('(['+tzstr+'])')
  }
*/

/*
// 
// this is a thing that's just included here because it shares in common the
// tzDescribe function that's describe & used above.
//
// update deadline tooltip if browser tz does not match usertz
function updateDeadTooltip() {
  var usertz = $(".hero .doom").data("tz"); // passed in info about what timezone the Actual User is in
  var browsertz = moment.tz.guess();        // get timezone info from the browser (i.e. timezone of Viewing User)
  if (usertz != browsertz) {
    var deadtime = $(".hero .doom").data("deadtime");
    var browserdead = moment.tz(deadtime*1000, browsertz); 
    var tzstr = tzDescribe(browsertz, true);
      
    // and now we're going to paste them together and set the tooltip
    $(".hero .doom").attr("title",
      $(".hero .doom").attr("title") + browserdead.format("[ / "+tzstr+"] HH:mm")
    ).tooltip();
  } else {
    $(".hero .doom").tooltip();
  }
}
*/

/* first stab at a showdate function
  const date = new Date(t*1000)
  const y = date.getUTCFullYear()
  const m = date.getUTCMonth() + 1
  const d = date.getUTCDate()
  const H = date.getUTCHours()
  const M = date.getUTCMinutes()
  const S = date.getUTCSeconds()
  const dd = function(x) { return x < 10 ? '0'+x : x } // double-digit-ify
  return y+'-'+dd(m)+'-'+dd(d)+'_'+dd(H)+':'+dd(M)+':'+dd(S)+' UTC'
*/

/*
const tzl = ["Africa/Abidjan", "Africa/Accra", "Africa/Addis_Ababa", "Africa/Algiers", "Africa/Asmara", "Africa/Bamako", "Africa/Bangui", 
"Africa/Banjul", "Africa/Bissau", "Africa/Blantyre", "Africa/Brazzaville", "Africa/Bujumbura", "Africa/Cairo", 
"Africa/Casablanca", "Africa/Ceuta", "Africa/Conakry", "Africa/Dakar", "Africa/Dar_es_Salaam", "Africa/Djibouti", 
"Africa/Douala", "Africa/El_Aaiun", "Africa/Freetown", "Africa/Gaborone", "Africa/Harare", "Africa/Johannesburg", 
"Africa/Juba", "Africa/Kampala", "Africa/Khartoum", "Africa/Kigali", "Africa/Kinshasa", "Africa/Lagos", "Africa/Libreville", 
"Africa/Lome", "Africa/Luanda", "Africa/Lubumbashi", "Africa/Lusaka", "Africa/Malabo", "Africa/Maputo", "Africa/Maseru", "Africa/Mbabane", 
"Africa/Mogadishu", "Africa/Monrovia", "Africa/Nairobi", "Africa/Ndjamena", "Africa/Niamey", "Africa/Nouakchott", 
"Africa/Ouagadougou", "Africa/Porto-Novo", "Africa/Sao_Tome", "Africa/Tripoli", "Africa/Tunis", "Africa/Windhoek", "America/Adak", 
"America/Anchorage", "America/Anguilla", "America/Antigua", "America/Araguaina", "America/Argentina/Buenos_Aires", 
"America/Argentina/Catamarca", "America/Argentina/Cordoba", "America/Argentina/Jujuy", "America/Argentina/La_Rioja", 
"America/Argentina/Mendoza", "America/Argentina/Rio_Gallegos", "America/Argentina/Salta", "America/Argentina/San_Juan", 
"America/Argentina/San_Luis", "America/Argentina/Tucuman", "America/Argentina/Ushuaia", "America/Aruba", "America/Asuncion", 
"America/Atikokan", "America/Bahia", "America/Bahia_Banderas", "America/Barbados", "America/Belem", "America/Belize", 
"America/Blanc-Sablon", "America/Boa_Vista", "America/Bogota", "America/Boise", "America/Cambridge_Bay", "America/Campo_Grande", 
"America/Cancun", "America/Caracas", "America/Cayenne", "America/Cayman", "America/Chicago", "America/Chihuahua", 
"America/Costa_Rica", "America/Creston", "America/Cuiaba", "America/Curacao", "America/Danmarkshavn", "America/Dawson", 
"America/Dawson_Creek", "America/Denver", "America/Detroit", "America/Dominica", "America/Edmonton", "America/Eirunepe", 
"America/El_Salvador", "America/Fortaleza", "America/Fort_Nelson", "America/Glace_Bay", "America/Godthab", "America/Goose_Bay", 
"America/Grand_Turk", "America/Grenada", "America/Guadeloupe", "America/Guatemala", "America/Guayaquil", "America/Guyana", 
"America/Halifax", "America/Havana", "America/Hermosillo", "America/Indiana/Indianapolis", "America/Indiana/Knox", 
"America/Indiana/Marengo", "America/Indiana/Petersburg", "America/Indiana/Tell_City", "America/Indiana/Vevay", 
"America/Indiana/Vincennes", "America/Indiana/Winamac", "America/Inuvik", "America/Iqaluit", "America/Jamaica", 
"America/Juneau", "America/Kentucky/Louisville", "America/Kentucky/Monticello", "America/Kralendijk", 
"America/La_Paz", "America/Lima", "America/Los_Angeles", "America/Lower_Princes", "America/Maceio", "America/Managua", 
"America/Manaus", "America/Marigot", "America/Martinique", "America/Matamoros", "America/Mazatlan", "America/Menominee", 
"America/Merida", "America/Metlakatla", "America/Mexico_City",  "America/Miquelon", "America/Moncton", "America/Monterrey", 
"America/Montevideo", "America/Montreal", "America/Montserrat", "America/Nassau", "America/New_York", "America/Nipigon", 
"America/Nome", "America/Noronha", "America/North_Dakota/Beulah", "America/North_Dakota/Center", "America/North_Dakota/New_Salem", 
"America/Ojinaga", "America/Panama", "America/Pangnirtung", "America/Paramaribo", "America/Phoenix", "America/Port-au-Prince", 
"America/Port_of_Spain", "America/Porto_Velho", "America/Puerto_Rico", "America/Punta_Arenas", "America/Rainy_River", 
"America/Rankin_Inlet", "America/Recife", "America/Regina", "America/Resolute", "America/Rio_Branco", "America/Santa_Isabel", 
"America/Santarem", "America/Santiago", "America/Santo_Domingo", "America/Sao_Paulo", "America/Scoresbysund", "America/Sitka", 
"America/St_Barthelemy", "America/St_Johns", "America/St_Kitts", "America/St_Lucia", "America/St_Thomas", "America/St_Vincent", 
"America/Swift_Current", "America/Tegucigalpa", "America/Thule", "America/Thunder_Bay", "America/Tijuana", "America/Toronto", 
"America/Tortola", "America/Vancouver", "America/Whitehorse", "America/Winnipeg", "America/Yakutat", "America/Yellowknife", 
"Antarctica/Casey", "Antarctica/Davis", "Antarctica/DumontDUrville", "Antarctica/Macquarie", "Antarctica/Mawson", "Antarctica/McMurdo", 
"Antarctica/Palmer", "Antarctica/Rothera", "Antarctica/Syowa", "Antarctica/Troll", "Antarctica/Vostok", "Arctic/Longyearbyen", 
"Asia/Aden", "Asia/Almaty", "Asia/Amman", "Asia/Anadyr", "Asia/Aqtau", "Asia/Aqtobe", "Asia/Ashgabat", "Asia/Atyrau", 
"Asia/Baghdad", "Asia/Bahrain", "Asia/Baku", "Asia/Bangkok", "Asia/Barnaul", "Asia/Beirut", "Asia/Bishkek", "Asia/Brunei", 
"Asia/Chita", "Asia/Choibalsan", "Asia/Chongqing", "Asia/Colombo", "Asia/Damascus", "Asia/Dhaka", "Asia/Dili", "Asia/Dubai", 
"Asia/Dushanbe", "Asia/Famagusta", "Asia/Gaza", "Asia/Harbin", "Asia/Hebron", "Asia/Ho_Chi_Minh", "Asia/Hong_Kong", "Asia/Hovd", 
"Asia/Irkutsk", "Asia/Jakarta", "Asia/Jayapura", "Asia/Jerusalem", "Asia/Kabul", "Asia/Kamchatka", "Asia/Karachi", "Asia/Kashgar", 
"Asia/Kathmandu", "Asia/Khandyga", "Asia/Kolkata", "Asia/Krasnoyarsk", "Asia/Kuala_Lumpur", "Asia/Kuching", 
"Asia/Kuwait", "Asia/Macau", "Asia/Magadan", "Asia/Makassar", "Asia/Manila", "Asia/Muscat", "Asia/Nicosia", "Asia/Novokuznetsk", 
"Asia/Novosibirsk", "Asia/Omsk", "Asia/Oral", "Asia/Phnom_Penh", "Asia/Pontianak", "Asia/Pyongyang", "Asia/Qatar", "Asia/Qostanay", 
"Asia/Qyzylorda", "Asia/Riyadh", "Asia/Sakhalin", "Asia/Samarkand", "Asia/Seoul", "Asia/Shanghai", "Asia/Singapore", 
"Asia/Srednekolymsk", "Asia/Taipei", "Asia/Tashkent", "Asia/Tbilisi", "Asia/Tehran", "Asia/Thimphu", "Asia/Tokyo", "Asia/Tomsk", 
"Asia/Ulaanbaatar", "Asia/Urumqi", "Asia/Ust-Nera", "Asia/Vientiane", "Asia/Vladivostok", "Asia/Yakutsk", "Asia/Yangon", 
"Asia/Yekaterinburg", "Asia/Yerevan", "Atlantic/Azores", "Atlantic/Bermuda", "Atlantic/Canary", "Atlantic/Cape_Verde", 
"Atlantic/Faroe", "Atlantic/Madeira", "Atlantic/Reykjavik", "Atlantic/South_Georgia", "Atlantic/Stanley", "Atlantic/St_Helena", 
"Australia/Adelaide", "Australia/Brisbane", "Australia/Broken_Hill", "Australia/Currie", "Australia/Darwin", "Australia/Eucla", 
"Australia/Hobart", "Australia/Lindeman", "Australia/Lord_Howe", "Australia/Melbourne", "Australia/Perth", "Australia/Sydney", 
"Europe/Amsterdam", "Europe/Andorra", "Europe/Astrakhan", "Europe/Athens", "Europe/Belgrade", "Europe/Berlin", 
"Europe/Bratislava", "Europe/Brussels", "Europe/Bucharest", "Europe/Budapest", "Europe/Busingen", "Europe/Chisinau", 
"Europe/Copenhagen", "Europe/Dublin", "Europe/Gibraltar", "Europe/Guernsey", "Europe/Helsinki", "Europe/Isle_of_Man", 
"Europe/Istanbul", "Europe/Jersey", "Europe/Kaliningrad", "Europe/Kiev", "Europe/Kirov", "Europe/Lisbon", "Europe/Ljubljana", 
"Europe/London", "Europe/Luxembourg", "Europe/Madrid", "Europe/Malta", "Europe/Mariehamn", "Europe/Minsk", "Europe/Monaco", 
"Europe/Moscow", "Europe/Oslo", "Europe/Paris", "Europe/Podgorica", "Europe/Prague", "Europe/Riga", "Europe/Rome", "Europe/Samara", 
"Europe/San_Marino", "Europe/Sarajevo", "Europe/Saratov", "Europe/Simferopol", "Europe/Skopje", "Europe/Sofia", 
"Europe/Stockholm", "Europe/Tallinn", "Europe/Tirane", "Europe/Ulyanovsk", "Europe/Uzhgorod", "Europe/Vaduz", 
"Europe/Vatican", "Europe/Vienna", "Europe/Vilnius", "Europe/Volgograd", "Europe/Warsaw", "Europe/Zagreb", 
"Europe/Zaporozhye", "Europe/Zurich", "GMT", "GMT-1", "GMT+1", "GMT-10", "GMT+10", "GMT+10.5", "GMT-11", "GMT+11", "GMT-12", 
"GMT+12", "GMT+12.75", "GMT+13", "GMT+14", "GMT-2", "GMT+2", "GMT-3", "GMT+3", "GMT-3.5", "GMT+3.5", "GMT-4", "GMT+4", "GMT+4.5", "GMT-5", 
"GMT+5", "GMT+5.5", "GMT+5.75", "GMT-6", "GMT+6", "GMT+6.5", "GMT-7", "GMT+7", "GMT-8", "GMT+8", "GMT+8.75", "GMT-9", "GMT+9", "GMT-9.5", 
"GMT+9.5", "Indian/Antananarivo", "Indian/Chagos", "Indian/Christmas", "Indian/Cocos", "Indian/Comoro", 
"Indian/Kerguelen", "Indian/Mahe", "Indian/Maldives", "Indian/Mauritius", "Indian/Mayotte", "Indian/Reunion", 
"Pacific/Apia", "Pacific/Auckland", "Pacific/Bougainville", "Pacific/Chatham", "Pacific/Chuuk", "Pacific/Easter", 
"Pacific/Efate", "Pacific/Enderbury", "Pacific/Fakaofo", "Pacific/Fiji", "Pacific/Funafuti", "Pacific/Galapagos", 
"Pacific/Gambier", "Pacific/Guadalcanal", "Pacific/Guam", "Pacific/Honolulu", "Pacific/Johnston", "Pacific/Kiritimati", 
"Pacific/Kosrae", "Pacific/Kwajalein", "Pacific/Majuro", "Pacific/Marquesas", "Pacific/Midway", "Pacific/Nauru", 
"Pacific/Niue", "Pacific/Norfolk", "Pacific/Noumea", "Pacific/Pago_Pago", "Pacific/Palau", "Pacific/Pitcairn", 
"Pacific/Pohnpei", "Pacific/Port_Moresby", "Pacific/Rarotonga", "Pacific/Saipan", "Pacific/Tahiti", "Pacific/Tarawa", 
"Pacific/Tongatapu", "Pacific/Wake", "Pacific/Wallis", "UCT", "UTC"]
*/

// -----------------------------------------------------------------------------
