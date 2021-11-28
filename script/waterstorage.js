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
		let state_name = attr['state_name'];console.log(state_name)
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
		let marker = L.marker([lat,lon]).bindPopup(info).addTo(storagesMap)
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