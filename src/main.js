function random(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min }
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
		data.time = document.getElementById("timer").innerHTML
		var players = document.getElementById("containerGamePlayers").childNodes
		players.forEach(player => {
			if (player.querySelector(".name").style.color == "rgb(0, 0, 255)") {
				data.player = player
				data.guessed = player.classList.contains("guessedWord")
			}
		});
		return data
	}

	step() {
		this.loopcount++
		var data = this.getdata()
		if (data.guessed || data.time <= 1) {
			this.type("https://git(dot)io/JT1KB")
			this.continue()
			return
		}
		if (this.oldtime < data.time) {
			this.sent = []
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
			if (this.getdata().guessed) break
		}
		if (loops == 3) this.type("https://git(dot)io/JT1KB")
		this.continue()
	}

	continue() {
		if (!this.running) return
		let timenow = performance.now()
		this.wait = timenow + random(2000,2500)
		let timetowait = this.wait - timenow
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