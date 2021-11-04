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

let pinnedLocality = ['QLD','Pittsworth']
let selectedRegion = 'AUS'


const observations = async(v)=>{

}

const populate = (v)=>{
	
	switch(selectedRegion){
		case 'AUS':
		// console.log(list)
		break;
	}
}

const stateSelect = (e)=>{
	let v = e.target.value
	selectedRegion = v

	switch(v){
		case 'AUS': appendNational(); break;
		case 'region': appendZone('QLD',2); break;

		default: appendAdmin(v)
	}

	$('.mapBox').css('background-image',`url(images/${v}.jpg)`)
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

			<div class="forecast">
					
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
						<div class="wind">UV:&nbsp;<b></b></div>
						<div class="wind">Air Quality:&nbsp;<b></b></div>
					</div>
						
				</div>

				<div class="icon"></div>

				<div class="expand">+</div>
			</div>
		</div>
	`)
}
	


const appendNational = ()=>{

	// let pinS = pinnedLocality[0]
	// let pinL = pinnedLocality[1]
	// let pinK = list[pinS]['localities'][pinL]['Key']

	// console.log(pinS,pinL,pinK)

	//////////////////////////////

	let keys = Object.keys(list)

	$('.localities .conditions').remove()

	for(let i of keys){

		let admin = i
		let loc = list[i]['zones'][0][0]
		let Key = list[admin]['localities'][loc]['Key']

		appendBlock(admin,loc,Key)
	}
}

const appendAdmin = (admin)=>{

	let keys = list[admin]['zones'][0]

	$('.localities .conditions').remove()

	for(let loc of keys){

		let Key = list[admin]['localities'][loc]['Key']

		appendBlock(admin,loc,Key)
	}
}

const appendZone = (admin,n)=>{

	let keys = list[admin]['zones'][n].sort()
	console.log(keys)

	$('.localities .conditions').remove()

	for(let loc of keys){

		let Key = list[admin]['localities'][loc]['Key']

		appendBlock(admin,loc,Key)
	}
}

const getList = async () => {
	const res = await fetch('script/AU.json')
	window['list'] = await res.json()
	
	appendNational()
	// appendAdmin('QLD')
	// appendZone('QLD',2)
}















$('#stateSelect').change(stateSelect)


getList()