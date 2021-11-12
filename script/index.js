/*query string paramaters*/
// //https://flaviocopes.com/urlsearchparams/
// const params = new URLSearchParams(window.location.search)


// console.log(params.has('admin'))
// console.log(params.get('admin'))

// for(const param of params) {
// 	console.log(param)
// }
/*query string paramaters*/

// const getWeather = async (id) => {
// 	const baseUrl = "http://dataservice.accuweather.com/currentconditions/v1/";
// 	// const baseUrl = "http://dataservice.accuweather.com/forecasts/v1/";
// 	const query = `${id}?apikey=${key}`;

// 	const res = await fetch(baseUrl + query);
// 	const data = await res.json();

// 	return data[0];
// };

let days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

let today = new Date()

let pinnedLocality = ['QLD','Pittsworth']
let selectedRegion = 'AUS'
let day = 0;
let loc_keys = [];

const tenseNav = (e)=>{

	switch(true){

		case !$(e.target).hasClass('active'):
		return false;
		
		case $(e.target).hasClass('next'):
		day++;
		$('.tenseNav.prev').addClass('active');
		break;

		case $(e.target).hasClass('prev'):
		day--;
		$('.tenseNav.next').addClass('active');
		break;
	}

	switch(true){
		case day >= 4:
		$('.tenseNav.next').removeClass('active');
		break;

		case day <= 0:
		$('.tenseNav.prev').removeClass('active');
		break;
	}

	today = new Date()
	today.setDate(today.getDate() + day);

	for(let i of loc_keys){
		populateForecast(i,day)
	}
}
$('.tenseNav').click(tenseNav)

const populateCurrent = (Key)=>{

	let data = window[`current_${Key}`]
	/*summaries*/	
	let WeatherIcon = data[0]['WeatherIcon'];if(WeatherIcon < 10){WeatherIcon = '0' + WeatherIcon}
	$(`.observation.k_${Key} .icon`).html(`<img src="icons/${WeatherIcon}-s.png">`)
	$(`.observation.k_${Key} .description`).html(data[0]['WeatherText'])
		$(`.observation.k_${Key} .time`).html(data[0]['LocalObservationDateTime'].substring(11,16))
	$(`.observation.k_${Key} .temperature`).html(`${data[0]['Temperature']['Metric']['Value']}&deg;`)
	/*summaries*/

	/*details*/
	$(`.observation.k_${Key} .feelsLike`).html(`${data[0]['RealFeelTemperature']['Metric']['Value']}&deg;`)
	$(`.observation.k_${Key} .feelsLikeShade`).html(`${data[0]['RealFeelTemperatureShade']['Metric']['Value']}&deg;`)
	$(`.observation.k_${Key} .windChill`).html(`${data[0]['WindChillTemperature']['Metric']['Value']}&deg;`)
	$(`.observation.k_${Key} .dewPoint`).html(`${data[0]['DewPoint']['Metric']['Value']}&deg;`)
	$(`.observation.k_${Key} .wind`).html(`
		${data[0]['Wind']['Direction']['Localized']}
		&nbsp;-&nbsp;
		${data[0]['Wind']['Speed']['Metric']['Value']}
		<!--&nbsp;-->
		${data[0]['Wind']['Speed']['Metric']['Unit']}
	`)
	$(`.observation.k_${Key} .windGust`).html(`
		${data[0]['WindGust']['Speed']['Metric']['Value']}
		<!--&nbsp;-->
		${data[0]['WindGust']['Speed']['Metric']['Unit']}
	`)
	$(`.observation.k_${Key} .uv`).html(`
		${data[0]['UVIndex']}
		&nbsp;-&nbsp;
		${data[0]['UVIndexText']}
	`)
	$(`.observation.k_${Key} .cloudCover`).html(`
		${data[0]['CloudCover']}%
		&nbsp;-&nbsp;
		${data[0]['Ceiling']['Metric']['Value']}
		${data[0]['Ceiling']['Metric']['Unit']}
	`)
	$(`.observation.k_${Key} .pressure`).html(`
		${data[0]['Pressure']['Metric']['Value']}
		${data[0]['Pressure']['Metric']['Unit']}
		&nbsp;-&nbsp;
		${data[0]['PressureTendency']['LocalizedText']}
	`)
	$(`.observation.k_${Key} .relativeHumidity`).html(`${data[0]['RelativeHumidity']}%`)
	$(`.observation.k_${Key} .visibility`).html(`
		${data[0]['Visibility']['Metric']['Value']}
		${data[0]['Visibility']['Metric']['Unit']}
	`)

	let obstruction = 'None'
	if(data[0]['ObstructionsToVisibility'] != ""){
		obstruction = data[0]['ObstructionsToVisibility']
	}
	$(`.observation.k_${Key} .obstruction`).html(obstruction)
	
	$(`.observation.k_${Key} .tempRange_06`).html(`L:&nbsp;${data[0]['TemperatureSummary']['Past6HourRange']['Minimum']['Metric']['Value']}&deg;&nbsp;-&nbsp;H:&nbsp;${data[0]['TemperatureSummary']['Past6HourRange']['Maximum']['Metric']['Value']}&deg;`)
	$(`.observation.k_${Key} .tempRange_12`).html(`L:&nbsp;${data[0]['TemperatureSummary']['Past12HourRange']['Minimum']['Metric']['Value']}&deg;&nbsp;-&nbsp;H:&nbsp;${data[0]['TemperatureSummary']['Past12HourRange']['Maximum']['Metric']['Value']}&deg;`)
	$(`.observation.k_${Key} .tempRange_24`).html(`L:&nbsp;${data[0]['TemperatureSummary']['Past24HourRange']['Minimum']['Metric']['Value']}&deg;&nbsp;-&nbsp;H:&nbsp;${data[0]['TemperatureSummary']['Past24HourRange']['Maximum']['Metric']['Value']}&deg;`)
	/*details*/
}

