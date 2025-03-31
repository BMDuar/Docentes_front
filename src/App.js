import { useState, useEffect } from "react";
import api from "./services/api";

export default function CadastroDocentes() {
  const [docentes, setDocentes] = useState([]);
  const [matricula, setMatricula] = useState("");
  const [modalType, setModalType] = useState(null); // 'create' ou 'edit'
  const [searchTerm, setSearchTerm] = useState("");
  const [erroNome, setErroNome] = useState("");
  const [erroMatricula, setErroMatricula] = useState("");
  const [errorEmail, setErrorEmail] = useState({
    email: "",
  });
  const [formData, setFormData] = useState({
    matricula: "",
    nome: "",
    email: "",
    dataNascimento: "",
    situacao: "Estatutário",
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
    }
  };

  useEffect(() => {
    fetchDocentes();
  }, []);

  // Envia o formulário para o backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Enviando dados para o backend:", formData);

    try {
      if (modalType === "edit") {
        await api.put(`/docentes/editar/${formData.matricula}`, formData);
      } else {
        await api.post("/docentes/criar", formData);
      }

      fetchDocentes(); // Atualiza a tabela
      setModalType(null); // Fecha o modal
    } catch (error) {
      console.error(
        "Erro ao salvar docente:",
        error.response ? error.response.data : error
      );
    }
  };


  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@(fiec)\.(com\.br|edu\.br)$/;
    return regex.test(email);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;

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

    // Atualiza os campos do formulário
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

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

  const openEditModal = () => {
    // Aqui você poderia preencher com os dados do docente selecionado
    // Exemplo com dados fictícios:
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
    setModalType("edit");
  };

  
  //Inicio Funcoes triviais
  const pesquisarDocentes = () => {
    const termo = searchTerm.trim().toLowerCase();
    const rows = document.querySelectorAll("#docentesTable tbody tr");

    rows.forEach((row) => {
      const matricula = row.cells[0].textContent.toLowerCase();
      const nome = row.cells[1].textContent.toLowerCase();
      const email = row.cells[2].textContent.toLowerCase();
      const areaConcurso = row.cells[3].textContent.toLowerCase();
      const situacao = row.cells[4].textContent.toLowerCase();
      const status = row.cells[5].textContent.toLowerCase();
      row.style.display =
        matricula.includes(termo) || nome.includes(termo) || email.includes(termo) || areaConcurso.includes(termo) || situacao.includes(termo) || status.includes(termo) ? "" : "none";
    });
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
    return partes.length >= 2 && partes.every(part => part.length >= 2);
  }

  // Função para buscar informações pela matrícula
  function buscarDados(matricula) {
    if (api.matricula) {
      setFormData(api.martricula);
      setErroMatricula("");
    } else {
      setFormData({ nome: "", email: "", cargo: "" });
      setErroMatricula("Matrícula não encontrada.");
    }
  }

  // Função chamada ao digitar a matrícula
  function handleMatriculaChange(event) {
    const value = event.target.value;
    setMatricula(value);

    if (value.length >= 5) { // Supondo que a matrícula tenha 5 dígitos
      buscarDados(value);
    } else {
      setFormData({ nome: "", email: "", cargo: "" });
      setErroMatricula("");
    }
  }

  //Fim funções triviais

  return (
    <div className="container">
      <img src="favicon.ico" className="logo" />
      <h1>Cadastro de Docentes</h1>
      <button id="btnNovoDocente" onClick={openCreateModal}>
        <img src="/images/mais.png" className="mais" />
        Novo
      </button>
      <button id="btnEditar" onClick={() => openEditModal(docentes.matricula)}>
        <img
          src="/images/pencilbranco.png"
          className="pencilEditar"
          alt="Editar"
        />
        Editar Docente
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

      {modalType && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>
              {modalType === "create" ? "Cadastrar Docente" : "Editar Docente"}
            </h2>
            <form onSubmit={handleSubmit}>
              <label htmlFor="matricula">Matrícula:</label>
              <input
                type="text"
                id="matricula"
                required
                value={formData.matricula}
                onChange={handleChange}
                placeholder="Digite o número da matrícula"
                maxLength={5}
                minLength={5}
              />

              <label htmlFor="nome">Nome Completo:</label>
              <input
                type="text"
                id="nome"
                required
                value={formData.nome}
                onChange={handleChange}
                placeholder="Digite o nome do docente"
              />
              {erroNome && <p style={{ color: "red", fontSize:"12px" , marginTop:"5px",border:"2px solid red",backgroundColor:"#ffe6e6"}}>{erroNome}</p>}

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
                value={formData.dataAdmissao}
                onChange={handleChange}
                placeholder="Digite a data de admissão do docente"
              />

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

              <label htmlFor="status">Status:</label>
              <select
                id="status"
                onChange={handleChange}
                value={formData.status}
              >
                <option value={1}>Ativado</option>
                <option value={0}>Desativado</option>
              </select>

              <button type="submit" disabled={!!erroNome}>Salvar</button>
              <button type="button" onClick={() => setModalType(null)}>
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}
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
              <th>Opçoes</th>
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
                      color: docente.status_doc == 1 ? "green" : "red",
                      fontWeight: "bold",
                    }}
                  >
                    {docente.status_doc == 1 ? "Ativado" : "Desativado"}
                  </td>
                  <td> 
                    <button style={{ border: "none", background: "none", cursor: "pointer" }} >
                    <img src="/images/lixo.png" className="btnLixo"></img>  
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
{docentes && docentes.length > 0 && 
  document.querySelectorAll("#docentesTable tbody tr[style='display: none;']").length === docentes.length && (
    <div className="no-results">Nenhum resultado encontrado para "{searchTerm}"</div>
)}
        </table>      
      </div>
    </div>
  );
}
