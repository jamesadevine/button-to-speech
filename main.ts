// written by Mike Hall
// mike.hall@microsoft.com

namespace phraseevents {
    // all settings keys are prefixed with this string
    const PREFIX = "@ph_"
    // data layout format (18bytes)
    const FORMAT = "s"
    // data layout types
    let phrases: string[] = []

let contentLength=0
let contentPointer=-1
let lastRotaryPosition=0


    function decodeBindings() {
        const keys = jacdac.settingsServer.list(PREFIX)
        console.log(`decoding bindings (${keys.length})`)
        phrases = []
        for (const key of keys) {
            try {
                const payload = jacdac.settingsServer.readBuffer(key)
                const binding = jacdac.jdunpack(
                    payload,
                    "s"
                )
                const phrase = binding[0]
                phrases.push(phrase)
            } catch (e) {
                // this key is broken
                console.log(`phrase ${key} corrupted`)
                //jacdac.settingsServer.delete(key)
            }
        }
        contentLength=phrases.length
        phrases.forEach((phrase) => console.log(phrase))
    }

    myModules.button2.onUp(function () {
        control.runInBackground(() => basic.showString(phrases[contentPointer], 75))
    })

    modules.rotaryEncoder1.onPositionChangedBy(1, function () {
        if (phrases.length == 0) {
            return
        }

        let selectedRotaryPosition=modules.rotaryEncoder1.reading()
        if (selectedRotaryPosition > lastRotaryPosition) {
            contentPointer++
            if (contentPointer >= contentLength)
                contentPointer=0
        }
        else{
            contentPointer--
            if (contentPointer < 0)
                contentPointer = contentLength-1
        }
        lastRotaryPosition=selectedRotaryPosition

        if (phrases.length > 0) {
            led.stopAnimation()
            control.runInBackground(()=> basic.showString(phrases[contentPointer], 75))
        }
    })

    modules.button1.onUp(function () {
        if (phrases.length > 0) {
            modules.speechSynthesis1.speak(`[:rate 190][:n3]hey Google. ${phrases[contentPointer]}`)
        }
    })

    let color = 0
    basic.forever(function () {
    })

    function start() {
        console.log(`app starting`)
        jacdac.startServer()
        jacdac.settingsServer.start()
        jacdac.settingsServer.on(jacdac.CHANGE, () => decodeBindings())

        // decode and start
        const keys2 = jacdac.settingsServer.list(PREFIX)
        if (keys2.length > 0) {
            console.log(`first key ${keys2[0]}`)
        } else {
            console.log(`no keys`)
        }
        
        decodeBindings()
    }
    
    start()
}