const getCurrent = async(admin,Key)=>{	
	let res = await fetch(`script/current/${Key}.json`)
	window[`current_${Key}`] = await res.json()
	populateCurrent(Key)
}

const populateForecast = (Key,n)=>{
	$('.tenseText').html(`${days[today.getDay()]}&nbsp;${months[today.getMonth()]}&nbsp;${today.getDate()}`)

	let data = window[`forecast_${Key}`]

	/*summaries*/
	let WeatherIcon = data['DailyForecasts'][n]['Day']['Icon'];if(WeatherIcon < 10){WeatherIcon = '0' + WeatherIcon}
	$(`.forecast.k_${Key} .icon`).html(`<img src="icons/${WeatherIcon}-s.png">`)

	$(`.forecast.k_${Key} .summary .description`).html(data['DailyForecasts'][n]['Day']['IconPhrase'])
	// $(`.forecast.k_${Key} .summary .description`).html(data['DailyForecasts'][n]['Day']['ShortPhrase'])

	$(`.forecast.k_${Key} .summary .lo`).html(`<span class="smallHeading">MIN</span>&nbsp;${data['DailyForecasts'][n]['Temperature']['Minimum']['Value']}&deg;`)
	$(`.forecast.k_${Key} .summary .hi`).html(`<span class="smallHeading">MAX</span>&nbsp;${data['DailyForecasts'][n]['Temperature']['Maximum']['Value']}&deg;`)
	
	$(`.forecast.k_${Key} .summary .precip`).html(`<span class="smallHeading">Rain</span>&nbsp;${data['DailyForecasts'][n]['Day']['RainProbability']}%`)
	
	$(`.forecast.k_${Key} .summary .wind`).html(`
		<span class="smallHeading">Wind</span>&nbsp;
		${data['DailyForecasts'][n]['Day']['Wind']['Direction']['Localized']}&nbsp;
		${data['DailyForecasts'][n]['Day']['Wind']['Speed']['Value']}&nbsp;
		${data['DailyForecasts'][n]['Day']['Wind']['Speed']['Unit']}
	`)
	/*summaries*/

	$(`.forecast.k_${Key} .expand`).attr('name',`k_${Key}`)
}


const getForecast5day = async(admin,Key,n)=>{
	let res = await fetch(`script/forecast5day/${Key}.json`)
	window[`forecast_${Key}`] = await res.json()
	populateForecast(Key,n)
}

const stateSelect = (e)=>{
	let v = e.target.value
	selectedRegion = v

	switch(v){
		case 'AUS': appendNational();
		$('.mapBox, .prompt').removeClass('hidden');
		$('.homeLocality').css('height','100%');
		break;
		
		case 'region': appendZone('QLD',2);
		$('.mapBox, .prompt').addClass('hidden');
		$('.homeLocality').css('height','auto');
		break;

		default: appendAdmin(v)
		$('.mapBox, .prompt').removeClass('hidden');
		$('.homeLocality').css('height','100%');
	}

	$('.mapBox').css('background-image',`url(images/${v}.jpg)`)

	$('main').scrollTop(0)
}


