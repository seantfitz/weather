/*set up map*/
const storagesMap = L.map('storagesMap').setView([-25.2744, 133.7751], 4);
const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
const tiles = L.tileLayer(
	'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
	{
		maxZoom: 19,
		attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
	}
)
tiles.addTo(storagesMap)
L.control.scale({imperial: false, metric: true}).addTo(storagesMap);
/*set up map*/

const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

let selectedRegion = 'AU'

// const stateBox = {//W,S,E,N
// 	// NSW:[140.999286483091,-37.5052674371251,159.105448901665,-28.157007484129],
// 	NSW:[140.999286483091,-37.5052674371251,153.660861,-28.157007484129],
// 	QLD:[137.99596539614,-29.1778849996844,153.555247484414,-9.14118954253052],
// 	VIC:[140.961865804717,-39.1591796902753,149.976504105742,-33.980636405904],
// 	TAS:[143.818576726639,-43.7429686004967,148.50313834661,-39.1919773009046],
// 	SA:[129.001348803946,-38.0625895910114,141.002962544954,-25.996363071308],
// 	WA:[112.921124550164,-35.134832521502,129.001862438231,-13.6894781340124],
// 	NT:[129.000484929137,-25.9986044823092,138.001207833215,-10.965900135588],
// 	ACT:[148.762795689483,-35.920517211112,149.399292549604,-35.1244029421091],
// 	// ACT:[148.762795689483,-35.920517211112,150.765777,-35.1178241],//including jervis bay territory

// 	AUS:[112.921124550164,-43.7429686004967,153.660861,-9.14118954253052]
// }

const state_centre = {//W,S,E,N
	AU:[[-25.2744, 133.7751], 4],
	NSW:[[-32.8311374606271,147.330073741546],6],
	QLD:[[-19.1595372711075,145.775606440277],5],
	VIC:[[-36.5699080480897,145.46918495523],7],
	// TAS:[[-41.4674729507007,146.160857536625],7],
	TAS:[[-42.0674729507007,146.160857536625],8],
	// SA:[[-32.0294763311597,135.00215567445],6],
	SA:[[-34.869060,139.818889],8],
	WA:[[-24.4121553277572,120.961493494198],4],
	NT:[[-18.4822523089486,133.500846381176],5],
	ACT:[[-35.5224600766106,149.081044119544],9],
}



