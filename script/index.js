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
// today.setDate(today.getDate() + 1);
// console.log(days[today.getDay()])
// console.log(months[today.getMonth()])
// console.log(today.getDate())


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

const getCurrent = async(admin,Key)=>{
	
	let res = await fetch(`script/current/${Key}.json`)
	let data = await res.json()

	/*summaries*/	
	let WeatherIcon = data[0]['WeatherIcon'];if(WeatherIcon < 10){WeatherIcon = '0' + WeatherIcon}
	$(`.observation.k_${Key} .icon`).html(`<img src="icons/${WeatherIcon}-s.png">`)
	$(`.observation.k_${Key} .description`).html(data[0]['WeatherText'])
	$(`.observation.k_${Key} .time`).html(data[0]['LocalObservationDateTime'].substring(11,16))
	$(`.observation.k_${Key} .temperature`).html(`${data[0]['Temperature']['Metric']['Value']}&deg;`)
	/*summaries*/
}

const populateForecast = (Key,n)=>{
	// console.log(Key)
	// today.setDate(today.getDate() + n);
	$('.tenseText').html(`${days[today.getDay()]}&nbsp;${months[today.getMonth()]}&nbsp;${today.getDate()}`)



	let data = window[`forecast_${Key}`]
// console.log(data['DailyForecasts'][n]["EpochDate"])
// console.log(new Date(data['DailyForecasts'][n]["EpochDate"]))
	/*summaries*/
	let WeatherIcon = data['DailyForecasts'][n]['Day']['Icon'];if(WeatherIcon < 10){WeatherIcon = '0' + WeatherIcon}
	$(`.forecast.k_${Key} .icon`).html(`<img src="icons/${WeatherIcon}-s.png">`)

	$(`.forecast.k_${Key} .hi`).html(`${data['DailyForecasts'][n]['Temperature']['Maximum']['Value']}&deg;`)
	$(`.forecast.k_${Key} .lo`).html(`${data['DailyForecasts'][n]['Temperature']['Minimum']['Value']}&deg;`)
	
	// $(`.forecast.k_${Key} .summary .description`).html(data['DailyForecasts'][n]['Day']['ShortPhrase'])
	$(`.forecast.k_${Key} .summary .description`).html(data['DailyForecasts'][n]['Day']['IconPhrase'])
	
	$(`.forecast.k_${Key} .summary .precip`).html(`Rain:&nbsp;${data['DailyForecasts'][n]['Day']['RainProbability']}%`)
	
	$(`.forecast.k_${Key} .summary .wind`).html(`
		Wind:&nbsp;
		${data['DailyForecasts'][n]['Day']['Wind']['Direction']['Localized']}&nbsp;
		${data['DailyForecasts'][n]['Day']['Wind']['Speed']['Value']}&nbsp;
		${data['DailyForecasts'][n]['Day']['Wind']['Speed']['Unit']}
	`)

	$(`.forecast.k_${Key} .summary .uv`).html(`UV:&nbsp;${data['DailyForecasts'][n]['AirAndPollen'][5]['Category']}`)
	$(`.forecast.k_${Key} .summary .air`).html(`Air Quality:&nbsp;${data['DailyForecasts'][n]['AirAndPollen'][n]['Category']}`)
	/*summaries*/
}


