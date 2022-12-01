const data = {
  currentUser: {
    imagen: {
      png: "./images/avatars/image-julio.png",
      webp: "./images/avatars/image-julio.webp",
    },
    username: "julio",
  },
  comments: [
    {
      parent: 0,
      id: 1,
      content:
        "este es el primer comentario de ejemplo",
      createdAt: "12 días",
      score: 0,
      user: {
        imagen: {
          png: "./images/avatars/image-Josefina.png",
          webp: "./images/avatars/image-Josefina.webp",
        },
        username: "Josefina",
      },
      replies: [],
    },
    {
      parent: 0,
      id: 2,
      content:
        "este es el segundo comentario de ejemplo",
      createdAt: "10 días",
      score: 0,
      user: {
        imagen: {
          png: "./images/avatars/image-luis.png",
          webp: "./images/avatars/image-luis.webp",
        },
        username: "Luis",
      },
      replies: [],
    },
  ],
};


const sumaFragmento = (frag, padre) => {
  console.log("1-----------------------sumaFragmento----------------------")

  const fragHijo = [].slice.call(frag.childNodes);
  padre.appendChild(frag);


  return fragHijo[1];
}


const sumaComentario = (body, idPadre, respuestaPara = undefined) => {
  console.log("2----------------------sumaComentario-----------------------")


  let comentarioPadre =
    idPadre === 0
      ? data.comments
      : data.comments.filter((c) => c.id == idPadre)[0].replies;

  let nuevoComentario = {
    parent: idPadre,
    id:
      comentarioPadre.length == 0
        ? 1
        : comentarioPadre[comentarioPadre.length - 1].id + 1,
    content: body,
    createdAt: "Now",
    replyingTo: respuestaPara,
    score: 0,
    replies: parent == 0 ? [] : undefined,
    user: data.currentUser,
  };

  comentarioPadre.push(nuevoComentario);

  comentariosDeInicio();

};


const respondiendoComentario = (padre, idPadre, respuestaPara = undefined, data) => {
  console.log("3----------------------respondiendoComentario-----------------------")


  if (padre.querySelectorAll(".inputContesta")) {
    padre.querySelectorAll(".inputContesta").forEach((e) => {
      e.remove();
    });
  }

  const inputTemplate = document.querySelector(".inputContesta-template");
  const inputNodo = inputTemplate.content.cloneNode(true);

  const addedInput = sumaFragmento(inputNodo, padre);


  addedInput.querySelector(".botonEnviar").addEventListener("click", () => {
    const texto = addedInput.querySelector(".cmnt-input").value;

    if (texto.trim() === "") return;

    sumaComentario(texto, idPadre, respuestaPara);
  });

  addedInput.querySelector(".cmnt-input").addEventListener("keypress", (e) => {

    const texto = addedInput.querySelector(".cmnt-input").value;

    if (e.code === "Enter" && texto.trim() !== "") {
      sumaComentario(texto, idPadre, respuestaPara);
    }


  });

};


const creaComentarioEnNodo = (comentarioObject) => {
  console.log("4----------------------creaComentarioEnNodo-----------------------")

  const comentarioEnTemplate = document.querySelector(".comentarioTemplate");
  const creandoComentarioEnNodo = comentarioEnTemplate.content.cloneNode(true);

  creandoComentarioEnNodo.querySelector(".nombreUsuario").textContent =
    comentarioObject.user.username;
  creandoComentarioEnNodo.querySelector(".imagenUsuario").src = comentarioObject.user.imagen.webp;
  creandoComentarioEnNodo.querySelector(".numeroLikes").textContent = comentarioObject.score;
  creandoComentarioEnNodo.querySelector(".fecha").textContent = comentarioObject.createdAt;
  creandoComentarioEnNodo.querySelector(".c-body").textContent = comentarioObject.content;

  if (comentarioObject.replyingTo)
    creandoComentarioEnNodo.querySelector(".responder-to").textContent =
      "@" + comentarioObject.replyingTo;

  creandoComentarioEnNodo.querySelector(".fa-heart").addEventListener("click", () => {
    comentarioObject.score++;
    comentariosDeInicio();
  });

  if (comentarioObject.user.username == data.currentUser.username) {
    creandoComentarioEnNodo.querySelector(".comentario").classList.add("this-user");
    creandoComentarioEnNodo.querySelector(".eliminar").addEventListener("click", () => {
      confirmarEliminacion(comentarioObject);
    });

    creandoComentarioEnNodo.querySelector(".editar").addEventListener("click", (e) => {
      const caminoAlClass = e.composedPath()[2].querySelector(".c-body");

      if (caminoAlClass.getAttribute("contenteditable") == false || caminoAlClass.getAttribute("contenteditable") == null) {

        caminoAlClass.setAttribute("contenteditable", true);
        caminoAlClass.focus()

      } else {
        caminoAlClass.removeAttribute("contenteditable");
        comentarioObject.content = caminoAlClass.childNodes[0].data
      }

      caminoAlClass.addEventListener("keypress", (e) => {
        const largo = caminoAlClass.childNodes[0].length

        if (e.code === 'Enter' && largo > 0) {
          caminoAlClass.removeAttribute("contenteditable");
          comentarioObject.content = caminoAlClass.childNodes[0].data
        }

      })

    });
    return creandoComentarioEnNodo;
  }
  return creandoComentarioEnNodo;
};


