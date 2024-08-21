var w = 28
var h = 28

var grid = []

for(var i = 0; i < w*h; i++)
	grid.push(0)

var c = document.getElementById("c")
var ctx = c.getContext("2d")

c.width = w*20
c.height = h*20

var network = new NeuralNetwork([784,50,50,10])

var saved = localStorage.getItem("DigitRecognitionNeuralNetwork")
if(saved) network.loadNetwork(JSON.parse(saved))



var mouse = {
	x: -1,
	y: -1,
	down: false,
	button: 0,
}

var trainData = ""

function runNetwork(){
	var out = network.run(grid)
	document.getElementById("output").innerHTML = ""
	var sum = 0
	for(var i = 0; i < out.length; i++) sum += out[i]
	if(sum == 0) sum = 1

	var ids = [0,1,2,3,4,5,6,7,8,9]

	for(var i = 0; i < out.length; i++){
		for(var k = i; k < out.length; k++){
			if(out[k] > out[i]){
				var t = out[k]
				out[k] = out[i]
				out[i] = t

				var t = ids[k]
				ids[k] = ids[i]
				ids[i] = t
			}
		}
	}

	for(var i = 0; i < out.length; i++){
		document.getElementById("output").innerHTML += ids[i] + ":   " + Math.floor(out[i]*10000/sum)/100 + "%<br>"
	}

	//var cost = network.getCost(trainData)
	//document.getElementById("output").innerHTML += "<br>" + cost
}

c.addEventListener("mousedown", function(e){
	mouse.down = true
	mouse.button = e.button
})

c.addEventListener("mouseup", function(){
	mouse.down = false
})

