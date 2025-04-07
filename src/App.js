import { useState, useEffect } from "react";
import api from "./services/api";
import Swal from "sweetalert2";

export default function CadastroDocentes() {
  const [docentes, setDocentes] = useState([]);
  const [matricula, setMatricula] = useState("");
  const [modalType, setModalType] = useState(null); // 'create' ou 'edit'
  const [reload, setReload] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [erroNome, setErroNome] = useState("");
  const [erroMatricula, setErroMatricula] = useState("");
  const [errorDate, setErrorDate] = useState("");
  const [errorEmail, setErrorEmail] = useState({
    email: "",
  });
  const [formData, setFormData] = useState({
    matricula: "",
    nome: "",
    email: "",
    dataNascimento: "",
    situacao: "Estatutário",
    areaConcurso:"",
    dataAdmissao: "",
    status: "1",
  });

  const fetchDocentes = async () => {
    try {
      const response = await api.get("/docentes");
      console.log("Dados recebidos:", response.data); // Verifica os dados
      setDocentes(response.data);
    } catch (error) {
      console.error("Erro ao buscar docentes:", error);
      setDocentes([]); // Evita que fique undefined
    } finally {
      setReload(false);
    }
  };

  useEffect(() => {
    fetchDocentes();
  }, [reload]);

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@(fiec)\.(com\.br|edu\.br)$/;
    return regex.test(email);
  };

  //Começo Handles
  // Envia o formulário para o backend
  const HandleSubmit = async (e) => {
    e.preventDefault();
    console.log("Enviando dados para o backend:", formData);

    try {
      if (modalType === "edit") {
        await api.put(`/docentes/editar/${formData.matricula}`, formData);
      } else {
        await api.post("/docentes/criar", formData);
      }
      setReload(true);
      setModalType(null); // Fecha o modal
    } catch (error) {
      console.error(
        "Erro ao salvar docente:",
        error.response ? error.response.data : error
      );
    }
  };

  //deletar docente
  async function HandleDelete(matricula) {
    await Swal.fire({
      title: "Você tem certeza?",
      text: "Essa ação não é reversível!",
      icon: "warning",
      iconColor: "red",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Sim,deletar",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/docentes/excluir/${matricula}`);
          await Swal.fire({
            title: "Sucesso!",
            text: "O docente foi excluido.",
            icon: "success",
          });
          setMatricula("");
          setReload(true);
        } catch (error) {
          console.error("Erro ao excluir docente:", error);
          await Swal.fire({
            title: "Erro!",
            text: "Erro ao excluir docente. Verifique se a matrícula está correta.",
            icon: "error",
          });
        }
      }
    });
  }

  const handleChange = (e) => {
    const { id, value } = e.target;

    //Validação da matrícula
    if (id === "matricula") {
      const numericValue = value.replace(/\D/g, ""); // Remove caracteres não numéricos
      setFormData((prev) => ({
        ...prev,
        matricula:"Apenas valores numéricos",
        [id]: numericValue.slice(0, 5), // Limita a 5 dígitos
      }));
      return;
    }

    // Validação de e-mail
    if (id === "email") {
      if (!value) {
        // Se o campo estiver vazio, remove a mensagem de erro
        setErrorEmail((prevErrors) => ({ ...prevErrors, email: "" }));
      } else if (!validateEmail(value)) {
        setErrorEmail((prevErrors) => ({
          ...prevErrors,
          email: "E-mail inválido. Use @fiec.com ou @fiec.edu",
        }));
      } else {
        setErrorEmail((prevErrors) => ({ ...prevErrors, email: "" }));
      }
    }

    //Validação do Nome
    if (id === "nome") {
      if (!validarNomeCompleto(value)) {
        setErroNome("Digite um nome completo válido (nome e sobrenome).");
      } else {
        setErroNome(""); // Remove o erro se for válido
      }
    }

    // Atualiza o estado do formulário
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));

    // Validação de data
    if (id === "dataNascimento" || id === "dataAdmissao") {
      const dataNascimento = new Date(
        id === "dataNascimento" ? value : formData.dataNascimento
      );
      const dataAdmissao = new Date(
        id === "dataAdmissao" ? value : formData.dataAdmissao
      );

      if (dataAdmissao < dataNascimento) {
        setErrorDate("A data de admissão deve ser maior que a de nascimento.");
      } else {
        setErrorDate("");
      }
    }

    // Atualiza os campos do formulário
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  //Fim Handles

  //Modais
  //Modal criar docente
  const openCreateModal = () => {
    // Limpa o formulário para um novo cadastro
    setFormData({
      matricula: "",
      nome: "",
      email: "",
      dataNascimento: "",
      situacao: "Estatutário",
      dataAdmissao: "",
      areaConcurso: "",
      status: "1",
    });
    setModalType("create");
  };

  //modal editar docente
  const openEditModal = (docente) => {
    console.log(docente);
    setFormData({
      matricula: docente.matricula_doc,
      nome: docente.nome_doc,
      email: docente.email_doc,
      dataNascimento: docente.data_nasci_doc.split("T")[0],
      situacao: docente.situacao_doc,
      dataAdmissao: docente.data_adimissao_doc.split("T")[0],
      areaConcurso: docente.area_concurso_doc,
      status: docente.status_doc,
    });
    setModalType("edit");
  };

  //Modal alert no handleDelete
  //Fim Modais
  
  //Inicio Funcoes complementares
  //Remover acentos
  const removerAcentos = (texto) => {
    return texto
      .normalize("NFD") // Decompõe caracteres acentuados em letra + acento
      .replace(/[\u0300-\u036f]/g, ""); // Remove os acentos
  };

  //Validar Nome e Sobrenome
  function validarNomeCompleto(nome) {
    // Regex que permite letras, espaços e acentos
    const regex = /^[a-zA-ZÀ-ÿ\s']+$/;

    if (!regex.test(nome)) {
      return false;
    }
    // Verifica se tem pelo menos 2 partes (nome e sobrenome)
    const partes = nome.trim().split(/\s+/);
    return partes.length >= 2 && partes.every((part) => part.length >= 2);
  }

  //Pesquisar docentes(searchinput)
  const pesquisarDocentes = () => {
    const termo = removerAcentos(searchTerm.trim().toLowerCase());
    const rows = document.querySelectorAll("#docentesTable tbody tr");
  
    rows.forEach((row) => {
      const matricula = removerAcentos(row.cells[0].textContent.toLowerCase());
      const nome = removerAcentos(row.cells[1].textContent.toLowerCase());
      const email = removerAcentos(row.cells[2].textContent.toLowerCase());
      const dataNascimento = removerAcentos(row.cells[3].textContent.toLowerCase());
      const dataAdmissao = removerAcentos(row.cells[4].textContent.toLowerCase());
      const situacao = removerAcentos(row.cells[5].textContent.toLowerCase());
      const areaConcurso = removerAcentos(row.cells[6].textContent.toLowerCase());
      const status = removerAcentos(row.cells[7].textContent.toLowerCase());
  
      row.style.display =
        matricula.includes(termo) ||
        nome.includes(termo) ||
        email.includes(termo) ||
        dataNascimento.includes(termo) ||
        dataAdmissao.includes(termo) ||
        situacao.includes(termo) ||
        areaConcurso.includes(termo) ||
        status.includes(termo)
          ? ""
          : "none";
    });
  };
  

  //Fim funções complementares

  return (
    <div className="container">
      <img src="favicon.ico" className="logo" alt="logo" />
      <h1>Cadastro de Docentes</h1>
      <button id="btnNovoDocente" onClick={openCreateModal}>
        <img src="/images/mais.png" className="mais" alt="Criar docente" />
        Novo
      </button>
      <div className="searchContainer">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Pesquisar Docente"
          id="searchInput"
        />
        <button onClick={pesquisarDocentes} id="btnPesquisar">
          <img
            src="/images/searchbranco.png"
            className="search"
            alt="pesquisar"
          />
          Pesquisar
        </button>
      </div>

      {/* Moldal Criar ou exluir */}
      {modalType && (
        <div className="modalOverlay">
          <div className="modal">
            <h2>
              {modalType === "create" ? "Cadastrar Docente" : "Editar Docente"}
            </h2>
            <form onSubmit={HandleSubmit}>
              <label htmlFor="matricula">Matrícula:</label>
              <input
                type="text"
                id="matricula"
                required
                value={formData.matricula}
                onChange={handleChange}
                className={erroMatricula ? "input-error" : ""}
                placeholder="Digite o número da matrícula"
                maxLength={5}
                minLength={5}
              />
              {erroMatricula &&<span className="error-message">{erroNome}</span>}

              <label htmlFor="nome">Nome Completo:</label>
              <input
                type="text"
                id="nome"
                required
                value={formData.nome}
                className={erroNome ? "input-error" : ""}
                onChange={handleChange}
                placeholder="Digite o nome do docente"
              />
              {erroNome && <span className="error-message">{erroNome}</span>}

              <label htmlFor="email">E-mail:</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className={errorEmail.email ? "input-error" : ""}
                placeholder="Digite o E-mail do docente"
              />
              {errorEmail.email && (
                <span className="error-message">{errorEmail.email}</span>
              )}

              <label htmlFor="dataNascimento">Data de Nascimento:</label>
              <input
                type="date"
                id="dataNascimento"
                required
                value={formData.dataNascimento}
                onChange={handleChange}
                placeholder="Digite a data de nascimento do docente"
              />

              <label htmlFor="dataAdmissao">Data de Admissão:</label>
              <input
                type="date"
                id="dataAdmissao"
                required
                className={errorDate ? "input-error" : ""}
                value={formData.dataAdmissao}
                onChange={handleChange}
                placeholder="Digite a data de admissão do docente"
              />
              {errorDate && <span className="error-message">{errorDate}</span>}

              <label htmlFor="situacao">Situação:</label>
              <select
                id="situacao"
                value={formData.situacao}
                onChange={handleChange}
              >
                <option value="Estatutário">Estatutário</option>
                <option value="CLT">CLT</option>
              </select>

              <label htmlFor="areaConcurso">Área do Concurso:</label>
              <input
                type="text"
                id="areaConcurso"
                required
                value={formData.areaConcurso}
                onChange={handleChange}
                placeholder="Digite a área do concurso"
              />
              {modalType === "edit" && (
                <>
                  <label htmlFor="status">Status:</label>
                  <select
                    id="status"
                    onChange={handleChange}
                    value={formData.status}
                  >
                    <option value={1}>Ativado</option>
                    <option value={0}>Desativado</option>
                  </select>
                </>
              )}
              <button type="submit" disabled={!!erroNome || !!errorDate}>
                Salvar
              </button>
              <button type="button" onClick={() => setModalType(null)}>
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Fim modal Criar ou Editar */}

      <div id="containerTable">
        <table id="docentesTable">
          <thead>
            <tr>
              <th>Matrícula</th>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Data de Nascimento</th>
              <th>Data de Admissão</th>
              <th>Situação</th>
              <th>Área do Concurso</th>
              <th>Status</th>
              <th>Opções</th>
            </tr>
          </thead>
          <tbody>
            {docentes && docentes.length > 0 ? (
              docentes.map((docente) => (
                <tr>
                  <td>{docente.matricula_doc}</td>
                  <td>{docente.nome_doc}</td>
                  <td>{docente.email_doc}</td>
                  <td>
                    {new Date(docente.data_nasci_doc).toLocaleDateString()}
                  </td>
                  <td>
                    {new Date(docente.data_adimissao_doc).toLocaleDateString()}
                  </td>
                  <td>{docente.situacao_doc}</td>
                  <td>{docente.area_concurso_doc}</td>
                  <td
                    style={{
                      color: docente.status_doc === 1 ? "green" : "red",
                      fontWeight: "bold",
                    }}
                  >
                    {docente.status_doc === 1 ? "Ativado" : "Desativado"}
                  </td>

                  <td>
                    {/* Modal alert */}

                    <button
                      id="btnEditar"
                      onClick={() => openEditModal(docente)}
                    >
                      <img
                        src="/images/pencilpreto.png"
                        className="imgEditar"
                        alt="Editar"
                      />
                      <div className="divOverlay"></div>
                    </button>

                    <button
                      onClick={() => HandleDelete(docente.matricula_doc)}
                      id="btnLixo"
                      type="button"
                    >
                      <img
                        src="/images/lixo.png"
                        className="imgLixo"
                        alt="Excluir docente"
                      ></img>
                      <div className="divOverlay"></div>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">Nenhum docente encontrado</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