const agregaComentario = (nodoPadre, comentarioEnNodo, idPadre) => {
  console.log("5----------------------agregaComentario-----------------------")

  const botonReply = comentarioEnNodo.querySelector(".responder");

  const agregandoComentario = sumaFragmento(comentarioEnNodo, nodoPadre);

  const respuestaPara = agregandoComentario.querySelector(".nombreUsuario").textContent;
  botonReply.addEventListener("click", () => {

    if (nodoPadre.classList.contains("replies")) {

      respondiendoComentario(nodoPadre, idPadre, respuestaPara);

    } else {

      respondiendoComentario(
        agregandoComentario.querySelector(".replies"),
        idPadre,
        respuestaPara
      );

    }

  });

};


const comentariosDeInicio = (

  listaDeComentarios = data.comments,
  padre = document.querySelector(".paqueteDeComentarios")


) => {
  console.log("6----------------------comentariosDeInicio-----------------------")

  padre.innerHTML = "";
  listaDeComentarios.forEach((element) => {

    var idPadre = element.parent == 0 ? element.id : element.parent;
    const comentarioEnNodo = creaComentarioEnNodo(element);
    if (element.replies && element.replies.length > 0) {
      comentariosDeInicio(element.replies, comentarioEnNodo.querySelector(".replies"));
    }
    agregaComentario(padre, comentarioEnNodo, idPadre);

    console.log("6.2----------------------comentariosDeInicio-----------------------")

  });

}
comentariosDeInicio();


const textoInputPrincipal = document.querySelector(".inputContesta");
textoInputPrincipal.querySelector(".botonEnviar").addEventListener("click", () => {

  console.log("7----------------------textoInputPrincipal-----------------------")

  const texto = textoInputPrincipal.querySelector(".cmnt-input").value;

  console.log(texto.trim() === "")

  if (texto.trim() === "") return

  sumaComentario(texto, 0);
  textoInputPrincipal.querySelector(".cmnt-input").value = "";

  console.log("---------------------------------------------------------     FIN   ")
});

textoInputPrincipal.querySelector(".cmnt-input").addEventListener("keypress", (e) => {

  const texto = textoInputPrincipal.querySelector(".cmnt-input").value;

  if (e.code === "Enter" && texto.trim() !== "") {

    sumaComentario(texto, 0);
    textoInputPrincipal.querySelector(".cmnt-input").value = "";
  }

})



//-----------------------------------------------------------------------------ELIMINAR Y CONFIRMAR 

const eliminarComentario = (comentarioObject) => {

  if (comentarioObject.parent == 0) {
    data.comments = data.comments.filter((e) => e != comentarioObject);
  } else {
    data.comments.filter((e) => e.id === comentarioObject.parent)[0].replies =
      data.comments
        .filter((e) => e.id === comentarioObject.parent)[0]
        .replies.filter((e) => e != comentarioObject);
  }
  comentariosDeInicio();
};

const confirmarEliminacion = (comentarioObject) => {

  const paqueteModal = document.querySelector(".paqueteModal");
  paqueteModal.classList.remove("invisible");
  paqueteModal.querySelector(".si").addEventListener("click", () => {
    eliminarComentario(comentarioObject);
    paqueteModal.classList.add("invisible");
  });
  paqueteModal.querySelector(".no").addEventListener("click", () => {
    paqueteModal.classList.add("invisible");
  });
};


const botonOnOff = document.querySelector("#onOff");

botonOnOff.addEventListener("click", () => {

  document.body.classList.toggle('oscuro')
  botonOnOff.classList.toggle('activo')


})

