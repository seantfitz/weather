let days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

let today = new Date()

let pinnedLocality = ['QLD','Pittsworth']
let selectedRegion = 'region'
let day = 0;
let hour = 0;
let loc_keys = [];

const tenseNav = (e)=>{

	switch(true){

		case !$(e.target).hasClass('active'):
		return false;
		
		case $(e.target).hasClass('next'):
		hour++;
		$('.tenseNav.prev').addClass('active');
		break;

		case $(e.target).hasClass('prev'):
		hour--;
		$('.tenseNav.next').addClass('active');
		break;
	}

	switch(true){
		case hour >= 11:
		$('.tenseNav.next').removeClass('active');
		break;

		case hour <= 0:
		$('.tenseNav.prev').removeClass('active');
		break;
	}

	// today = new Date()
	// today.setDate(today.getDate() + day);

	for(let i of loc_keys){
		// console.log(i,hour)
		// populateForecast(i,day)
		populate12Hour(i,hour)
	}
}
$('.tenseNav').click(tenseNav)

const populateCurrent = (Key)=>{

	let data = window[`current_${Key}`]
	/*summaries*/	
	let WeatherIcon = data[0]['WeatherIcon'];if(WeatherIcon < 10){WeatherIcon = '0' + WeatherIcon}
	$(`.observation.k_${Key} .icon`).html(`<img src="icons/${WeatherIcon}-s.png">`)

	if(data[0]['PrecipitationType'] != null){
		$(`.observation.k_${Key} .description`).html(data[0]['PrecipitationType'])
	}	

	// $(`.observation.k_${Key} .time`).html(data[0]['LocalObservationDateTime'].substring(11,16))
	$(`.observation.k_${Key} .temperature`).html(`${data[0]['Temperature']['Metric']['Value']}&deg;`)
	/*summaries*/

	/*details*/
	$(`.observation.k_${Key} .dewPoint`).html(`${data[0]['DewPoint']['Metric']['Value']}&deg;`)
	$(`.observation.k_${Key} .relativeHumidity`).html(`${data[0]['RelativeHumidity']}%`)

	$(`.observation.k_${Key} .cloudCover`).html(`${data[0]['CloudCover']}%`)
	$(`.observation.k_${Key} .cloudCeiling`).html(`${data[0]['Ceiling']['Metric']['Value']}${data[0]['Ceiling']['Metric']['Unit']}`)

	
	$(`.observation.k_${Key} .detailValue.precipRange_01`).html(`${data[0]['PrecipitationSummary']['PastHour']['Metric']['Value']}${data[0]['PrecipitationSummary']['PastHour']['Metric']['Unit']}`)
	$(`.observation.k_${Key} .detailValue.precipRange_03`).html(`${data[0]['PrecipitationSummary']['Past3Hours']['Metric']['Value']}${data[0]['PrecipitationSummary']['Past3Hours']['Metric']['Unit']}`)
	$(`.observation.k_${Key} .detailValue.precipRange_06`).html(`${data[0]['PrecipitationSummary']['Past6Hours']['Metric']['Value']}${data[0]['PrecipitationSummary']['Past6Hours']['Metric']['Unit']}`)
	$(`.observation.k_${Key} .detailValue.precipRange_09`).html(`${data[0]['PrecipitationSummary']['Past9Hours']['Metric']['Value']}${data[0]['PrecipitationSummary']['Past9Hours']['Metric']['Unit']}`)
	$(`.observation.k_${Key} .detailValue.precipRange_12`).html(`${data[0]['PrecipitationSummary']['Past12Hours']['Metric']['Value']}${data[0]['PrecipitationSummary']['Past12Hours']['Metric']['Unit']}`)
	$(`.observation.k_${Key} .detailValue.precipRange_18`).html(`${data[0]['PrecipitationSummary']['Past18Hours']['Metric']['Value']}${data[0]['PrecipitationSummary']['Past18Hours']['Metric']['Unit']}`)
	$(`.observation.k_${Key} .detailValue.precipRange_24`).html(`${data[0]['PrecipitationSummary']['Past24Hours']['Metric']['Value']}${data[0]['PrecipitationSummary']['Past24Hours']['Metric']['Unit']}`)
	/*details*/
	// console.log(data[0]['PrecipitationSummary']['PastHour']['Metric']['Value'])
}

const getCurrent = async(admin,Key)=>{	
	let res = await fetch(`script/current/${Key}.json`)
	window[`current_${Key}`] = await res.json()
	populateCurrent(Key)
}

const populateForecast = (Key,n)=>{
	// $('.tenseText').html(`${days[today.getDay()]}&nbsp;${months[today.getMonth()]}&nbsp;${today.getDate()}`)

	let data = window[`forecast_${Key}`]

	/*details*/
	/*details*/

	// $(`.forecast.k_${Key} .expand`).attr('name',`k_${Key}`)
}

