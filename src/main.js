function random(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min }
function triggerMouseEvent(node, eventType) {var clickEvent = document.createEvent('MouseEvents');clickEvent.initEvent(eventType, true, true);node.dispatchEvent(clickEvent);}
hackclass = class {
	constructor() {
		this.anagram = document.getElementById("currentWord")
		this.wordlist = JSON.parse(this.request("https://raw.githubusercontent.com/skribbliohints/skribbliohints.github.io/master/words.json"))
		// this.wordlist = this.wordlist.split("\n")
		this.running = true
		this.oldtime = -1
		this.loopcount = 0
		this.step()
	}

	getdata() {
		var data = {}
		data.game = document.getElementById("screenGame")
		data.time = document.getElementById("timer").innerHTML
		var players = document.getElementById("containerGamePlayers").childNodes
		players.forEach(player => {
			if (player.querySelector(".name").style.color == "rgb(0, 0, 255)") {
				data.player = player
				data.guessed = player.classList.contains("guessedWord")
				data.drawing = (player.querySelector(".avatar .drawing").style.display !== "none")
			}
		});
		data.canvas = document.getElementById("canvasGame")
		return data
	}

	step() {
		this.loopcount++
		var data = this.getdata()
		if (data.drawing) {
			if (!this.wasdrawing) {
				data.game.querySelectorAll("div.containerToolbar div.containerTools div.tool img.toolIcon")[2].click()
			}
			if (this.loopcount % 2 == 0) {
				document.getElementById("buttonClearCanvas").click()
				data.game.querySelectorAll("div.containerToolbar div.containerTools div.tool img.toolIcon")[2].click()
				var colors = data.game.querySelector("div.containerColorbox div.containerColorColumn").childNodes
				colors[random(0, colors.length - 1)].click()
			} else {
				triggerMouseEvent(data.canvas, "mouseover")
				triggerMouseEvent(data.canvas, "mousedown")
				triggerMouseEvent(data.canvas, "mouseup")
				triggerMouseEvent(data.canvas, "click")
			}
		}
		if (data.guessed || data.time <= 1 || data.drawing) {
			if (this.loopcount % 20 == 0) this.type("https://git(dot)io/JT1KB")
			this.continue(100)
			return
		}
		if (this.oldtime < data.time) {
			this.sent = []
			this.wasdrawing = false
			this.wait = 0
			console.debug("New")
		}
		this.oldtime = data.time

		let anagram = this.anagram.innerHTML.replaceAll("_", "[a-z]")
		var regex = new RegExp("^" + anagram + "$", "i")

		var loops = 4
		if (this.loopcount % 4 == 0) loops = 3
		for (let i = 0; i < loops; i++) {
			var matches = []
			for (const [word, weight] of Object.entries(this.wordlist)) {
				if (regex.test(word)) {
					matches.push([word, weight["count"]])
				}
			}

			var out = []
			for (let i = 0; i < matches.length; i++) {
				let match = matches[i]
				if (this.sent.includes(match[0])) continue
				for (let i = 0; i < match[1]; i++) {
					out.push(match[0])
				}
			}
			let word = out[random(0,out.length)]
			this.type(word)
			this.sent.push(word)
			this.oldword = word
		}
		if (loops == 3) this.type("https://git(dot)io/JT1KB")
		this.continue()
	}

	continue(time) {
		if (!this.running) return
		let timenow = performance.now()
		this.wait = timenow + random(2000,2500)
		let timetowait = (time) ? time : this.wait - timenow
		setTimeout(this.step.bind(this), timetowait)
	}

	type(text) {
		if (text == "undefined") return
		let chat = document.getElementById("inputChat")
		chat.value = text
		chat.dispatchEvent(new KeyboardEvent('keypress', { 'keyCode': '13' }));
	}

	request(url) {
		let xmlHttp = new XMLHttpRequest()
		xmlHttp.open("GET", url, false)
		xmlHttp.send()
		return xmlHttp.responseText
	}

	pause() {
		this.running = false
	}

	resume() {
		this.running = true
		this.step()
	}
}
try {
	hack.pause()
	hack = ""
} catch {
	//continue?
}
hack = new hackclass()