function drawingEvent(x, y, button){
	var x1 = Math.floor(x/20)
	var y1 = Math.floor(y/20)
	var str = 1
	if(button == 0){
		grid[x1+y1*w] = Math.min(1, grid[x1+y1*w]+str)
		ctx.fillStyle = "#000000"
		ctx.globalAlpha = 1
		ctx.fillRect(x1*20, y1*20, 20, 20)
		ctx.fillStyle = "#FFFFFF"
		ctx.globalAlpha = grid[x1+y1*w]
		ctx.fillRect(x1*20, y1*20, 20, 20)

		if(grid[x1+y1*w+1] != undefined){
			grid[x1+y1*w+1] = Math.min(1, grid[x1+y1*w+1]+str/5)
			ctx.fillStyle = "#000000"
			ctx.globalAlpha = 1
			ctx.fillRect((x1+1)*20, y1*20, 20, 20)
			ctx.fillStyle = "#FFFFFF"	
			ctx.globalAlpha = grid[x1+y1*w+1]
			ctx.fillRect((x1+1)*20, y1*20, 20, 20)
		}
		if(grid[x1+y1*w-1] != undefined){
			grid[x1+y1*w-1] = Math.min(1, grid[x1+y1*w-1]+str/5)
			ctx.fillStyle = "#000000"
			ctx.globalAlpha = 1
			ctx.fillRect((x1-1)*20, y1*20, 20, 20)
			ctx.fillStyle = "#FFFFFF"
			ctx.globalAlpha = grid[x1+y1*w-1]
			ctx.fillRect((x1-1)*20, y1*20, 20, 20)
		}
		if(grid[x1+y1*w+w] != undefined){
			grid[x1+y1*w+w] = Math.min(1, grid[x1+y1*w+w]+str/5)
			ctx.fillStyle = "#000000"
			ctx.globalAlpha = 1
			ctx.fillRect(x1*20, (y1+1)*20, 20, 20)
			ctx.fillStyle = "#FFFFFF"
			ctx.globalAlpha = grid[x1+y1*w+w]
			ctx.fillRect(x1*20, (y1+1)*20, 20, 20)
		}
		if(grid[x1+y1*w-w] != undefined){
			grid[x1+y1*w-w] = Math.min(1, grid[x1+y1*w-w]+str/5)
			ctx.fillStyle = "#000000"
			ctx.globalAlpha = 1
			ctx.fillRect(x1*20, (y1-1)*20, 20, 20)
			ctx.fillStyle = "#FFFFFF"
			ctx.globalAlpha = grid[x1+y1*w-w]
			ctx.fillRect(x1*20, (y1-1)*20, 20, 20)
		}

		if(grid[x1+y1*w+1+w] != undefined){
			grid[x1+y1*w+1+w] = Math.min(1, grid[x1+y1*w+1+w]+str/10)
			ctx.fillStyle = "#000000"
			ctx.globalAlpha = 1
			ctx.fillRect((x1+1)*20, (y1+1)*20, 20, 20)
			ctx.fillStyle = "#FFFFFF"
			ctx.globalAlpha = grid[x1+y1*w+1+w]
			ctx.fillRect((x1+1)*20, (y1+1)*20, 20, 20)
		}
		if(grid[x1+y1*w-1+w] != undefined){
			grid[x1+y1*w-1+w] = Math.min(1, grid[x1+y1*w-1+w]+str/10)
			ctx.fillStyle = "#000000"
			ctx.globalAlpha = 1
			ctx.fillRect((x1-1)*20, (y1+1)*20, 20, 20)
			ctx.fillStyle = "#FFFFFF"
			ctx.globalAlpha = grid[x1+y1*w-1+w]
			ctx.fillRect((x1-1)*20, (y1+1)*20, 20, 20)
		}
		if(grid[x1+y1*w+1-w] != undefined){
			grid[x1+y1*w+1-w] = Math.min(1, grid[x1+y1*w+1-w]+str/10)
			ctx.fillStyle = "#000000"
			ctx.globalAlpha = 1
			ctx.fillRect((x1+1)*20, (y1-1)*20, 20, 20)
			ctx.fillStyle = "#FFFFFF"
			ctx.globalAlpha = grid[x1+y1*w+1-w]
			ctx.fillRect((x1+1)*20, (y1-1)*20, 20, 20)
		}
		if(grid[x1+y1*w-1-w] != undefined){
			grid[x1+y1*w-1-w] = Math.min(1, grid[x1+y1*w-1-w]+str/10)
			ctx.fillStyle = "#000000"
			ctx.globalAlpha = 1
			ctx.fillRect((x1-1)*20, (y1-1)*20, 20, 20)
			ctx.fillStyle = "#FFFFFF"
			ctx.globalAlpha = grid[x1+y1*w-1-w]
			ctx.fillRect((x1-1)*20, (y1-1)*20, 20, 20)
		}
	}
	if(button == 2){
		grid[x1+y1*w] = 0
		ctx.fillStyle = "#000000"
		ctx.globalAlpha = 1
		ctx.fillRect(x1*20, y1*20, 20, 20)
	}
	ctx.globalAlpha = 1

	runNetwork()
}

c.addEventListener("mousemove", function(e){
	mouse.x = e.x - c.getBoundingClientRect().left
	mouse.y = e.y - c.getBoundingClientRect().top
	if(!mouse.down) return 0
	drawingEvent(mouse.x, mouse.y, mouse.button)
})

document.addEventListener('touchmove',function(e){
	var canvasRect = c.getBoundingClientRect()
	var t = e.changedTouches[0]
	drawingEvent(t.clientX - canvasRect.left, t.clientY - canvasRect.top, 0)
})

//trainData = localStorage.getItem("HandwrittenDigits").split(';')

var savedDigits = []

function drawImg(img){
	grid = img.data
	ctx.clearRect(0, 0, c.width, c.height)
	for(var i = 0; i < grid.length; i++){
		ctx.fillStyle = "#FFFFFF"
		ctx.globalAlpha = grid[i]
		ctx.fillRect((i%28)*20, Math.floor(i/28)*20, 20, 20)
	}
	ctx.globalAlpha = 1
	ctx.fillText(img.expected.indexOf(1), 10, 10)
	runNetwork()
}

function clr(){
		grid = []
		for(var i = 0; i < w*h; i++) grid.push(0)
		ctx.clearRect(0, 0, c.width, c.height)
}

document.addEventListener("keydown", function(e){
	/*if('0123456789'.includes(e.key)){
		trainData += exportMap(e.key)
		localStorage.setItem("HandwrittenDigits", trainData)
		counts[Number(e.key)]++
	}*/
	if(e.key == "c") clr()
	if(e.key == "r"){
		if(savedDigits.length > 0) drawImg(savedDigits[Math.floor(Math.random()*savedDigits.length)])
	}
})

