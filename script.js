// =========================
// SONS
// =========================

const somType = document.getElementById("somType");
const somClick = document.getElementById("somClick");
const somComplete = document.getElementById("somComplete");
const somDelete = document.getElementById("somDelete");

const inputTarefa = document.getElementById("inputTarefa");
const lista = document.getElementById("lista");

let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
let filtroAtual = "todas";

function tocarSom(som, volume = 0.3, inicio = 0) {
  if (!som) return;

  som.pause();
  som.currentTime = inicio;
  som.volume = volume;
  som.play();
}

inputTarefa.addEventListener("keydown", function () {
  tocarSom(somType, 0.12, 0.08);
});


// =========================
// TAREFAS
// =========================

function salvarTarefas() {
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

function adicionarTarefa() {
  const texto = inputTarefa.value.trim();
  const data = document.getElementById("dataTarefa").value;
  const horario = document.getElementById("horarioTarefa").value;
  const prioridade = document.getElementById("prioridadeTarefa").value;

  if (texto === "") {
    alert("Digite uma tarefa!");
    return;
  }

  const tarefa = {
    id: Date.now(),
    texto: texto,
    data: data,
    horario: horario,
    prioridade: prioridade,
    concluida: false
  };

  tarefas.push(tarefa);

  salvarTarefas();
  renderizarTarefas();

  tocarSom(somClick, 0.35);

  inputTarefa.value = "";
  document.getElementById("dataTarefa").value = "";
  document.getElementById("horarioTarefa").value = "";
}

function renderizarTarefas() {
  lista.innerHTML = "";

  const tarefasFiltradas = tarefas.filter(function (tarefa) {
    if (filtroAtual === "pendentes") return !tarefa.concluida;
    if (filtroAtual === "concluidas") return tarefa.concluida;
    return true;
  });

  tarefasFiltradas.forEach(function (tarefa) {
    const item = document.createElement("li");

    item.classList.add("prioridade-" + tarefa.prioridade);

    if (tarefa.concluida) {
      item.classList.add("item-concluido");
    }

    const tarefaInfo = document.createElement("div");
    tarefaInfo.classList.add("tarefa-info");

    const tarefaTexto = document.createElement("span");
    tarefaTexto.textContent = tarefa.texto;

    if (tarefa.concluida) {
      tarefaTexto.classList.add("concluida");
    }

    const detalhes = document.createElement("small");

    let info = [];

    if (tarefa.data !== "") info.push(tarefa.data);
    if (tarefa.horario !== "") info.push(tarefa.horario);

    info.push("Prioridade: " + tarefa.prioridade);

    detalhes.textContent = info.join(" • ");

    tarefaInfo.onclick = function () {
      tarefa.concluida = !tarefa.concluida;

      salvarTarefas();
      tocarSom(somComplete, 0.4);
      renderizarTarefas();
    };

    const botao = document.createElement("button");
    botao.textContent = "X";
    botao.classList.add("botao-remover");

    botao.onclick = function () {
      item.classList.add("removendo");

      tocarSom(somDelete, 0.35);

      setTimeout(function () {
        tarefas = tarefas.filter(function (t) {
          return t.id !== tarefa.id;
        });

        salvarTarefas();
        renderizarTarefas();
      }, 350);
    };

    tarefaInfo.appendChild(tarefaTexto);
    tarefaInfo.appendChild(detalhes);

    item.appendChild(tarefaInfo);
    item.appendChild(botao);

    lista.appendChild(item);
  });

  atualizarStatus();
}

function atualizarStatus() {
  const concluidas = tarefas.filter(function (tarefa) {
    return tarefa.concluida;
  }).length;

  const pendentes = tarefas.length - concluidas;

  document.getElementById("contador").textContent =
    pendentes + " pendentes • " + concluidas + " concluídas";

  const porcentagem =
    tarefas.length === 0 ? 0 : (concluidas / tarefas.length) * 100;

  document.getElementById("progresso").style.width = porcentagem + "%";
}

function filtrarTarefas(filtro) {
  filtroAtual = filtro;
  renderizarTarefas();
}

function limparConcluidas() {
  tarefas = tarefas.filter(function (tarefa) {
    return !tarefa.concluida;
  });

  salvarTarefas();
  renderizarTarefas();
}

function modoFoco() {
  document.body.classList.toggle("modo-foco");
}


// =========================
// MÚSICA
// =========================

const audio = document.getElementById("audio");
const botaoMusica = document.getElementById("botaoMusica");

let tocando = false;

function ativarVisualMusica() {
  botaoMusica.classList.add("tocando");

  botaoMusica.innerHTML = `
    <span class="disco-css"></span>
    Pausar música
  `;
}

function desativarVisualMusica() {
  botaoMusica.classList.remove("tocando");

  botaoMusica.innerHTML = `
    <span class="disco-css"></span>
    Música
  `;
}

function tocarMusica() {
  if (!tocando) {
    audio.play();

    ativarVisualMusica();

    tocando = true;
  } else {
    audio.pause();

    desativarVisualMusica();

    tocando = false;
  }
}


// =========================
// PALETAS
// =========================

function abrirPaletas() {
  const paletas = document.getElementById("paletas");
  paletas.classList.toggle("paletas-aberto");
}

function trocarTema(tema) {
  document.body.className = document.body.className
    .replace("tema-original", "")
    .replace("tema-red", "")
    .replace("tema-green", "")
    .replace("tema-orange", "")
    .replace("tema-pink", "")
    .replace("tema-black", "");

  document.body.classList.add("tema-" + tema);

  localStorage.setItem("tema", tema);
}


// =========================
// INICIAR SITE
// =========================

window.onload = function () {
  renderizarTarefas();

  const temaSalvo = localStorage.getItem("tema") || "original";
  trocarTema(temaSalvo);

  audio.volume = 0.4;

  audio.play()
    .then(function () {
      tocando = true;
      ativarVisualMusica();
    })
    .catch(function () {
      tocando = false;
      desativarVisualMusica();
    });
};