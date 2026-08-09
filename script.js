let ligado = false;
let microfoneLigado = false;

let stream = null;
let audioContext = null;
let source = null;
let gainNode = null;


// =============================
// LIGAR / DESLIGAR
// =============================

async function ligarDesligar() {

    if (!ligado) {

        ligado = true;

        document.getElementById("status").innerText =
            "Ligado";

        document.getElementById("power").style.background =
            "green";

    } else {

        desligarMicrofone();

        ligado = false;

        document.getElementById("status").innerText =
            "Desligado";

        document.getElementById("power").style.background =
            "#333";
    }
}


// =============================
// ATIVAR MICROFONE
// =============================

async function ativarMicrofone() {

    if (!ligado) {

        alert("Primeiro ligue o aparelho.");

        return;
    }

    if (microfoneLigado) {

        desligarMicrofone();

        return;
    }

    try {

        stream = await navigator.mediaDevices.getUserMedia({
            audio: true
        });

        audioContext = new (
            window.AudioContext ||
            window.webkitAudioContext
        )();

        source = audioContext.createMediaStreamSource(stream);

        gainNode = audioContext.createGain();

        gainNode.gain.value =
            document.getElementById("volume").value;

        source.connect(gainNode);

        gainNode.connect(audioContext.destination);

        microfoneLigado = true;

        document.getElementById("status").innerText =
            "🎤 Microfone ligado";

        document.getElementById("microfoneBtn").innerText =
            "🔴 Desligar microfone";

    } catch (erro) {

        console.error(erro);

        alert(
            "Não foi possível acessar o microfone. " +
            "Permita o acesso ao microfone no navegador."
        );
    }
}


// =============================
// DESLIGAR MICROFONE
// =============================

function desligarMicrofone() {

    if (stream) {

        stream.getTracks().forEach(
            track => track.stop()
        );

        stream = null;
    }

    if (audioContext) {

        audioContext.close();

        audioContext = null;
    }

    source = null;
    gainNode = null;

    microfoneLigado = false;

    document.getElementById("microfoneBtn").innerText =
        "🎤 Ativar microfone";

    if (ligado) {

        document.getElementById("status").innerText =
            "Ligado";
    }
}


// =============================
// CONTROLE DE VOLUME
// =============================

document
    .getElementById("volume")
    .addEventListener("input", function () {

        if (gainNode) {

            gainNode.gain.value =
                this.value;
        }

    });