// const expand = (e)=>{

// 	let x = $(e.target)
// 	let p = $(x.closest('.conditions')[0])

// 	// console.log(p.classList)
// 	console.log(p.hasClass('expanded'))

// 	switch(true){
// 		case p.hasClass('expanded'):
		
// 		p.removeClass('expanded');
// 		break;
		

// 		default:

// 		// x.css({'background-color':'red','height':"120px"})
// 		$('.conditions.expanded').removeClass('expanded');
		

// 		p.addClass('expanded');
// 	}



// 	// console.log($(x).parent()[0])
// 	// console.log(x.parent()[0])
// 	// console.log(x.closest('.conditions')[0])



// 	// console.log(e.target)
// 	// console.log(e.target.getAttribute('name'))
// 	let Key = e.target.getAttribute('name').replace(/k_/g,'')

// 	console.log(Key)

// 	// $(`.k_${Key}`).css('height','100%')


// 	console.log(window[`current_${Key}`])
// 	console.log(window[`forecast_${Key}`])
// }

const expand = (e)=>{
	let x = $(e.target)
	let n = x.attr('name')
	$(`.conditions .${n} .detailed`).toggleClass('hidden')
}

const appendBlock = (admin,loc,Key)=>{
	$('.localities').append(`
		<div class="locality k_${Key}">
			<div class="warning conditional"></div>
			<div class="conditions local k_${Key}">
				<div class="observation k_${Key}">
					<div class="basic">
						<div class="icon"></div>
						<div class="summary">
							<div class="localityName"></div>
							<div class="description"></div>
						</div>
						<div class="temperature"></div>
					</div>
					<div class="detailed hidden">
						<div class="detailRow">
							<div class="detailCell">
								<div class="detailHeading smallHeading">FEELS LIKE</div>
								<div class="detailValue feelsLike"></div>
							</div>
							<div class="detailCell">
								<div class="detailHeading smallHeading">SHADE FEELS LIKE</div>
								<div class="detailValue feelsLikeShade"></div>
							</div>
						</div>
						<div class="detailRow">
							<div class="detailCell">
								<div class="detailHeading smallHeading">WIND CHILL TEMP</div>
								<div class="detailValue windChill"></div>
							</div>
							<div class="detailCell">
								<div class="detailHeading smallHeading">DEW POINT</div>
								<div class="detailValue dewPoint"></div>
							</div>
						</div>
						<div class="detailRow">
							<div class="detailCell">
								<div class="detailHeading smallHeading">WIND</div>
								<div class="detailValue wind"></div>
							</div>
							<div class="detailCell">
								<div class="detailHeading smallHeading">WIND GUST</div>
								<div class="detailValue windGust"></div>
							</div>
						</div>
						<div class="detailRow">
							<div class="detailCell">
								<div class="detailHeading smallHeading">UV INDEX</div>
								<div class="detailValue uv"></div>
							</div>
							<div class="detailCell">
								<div class="detailHeading smallHeading">CLOUD COVER</div>
								<div class="detailValue cloudCover"></div>
							</div>
						</div>
						<div class="detailRow">
							<div class="detailCell">
								<div class="detailHeading smallHeading">PRESSUE</div>
								<div class="detailValue pressure"></div>
							</div>
							<div class="detailCell">
								<div class="detailHeading smallHeading">RELATIVE HUMIDITY</div>
								<div class="detailValue relativeHumidity"></div>
							</div>
						</div>
						<div class="detailRow">
							<div class="detailCell">
								<div class="detailHeading smallHeading">VISIBILITY</div>
								<div class="detailValue visibility"></div>
							</div>
							<div class="detailCell">
								<div class="detailHeading smallHeading">OBSTRUCTION</div>
								<div class="detailValue obstruction"></div>
							</div>
						</div>
						<div class="detailRow">
							<div class="detailCell">
								<div class="detailHeading smallHeading">TEMPERATURE RANGE SUMMARY</div>
								<div class="detailRow">
									<div class="detailHeading smallHeading">LAST 6 HOURS</div>
									<div class="detailValue tempRange_06"></div>
								</div>
								<div class="detailRow">
									<div class="detailHeading smallHeading">LAST 12 HOURS</div>
									<div class="detailValue tempRange_12"></div>
								</div>
								<div class="detailRow">
									<div class="detailHeading smallHeading">LAST 24 HOURS</div>
									<div class="detailValue tempRange_24"></div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="forecast k_${Key}">
					<div class="basic">
						<div class="icon"></div>
						<div class="summary">
							<div class="description"></div>
							<div class="row">
								<div class="summaryCell lo"></div>
								<div class="summaryCell hi"></div>
								<div class="summaryCell precip"></div>
							</div>
						</div>			
						<div class="expand">+</div>
					</div>
					<div class="detailed hidden">
						<div class="detailRow">
							<div class="detailCell">
								<div class="detailHeading smallHeading">FEELS LIKE</div>
								<div class="row">
									<div class="summaryCell feelMin"><span class="smallHeading">MIN</span>&nbsp;XXX.XX</div>
									<div class="summaryCell feelMax"><span class="smallHeading">MAX</span>&nbsp;XXX.XX</div>
								</div>
							</div>
							<div class="detailCell">
								<div class="detailHeading smallHeading">SHADE FEELS LIKE</div>
								<div class="row">
									<div class="summaryCell feelShadeMin"><span class="smallHeading">MIN</span>&nbsp;XXX.XX</div>
									<div class="summaryCell feelShadeMax"><span class="smallHeading">MAX</span>&nbsp;XXX.XX</div>
								</div>
							</div>
						</div>
						<div class="detailRow">
							<div class="detailCell">
								<div class="detailHeading smallHeading">DAY</div>
								<div class="detailValue phraseDay"></div>
							</div>
							<div class="detailCell">
								<div class="detailHeading smallHeading">NIGHT</div>
								<div class="detailValue phraseNight"></div>
							</div>
						</div>
						<div class="detailRow">
							<div class="detailCell">
								<div class="detailHeading smallHeading">CHANCE OF RAIN</div>
								<div class="detailRow">
									<div class="detailHeading">
										<div class="detailHeading smallHeading ampm">DAY</div>
										<div class="detailValue rainDay"></div>
									</div>
									<div class="detailHeading">
										<div class="detailHeading smallHeading ampm">NIGHT</div>
										<div class="detailValue rainNight"></div>
									</div>
								</div>
							</div>
						</div>
						<div class="detailRow conditional">
							<div class="detailCell">
								<div class="detailHeading smallHeading">CHANCE OF THUNDERSTORM</div>
								<div class="detailRow">
									<div class="detailHeading">
										<div class="detailHeading smallHeading ampm">DAY</div>
										<div class="detailValue thunderDay"></div>
									</div>
									<div class="detailHeading">
										<div class="detailHeading smallHeading ampm">NIGHT</div>
										<div class="detailValue thunderNight"></div>
									</div>
								</div>
							</div>
						</div>
						<div class="detailRow conditional">
							<div class="detailCell">
								<div class="detailHeading smallHeading">CHANCE OF SNOW</div>
								<div class="detailRow">
									<div class="detailHeading">
										<div class="detailHeading smallHeading ampm">DAY</div>
										<div class="detailValue snowDay"></div>
									</div>
									<div class="detailHeading">
										<div class="detailHeading smallHeading ampm">NIGHT</div>
										<div class="detailValue snowNight"></div>
									</div>
								</div>
							</div>
						</div>
						<div class="detailRow conditional">
							<div class="detailCell">
								<div class="detailHeading smallHeading">CHANCE OF ICE</div>
								<div class="detailRow">
									<div class="detailHeading">
										<div class="detailHeading smallHeading ampm">DAY</div>
										<div class="detailValue iceDay"></div>
									</div>
									<div class="detailHeading">
										<div class="detailHeading smallHeading ampm">NIGHT</div>
										<div class="detailValue iceNight"></div>
									</div>
								</div>
							</div>
						</div>
						<div class="detailRow">
							<div class="detailCell">
								<div class="detailHeading smallHeading">WIND</div>
								<div class="detailRow">
									<div class="detailHeading">
										<div class="detailHeading smallHeading ampm">DAY</div>
										<div class="detailValue windDay"></div>
									</div>
									<div class="detailHeading">
										<div class="detailHeading smallHeading ampm">NIGHT</div>
										<div class="detailValue windNight"></div>
									</div>
								</div>
							</div>
						</div>
						<div class="detailRow">
							<div class="detailCell">
								<div class="detailHeading smallHeading">WIND GUST</div>
								<div class="detailRow">
									<div class="detailHeading">
										<div class="detailHeading smallHeading ampm">DAY</div>
										<div class="detailValue gustDay"></div>
									</div>
									<div class="detailHeading">
										<div class="detailHeading smallHeading ampm">NIGHT</div>
										<div class="detailValue gustNight"></div>
									</div>
								</div>
							</div>
						</div>
						<div class="detailRow">
							<div class="detailCell">
								<div class="detailHeading smallHeading">SUNRISE</div>
								<div class="detailValue sunrise"></div>
							</div>
							<div class="detailCell">
								<div class="detailHeading smallHeading">SUNSET</div>
								<div class="detailValue sunset"></div>
							</div>
						</div>
						<div class="detailRow">
							<div class="detailCell">
								<div class="detailHeading smallHeading">HOURS OF SUN</div>
								<div class="detailValue sunHours"></div>
							</div>
							<div class="detailCell">
								<div class="detailHeading smallHeading">UV INDEX</div>
								<div class="detailValue uv"></div>
							</div>
							<div class="detailCell">
								<div class="detailHeading smallHeading">AIR QUALITY</div>
								<div class="detailValue air"></div>
							</div>
						</div>
						<div class="detailRow">
							<div class="detailCell">
								<div class="detailHeading smallHeading">GRASS</div>
								<div class="detailValue grass"></div>
							</div>
							<div class="detailCell">
								<div class="detailHeading smallHeading">MOULD</div>
								<div class="detailValue mould"></div>
							</div>
							<div class="detailCell">
								<div class="detailHeading smallHeading">RAGWEED</div>
								<div class="detailValue ragweed"></div>
							</div>
							<div class="detailCell">
								<div class="detailHeading smallHeading">TREE</div>
								<div class="detailValue tree"></div>
							</div>
						</div>
						<div class="detailRow">
							<div class="detailCell">
								<div class="detailHeading smallHeading">SOLAR IRRADIANCE</div>
								<div class="detailValue solar"></div>
							</div>
							<div class="detailCell">
								<div class="detailHeading smallHeading">EVAPOTRANSPIRATION</div>
								<div class="detailValue evap"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	`)

	// $('.conditions .expand').click(expand)
	// $(`.expand.k_${Key}`).click(expand)

	getCurrent(admin,Key)
	getForecast5day(admin,Key,day)
}
	