const getForecast5day = async(admin,Key,n)=>{
	let res = await fetch(`script/forecast5day/${Key}.json`)
	window[`forecast_${Key}`] = await res.json()
	populateForecast(Key,n)
}

const populate12Hour = async(Key,n)=>{

	$('.tenseText').html(`${days[today.getDay()]}&nbsp;${months[today.getMonth()]}&nbsp;${today.getDate()}`)

	let data = window[`hourly_${Key}`]

	// console.log(new Date(data[n]['EpochDateTime']))
	$('.tenseText').html(data[n]['DateTime'].substring(11,16))
	// console.log(data[n]['DateTime'].substring(11,16))

	/*summaries*/
	let WeatherIcon = data[n]['WeatherIcon'];if(WeatherIcon < 10){WeatherIcon = '0' + WeatherIcon}
	$(`.forecast.k_${Key} .icon`).html(`<img src="icons/${WeatherIcon}-s.png">`)
	$(`.forecast.k_${Key} .rain`).html(`${data[n]['RainProbability']}%&nbsp;-&nbsp;${data[n]['Rain']['Value']}${data[n]['Rain']['Unit']}`)
	$(`.forecast.k_${Key} .snow`).html(`${data[n]['SnowProbability']}%&nbsp;-&nbsp;${data[n]['Snow']['Value']}${data[n]['Snow']['Unit']}`)
	$(`.forecast.k_${Key} .ice`).html(`${data[n]['IceProbability']}%&nbsp;-&nbsp;${data[n]['Ice']['Value']}${data[n]['Ice']['Unit']}`)
	/*summaries*/

	/*details*/
	$(`.forecast.k_${Key} .dewPoint`).html(`${data[n]['DewPoint']['Value']}&deg;`)
	$(`.forecast.k_${Key} .relativeHumidity`).html(`${data[n]['RelativeHumidity']}%`)
	$(`.forecast.k_${Key} .temperature`).html(`${data[n]['Temperature']['Value']}&deg;`)

	$(`.forecast.k_${Key} .cloudCover`).html(`${data[n]['CloudCover']}%`)
	$(`.forecast.k_${Key} .cloudCeiling`).html(`${data[n]['Ceiling']['Value']}${data[n]['Ceiling']['Unit']}`)
	$(`.forecast.k_${Key} .evapotranspiration`).html(`${data[n]['Evapotranspiration']['Value']}${data[n]['Evapotranspiration']['Unit']}`)
	/*details*/

	$(`.forecast.k_${Key} .expand`).attr('name',`k_${Key}`)
}

const getForecast12hour = async(admin,Key,hour)=>{
	let res = await fetch(`script/forecast12hour/${Key}.json`)
	window[`hourly_${Key}`] = await res.json()
	populate12Hour(Key,hour)
}

const stateSelect = (e)=>{
	let v = e.target.value
	selectedRegion = v

	$('.locality, .mapBox, .prompt').removeClass('hidden');
	$('.detailed').addClass('hidden');
	$('.expand').text('+');

	switch(v){
		case 'AU': appendNational();
		$('.mapBox, .prompt').removeClass('displayNone');
		// $('.homeLocality').css('height','100%');
		$('.mapBox').css('background-image',`url(images/${v}.jpg)`)
		break;
		
		case 'region': appendZone('QLD',2);
		$('.mapBox, .prompt').addClass('displayNone');
		// $('.homeLocality').css('height','auto');
		break;

		default: appendAdmin(v)
		$('.mapBox, .prompt').removeClass('displayNone');
		// $('.homeLocality').css('height','100%');
		$('.mapBox').css('background-image',`url(images/${v}.jpg)`)
	}

	// $('.mapBox').css('background-image',`url(images/${v}.jpg)`)

	$('main').scrollTop({
		behavior: "smooth", // or "auto" or "instant"
		block: "start" // or "end"
	})
}

// const expand = (e)=>{

// 	let x = $(e.target)
// 	let n = x.attr('name')

// 	switch(x.text()){
// 		case '+':x.text('-');break;
// 		case '-':x.text('+');break;
// 	}

// 	$(`
// 		.locality,
// 		.conditions .${n} .detailed,
// 		.mapBox,
// 		.prompt
// 	`).not(`.locality.${n}`).toggleClass('hidden')

// 	$(`.locality.${n}`)[0].scrollIntoView({
// 		behavior: "smooth", // or "auto" or "instant"
// 		block: "start" // or "end"
// 	});
// }
const expand = (e)=>{

	let x = $(e.target)
	let n = x.attr('name')

	switch(x.text()){
		case '+':x.text('-');break;
		case '-':x.text('+');break;
	}

	$(`
		.conditions .${n} .detailed,
		.mapBox,
		.prompt
	`).not(`.locality.${n}`).toggleClass('hidden')

	$(`.locality.${n}`)[0].scrollIntoView({
		behavior: "smooth", // or "auto" or "instant"
		block: "start" // or "end"
	});
}