/*functions*/
const numberWithCommas = (x)=>{
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const addStorages = async()=>{

	console.log(storageLocations)
	let features = storageLocations['features']

	for(let i of features){

		let attr = i['attributes']
		let storage_name = attr['storage_name']
		let storage_id = attr['storage_id']
		let wiski_station_no = attr['wiski_station_no']
		let total_capacity_ml = attr['total_capacity_ml']
		let accessible_capacity_ml = attr['accessible_capacity_ml']
		let total_us_catchment_area_km2 = attr['total_us_catchment_area_km2']
		let surface_area_m2 = attr['surface_area_m2']
		let system_type = attr['system_type']
		let awra_drainage_division_name = attr['awra_drainage_division_name']
		let state_name = attr['state_name']//;console.log(state_name)
		let river_name = attr['river_name']
		let year_completion = attr['year_completion']
		let data_owner = attr['data_owner']
		let data_provider = attr['data_provider']
		let management_system = attr['management_system']
		let supply_system = attr['supply_system']
		let centroid_latitude_dd = attr['centroid_latitude_dd']
		let centroid_longitude_dd = attr['centroid_longitude_dd']
		let ahgf_hydroid = attr['ahgf_hydroid']
		let ahgf_version = attr['ahgf_version']
		let objectid = attr['objectid']
		let ahgf_connode_id = attr['ahgf_connode_id']

		let current_volume = numberWithCommas(levels[storage_name]['volume_ML'])
		let percentage = levels[storage_name]['percentage']
		// let obs_date = new Date(levels[storage_name]['obs_date']).toString().substring(0,15)
		let obs_date = new Date(levels[storage_name]['obs_date'])
		let day = obs_date.getDay()
		let date = obs_date.getDate()
		let month = obs_date.getMonth()
		let year = obs_date.getFullYear()

		let info = `
			<b>${storage_name}</b>
			<br>
			${state_name}
			<hr>
			Accessible Capacity: ${numberWithCommas(accessible_capacity_ml)} ML
			<br>
			Current Volume: ${current_volume} ML
			<br>
			Current percentage full: ${percentage} %
			<br>
			Observed: ${days[day]} ${months[month]} ${date} ${year}
			<hr>
			Drainage division: ${awra_drainage_division_name}
			<br>
			Data provider: ${data_provider}
		`

		if(system_type != null){
			info += `
				<hr>
				System type: ${system_type}
			`

			// if(system_type == 'Rural'){
			// 	console.log(supply_system)
			// }

			if(supply_system != null){
				info += `
					<br>
					Supply System: ${supply_system}
				`
			}
		}

		// console.log(storage_name,attr['system_type'])
		// console.log(storage_name,river_name)
		// console.log(attr)

		let geo = i['geometry']
		let lat = geo['y']
		let lon = geo['x']

		let icon = new L.Icon.Default();
		icon.options.shadowSize = [0,0];

		let marker = L.marker([lat,lon],{icon : icon}).bindPopup(info).addTo(storagesMap)

		switch(state_name){
			case 'New South Wales and Victoria': $(marker._icon).addClass('NSW VIC');break;
			case 'Australian Capital Territory': $(marker._icon).addClass('ACT');break;
			case 'New South Wales': $(marker._icon).addClass('NSW');break;
			case 'Northern Territory': $(marker._icon).addClass('NT');break;
			case 'Queensland': $(marker._icon).addClass('QLD');break;
			case 'South Australia': $(marker._icon).addClass('SA');break;
			case 'Tasmania': $(marker._icon).addClass('TAS');break;
			case 'Victoria': $(marker._icon).addClass('VIC');break;
			case 'Western Australia': $(marker._icon).addClass('WA');break;
		}
	}
}

const getStorageLocations = async()=>{
	let res = await fetch(`script/wsapi/centroid_211125.json`)
	window[`storageLocations`] = await res.json()
	addStorages()
}
// getStorageLocations()

const states = ['act','nsw','nt','qld','sa','tas','vic','wa']

//"Storage","Water level (mAHD)","Water depth (m)","Volume (ML)","Capacity (ML)","Volume (%)","Reported date"

let levels = {}

const getCSV = async(n)=>{

	let x = states[n]
	let res = await fetch(`script/water/${x}.csv`)
	let data = await res.text()
	// let data = (await res.text()).replace(/\"/g,'')
	let rows = data.split(/\n/).slice(1)

	for(let i of rows){

		let row = i.split(/","/)

		levels[row[0].replace(/"/g,'')] = {
			"water_level_mAHD":row[1],
			"water_depth_m":row[2],
			"volume_ML":row[3],
			"capacity_ML":row[4],
			"percentage":row[5],
			"obs_date":row[6].replace(/"/g,'')
		}
	}

	if(n < states.length - 1){
		getCSV(n + 1)
	}else{
		console.log(levels)
		getStorageLocations();
	}
}

getCSV(0)

const stateSelect = (e)=>{
	let v = e.target.value
	selectedRegion = v

	$(`.leaflet-marker-icon`).show()
	if(v != 'AU'){
		$(`.leaflet-marker-icon:not(.${v})`).hide()
	}
	storagesMap.setView(state_centre[v][0],state_centre[v][1]).closePopup()
	$(e.target).addClass('selected')
}



/*bindings*/
$('#stateSelect').change(stateSelect)

// var map = L.map('map').setView({lon: 0, lat: 0}, 2);

//	   // add the OpenStreetMap tiles
//	   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//		 maxZoom: 19,
//		 attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
//	   }).addTo(map);

//	   // show the scale bar on the lower left corner
//	   L.control.scale({imperial: true, metric: true}).addTo(map);

//	   // show a marker on the map
//	   L.marker({lon: 0, lat: 0}).bindPopup('The center of the world').addTo(map);