const appendNational = ()=>{

	let keys = Object.keys(list)

	$('.localities .conditions').remove()

	loc_keys = [pinnedKey]

	for(let i of keys){

		let admin = i
		let loc = list[i]['zones'][0][0]
		let Key = list[admin]['localities'][loc]['Key']
		loc_keys.push(Key)

		appendBlock(admin,loc,Key)
		// break;
	}
}

const appendAdmin = (admin)=>{

	let keys = list[admin]['zones'][0]

	$('.localities .conditions').remove()

	loc_keys = [pinnedKey]

	for(let loc of keys){

		let Key = list[admin]['localities'][loc]['Key']
		loc_keys.push(Key)

		appendBlock(admin,loc,Key)
	}
}

const appendZone = (admin,n)=>{

	let keys = list[admin]['zones'][n].sort()

	$('.localities .conditions').remove()

	loc_keys = [pinnedKey]

	for(let loc of keys){

		let Key = list[admin]['localities'][loc]['Key']
		loc_keys.push(Key)

		if(Key != pinnedKey){
			appendBlock(admin,loc,Key)
		}
	}
}

const getList = async () => {
	
	const res = await fetch('script/AU.json')
	window['list'] = await res.json()
	window['pinnedKey'] = list[pinnedLocality[0]]['localities'][pinnedLocality[1]]['Key']

	$('.homeLocality .localityName').html(`${pinnedLocality[1]}&nbsp;${pinnedLocality[0]}`)
	$('.homeLocality .observation, .homeLocality .forecast').addClass(`k_${pinnedKey}`)

	getCurrent(pinnedLocality[0],pinnedKey)
	getForecast5day(pinnedLocality[0],pinnedKey,day)
	
	appendNational()
	// appendAdmin('QLD')
	// appendZone('QLD',2)
}



/*bindings*/
$('#stateSelect').change(stateSelect)
$('main').on('click','.expand',expand)
/*bindings*/

getList()