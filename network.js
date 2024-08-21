function activationFunction(x){
	return 1/(Math.exp(-x)+1)
	//if(x < 0) return 0
	//return x
}

function activationDerivative(x){
	return activationFunction(x)*(1-activationFunction(x))
	//return Number(x >= 0)
}

function errorCost(x, expected){
	return (x - expected)**2
}

function costDerivative(x, expected){
	return 2*(x - expected)
}

class Layer{
	constructor(nodesIn, nodesOut){
		this.nodesIn = nodesIn
		this.nodesOut = nodesOut
		this.weights = []
		this.biases = []
		this.weightedInputs = []
		this.outputs = []
		this.inputs = []
		this.values = []
		this.gradW = []
		this.gradB = []
		for(var i = 0; i < nodesOut; i++){
			this.weights.push([])
			this.gradW.push([])
			for(var k = 0; k < nodesIn; k++){
				this.weights[i].push(Math.random()*2-1)
				this.gradW[i].push(0)
			}
		}
		for(var i = 0; i < nodesOut; i++){
			this.biases.push(Math.random()*2-1)
			this.values.push(0)
			this.gradB.push(0)
		}
	}

	run(inputs){
		if(inputs.length != this.nodesIn)
			return inputs
		this.inputs = inputs
		this.outputs = []
		this.weightedInputs = []
		for(var i = 0; i < this.nodesOut; i++){
			var s = this.biases[i]
			for(var k = 0; k < this.nodesIn; k++){
				s += inputs[k]*this.weights[i][k]
			}
			this.weightedInputs.push(s)
			this.outputs.push(activationFunction(s))
		}
		return this.outputs
	}

	loadLayer(data){
		Object.assign(this, data)
	}
}

class NeuralNetwork{
	constructor(layerSizes){
		this.layers = []
		for(var i = 1; i < layerSizes.length; i++)
			this.layers.push(new Layer(layerSizes[i-1], layerSizes[i]))
	}

	loadNetwork(data){
		Object.assign(this, data)
		for(var i = 0; i < this.layers.length; i++){
			var newLayer = new Layer(1, 1)
			newLayer.loadLayer(this.layers[i])
			this.layers[i] = newLayer
		}
	}

	run(inputs){
		if(inputs.length != this.layers[0].nodesIn)
			return
		for(var i = 0; i < this.layers.length; i++)
			inputs = this.layers[i].run(inputs)
		return inputs
	}


	Learn(trainingBatch, learnRate){
		var lr = learnRate/trainingBatch.length

		for(var i = 0; i < trainingBatch.length; i++){
			this.run(trainingBatch[i].data)
			var outputLayer = this.layers[this.layers.length-1]
			for(var k = 0; k < outputLayer.nodesOut; k++){
				this.layers[this.layers.length-1].values[k] = activationDerivative(outputLayer.weightedInputs[k])*costDerivative(outputLayer.outputs[k], trainingBatch[i].expected[k])
			}

			for(var l = this.layers.length-2; l >= 0; l--){
				for(var j = 0; j < this.layers[l].nodesOut; j++){
					this.layers[l].values[j] = 0
					for(var k = 0; k < this.layers[l+1].nodesOut; k++){
						this.layers[l].values[j] += this.layers[l+1].values[k] * this.layers[l].weights[j][k]
					}

					this.layers[l].values[j] *= activationDerivative(this.layers[l].weightedInputs[j])
				}

			}

			for(var l = 0; l < this.layers.length; l++){
				for(var j = 0; j < this.layers[l].nodesOut; j++){
					for(var k = 0; k < this.layers[l].nodesIn; k++){
						this.layers[l].gradW[j][k] += this.layers[l].values[j]*this.layers[l].inputs[k]
					}
					this.layers[l].gradB[j] += this.layers[l].values[j]
				}
			}
		}

		for(var l = 0; l < this.layers.length; l++){
			for(var j = 0; j < this.layers[l].nodesOut; j++){
				this.layers[l].biases[j] -= this.layers[l].gradB[j]*lr
				for(var k = 0; k < this.layers[l].nodesIn; k++){
					this.layers[l].weights[j][k] -= this.layers[l].gradW[j][k]*lr
				}
			}
		}

		for(var l = 0; l < this.layers.length; l++){
			for(var j = 0; j < this.layers[l].nodesOut; j++){
				this.layers[l].gradB[j] = 0
				for(var k = 0; k < this.layers[l].nodesIn; k++){
					this.layers[l].gradW[j][k] = 0
				}
			}
		}
	}
}