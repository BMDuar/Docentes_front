import { useState, useEffect } from "react";
import axios from "axios";
import api from "./services/api";

export default function CadastroDocentes() {
  const [docentes, setDocentes] = useState([]);
  const [modalType, setModalType] = useState(null); // 'create' ou 'edit'
  const [ativo, setAtivo] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    matricula: "",
    nome: "",
    email: "",
    dataNascimento: "",
    situacao: "Estatutário",
    dataAdmissao: "",
    status:null,
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
        await api.put(
          `/docentes/editar${formData.matricula}`,
          formData
        );
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

  const [errors, setErrors] = useState({
    email: "",
  });

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@(fiec)\.(com\.br|edu\.br)$/;
    return regex.test(email);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;

    // Validação de e-mail
    if (id === "email") {
      if (value && !validateEmail(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: "E-mail inválido. @fiec.com.br ou @fiec.edu.br",
        }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, email: "" }));
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
      status: null,
    });
    setModalType("create");
  };

  const openEditModal = () => {
    // Aqui você poderia preencher com os dados do docente selecionado
    // Exemplo com dados fictícios:
    setFormData({
      matricula: "12345",
      nome: "Professor Exemplo",
      email: "professor@example.com",
      dataNascimento: "1980-01-01",
      situacao: "Estatutário",
      dataAdmissao: "2010-05-15",
      areaConcurso: "Matemática",
      status: null,
    });
    setModalType("edit");
  };

  const pesquisarDocentes = () => {
    const termo = searchTerm.trim().toLowerCase();
    const rows = document.querySelectorAll("#docentesTable tbody tr");

    rows.forEach((row) => {
      const matricula = row.cells[0].textContent.toLowerCase();
      const nome = row.cells[1].textContent.toLowerCase();
      row.style.display =
        matricula.includes(termo) || nome.includes(termo) ? "" : "none";
    });
  };

  return (
    <div className="container">
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
          placeholder="Pesquisar por nome ou ID..."
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
              />

              <label htmlFor="nome">Nome:</label>
              <input
                type="text"
                id="nome"
                required
                value={formData.nome}
                onChange={handleChange}
                placeholder="Digite o nome do docente"
              />

              <label htmlFor="email">E-mail:</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? "input-error" : ""}
                placeholder="Digite o E-mail do docente"
              />
              {errors.email && (
                <span className="error-message">{errors.email}</span>
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
                required
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

             <label htmlFor="status" id="status">Status:</label>
              <select
                onChange={(e) => setAtivo(e.target.value)}
              >
                <option value={1}>Ativado</option>
                <option value={0}>Desativado</option>
              </select>

              <button type="submit">Salvar</button>
              <button type="button" onClick={() => setModalType(null)}>
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}

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
          </tr>
        </thead>
        <tbody>
          {docentes && docentes.length > 0 ? (
            docentes.map((docente) => (
              <tr>
                <td>{docente.matricula_doc}</td>
                <td>{docente.nome_doc}</td>
                <td>{docente.email_doc}</td>
                <td>{new Date(docente.data_nasci_doc).toLocaleDateString()}</td>
                <td>
                  {new Date(docente.data_adimissao_doc).toLocaleDateString()}
                </td>
                <td>{docente.situacao_doc}</td>
                <td>{docente.area_concurso_doc}</td>
                <td>{docente.status_doc == 1 ? "Ativado" : "Desativado"}</td>
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
  );
}