const appendBlock = (admin,loc,Key)=>{
	$('.localities').append(`
		<div class="locality k_${Key}">
			<div class="warning conditional"></div>
			<div class="conditions k_${Key}">
				<div class="observation k_${Key}">
					<div class="basic">
						<div class="icon"></div>
						<div class="summary">
							<div class="localityName">${loc}&nbsp;${admin}</div>
							<div class="description"></div>
						</div>
						<div class="temperature"></div>
					</div>
					
					<div class="detailed hidden">
						<div class="detailRow">
							<div class="detailCell">
								<div class="detailHeading smallHeading">DEW POINT</div>
								<div class="detailValue dewPoint"></div>
							</div>
							<div class="detailCell">
								<div class="detailHeading smallHeading">RELATIVE HUMIDITY</div>
								<div class="detailValue relativeHumidity"></div>
							</div>
						</div>

						<div class="detailRow">
							<div class="detailCell">
								<div class="detailHeading smallHeading">CLOUD COVER</div>
								<div class="detailValue cloudCover"></div>
							</div>
							<div class="detailCell">
								<div class="detailHeading smallHeading">CLOUD CEILING</div>
								<div class="detailValue cloudCeiling"></div>
							</div>
						</div>

						<div class="detailRow">
							<div class="detailCell">
								<div class="detailHeading smallHeading">PRECIPITATION SUMMARY</div>
								<div class="detailRow precipRange_01">
									<div class="detailHeading smallHeading">LAST HOUR</div>
									<div class="detailValue precipRange_01"></div>
								</div>
								<div class="detailRow precipRange_03 conditional">
									<div class="detailHeading smallHeading">LAST 3 HOURs</div>
									<div class="detailValue precipRange_03"></div>
								</div>
								<div class="detailRow precipRange_06 conditional">
									<div class="detailHeading smallHeading">LAST 6 HOURS</div>
									<div class="detailValue precipRange_06"></div>
								</div>
								<div class="detailRow precipRange_09 conditional">
									<div class="detailHeading smallHeading">LAST 9 HOURS</div>
									<div class="detailValue precipRange_09"></div>
								</div>
								<div class="detailRow precipRange_12 conditional">
									<div class="detailHeading smallHeading">LAST 12 HOURS</div>
									<div class="detailValue precipRange_12"></div>
								</div>
								<div class="detailRow precipRange_18 conditional">
									<div class="detailHeading smallHeading">LAST 18 HOURS</div>
									<div class="detailValue precipRange_18"></div>
								</div>
								<div class="detailRow precipRange_24">
									<div class="detailHeading smallHeading">LAST 24 HOURS</div>
									<div class="detailValue precipRange_24"></div>
								</div>
							</div>
						</div>
					</div>
				</div>
				
				<div class="forecast k_${Key}">
					<div class="basic">
						<div class="icon"></div>

						<div class="detailCell noBorder">
							<div class="detailHeading smallHeading">RAIN</div>
							<div class="detailValue rain"></div>
						</div>
						<div class="detailCell noBorder">
							<div class="detailHeading smallHeading">SNOW</div>
							<div class="detailValue snow"></div>
						</div>
						<div class="detailCell noBorder">
							<div class="detailHeading smallHeading">ICE</div>
							<div class="detailValue ice"></div>
						</div>

						<div class="expand">+</div>
					</div>

					<div class="detailed hidden">
						
						<div class="detailRow">
							<div class="detailCell">
								<div class="detailHeading smallHeading">DEW POINT</div>
								<div class="detailValue dewPoint"></div>
							</div>
							<div class="detailCell">
								<div class="detailHeading smallHeading">RELATIVE HUMIDITY</div>
								<div class="detailValue relativeHumidity"></div>
							</div>
							<div class="detailCell">
								<div class="detailHeading smallHeading">TEMPERATURE</div>
								<div class="detailValue temperature"></div>
							</div>
						</div>

						<div class="detailRow">
							<div class="detailCell">
								<div class="detailHeading smallHeading">CLOUD COVER</div>
								<div class="detailValue cloudCover"></div>
							</div>
							<div class="detailCell">
								<div class="detailHeading smallHeading">CLOUD CEILING</div>
								<div class="detailValue cloudCeiling"></div>
							</div>
							<div class="detailCell">
								<div class="detailHeading smallHeading">EVAPOTRANSPIRATION</div>
								<div class="detailValue evapotranspiration"></div>
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
	// getForecast5day(admin,Key,day)
	getForecast12hour(admin,Key,hour)
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
	$('.homeLocality .locality, .homeLocality .observation, .homeLocality .forecast').addClass(`k_${pinnedKey}`)

	getCurrent(pinnedLocality[0],pinnedKey)
	// getForecast5day(pinnedLocality[0],pinnedKey,day)
	getForecast12hour(pinnedLocality[0],pinnedKey,hour)
	
	// appendNational()
	// appendAdmin('QLD')
	appendZone('QLD',2)
}

/*bindings*/
$('#stateSelect').change(stateSelect)
$('main').on('click','.expand',expand)
/*bindings*/

getList()