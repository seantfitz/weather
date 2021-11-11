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
		<div class="conditions k_${Key}">
			<div class="observation k_${Key}">
				<div class="basic">
					<div class="icon"></div>

					<div class="summary">
						<div class="localityName">${loc}&nbsp;${admin}</div>
						<div class="description"></div>
						<!--<div class="time"></div>-->
					</div>

					<div class="temperature"></div>				
				</div>

				<!--* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *-->
				<div class="detailed hidden">
					
					<div class="detailRow">
						<div class="detailCell">
							<div class="detailHeading smallHeading">FEELS LIKE</div>
							<div class="detailValue feelsLike">XX.X&deg;</div>
						</div>
						<div class="detailCell">
							<div class="detailHeading smallHeading">SHADE FEELS LIKE</div>
							<div class="detailValue shadeFeelsLike">XX.X&deg;</div>
						</div>
					</div>

					<div class="detailRow">
						<div class="detailCell">
							<div class="detailHeading smallHeading">WIND CHILL TEMP</div>
							<div class="detailValue windChillTemp">XX.X&deg;</div>
						</div>
						<div class="detailCell">
							<div class="detailHeading smallHeading">DEW POINT</div>
							<div class="detailValue dewPoint">XX.X&deg;</div>
						</div>
					</div>

					<div class="detailRow">
						<div class="detailCell">
							<div class="detailHeading smallHeading">WIND</div>
							<div class="detailValue windSpeedDir">XXX - XX.X km/h</div>
						</div>
						<div class="detailCell">
							<div class="detailHeading smallHeading">WIND GUST</div>
							<div class="detailValue windGust">XX.X km/h</div>
						</div>
					</div>

					<div class="detailRow">
						<div class="detailCell">
							<div class="detailHeading smallHeading">UV INDEX</div>
							<div class="detailValue UV">X - Xxxxxxxx</div>
						</div>
						<div class="detailCell">
							<div class="detailHeading smallHeading">CLOUD COVER</div>
							<div class="detailValue cloudCover">XX% - XXXX.XXm</div>
						</div>
					</div>

					<div class="detailRow">
						<div class="detailCell">
							<div class="detailHeading smallHeading">PRESSUE</div>
							<div class="detailValue pressure">XXXX.XX hPa</div>
						</div>
						<div class="detailCell">
							<div class="detailHeading smallHeading">RELATIVE HUMIDITY</div>
							<div class="detailValue relativeHumidity">XX.XX%</div>
						</div>
					</div>

					<div class="detailRow">
						<div class="detailCell">
							<div class="detailHeading smallHeading">VISIBILITY</div>
							<div class="detailValue visibility">XX.X km</div>
						</div>
						<div class="detailCell">
							<div class="detailHeading smallHeading">OBSTRUCTION</div>
							<div class="detailValue obstruction">xxxxxxxx</div>
						</div>
					</div>

					<div class="detailRow">
						<div class="detailCell">
							<div class="detailHeading smallHeading">TEMPERATURE RANGE SUMMARY</div>
							<div class="detailRow">
								<div class="detailHeading smallHeading">LAST 6 HOURS</div>
								<div class="detailValue tempLast6">L:&nbsp;XX.X&deg;&nbsp;-&nbsp;H:&nbsp;XX.X&deg;</div>
							</div>
							<div class="detailRow">
								<div class="detailHeading smallHeading">LAST 12 HOURS</div>
								<div class="detailValue tempLast12">L:&nbsp;XX.X&deg;&nbsp;-&nbsp;H:&nbsp;XX.X&deg;</div>
							</div>
							<div class="detailRow">
								<div class="detailHeading smallHeading">LAST 24 HOURS</div>
								<div class="detailValue tempLast24">L:&nbsp;XX.X&deg;&nbsp;-&nbsp;H:&nbsp;XX.X&deg;</div>
							</div>
						</div>
					</div>
				</div>
				<!--* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *-->
			</div>
			
			<div class="forecast k_${Key}">
				<div class="basic">		
					<div class="range">
						<div class="hi"></div>
						<div class="lo"></div>
					</div>

					<div class="summary">
						<div class="description"></div>
							
						<div class="row">
							<div class="precip">Rain:&nbsp;<b></b></div>
							<div class="wind">Wind:&nbsp;<b></b></div>
						</div>

						<div class="row">
							<div class="uv">UV:&nbsp;<b></b></div>
							<div class="air">Air Quality:&nbsp;<b></b></div>
						</div>
							
					</div>

					<div class="icon"></div>

					<div class="expand">+</div>
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