const getForecast5day = async(admin,Key,n)=>{
	
	let res = await fetch(`script/forecast5day/${Key}.json`)
	// let data = await res.json()
	// console.log(data['DailyForecasts'])
	window[`forecast_${Key}`] = await res.json()

	populateForecast(Key,n)

	/*summaries*/
	// let WeatherIcon = data['DailyForecasts'][n]['Day']['Icon'];if(WeatherIcon < 10){WeatherIcon = '0' + WeatherIcon}
	// $(`.forecast.k_${Key} .icon`).html(`<img src="icons/${WeatherIcon}-s.png">`)

	// $(`.forecast.k_${Key} .hi`).html(`${data['DailyForecasts'][n]['Temperature']['Maximum']['Value']}&deg;`)
	// $(`.forecast.k_${Key} .lo`).html(`${data['DailyForecasts'][n]['Temperature']['Minimum']['Value']}&deg;`)
	
	// // $(`.forecast.k_${Key} .summary .description`).html(data['DailyForecasts'][n]['Day']['ShortPhrase'])
	// $(`.forecast.k_${Key} .summary .description`).html(data['DailyForecasts'][n]['Day']['IconPhrase'])
	
	// $(`.forecast.k_${Key} .summary .precip`).html(`Rain:&nbsp;${data['DailyForecasts'][n]['Day']['RainProbability']}%`)
	
	// $(`.forecast.k_${Key} .summary .wind`).html(`
	// 	Wind:&nbsp;
	// 	${data['DailyForecasts'][n]['Day']['Wind']['Direction']['Localized']}&nbsp;
	// 	${data['DailyForecasts'][n]['Day']['Wind']['Speed']['Value']}&nbsp;
	// 	${data['DailyForecasts'][n]['Day']['Wind']['Speed']['Unit']}
	// `)

	// $(`.forecast.k_${Key} .summary .uv`).html(`UV:&nbsp;${data['DailyForecasts'][n]['AirAndPollen'][5]['Category']}`)
	// $(`.forecast.k_${Key} .summary .air`).html(`Air Quality:&nbsp;${data['DailyForecasts'][n]['AirAndPollen'][n]['Category']}`)
	/*summaries*/
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




const appendBlock = (admin,loc,Key)=>{
	$('.localities').append(`
		<div class="conditions">
			<div class="observation k_${Key}">

				<div class="icon"></div>

				<div class="summary">
					<div class="localityName">${loc}&nbsp;${admin}</div>
					<div class="description"></div>
					<div class="time"></div>
				</div>

				<div class="temperature"></div>				
			</div>

			<div class="forecast k_${Key}">
					
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
	`)

	getCurrent(admin,Key)
	getForecast5day(admin,Key,day)
}
	


const appendNational = ()=>{

	// let pinS = pinnedLocality[0]
	// let pinL = pinnedLocality[1]
	// let pinK = list[pinS]['localities'][pinL]['Key']

	// console.log(pinS,pinL,pinK)

	//////////////////////////////

	let keys = Object.keys(list)

	$('.localities .conditions').remove()
	// loc_keys = [list[pinnedLocality[0]]['localities'][pinnedLocality[1]]['Key']]
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
	// loc_keys = [list[pinnedLocality[0]]['localities'][pinnedLocality[1]]['Key']]
	loc_keys = [pinnedKey]

	for(let loc of keys){

		let Key = list[admin]['localities'][loc]['Key']
		loc_keys.push(Key)

		appendBlock(admin,loc,Key)
	}
}

const appendZone = (admin,n)=>{

	let keys = list[admin]['zones'][n].sort()
	// console.log(keys)

	$('.localities .conditions').remove()
	// loc_keys = [list[pinnedLocality[0]]['localities'][pinnedLocality[1]]['Key']]
	loc_keys = [pinnedKey]

	for(let loc of keys){

		let Key = list[admin]['localities'][loc]['Key']
		loc_keys.push(Key)

		if(Key != pinnedKey){
			appendBlock(admin,loc,Key)
		}
	}
}

// const prepareBlocks = (admin,n)=>{

// 	$('.localities .conditions').remove()
	
// 	let keys;

// 	switch(admin){
// 		case 'AUS': keys = Object.keys(list); break;
// 		default: 
// 	}
// }

const getList = async () => {
	const res = await fetch('script/AU.json')
	window['list'] = await res.json()

	window['pinnedKey'] = list[pinnedLocality[0]]['localities'][pinnedLocality[1]]['Key']

	// console.log(list)
	// console.log(list[pinnedLocality[0]]['localities'][pinnedLocality[1]]['Key'])
	
	// getCurrent(pinnedLocality[0],list[pinnedLocality[0]]['localities'][pinnedLocality[1]]['Key'])
	// getForecast5day(pinnedLocality[0],list[pinnedLocality[0]]['localities'][pinnedLocality[1]]['Key'],0)

	getCurrent(pinnedLocality[0],pinnedKey)
	getForecast5day(pinnedLocality[0],pinnedKey,day)
	
	appendNational()
	// appendAdmin('QLD')
	// appendZone('QLD',2)
}















$('#stateSelect').change(stateSelect)


getList()