function exportMap(label){
	var res = ""
	for(var i = 0; i < grid.length; i++){
		res += "."
		if(grid[i] != 0) res += Math.floor(grid[i]*1000).toString(36)
	}
	res = label + res.slice(1) + ";"

	for(var i = 0; i < w*h; i++) grid[i] = 0

	ctx.clearRect(0, 0, c.width, c.height)

	return res
}

var testImages = 500

function decodeTestImages(){
	var digitCount = [0,0,0,0,0,0,0,0,0,0]
	var alphabet = 'abcdefghijklmnopqrstuvwxyz'
	var digits = '0123456789'
	for(var k = 0; k < trainData.length; k++){
		var dataPoint = trainData[k]
		var expct = [0,0,0,0,0,0,0,0,0,0]
		digitCount[alphabet.indexOf(dataPoint[0])]++
		expct[alphabet.indexOf(dataPoint[0])] = 1
		dataPoint = dataPoint.slice(1)
		var values = []
		var digitValue = ''
		for(var i = 0; i < dataPoint.length; i++){
			if(digits.includes(dataPoint[i])){
				digitValue += String(dataPoint[i])
			}
			else{
				if(digitValue != ''){
					for(var j = 0; j < Number(digitValue); j++) values.push(0)
				}
				values.push((alphabet.indexOf(dataPoint[i])+1)/26)
				digitValue = ''
			}
		}
		if(digitValue != '')
			for(var j = 0; j < Number(digitValue); j++) values.push(0)


		if(Math.random() > 0.5){
			var shift = values.splice(0, Math.floor(Math.random()*6)*w)
			values = values.concat(shift)
		}
		else{
			var shift = Math.floor(Math.random()*6)*w
			shift = values.splice(values.length-shift.length-1,shift.length)
			values = shift.concat(values)
		}

		if(Math.random() > 0.5){
			var shift = values.splice(0, Math.floor(Math.random()*6))
			values = values.concat(shift)
		}
		else{
			var shift = Math.floor(Math.random()*6)
			shift = values.splice(values.length-shift.length-1,shift.length)
			values = shift.concat(values)
		}

		if(k < trainData.length - testImages){
		for(var i = 0; i < 50; i++){
			var r = Math.floor(Math.random()*values.length)
			if(values[r] == 0) values[r] = Math.random()
		}
}

		else savedDigits.push({expected: expct, data: values})
		trainData[k] = {expected: expct, data: values}
	}
	//console.log(digitCount)
}

const inputElement = document.getElementById("inputElement")

var learnRate = 1

var origTrainData

inputElement.onchange = (e) => {
  const file = inputElement.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (e) => {
    // e.target points to the reader
    const textContent = e.target.result
    trainData = textContent.split(';')
    origTrainData = trainData.slice(0)
    decodeTestImages()
  }
  reader.onerror = (e) => {
    const error = e.target.error
    console.error(`Error occured while reading ${file.name}`, error)
  }
  reader.readAsText(file)
}

var failedTests = []
var failId = 0
var showFailed = 0

function learn(){
    for(var i = 20; i < trainData.length - testImages; i+=20){
    	//setTimeout(function(){
    			network.Learn(trainData.slice(i-20, i), learnRate)
    			//runNetwork()
    	//}, i/500-1*100)
    }
    var passed = 0
    var failed = 0
    for(var i = trainData.length - testImages; i < trainData.length; i++){
    	var out = network.run(trainData[i].data)
    	if(out.indexOf(Math.max(...out)) == trainData[i].expected.indexOf(1)) passed++
    	else{
    		failed++
    		failedTests.push([trainData[i].data, trainData[i].expected.indexOf(1), out.indexOf(Math.max(...out))])
    	} 
    }

    trainData = origTrainData.slice(0)

    savedDigits = []

    decodeTestImages()

    console.log("Test data")
    console.log("PASSED: " + passed)
    console.log("FAILED: " + failed)
		runNetwork()

		//localStorage.setItem("DigitRecognitionNeuralNetwork", JSON.stringify(network))
}

c.addEventListener("contextmenu", e => e.preventDefault());